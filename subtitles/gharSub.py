import os
import logging
import assemblyai as aai

# Initialize logger for error and info handling
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define your AssemblyAI API key here or read it from environment variables
API_KEY = "6b708e1f59ea4ae7ab9e83478430c8cf"  # Replace with your actual API key
aai.settings.api_key = API_KEY

# Define file paths directly
audio_file_path = 'Greetings.mp3'  # Replace with the path to your audio file
srt_file_path = 'output_subtitles.srt'    # Replace with the path where you want to save the SRT file

def transcribe_audio():
    """Transcribes an audio file and saves the subtitles in SRT format."""
    
    if not os.path.exists(audio_file_path):
        logger.error(f"Audio file not found: {audio_file_path}")
        return

    try:
        logger.info("Creating Transcriber instance...")
        transcriber = aai.Transcriber()

        logger.info(f"Transcribing audio file: {audio_file_path}")
        transcript = transcriber.transcribe(audio_file_path)

        logger.info("Exporting subtitles to SRT format...")
        subtitles_srt = transcript.export_subtitles_srt()

        logger.info(f"Saving subtitles to: {srt_file_path}")
        with open(srt_file_path, 'w', encoding='utf-8') as srt_file:
            srt_file.write(subtitles_srt)

        logger.info(f"Subtitles saved successfully to: {srt_file_path}")
    
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")

# Call the function
if __name__ == "__main__":
    transcribe_audio()
