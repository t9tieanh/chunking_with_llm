import { DocumentLoader } from "./DocumentLoader.js";
import { SentenceProcessor } from "./SentenceProcessor.js";
import { EmbeddingService } from "./EmbeddingService.js";
import { SemanticAnalyzer } from "./SemanticAnalyzer.js";
export class SemanticChunkingService {
    documentLoader;
    sentenceProcessor;
    embeddingService;
    semanticAnalyzer;
    constructor() {
        this.documentLoader = new DocumentLoader();
        this.sentenceProcessor = new SentenceProcessor();
        this.embeddingService = new EmbeddingService();
        this.semanticAnalyzer = new SemanticAnalyzer();
    }
    async processTextFile(filePath, config = {}) {
        const { bufferSize = 1, percentileThreshold = 80, } = config;
        const textCorpus = await this.documentLoader.loadTextFile(filePath);
        const structuredSentences = this.sentenceProcessor.structureSubtitles(textCorpus, bufferSize);
        const sentencesWithEmbeddings = await this.embeddingService.generateAndAttachEmbeddings(structuredSentences);
        const { updatedArray, significantShiftIndices } = this.semanticAnalyzer.calculateCosineDistancesAndSignificantShifts(sentencesWithEmbeddings, percentileThreshold);
        const semanticChunks = this.semanticAnalyzer.groupSentencesIntoChunks(updatedArray, significantShiftIndices);
        return semanticChunks;
    }
    logSemanticChunks(semanticChunks) {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`Total Chunks Processed: ${semanticChunks.length}`);
        console.log(`${'='.repeat(80)}\n`);
        semanticChunks.forEach((chunk, index) => {
            console.log(`\n${'-'.repeat(80)}`);
            console.log(`Chunk #${index + 1}`);
            console.log(`${'-'.repeat(80)}`);
            if (chunk.metadata) {
                console.log(`\n📊 Metadata:`);
                if (chunk.metadata.timestamp) {
                    console.log(`  ⏱️  Timestamp: ${chunk.metadata.timestamp}`);
                }
                if (chunk.metadata.subtitleIndex !== undefined) {
                    console.log(`  🔢 Subtitle Index: ${chunk.metadata.subtitleIndex}`);
                }
                if (chunk.metadata.sentenceCount) {
                    console.log(`  📝 Sentences: ${chunk.metadata.sentenceCount}`);
                }
            }
            console.log(`\n📄 Content:`);
            console.log(chunk.content);
            console.log();
        });
        console.log(`\n${'='.repeat(80)}\n`);
    }
}
//# sourceMappingURL=SemanticChunkingService.js.map