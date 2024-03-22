from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack
from django.http import HttpRequest
import google.oauth2.id_token
from google.auth.transport import requests

class CustomAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner
        # print('hello himanshu bhaiya from beginning')

    async def __call__(self, scope, receive, send):
        print('hello himanshu bhaiya 1st')

        # Check if the token is a JWT token
        if 'jwt_token' in scope:
            print('hello himanshu bhaiya 2nd')

            # Handle JWT token validation using django_channels_jwt_auth_middleware
            jwt_middleware = JWTAuthMiddlewareStack(inner=self.inner)
            return await jwt_middleware(scope, receive, send)
        # If not a JWT token, assume it's a Google OAuth token
        elif 'google_token' in scope:
            print('hello himanshu bhaiya from google')

            google_token = scope['google_token']
            # Validate Google OAuth token
            try:
                id_info = google.oauth2.id_token.verify_oauth2_token(
                    google_token, requests.Request())
                # Extract user information from id_info
                user_id = id_info['sub']
                # Perform authentication checks and set user in scope
                scope['user'] = user_id
            except Exception as e:
                # Handle token validation errors
                pass
        # Call the next middleware in the stack
        print("kuch kaam nhi kr rha")
        return await self.inner(scope, receive, send)
