# apps.py
import os
from gradio_client import Client

class AppResources:
    def __init__(self):
        print("Initializing clients...")
        # Point to your new FastAPI chat endpoint instead of a Gradio model
        self.chat_api_url = os.getenv(
            "CHAT_API_URL",
            "https://jawwad1234-chatbot.hf.space/chat"
        )
        # Your existing links client
        self.links_client = Client("jawwad1234/gallKro")
        # Other endpoints
        self.whisper_api_url = "https://jawwad1234-fast-api-whisper.hf.space/subtitles"
        self.edge_tts_api_url   = "https://jawwad1234-fastapi-edge-tts.hf.space/tts"
        print("Clients initialized.")

    def get_chat_api_url(self):
        return self.chat_api_url

    def get_links_client(self):
        return self.links_client

    def get_whisper_api_url(self):
        return self.whisper_api_url

    def get_edge_tts_api_url(self):
        return self.edge_tts_api_url

# Only instantiate once when running under Uvicorn/WSGI
if os.environ.get("RUN_MAIN") == "true":
    resources = AppResources()
