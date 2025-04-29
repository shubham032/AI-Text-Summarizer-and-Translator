from flask import Flask, request, jsonify
from transformers import T5Tokenizer, T5ForConditionalGeneration
from PyPDF2 import PdfReader
import re
import torch
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
# Load the T5 model and tokenizer for summarization and translation
tokenizer = T5Tokenizer.from_pretrained("t5-small")
model = T5ForConditionalGeneration.from_pretrained("t5-small")
# Function to set max_length based on summary length selection
def get_summary_length(length_option):
   if length_option == "short":
       return 100  # Short summary (fewer words)
   elif length_option == "medium":
       return 200
   elif length_option == "long":
       return 400  # Long summary (more words)

# Function to extract text from PDF
def extract_text_from_pdf(file):
   try:
       reader = PdfReader(file)
       text = ""
       for page in reader.pages:
           page_text = page.extract_text()
           if page_text:  # Avoid adding None values
               text += page_text
       return text
   except Exception as e:
       return None

# Function to improve summary formatting
def format_summary(summary):
    summary = summary.strip()  # Remove leading and trailing whitespace
    # Remove leading punctuation (if any)
    summary = re.sub(r'^[.,\s]+', '', summary)  
    summary = summary.capitalize()  # Capitalize the first letter
    summary = re.sub(r'\s+\.', '.', summary)  # Remove extra spaces before periods
    summary = re.sub(r'(?<!\w)(?<![.!?])\s*$', '', summary)  # Ensure no trailing space
    if summary and summary[-1] not in ['.', '!', '?']:
        summary += '.'  # Add a period if it's missing
    return summary

# Function to translate text to a target language
SUPPORTED_LANGUAGES = ["en", "es", "fr", "de", "it"]  # Add more as needed

def translate_summary(summary, target_language):
    if target_language not in SUPPORTED_LANGUAGES:
        return f"Error: Unsupported language '{target_language}'. Supported languages are: {', '.join(SUPPORTED_LANGUAGES)}"
    if target_language == "en":
        return summary  # No need to translate if English
    try:
        translation_input = f"translate English to {target_language}: {summary}"
        inputs = tokenizer.encode(translation_input, return_tensors="pt", max_length=512, truncation=True)
        if len(inputs[0]) == 512:
            print("Warning: Input was truncated to 512 tokens.")
        translated_ids = model.generate(inputs, max_length=512, num_beams=4, early_stopping=True)
        translated_summary = tokenizer.decode(translated_ids[0], skip_special_tokens=True)
        return translated_summary
    except Exception as e:
        return f"Error during translation: {str(e)}"

# Function to summarize large text by chunking
def summarize_large_text(text, max_length, min_length):
   # Split the text into chunks of 512 tokens max
   input_ids = tokenizer.encode(text, return_tensors="pt", max_length=512, truncation=True)
   if len(input_ids[0]) > 512:
       chunks = []
       chunk_size = 450  # Smaller size to avoid overflow
       for i in range(0, len(input_ids[0]), chunk_size):
           chunk = input_ids[0][i:i + chunk_size]
           chunks.append(chunk)
       summaries = []
       for chunk in chunks:
           chunk_input = torch.tensor([chunk])
           summary_ids = model.generate(chunk_input, max_length=max_length, min_length=min_length,
                                        length_penalty=2.0, num_beams=4, early_stopping=True)
           summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
           summaries.append(format_summary(summary))
       return " ".join(summaries)
   else:
       # If the text is short, summarize directly
       summary_ids = model.generate(input_ids, max_length=max_length, min_length=min_length,
                                    length_penalty=2.0, num_beams=4, early_stopping=True)
       return format_summary(tokenizer.decode(summary_ids[0], skip_special_tokens=True))

# API endpoint to summarize and translate text
@app.route("/summarize", methods=["POST"])
def summarize():
   summary_length = request.form.get('summaryLength', 'medium')  # Get summary length selection
   language = request.form.get('language', 'en')  # Get language preference
   # If a file is uploaded
   if 'file' in request.files:
       file = request.files['file']
       if file.filename.endswith('.pdf'):
           text = extract_text_from_pdf(file)
           if text is None:
               return jsonify({"error": "Unable to extract text from the PDF."}), 400
       else:
           return jsonify({"error": "Unsupported file type. Only PDFs are allowed."}), 400
   else:
       text = request.form.get('text')
   if not text:
       return jsonify({"error": "No text provided"}), 400
   # Adjust summary length based on user input
   max_length = get_summary_length(summary_length)
   # Set min_length based on summary length selection
   if summary_length == "short":
       min_length = 20
   elif summary_length == "medium":
       min_length = 50
   else:  # Long
       min_length = 100
   # Summarize the input text, handling chunking if necessary
   summarized_text = summarize_large_text(text, max_length, min_length)
   # Translate the summary if necessary
   translated_summary = translate_summary(summarized_text, language)
   return jsonify({"summary": translated_summary})
if __name__ == "__main__":
   app.run(debug=True)