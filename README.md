# VitalSync 🩺

VitalSync is an AI-powered health assistant and personal health record management system. It allows users to upload their medical lab reports (PDFs or images), automatically extracts key medical markers using OCR, and analyzes the parameters using the Google Gemini AI model. It provides a visual dashboard highlighting overall health scores, deficiency alerts, nutrient overviews, customized dietary meal plans, and insights.

---

## 📸 Project Screenshots

### 1. Landing Page
*A sleek, modern welcome interface featuring dynamic call-to-actions and clean aesthetics.*
![VitalSync Landing Page](./Screenshot%202026-07-16%20184823.png)

### 2. Dashboard Overview
*An interactive panel displaying your health metrics, deficiency details, custom meal plans, and AI-driven health insights.*
![VitalSync Dashboard Overview](./Screenshot%202026-07-16%20184854.png)

### 3. Medical Records History
*An elegant historical log panel for viewing, deleting, and tracking all your previously uploaded health assessments.*
![VitalSync Records History](./Screenshot%202026-07-16%20185542.png)

---

## ✨ Features

- **📄 Smart Document OCR & Upload**: Seamlessly parse PDF or image medical files using AWS S3 for secure cloud storage and OCR utilities (`pdf-parse`, `tesseract.js`) for text extraction.
- **🤖 Gemini AI Health Analysis**: Leverages Google Gemini AI to analyze raw medical text, calculate a standardized health score, diagnose deficiency statuses, and draft health risks.
- **🥗 Custom Meal Plan Preview**: Automatically generates a personalized 7-day breakfast, lunch, and dinner recommendation routine tailored to correct your specific deficiencies.
- **📊 Nutrient and Deficiency Analytics**: Elegant visual display showing statuses (Low, Normal, High, Borderline) and range comparisons for markers such as Vitamin D, Iron, Vitamin B12, and Calcium.
- **🔒 Secure Authentication**: Robust user authentication built using JWT tokens, Password hashing (Bcrypt), and Google OAuth integration.
- **📁 Historical Records Archiving**: Fully manage your records history with the ability to store multiple reports, search, compare scores, and delete records instantly.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Routing**: React Router DOM (v7)
- **HTTP Client**: Axios
- **Icons**: Tabler Icons (`@tabler/icons-react`)
- **Styling**: Vanilla CSS (Tailored Dark Forest-Green Theme, HSL gradients, and glassmorphism)

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose
- **AI Engine**: Google Gemini Pro (`@google/genai`)
- **Storage**: AWS S3 Storage (`@aws-sdk/client-s3`)
- **OCR Engine**: Tesseract.js & PDF-Parse
- **Security**: JWT & Passport Google OAuth 2.0

---

## ⚙️ Project Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB instance (Local or Atlas)
- Google Gemini API Key
- AWS S3 bucket and credentials

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` directory and define your credentials:
   ```env
   PORT=5000
   MONGO_URI=mongodb://your_mongo_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_BUCKET_NAME=your_s3_bucket_name
   AWS_REGION=your_s3_region
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   ```
4. Start the server:
   ```bash
   npm run server
   ```

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Access the web app locally via `http://localhost:5173`.

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Login & retrieve JWT

### Medical Reports
- `POST /api/reports/upload` — Upload PDF/Image report, parse with Gemini AI & save
- `GET /api/reports/latest` — Retrieve the most recent report analysis
- `GET /api/reports/all` — Retrieve list of all reports for the user
- `DELETE /api/reports/:id` — Delete a report by ID
- `POST /api/reports/claim-orphaned` — Map reports uploaded anonymously before registration
