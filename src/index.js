// AI Business Service - Claude Integration
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function runAIService() {
  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: "Hello! I'm ready to help with this AI business service.",
        },
      ],
    });

    console.log("Response:", message.content[0].type === "text" ? message.content[0].text : "");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

runAIService();
