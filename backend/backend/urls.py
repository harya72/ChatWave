from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("authentication.urls")),
    path("api-auth/", include("drf_social_oauth2.urls", namespace="drf")),
]
