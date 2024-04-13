from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json
from .models import User
from django.db.models import Q

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        user = self.scope['user']
        print('my username is:',user)
        if not user.is_authenticated:
            return
        self.username = user.username
        async_to_sync(self.channel_layer.group_add)(
            self.username, self.channel_name
        )
        self.accept()
    
    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.username, self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        data_source = data.get('source')
        message_type = data.get('type', '')
        if message_type == 'get_user_list':
            query = data.get('query', '')
            users = self.get_filtered_users(query)
            user_list = [
                {
                    'id' : user.id,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'thumbnail_url': user.thumbnail.url if user.thumbnail else None
                }
                for user in users
            ]
            self.send(text_data=json.dumps({
                'type': 'user_list',
                'users': user_list
            }))
        elif data_source == 'realtime':
            # Send message to room group
            self.sending_receiving(data)

    
    def sending_receiving(self,data):
        print('my data is from server',data)
        receiver=data.get('receiver')
        sender= data.get('sender')
        if(sender==str(self.scope['user'])):
            self.send_group(receiver,'realtime',data)
            print('no i am running buddy')
            return
        print('i am running buddy')
        self.send_group(sender,'realtime',data)
        # print('done')
        # self.send_group(sender,'realtime',data)
        # print('done too')
    def get_filtered_users(self, query):
        if query:
            users = User.objects.filter(
            Q(username__istartswith=query) | Q(first_name__istartswith=query)
        )
        else:
            users = User.objects.all()

        return users
    
    def send_group(self,group,source,data):
        response = {
			'type': 'broadcast_group',
			'source': source,
			'data': data
		}
        async_to_sync(self.channel_layer.group_send)(
            group,response
        )

    def broadcast_group(self,data):
        '''
		data:
			- type: 'broadcast_group'
			- source: where it originated from
			- data: what ever you want to send as a dict
		'''
        data.pop('type')
		
        '''
		return data:
			- source: where it originated from
			- data: what ever you want to send as a dict
		'''
        self.send(text_data=json.dumps(data))
    
