from gradio_client import Client
import os

class AppResources:
    def __init__(self):
        # Preload the Gradio clients
        print("Initializing Gradio clients...")
        self.convo_client = Client("Nymbo/Serverless-TextGen-Hub")
        self.whisper_client = Client("jawwad1234/whisper-model")
        #self.tts_client = Client("jawwad1234/text-to-speech")
        self.links_client = Client("jawwad1234/gallKro")
        print("Gradio clients initialized.")


    def get_convo_client(self):
        return self.convo_client
    
    def get_whisper_client(self):
        return self.whisper_client

    def get_tts_client(self):
        return self.tts_client
    
    def getLinks_client(self):
        return self.links_client

if os.environ.get("RUN_MAIN") == "true":
    # Create a global instance to be used across the app
    resources = AppResources()