from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('TextToAudio/', views.text_to_audio, name='text_to_audio'),
    path('interview/', views.interview, name='interview'),
    path('podcast/', views.podcast, name = "podcast"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
