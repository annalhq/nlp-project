# GitHub Issue Summarizer

A web application that extracts GitHub issue threads and uses an AI model (T5) to generate clear insights, summaries, and potential solutions.

## Architecture

The project consists of three separate services:
1. **Frontend (Next.js)**: The React user interface running on port `3000`.
2. **Scraper Service (Node.js/Express)**: A Puppeteer-based web scraper that extracts issue body and comments. Runs on port `5000`.
3. **AI Summarizer (Python/FastAPI)**: A Python service running a T5 transformer model to summarise the extracted issues. Runs on port `8000`.

## How to Run

For the application to work correctly, all three services must be running simultaneously.

### 1. Start the Summarizer (AI Backend)

This service requires Python 3.

```bash
cd summarizer
pip install -r requirements.txt
python main.py
```
*The server will start on `http://localhost:8000`. It may take a moment to download the T5-small model on the first run.*

### 2. Start the Scraper Service

This service requires Node.js.

```bash
cd scraper
npm install
npm run dev
```
*The server will start on `http://localhost:5000`.*

### 3. Start the Frontend Application

This service requires Node.js.

```bash
cd frontend
npm install
npm run dev
```
*The application will start on `http://localhost:3000`.*

### Usage
Once all three services are running, open your browser and navigate to `http://localhost:3000`. Paste a valid GitHub issue URL (e.g., `https://github.com/microsoft/vscode/issues/1234`) and click "Analyze Issue" to see the extracted thread and AI-generated summaries.
