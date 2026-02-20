import requests
import json

OLLAMA_API_URL = "http://127.0.0.1:11434/api/chat"

def generate_response(messages: list, model: str = "phi3") -> str:
    """
    Sends a chat history to the local Ollama instance and returns the response.
    """
    try:
        payload = {
            "model": model,
            "messages": messages,
            "stream": False
        }
        
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=60)
        response.raise_for_status()
        
        data = response.json()
        # structure: {"message": {"role": "assistant", "content": "..."}}
        return data.get("message", {}).get("content", "No response from AI.")
    
    except requests.exceptions.ConnectionError:
        return "Error: Ollama is not running. Please run 'ollama serve'."
    except requests.exceptions.ReadTimeout:
        return "Error: AI generation timed out."
    except Exception as e:
        return f"Error: {str(e)}"
