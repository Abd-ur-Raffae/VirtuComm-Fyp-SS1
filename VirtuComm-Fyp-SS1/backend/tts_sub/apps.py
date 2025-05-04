from gradio_client import Client
import os

class AppResources:
    def __init__(self):
        # Preload the Gradio clients
        print("Initializing Gradio clients...")
        self.convo_client = Client("muryshev/Qwen-2.5-72B-Instruct")
        self.links_client = Client("jawwad1234/gallKro")
        print("Gradio clients initialized.")

        # Preload FastAPI endpoints
        print("Storing FastAPI endpoints...")
        self.whisper_api_url = "https://jawwad1234-fast-api-whisper.hf.space/subtitles"
        self.edge_tts_api_url = "https://jawwad1234-fastapi-edge-tts.hf.space/tts"
        print("FastAPI endpoints stored.")

    def get_convo_client(self):
        return self.convo_client

    def get_links_client(self):
        return self.links_client

    def get_whisper_api_url(self):
        return self.whisper_api_url

    def get_edge_tts_api_url(self):
        return self.edge_tts_api_url

# Initialize only once when the server starts
if os.environ.get("RUN_MAIN") == "true":
    resources = AppResources()
