from gradio_client import Client
import whisper

class AppResources:
    def __init__(self):
        # Preload the Gradio clients
        print("Initializing Gradio clients...")
        self.convo_client = Client("jawwad1234/convo")
        self.tts_client = Client("jawwad1234/Edge-TTS-Text-to-Speech")
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


# Create a global instance to be used across the app
resources = AppResources()
