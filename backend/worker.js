import dotenv from "dotenv";
dotenv.config();
import { Worker } from "bullmq";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    // Will print { foo: 'bar'} for the first job
    // and { qux: 'baz' } for the second.
    console.log("JOB:", job.data);
    const data = JSON.parse(job.data);

    // load the pdf using path
    const PdfLoader = new PDFLoader(data.path);
    const docs = await PdfLoader.load();
    // docs[0];
    // console.log(docs);
    // qdrant is running on docker
    console.log(1);
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      apiKey: process.env.APIKEY,
    });
    console.log(2, embeddings);

    try {
      const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
          url: process.env.QUADRANTDB_CONNECTION_STRING,
          collectionName: "langchainjs-testing",
        }
      );
      console.log(3);
      await vectorStore.addDocuments(docs);
      console.log(4);
      console.log(vectorStore, "All are added to vector store");
      console.log(5);
    } catch (err) {
      console.error("Error occurred while storing vectors:", err);
    }

    /*
    path: data.path
    read the pdf form the path
    chunk the pdf 
    call the openai embedding model for every chunk
    store the chunk in qdrant db
    */
  },
  {
    concurrency: 100,
    connection: {
      host: "localhost",
      port: "6379",
    },
  }
);
