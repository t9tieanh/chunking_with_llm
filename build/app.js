import "dotenv/config";
import { SemanticChunkingService } from "./services/SemanticChunkingService.js";
async function main() {
    try {
        const semanticChunkingService = new SemanticChunkingService();
        const semanticChunks = await semanticChunkingService.processTextFile("assets/state_of_the_union.txt", {
            bufferSize: 1,
            percentileThreshold: 90,
        });
        console.log('finally: ', semanticChunks);
    }
    catch (error) {
        console.error("An error occurred in the main function:", error);
    }
}
main();
//# sourceMappingURL=app.js.map