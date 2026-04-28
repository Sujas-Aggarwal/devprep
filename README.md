# DevPrep

A professional, high-performance Coding Practice & Progress Tracker. Designed with a premium Amber & Zinc aesthetic, DevPrep offers a seamless experience for solving DSA problems with an integrated Monaco-powered IDE.

# Screenshots
<img width="1728" height="1117" alt="Screenshot 2026-04-28 at 23 06 00" src="https://github.com/user-attachments/assets/ba6c0d4a-85a8-4988-8c90-12f3cce81c2d" />
<img width="1728" height="1117" alt="Screenshot 2026-04-28 at 23 05 34" src="https://github.com/user-attachments/assets/ce5c3980-6bfb-47e8-87ea-3fdff0c40c85" />
<img width="1728" height="1117" alt="Screenshot 2026-04-28 at 23 05 40" src="https://github.com/user-attachments/assets/9bef4896-6bb3-40f8-bd1c-840b19473324" />
<img width="1728" height="1117" alt="Screenshot 2026-04-28 at 23 06 22" src="https://github.com/user-attachments/assets/4e4c5643-2d50-4475-80de-4b0c6ad04083" />
<img width="1728" height="1117" alt="Screenshot 2026-04-28 at 23 06 26" src="https://github.com/user-attachments/assets/ac08bc55-b8c5-47aa-9db3-7669ad29787e" />
<img width="1728" height="1117" alt="Screenshot 2026-04-28 at 23 07 47" src="https://github.com/user-attachments/assets/326fd962-5684-4742-9bc9-f0dcc37ef7e3" />
<img width="1728" height="1117" alt="Screenshot 2026-04-28 at 23 07 43" src="https://github.com/user-attachments/assets/23db2c96-0644-49cb-9199-9e1033c10305" />



## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Monaco Editor
- **Backend**: Node.js, Express
- **Database**: SQLite (via `sql.js`)

## Local Setup

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

## Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` directory:
```env
PORT=5001
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
DB_PATH=./database/dev.db
```

### Frontend (.env)
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5001/api
```

## Key Features

- **Monaco Editor**: A VS Code-like editing experience with syntax highlighting and smart indentation.
- **Dynamic Starter Code**: Every problem starts with the correct function signature automatically.
- **Progress Tracking**: Real-time stats on solved problems, difficulty distribution, and submission history.
- **Dark & Light Mode**: A meticulously crafted design system that looks stunning in both themes.
