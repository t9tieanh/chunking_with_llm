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
        const { bufferSize = 1, } = config;
        const textCorpus = await this.documentLoader.loadTextFile(filePath);
        console.log('1. textCorpus', textCorpus);
        const sentences = this.sentenceProcessor.splitToSentencesUsingNLP(textCorpus);
        console.log('2. sentences', sentences);
        const structuredSentences = this.sentenceProcessor.structureSentences(sentences, bufferSize);
        console.log('3. structuredSentences', structuredSentences);
        return [];
    }
    async processDocxFile(filePath, config = {}) {
        const { bufferSize = 1, percentileThreshold = 90, } = config;
        const textCorpus = await this.documentLoader.loadDocxFile(filePath);
        const sentences = this.sentenceProcessor.splitToSentencesUsingNLP(textCorpus);
        const structuredSentences = this.sentenceProcessor.structureSentences(sentences, bufferSize);
        const sentencesWithEmbeddings = await this.embeddingService.generateAndAttachEmbeddings(structuredSentences);
        const { updatedArray, significantShiftIndices } = this.semanticAnalyzer.calculateCosineDistancesAndSignificantShifts(sentencesWithEmbeddings, percentileThreshold);
        const semanticChunks = this.semanticAnalyzer.groupSentencesIntoChunks(updatedArray, significantShiftIndices);
        return semanticChunks;
    }
    logSemanticChunks(semanticChunks) {
        console.log(`Total Chunks Processed : ${semanticChunks.length}`);
        console.log("Semantic Chunks:\n");
        semanticChunks.forEach((chunk, index) => {
            console.log(`Chunk #${index + 1}:`);
            console.log(chunk);
            console.log("\n--------------------------------------------------\n");
        });
    }
}
//# sourceMappingURL=SemanticChunkingService.js.map