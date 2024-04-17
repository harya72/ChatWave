from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json

from django.shortcuts import get_object_or_404
from .models import User, Messages
from django.db.models import Q
from django.http import JsonResponse


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        user = self.scope["user"]
        print("my username is:", user)
        if not user.is_authenticated:
            return
        self.username = user.username
        async_to_sync(self.channel_layer.group_add)(self.username, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.username, self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        data_source = data.get("source")
        message_type = data.get("type", "")
        if message_type == "get_user_list":
            query = data.get("query", "")
            users = self.get_filtered_users(query)
            user_list = [
                {
                    "id": user.id,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "thumbnail_url": user.thumbnail.url if user.thumbnail else None,
                }
                for user in users
            ]
            self.send(text_data=json.dumps({"type": "user_list", "users": user_list}))
        elif data_source == "realtime":
            # Send message to room group
            self.sending_receiving(data)
        elif data_source == "get_messages":
            # Send messages list to the frontend
            self.messages_list(data)
        elif data_source == "conversation_list":
            self.conversation_list(data)

    def conversation_list(self, data):
        username = data.get("username")
        user = User.objects.get(username=username)
       

        # Get all unique users the authenticated user has interacted with
        sent_conversations = (
            Messages.objects.filter(sender=user)
            .values_list("receiver", flat=True)
            .distinct()
        )
 
        received_conversations = (
            Messages.objects.filter(receiver=user)
            .values_list("sender", flat=True)
            .distinct()
        )
       

        # Combine sent and received conversations to get all unique conversations
        conversations = set(sent_conversations) | set(received_conversations)
        # Retrieve User objects corresponding to the conversation IDs
        users_in_conversations = User.objects.filter(id__in=conversations)
        conversation_list = []
        for other_user_id in conversations:
            other_user = get_object_or_404(User, id=other_user_id)

            # Get the latest message in the conversation
            try:
                # Try to get the latest sent message
                sent_latest = Messages.objects.filter(
                    sender=user, receiver=other_user
                ).latest("timestamp")
            except Messages.DoesNotExist:
                # Handle the case where there are no sent messages
                sent_latest = None

            try:
                # Try to get the latest received message
                received_latest = Messages.objects.filter(
                    sender=other_user, receiver=user
                ).latest("timestamp")
            except Messages.DoesNotExist:
                # Handle the case where there are no received messages
                received_latest = None

            # Check which message is more recent
            if sent_latest is not None and (
                received_latest is None
                or sent_latest.timestamp > received_latest.timestamp
            ):
                latest_message = sent_latest
                sent_by = "sender"
            elif received_latest is not None:
                latest_message = received_latest
                sent_by = "receiver"
            else:
                # Handle the case where there are no messages between the two users
                latest_message = None
                sent_by = None

            # Construct the conversation info based on the latest message
            if latest_message:
                last_message_info = {
                    "text": latest_message.message,
                    "sent_by": sent_by,
                    # "time": latest_message.timestamp,
                    'time': latest_message.timestamp.isoformat() if latest_message.timestamp else None
                }
                conversation_info = {
                    "user_id": other_user_id,
                    "username": other_user.username,
                    "last_message": last_message_info,
                    "thumbnail_url" : other_user.thumbnail.url if other_user.thumbnail else None



                }
                conversation_list.append(conversation_info)
        return self.send_group(username, "conversation_list", conversation_list)

    def messages_list(self, data):
        receiver = data.get("receiver")
        sender = data.get("sender")
        sender_user = User.objects.get(username=sender)
        receiver_user = User.objects.get(username=receiver)
        messages_sent_by_sender = Messages.objects.filter(
            sender=sender_user, receiver=receiver_user
        )
        message_sent_by_receiver = Messages.objects.filter(
            sender=receiver_user, receiver=sender_user
        )
        all_messages = list(messages_sent_by_sender) + list(message_sent_by_receiver)
        ordered_messages = sorted(all_messages, key=lambda message: message.timestamp)
        response = []
        for message in ordered_messages:
            if str(message.sender) == sender:
                message_info = {
                    "message": message.message,
                    "timestamp": str(message.timestamp),
                    "sent_by": sender,
                }
            else:
                message_info = {
                    "message": message.message,
                    "sent_by": receiver,
                    "timestamp": str(message.timestamp),
                }
            response.append(message_info)
        self.send_group(sender, "get_messages", response)
        self.send_group(receiver, "get_messages", response)

    def sending_receiving(self, data):
        receiver = data.get("receiver")
        sender = data.get("sender")
        message = data.get("message")
        sender_user = User.objects.get(username=sender)
        receiver_user = User.objects.get(username=receiver)
        Messages.objects.create(
            sender=sender_user, receiver=receiver_user, message=message
        )
        if sender == str(self.scope["user"]):
            self.send_group(receiver, "realtime", data)
            return
        self.send_group(sender, "realtime", data)

    def get_filtered_users(self, query):
        if query:
            users = User.objects.filter(
                Q(username__istartswith=query) | Q(first_name__istartswith=query)
            )
        else:
            users = User.objects.all()

        return users

    def send_group(self, group, source, data):
        response = {"type": "broadcast_group", "source": source, "data": data}
        async_to_sync(self.channel_layer.group_send)(group, response)

    def broadcast_group(self, data):
        """
        data:
                - type: 'broadcast_group'
                - source: where it originated from
                - data: what ever you want to send as a dict
        """
        data.pop("type")

        """
		return data:
			- source: where it originated from
			- data: what ever you want to send as a dict
		"""
        self.send(text_data=json.dumps(data))
