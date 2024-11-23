from django.shortcuts import render
# Create your views here.
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
                # Check if username already exists
                if User.objects.filter(username=request.data.get('username')).exists():
                    return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
                # Create the user
                user = serializer.save()
                user.is_superuser = True
                user.is_staff = True 
                user.save()

                # Log in the user after registration
                login(request, user)

                # Optionally return a CSRF token for subsequent requests
                csrf_token = get_token(request)

                return Response({'message': 'User registered successfully and logged in.', 'csrf_token': csrf_token}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Log serializer errors to debug
            print(serializer.errors)  # Log the errors for debugging
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_user(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        # Check if username and password are provided
        if not username or not password:
            return Response({'error': 'Please provide both username and password.'}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate user
        user = authenticate(username=username, password=password)

        if user is not None:
            # If user is authenticated, log them in
            login(request, user)

            # Optionally return a CSRF token for subsequent requests
            csrf_token = get_token(request)

            return Response({'message': 'Login successful', 'csrf_token': csrf_token}, status=status.HTTP_200_OK)
        else:
            # If authentication fails, return an error
            return Response({'error': 'Invalid username or password.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_csrf_token(request):
    csrf_token = get_token(request)
    return Response({'csrfToken': csrf_token})

@api_view(['POST'])
def logout_user(request):
    logout(request)  # Logout the user
    return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def check_login_status(request):
    if request.user.is_authenticated:
        return Response({'isAuthenticated': True}, status=status.HTTP_200_OK)
    return Response({'isAuthenticated': False}, status=status.HTTP_200_OK)