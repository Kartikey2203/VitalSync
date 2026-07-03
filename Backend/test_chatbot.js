import "dotenv/config";
import { chatWithGemini } from "./src/services/geminiService.js";

async function run() {
  console.log("Testing chatbot with a health-related query...");
  const healthReply = await chatWithGemini("What are some good dietary sources of Vitamin D?");
  console.log("\n[HEALTH QUERY RESPONSE]:");
  console.log(healthReply);

  console.log("\n----------------------------------------");

  console.log("\nTesting chatbot with a non-health-related query...");
  const codingReply = await chatWithGemini("Can you write a Python function to sort an array?");
  console.log("\n[NON-HEALTH QUERY RESPONSE]:");
  console.log(codingReply);

  console.log("\n----------------------------------------");

  console.log("\nTesting chatbot with a general knowledge query...");
  const gkReply = await chatWithGemini("Who is the prime minister of India?");
  console.log("\n[GK QUERY RESPONSE]:");
  console.log(gkReply);

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
