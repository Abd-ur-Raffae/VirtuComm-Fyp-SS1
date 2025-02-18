from gradio_client import Client
import whisper
import os

class AppResources:
    def __init__(self):
        # Preload the Gradio clients
        print("Initializing Gradio clients...")
        self.convo_client = Client("jawwad1234/gallKro")
        self.tts_client = Client("jawwad1234/Edge-TTS-Text-to-Speech")
        self.recommend_client = Client("jawwad1234/RecommendQuestion")
        print("Gradio clients initialized.")

        # Preload the Whisper model
        print("Loading Whisper model...")
        self.whisper_model = whisper.load_model("base")
        print("Whisper model loaded.")

    def get_convo_client(self):
        return self.convo_client

    def get_tts_client(self):
        return self.tts_client

    def get_whisper_model(self):
        return self.whisper_model
    
    def get_suggester_client(self):
        return self.recommend_client

if os.environ.get("RUN_MAIN") == "true":
    # Create a global instance to be used across the app
    resources = AppResources()