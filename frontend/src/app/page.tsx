"use client";
import { useState } from "react";
import FileUploadReactComponent from "./components/File-upload";
import ChatComponent from "./components/Chat-Comp";

export default function Home() {
  const [counter, setcounter] = useState(0);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top navbar with file upload */}
      <header className="w-full bg-white shadow-md p-4 flex justify-between items-center ">
        <h1 className="text-xl font-semibold">PDF-RAG</h1>
        <FileUploadReactComponent />
      </header>

      {/* Main chat area */}
      <main className="flex-1 bg-gray-50 overflow-hidden">
        <ChatComponent />
      </main>
    </div>
  );
}
