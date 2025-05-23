# RAG Application

## Overview

RAG is a chat application designed to interact with PDF documents. After uploading a PDF, you can query its contents by typing your questions into an input box. The app sends these queries to the backend, which fetches relevant answers from QdrantDB, a fast and lightweight vector database.

This application leverages several modern technologies and tools to deliver a smooth, scalable experience:

- **CLERK** for authentication and user management
- **Next.js 15** for the frontend framework
- **QdrantDB** as the vector database for efficient PDF content retrieval
- **LangChain** used alongside QdrantDB for advanced querying
- **BullMQ** to queue and manage each PDF upload asynchronously
- **Valkey** as a Redis replacement for caching query responses

---

## Features

- Upload PDFs to the system
- Query PDF content via chat interface
- User authentication with CLERK
- Fast, vector-based search powered by QdrantDB and LangChain
- Upload queue management with BullMQ
- Response caching using Valkey (KV store)

---

## Folder Structure

```plaintext
root/
├── backend/
│   ├── my-uploads/
│   ├── node_modules/
│   ├── .env
│   ├── .gitignore
│   ├── docker-compose.yml
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   └── worker.js
│
├── frontend/
│   ├── .clerk/
│   ├── .next/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   └── middleware.ts
│   ├── .env
│   ├── .env.sample
│   ├── .gitignore
│   ├── components.json
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── README.md
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- Docker
- Git

---

### Installation and Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/NAYANKUMAR21/rag-pdf-app.git
   cd rag-pdf-app
   ```

2. **Configure environment variables**

   Create a `.env` file inside the `frontend/` folder with the following keys:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   ```

   Create a `.env` file inside the `backend/` folder with the following keys: Replace the placeholder values with your actual credentials.

   ```env
   APIKEY=
   VALKEY_CACHE_URL=
   QUADRANTDB_CONNECTION_STRING=
   ```

3. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

4. **Run the backend and worker**

   Open two separate terminal tabs/windows. Before running the npm commands, start the Docker services:

   **Development Setup:**

   ```bash
   cd backend
   docker compose up -d
   ```

   - Terminal 1: Start the backend server
     ```bash
     cd backend
     npm run dev
     ```
   - Terminal 2: Start the background worker that handles PDF upload queue
     ```bash
     cd backend
     npm run dev:worker
     ```

5. **Run the frontend**

   In a new terminal:

   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the app**

   Open your browser and go to:

   ```
   http://localhost:3000
   ```

---

## How It Works

- The user uploads a PDF via the frontend interface.
- The upload task is queued using **BullMQ** to ensure smooth processing.
- The backend processes the PDF, indexing its content into **QdrantDB** using **LangChain** for semantic search.
- Queries typed into the chat box are sent to the backend, which uses QdrantDB to find the most relevant answers.
- Frequently requested answers are cached in **Valkey** for faster response times.
- User authentication and session management are handled securely with **CLERK**.

---

## Technologies Used

| Technology | Purpose                           |
| ---------- | --------------------------------- |
| Next.js 15 | Frontend framework                |
| CLERK      | Authentication                    |
| QdrantDB   | Vector database for search        |
| LangChain  | Semantic query processing         |
| BullMQ     | Upload task queue management      |
| Valkey     | Caching layer (Redis alternative) |
| Docker     | Containerization                  |

---

## Contact

For questions or feedback, please contact [nayanph1@gmail.com](mailto:nayanph1@gmail.com).
