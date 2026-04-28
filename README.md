# DevPrep

A professional, high-performance Coding Practice & Progress Tracker. Designed with a premium Amber & Zinc aesthetic, DevPrep offers a seamless experience for solving DSA problems with an integrated Monaco-powered IDE.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Monaco Editor
- **Backend**: Node.js, Express
- **Database**: SQLite (via `sql.js`)

## 🚀 Local Setup

Follow these steps to get the project running on your local machine.

### 1. Clone the repository
```bash
git clone https://github.com/Sujas-Aggarwal/devprep.git
cd devprep
```

### 2. Backend Setup
```bash
cd backend
npm install

# Initialize and seed the database
node database/seed.js

# Start the server
npm start
```
The backend will run on `http://localhost:5001`.

### 3. Frontend Setup
```bash
# Open a new terminal
cd frontend
npm install

# Start the development server
npm run dev
```
The application will be available at `http://localhost:5173`.

## ⚙️ Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` directory:
```env
PORT=5001
JWT_SECRET=your_super_secret_key
DB_PATH=./database/dev.db
```

### Frontend (.env)
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5001/api
```

## ✨ Key Features

- **Monaco Editor**: A VS Code-like editing experience with syntax highlighting and smart indentation.
- **Dynamic Starter Code**: Every problem starts with the correct function signature automatically.
- **Progress Tracking**: Real-time stats on solved problems, difficulty distribution, and submission history.
- **Dark & Light Mode**: A meticulously crafted design system that looks stunning in both themes.
