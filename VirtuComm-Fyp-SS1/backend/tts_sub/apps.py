from django.apps import AppConfig
import os
import onnxruntime as ort
import yaml


class TtsSubConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tts_sub'

    def ready(self):
        global ONNX_MODEL
        global CONFIG

        try:
            # Resolve the app directory
            app_dir = os.path.dirname(os.path.abspath(__file__))

            # Load the ONNX model
            model_path = os.path.join(app_dir, "vctk-vits-onnx", "model.onnx")
            print(f"Resolved model path: {model_path}")
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"ONNX model not found at {model_path}")

            ONNX_MODEL = ort.InferenceSession(model_path, providers=["CPUExecutionProvider"])
            print("ONNX model loaded successfully.")

            # Load the YAML configuration
            config_path = os.path.join(app_dir, "vctk-vits-onnx", "config.yaml")
            print(f"Resolved config path: {config_path}")
            if not os.path.exists(config_path):
                raise FileNotFoundError(f"Configuration file not found at {config_path}")

            with open(config_path, "r", encoding="utf-8") as f:
                CONFIG = yaml.safe_load(f)
            print("Configuration loaded successfully.")

        except Exception as e:
            print(f"Error in TtsSubConfig.ready(): {e}")
