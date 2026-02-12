import natural from "natural";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
export class SentenceProcessor {
    splitToSentencesUsingNLP(textCorpus) {
        const tokenizer = new natural.SentenceTokenizerNew();
        const sentences = tokenizer.tokenize(textCorpus);
        return sentences;
    }
    async splitToSentences(textCorpus, chunkSize = 200, chunkOverlap = 20) {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize,
            chunkOverlap,
        });
        const output = await splitter.createDocuments([textCorpus]);
        return output.map((out) => out.pageContent);
    }
    structureSentences(sentences, bufferSize = 1) {
        const sentenceObjectArray = sentences.map((sentence, i) => ({
            sentence,
            index: i,
        }));
        sentenceObjectArray.forEach((currentSentenceObject, i) => {
            let combinedSentence = "";
            for (let j = i - bufferSize; j < i; j++) {
                if (j >= 0) {
                    combinedSentence += sentenceObjectArray[j].sentence + " ";
                }
            }
            combinedSentence += currentSentenceObject.sentence + " ";
            for (let j = i + 1; j <= i + bufferSize; j++) {
                if (j < sentenceObjectArray.length) {
                    combinedSentence += sentenceObjectArray[j].sentence;
                }
            }
            sentenceObjectArray[i].combined_sentence = combinedSentence.trim();
        });
        return sentenceObjectArray;
    }
}
//# sourceMappingURL=SentenceProcessor.js.map