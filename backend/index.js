import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import OpenAI from "openai";

const app = express();
const client = new OpenAI({
  apiKey: process.env.APIKEY,
});

// TODO: add origins
app.use(cors());
const myQueue = new Queue("file-upload-queue");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "my-uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });
app.get("/chat", async (req, res) => {
  const userQuery = req.query.message;
  try {
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      apiKey: process.env.APIKEY,
    });
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: "http://localhost:6333",
        collectionName: "langchainjs-testing",
      }
    );

    const retriever = await vectorStore.asRetriever({
      k: 2,
    });
    const result = await retriever.invoke(userQuery);

    const SYSTEM_PROMPT = `
  You are helfull AI Assistant who answeres the user query based on the available context from PDF File.
  Context:
  ${JSON.stringify(result)}
  `;

    const chatResult = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userQuery },
      ],
    });

    console.log(result, "All are added to vector store");
    console.log(5);
    return res
      .status(200)
      .send({ message: chatResult.choices[0].message.content });
  } catch (err) {
    console.error("Error occurred while storing vectors:", err);
    return res.status(500).send({ message: err.message });
  }
});
app.post("/upload/pdf", upload.single("pdf"), (req, res) => {
  console.log(req.file);
  myQueue.add(
    "file-ready",
    JSON.stringify({
      filename: req.file.originalname,
      destination: req.file.destination,
      path: req.file.path,
    })
  );

  return res.status(200).send("file Uploaded Successfully");
});

app.get("/", (req, res) => {
  return res.status(200).send("All good");
});
app.listen(8080, () => {
  console.log("Application running on 8080");
});

// import express from e
