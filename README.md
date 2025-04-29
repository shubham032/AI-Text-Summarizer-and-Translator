# 🧠 AI Text Summarizer and Translator

A full-stack application that uses **T5 Transformer** to summarize and translate long-form content from **text or PDF files**. Built with **Flask** backend and **React.js** frontend.

---

## ✨ Features

- 📄 Accepts raw text or PDF file upload.
- 📝 Summarizes content into **short**, **medium**, or **long** summaries.
- 🌐 Translates summaries to languages like Spanish, French, German, Italian, etc.
- 📦 Full REST API built with Flask.
- 🌍 Frontend built with React using Axios and modern UI elements.

---

## 📂 Project Structure

textsumm/
├── Backend
|   └──  app.py             # Flask backend
|    
├── textsumm/              # React app (assumed)
|    ├── package.json       # Frontend dependencies
|    ├── node_modules/
|    └── src/               # Frontend source
├── requirements.txt
└── README.md


---

## 🚀 Getting Started

### ✅ Backend Setup

1. **Create Virtual Environment**
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

2. **Install Python Dependencies**
pip install -r requirements.txt

3. **Run Backend**
python app.py

##💻 Frontend Setup
1.Navigate to frontend folder:
cd textsumm

2.Install dependencies:
npm install

3.Start the React app:
npm start

###🔌 API Endpoint
    >POST /summarize
    >Content-Type: multipart/form-data
    >Params:

| Key            | Type    | Required | Description                            |
|----------------|---------|----------|----------------------------------------|
| `text`         | string  | Optional | Raw text to summarize                  |
| `file`         | file    | Optional | PDF file to extract and summarize      |
| `summaryLength`| string  | Yes      | Options: `short`, `medium`, `long`     |
| `language`     | string  | No       | Language code: `en`, `es`, `fr`, `de`, `it` |

🌍 Supported Languages
English (en)
Spanish (es)
French (fr)
German (de)
Italian (it)

