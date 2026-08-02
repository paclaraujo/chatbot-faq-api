import { defineComputeConfig } from "@prisma/compute-sdk/config";
export default defineComputeConfig({
    app: {
        name: "chatbot-faq-api",
        framework: "bun",
        entry: "src/server.ts",
        httpPort: 3001,
        build: {
            command: null,
        },
    },
});
