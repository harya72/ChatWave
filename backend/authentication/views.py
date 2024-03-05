from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile


class HomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            avatar_url = user_profile.avatar.url if user_profile.avatar else None
            return Response({"username": request.user.username, "avatar_url": f'http://localhost:8000/{avatar_url}'})
        except Exception as e:
            print(f"Error fetching user profile: {str(e)}")
            return Response({'username': str(request.user)})

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):

        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
