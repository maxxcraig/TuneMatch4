from django.urls import path
from .views import spotify_login, spotify_callback

urlpatterns = [
    path("auth/login", spotify_login, name="spotify-login"),
    path("auth/callback", spotify_callback, name="spotify-callback"),
]
