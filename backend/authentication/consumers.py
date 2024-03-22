from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # print(self.scope)
        user =self.scope['user']
        print("i am getting connection from socket")
        print(user)
        if not user.is_authenticated:
            return
        self.accept()
    
    def disconnect(self,close_code):
        pass