import "dotenv/config";
import { SemanticChunkingService } from "./services/SemanticChunkingService.js";

async function main() {
  try {
    // Create an instance of the semantic chunking service
    const semanticChunkingService = new SemanticChunkingService();

    // Process the text file with custom configuration
    const semanticChunks = await semanticChunkingService.processTextFile(
      "assets/input_srt.txt",
      {
        bufferSize: 3,
        percentileThreshold: 90,
      }
    );

    // Log the semantic chunks
    semanticChunkingService.logSemanticChunks(semanticChunks);
  } catch (error) {
    console.error("An error occurred in the main function:", error);
  }
}

main();
