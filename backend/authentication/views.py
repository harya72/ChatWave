from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer
from django.contrib.auth.models import User


class HomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            if hasattr(
                request.user, "userprofile"
            ):  # Check if the user has a UserProfile
                user_profile = request.user.userprofile
                if user_profile.avatar:
                    avatar_url = user_profile.avatar.url
                else:
                    avatar_url = "media/avatars/blank.png"
                return Response(
                    {
                        "username": request.user.username,
                        "avatar_url": f"http://localhost:8000/{avatar_url}",
                        "message": "hi from userProfile",
                    }
                )
            else:
                user = User.objects.get(username=request.user.username)
                return Response(
                    {
                        "username": user.username,
                        "email": user.email,
                        "message": "hi from jwt/google",
                        "avatar_url": f"http://localhost:8000/media/avatars/blank.png",
                    }
                )

        except Exception as e:
            print(f"Error fetching user profile: {str(e)}")
            return Response(
                {"username": str(request.user), "message": "hi from google oauth"}
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
