import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { inngest } from "./client";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const executeAI = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("wait-5-seconds", "5s");

    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        system: "You are a helpful assistant that generates text.",
        model: google("gemini-2.5-flash"),
        prompt: "What is 2+2?",
      }
    );
    const { steps: openaiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        system:
          "You are a helpful assistant that helps users generate text using Google Gemini models.",
        model: openai("gpt-3.5-turbo"),
        prompt: "What is 2+2?",
      }
    );

    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        system:
          "You are a helpful assistant that helps users generate text using Google Gemini models.",
        model: anthropic("claude-sonnet-4-5"),
        prompt: "What is 2+2?",
      }
    );

    return {
      geminiSteps,
      openaiSteps,
      anthropicSteps,
    };
  }
);
