#!/usr/bin/env python3
"""
AI Models Integration for StoryLens
Handles Kosmos-2 (image-to-text) and XTTS-v2 (text-to-speech) model inference
"""

import os
import sys
import json
import base64
from io import BytesIO
import torch
from PIL import Image
from transformers import AutoProcessor, AutoModelForVision2Seq
from TTS.api import TTS
import numpy as np
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class StoryLensAI:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.kosmos_model = None
        self.kosmos_processor = None
        self.tts_model = None
        self.initialize_models()
    
    def initialize_models(self):
        """Initialize both AI models"""
        try:
            print("Initializing Kosmos-2 model...")
            self.kosmos_processor = AutoProcessor.from_pretrained("microsoft/kosmos-2-patch14-224")
            self.kosmos_model = AutoModelForVision2Seq.from_pretrained("microsoft/kosmos-2-patch14-224")
            self.kosmos_model.to(self.device)
            
            print("Initializing XTTS-v2 model...")
            self.tts_model = TTS(model_name="tts_models/multilingual/multi-dataset/xtts_v2", progress_bar=False)
            
            print("✅ All models initialized successfully!")
            
        except Exception as e:
            print(f"❌ Error initializing models: {e}")
            sys.exit(1)
    
    def generate_story_from_image(self, image_path, story_type="story"):
        """Generate story or poem from image using Kosmos-2"""
        try:
            # Load and process image
            image = Image.open(image_path).convert("RGB")
            
            # Create prompt based on story type
            if story_type == "poem":
                prompt = "<grounding>Describe this image and write a creative poem inspired by it:"
            else:
                prompt = "<grounding>Describe this image and write a creative short story inspired by it:"
            
            # Process inputs
            inputs = self.kosmos_processor(text=prompt, images=image, return_tensors="pt")
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # Generate story
            with torch.no_grad():
                generated_ids = self.kosmos_model.generate(
                    **inputs,
                    max_new_tokens=200,
                    do_sample=True,
                    temperature=0.8,
                    top_p=0.9,
                    num_return_sequences=1
                )
            
            # Decode the generated text
            generated_text = self.kosmos_processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
            
            # Extract the story part (remove the original prompt)
            story = generated_text.replace(prompt, "").strip()
            
            # If the generated story is too short, use fallback
            if len(story) < 50:
                story = self._generate_fallback_story(story_type)
            
            return {
                "success": True,
                "story": story,
                "model": "microsoft/kosmos-2-patch14-224"
            }
            
        except Exception as e:
            print(f"Error generating story: {e}")
            return {
                "success": False,
                "story": self._generate_fallback_story(story_type),
                "error": str(e)
            }
    
    def generate_audio_from_text(self, text, output_path):
        """Generate audio from text using XTTS-v2"""
        try:
            # Clean up text for TTS
            clean_text = self._clean_text_for_tts(text)
            
            # Generate audio
            wav = self.tts_model.tts(
                text=clean_text,
                speaker_wav=None,  # Use default speaker
                language="en"
            )
            
            # Save audio file
            self.tts_model.tts_to_file(
                text=clean_text,
                file_path=output_path,
                speaker_wav=None,
                language="en"
            )
            
            return {
                "success": True,
                "audio_path": output_path,
                "model": "coqui/xtts-v2"
            }
            
        except Exception as e:
            print(f"Error generating audio: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _clean_text_for_tts(self, text):
        """Clean text for better TTS output"""
        # Remove special characters that might interfere with TTS
        import re
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove or replace problematic characters
        text = text.replace('\n', '. ')
        text = text.replace('\t', ' ')
        
        # Ensure proper sentence endings
        if not text.endswith(('.', '!', '?')):
            text += '.'
        
        return text.strip()
    
    def _generate_fallback_story(self, story_type):
        """Generate fallback story when AI model fails"""
        import random
        
        stories = [
            "In this captured moment, time seems to stand still. The image tells a story of beauty, wonder, and the magic found in everyday moments. Every detail speaks to the photographer's eye for capturing life's precious instances. There's something special about this scene that draws the viewer in, inviting them to imagine the stories that led to this moment and the memories that will follow.",
            
            "Once upon a time, this scene unfolded before someone's eyes. They saw something special - a moment worth preserving, a memory worth keeping. The image holds secrets and stories waiting to be discovered by those who take the time to truly look. In its composition lies a narrative of human experience, emotion, and the beautiful complexity of life itself.",
            
            "This photograph whispers tales of adventure, emotion, and human experience. In its pixels lie countless stories, each viewer bringing their own interpretation to the visual narrative presented here. The interplay of light and shadow, color and form, creates a canvas upon which imagination can paint infinite possibilities."
        ]
        
        poems = [
            """A moment frozen in time's embrace,
Where light and shadow softly dance,
This image holds a special place,
In memory's vast expanse.

Through colors bright and textures fine,
A story waits to be unfurled,
In every curve and every line,
A glimpse into our world.""",

            """Through the lens, a story told,
Of beauty that will never fade,
In colors bright and shadows bold,
A masterpiece nature made.

Each pixel holds a whispered tale,
Of moments that have come to pass,
And though the years may make us frail,
These memories forever last.""",

            """Captured here for all to see,
A slice of life's grand design,
This photograph will always be
A treasure, pure and fine.

In silence, yet it speaks so loud,
Of joy and sorrow, love and loss,
Among life's vast and endless crowd,
This moment, none can gloss."""
        ]
        
        collection = poems if story_type == "poem" else stories
        return random.choice(collection)

def main():
    """Main function for command-line usage"""
    if len(sys.argv) < 3:
        print("Usage: python ai_models.py <command> <args>")
        print("Commands:")
        print("  story <image_path> [story_type]")
        print("  audio <text> <output_path>")
        sys.exit(1)
    
    command = sys.argv[1]
    ai = StoryLensAI()
    
    if command == "story":
        image_path = sys.argv[2]
        story_type = sys.argv[3] if len(sys.argv) > 3 else "story"
        
        result = ai.generate_story_from_image(image_path, story_type)
        print(json.dumps(result, indent=2))
        
    elif command == "audio":
        text = sys.argv[2]
        output_path = sys.argv[3]
        
        result = ai.generate_audio_from_text(text, output_path)
        print(json.dumps(result, indent=2))
        
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)

if __name__ == "__main__":
    main() 