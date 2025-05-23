from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
from api.models import Room
from .models import Vote


class AuthURL(APIView):
    def get(self, request, fornat=None):
        scopes =  'user-read-playback-state user-modify-playback-state user-read-currently-playing user-top-read'


        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(
        request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('/create')


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host, endpoint)

        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        artist_string = ""

        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name

        votes = len(Vote.objects.filter(room=room, song_id=song_id))
        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': votes,
            'votes_required': room.votes_to_skip,
            'id': song_id
        }

        self.update_room_song(room, song_id)
        
        
        return Response(song, status=status.HTTP_200_OK)

    def update_room_song(self, room, song_id):
        current_song = room.current_song

        if current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=['current_song'])
            votes = Vote.objects.filter(room=room).delete()


class PauseSong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            pause_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        return Response({}, status=status.HTTP_403_FORBIDDEN)


class PlaySong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        return Response({}, status=status.HTTP_403_FORBIDDEN)


class SkipSong(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        votes = Vote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip

        user_vote = Vote.objects.filter(
            user=self.request.session.session_key,
            room=room,
            song_id=room.current_song,
        )

        user_vote = Vote.objects.filter(
            user=self.request.session.session_key,
            room=room,
            song_id=room.current_song,
        )

        if user_vote.exists():
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        # Save the new vote
        vote = Vote(
            user=self.request.session.session_key,
            room=room,
            song_id=room.current_song,
        )
        vote.save()

        votes = Vote.objects.filter(room=room, song_id=room.current_song)
        if len(votes) >= room.votes_to_skip:
            votes.delete()
            skip_song(room.host)

        return Response({}, status=status.HTTP_204_NO_CONTENT)



        return Response({}, status.HTTP_204_NO_CONTENT)
    
class UserProfileSummary(APIView):
    def get(self, request, format=None):
        session_key = request.session.session_key

        # Get user profile
        profile = execute_spotify_api_request(session_key, 'me', override_base=True)
        display_name = profile.get('display_name', 'Spotify User')
        image_url = profile.get('images', [{}])[0].get('url', None)

        # Get top artist
        # Get top artist and image
        top_artists = execute_spotify_api_request(session_key, 'me/top/artists?limit=1&time_range=long_term', override_base=True)
        top_artist_item = top_artists.get('items', [{}])[0]
        top_artist = top_artist_item.get('name', 'Unknown')
        top_artist_image = top_artist_item.get('images', [{}])[0].get('url', None)


        # Get top song
        top_tracks = execute_spotify_api_request(session_key, 'me/top/tracks?limit=1&time_range=long_term', override_base=True)
        top_song = top_tracks.get('items', [{}])[0].get('name', 'Unknown')

        # Get total minutes listened (approximate using top 50 tracks' durations)
        all_tracks = execute_spotify_api_request(session_key, 'me/top/tracks?limit=50&time_range=long_term', override_base=True)
        total_ms = sum(track.get('duration_ms', 0) for track in all_tracks.get('items', []))
        minutes_listened = round(total_ms / (1000 * 60), 1)

        # Get top genre (from top artist)
        top_genre = top_artists.get('items', [{}])[0].get('genres', ['Unknown'])[0]

        return Response({
            'display_name': display_name,
            'image_url': image_url,
            'top_artist': top_artist,
            'top_song': top_song,
            'minutes_listened': minutes_listened,
            'top_genre': top_genre,
            'top_artist_image': top_artist_image
        }, status=200)
