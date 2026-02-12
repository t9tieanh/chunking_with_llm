import "dotenv/config";
import { SemanticChunkingService } from "./services/SemanticChunkingService.js";
async function main() {
    try {
        const semanticChunkingService = new SemanticChunkingService();
        const semanticChunks = await semanticChunkingService.processTextFile("assets/input_srt.txt", {
            bufferSize: 3,
            percentileThreshold: 90,
        });
        semanticChunkingService.logSemanticChunks(semanticChunks);
    }
    catch (error) {
        console.error("An error occurred in the main function:", error);
    }
}
main();
//# sourceMappingURL=app.js.map