from django.urls import path
from .views import register, login_user, get_csrf_token, logout_user, check_login_status

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login_user, name='login_user'),
    path('csrf-token/', get_csrf_token, name='csrf-token'),
    path('logout/', logout_user, name='logout'),
    path('check-login/', check_login_status, name='login-check'),
]
