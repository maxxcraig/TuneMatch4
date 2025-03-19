from django.http import JsonResponse, HttpResponseRedirect
import requests
import os
import urllib.parse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_USER_PROFILE_URL = "https://api.spotify.com/v1/me"
SPOTIFY_SCOPE = "user-read-private user-read-email user-top-read"

FRONTEND_REDIRECT_URI = "http://localhost:3000/profile"  # Redirect user to React frontend

def spotify_login(request):
    """
    Redirect users to Spotify OAuth login page
    """
    auth_url = f"{SPOTIFY_AUTH_URL}?client_id={os.getenv('SPOTIFY_CLIENT_ID')}&response_type=code&redirect_uri={urllib.parse.quote(os.getenv('SPOTIFY_REDIRECT_URI'))}&scope={SPOTIFY_SCOPE}"
    return HttpResponseRedirect(auth_url)

def spotify_callback(request):
    """
    Handle Spotify OAuth callback, exchange code for access token, and fetch user profile
    """
    code = request.GET.get("code")
    if not code:
        return JsonResponse({"error": "No authorization code provided"}, status=400)

    # Exchange the authorization code for an access token
    token_response = requests.post(SPOTIFY_TOKEN_URL, data={
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": os.getenv("SPOTIFY_REDIRECT_URI"),
        "client_id": os.getenv("SPOTIFY_CLIENT_ID"),
        "client_secret": os.getenv("SPOTIFY_CLIENT_SECRET")
    }).json()

    access_token = token_response.get("access_token")
    if not access_token:
        return JsonResponse({"error": "Failed to retrieve access token", "details": token_response}, status=400)

    # Fetch user profile from Spotify
    headers = {"Authorization": f"Bearer {access_token}"}
    user_profile = requests.get(SPOTIFY_USER_PROFILE_URL, headers=headers).json()

    # Redirect user to frontend with the token (React will handle storing it)
    redirect_url = f"{FRONTEND_REDIRECT_URI}?token={access_token}&username={user_profile.get('display_name')}"
    return HttpResponseRedirect(redirect_url)