import json
import re

def srt_to_json(srt_file_path, json_file_path):
    # Regular expressions to match SRT format
    srt_entry_pattern = re.compile(r'(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n(.*?)\n', re.DOTALL)

    subtitles = []

    with open(srt_file_path, 'r', encoding='utf-8') as file:
        content = file.read()

        # Find all entries in the SRT file
        matches = srt_entry_pattern.findall(content)

        for match in matches:
            subtitle_id = int(match[0])
            start_time = match[1]
            end_time = match[2]
            text = match[3].replace('\n', ' ').strip()  # Remove line breaks and extra spaces

            # Create a subtitle entry
            subtitle_entry = {
                "id": subtitle_id,
                "start": start_time,
                "end": end_time,
                "text": text
            }
            subtitles.append(subtitle_entry)

    # Save the subtitles to a JSON file
    with open(json_file_path, 'w', encoding='utf-8') as json_file:
        json.dump(subtitles, json_file, ensure_ascii=False, indent=4)

    print(f"Successfully converted {srt_file_path} to {json_file_path}")

# Example usage
srt_file_path = 'output_subtitles.srt'  # Replace with your SRT file path
json_file_path = 'subtitles1.json'  # Desired output JSON file path
srt_to_json(srt_file_path, json_file_path)
