"use client";
import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Upload } from "lucide-react";

const FileUploadReactComponent: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData | undefined>();
  const storeFile = async () => {
    const data = await axios.post("http://localhost:8080/upload/pdf", formData);
    console.log(data);
  };

  const handleFileUpload = () => {
    const eleInput = document.createElement("input");
    eleInput.setAttribute("type", "file");
    eleInput.setAttribute("accept", "application/pdf");
    eleInput.click();
    eleInput.addEventListener("change", async (e: Event) => {
      const target = e.target as HTMLInputElement;
      console.log(target.files);
      if (target.files && target.files.length > 0) {
        const file = target.files.item(0);
        if (file) {
          const formData = new FormData();
          formData.append("pdf", file);
          await fetch("http://localhost:8080/upload/pdf", {
            method: "POST",
            body: formData,
          });
          console.log("File uploaded");
        }
      }
    });
  };
  return (
    <div
      className="cursor-pointer bg-white text-gray-800 border border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all duration-200 rounded-md px-6 py-3 flex items-center gap-3 text-sm font-medium"
      onClick={handleFileUpload}
    >
      <Upload className="w-5 h-5 text-blue-500" />
      <span>Upload File</span>
    </div>
  );
};

export default FileUploadReactComponent;
