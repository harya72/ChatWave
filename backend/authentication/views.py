from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer
from oauth2_provider.models import AccessToken


class HomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            token = AccessToken.objects.get(token="p4U1gxbMnLGAWua0FrD8aJ3ZYviVWj")
            print("""
                  Here i am trying to get the AccessToken object
                   from the views and it is working perfectly fine
                  i can get the user associated with it easily :""",token.user)
            user = request.user
            if hasattr(user, "thumbnail") and user.thumbnail:
                return Response(
                    {
                        "avatar_url": f"http://localhost:8000{user.thumbnail.url}",
                        "username": user.first_name,
                        "message":"You have the image buddy"
                    }
                )
            else:
                return Response(
                    {
                        "username": user.first_name,
                        "email": user.email,
                        "message": "You dont have image buddy",
                        "avatar_url": "http://localhost:8000/media/avatars/blank.png",
                    }
                )

        except Exception as e:
            print(f"Error fetching user profile: {str(e)}")
            return Response(
                {"error":e}
            )


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):

        try:
            refresh_token = request.data["refresh_token"]
            # print(refresh_token)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
