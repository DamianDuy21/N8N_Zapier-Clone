import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { inngest } from "./client";
import * as Sentry from "@sentry/nextjs";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const executeAI = inngest.createFunction(
  { id: "execute-ai", retries: 2 },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("wait-5-seconds", "5s");

    console.error("Executing AI models with telemetry enabled");
    Sentry.logger.info("User triggered test log", {
      log_source: "sentry_test",
    });

    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        system: "You are a helpful assistant that generates text.",
        model: google("gemini-2.5-flash"),
        prompt: "What is 2+2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );
    const { steps: openaiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        system:
          "You are a helpful assistant that helps users generate text using Google Gemini models.",
        model: openai("gpt-4o"),
        prompt: "What is 2+2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
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
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    return {
      geminiSteps,
      openaiSteps,
      anthropicSteps,
    };
  }
);
