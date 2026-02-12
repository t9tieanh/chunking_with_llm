import { OpenAIEmbeddings } from "@langchain/openai";
export class EmbeddingService {
    embeddings;
    constructor() {
        this.embeddings = new OpenAIEmbeddings();
    }
    async generateAndAttachEmbeddings(sentencesArray) {
        const sentencesArrayCopy = sentencesArray.map((sentenceObject) => ({
            ...sentenceObject,
            combined_sentence_embedding: sentenceObject.combined_sentence_embedding
                ? [...sentenceObject.combined_sentence_embedding]
                : undefined,
        }));
        const combinedSentencesStrings = sentencesArrayCopy
            .filter((item) => item.combined_sentence !== undefined)
            .map((item) => item.combined_sentence);
        const embeddingsArray = await this.embeddings.embedDocuments(combinedSentencesStrings);
        let embeddingIndex = 0;
        for (let i = 0; i < sentencesArrayCopy.length; i++) {
            if (sentencesArrayCopy[i].combined_sentence !== undefined) {
                sentencesArrayCopy[i].combined_sentence_embedding =
                    embeddingsArray[embeddingIndex++];
            }
        }
        return sentencesArrayCopy;
    }
}
//# sourceMappingURL=EmbeddingService.js.map