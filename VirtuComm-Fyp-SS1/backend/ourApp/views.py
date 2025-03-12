from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import UserSerializer
from django.contrib.auth import authenticate, login
from django.middleware.csrf import get_token
from django.contrib.auth import logout

@api_view(['POST'])
def register(request):
    User = get_user_model()
    
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                if User.objects.filter(username=request.data.get('username')).exists():
                    return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
                user = serializer.save()
                user.is_superuser = True
                user.is_staff = True 
                user.save()
                login(request, user)
                csrf_token = get_token(request)
                return Response({
                    'message': 'User registered successfully and logged in.',
                    'username': user.username,  # Add username
                    'csrf_token': csrf_token
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print(serializer.errors)
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_user(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Please provide both username and password.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            csrf_token = get_token(request)
            return Response({
                'message': 'Login successful',
                'username': user.username,  # Add username
                'csrf_token': csrf_token
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid username or password.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_csrf_token(request):
    csrf_token = get_token(request)
    return Response({'csrfToken': csrf_token})

@api_view(['POST'])
def logout_user(request):
    logout(request)
    return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def check_login_status(request):
    if request.user.is_authenticated:
        return Response({
            'isAuthenticated': True,
            'username': request.user.username  # Add username
        }, status=status.HTTP_200_OK)
    return Response({'isAuthenticated': False}, status=status.HTTP_200_OK)