from text_to_audio import generate_audio_from_text
from audio_to_json import audio_to_json
from tts_sub.apps import resources

def generate_dialogue():
    convo_client = resources.get_convo_client()
    result = convo_client.predict(
        message="""create an accurate hypothetical dialogue in which teacher is explaining quantum computing to student""",
        system_message="""You are a chatbot which only replies shortly, you give different results every time and in the form of a dialogue 
        between two characters talking about given topic in just 10 lines. when starting
        each person's dialogue, only start it with: '[student]' or '[teacher]' if you have to mention the names again, don't use brackets, 
        brackets only come when starting the sentence
        and no need to mention names or any kind of alias for them.
         """,
        max_tokens=512,
        temperature=0.7,
        top_p=0.95,
        api_name="/chat"
    )
    return result

# Generate the dialogue
text = generate_dialogue()
print(text)

# Generate audio and collect metadata
metadata = generate_audio_from_text(text)
print(metadata)

# Transcribe audio and save JSON with metadata
whisper_model = resources.get_whisper_model()
audio_to_json("final_conversation_withAPI.wav", metadata, whisper_model)
