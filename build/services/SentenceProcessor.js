import * as natural from "natural";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { SubtitleParser } from "../utils/SubtitleParser.js";
export class SentenceProcessor {
    splitToSentencesUsingNLP(textCorpus) {
        if (SubtitleParser.isSubtitleFormat(textCorpus)) {
            const parsedSubtitles = SubtitleParser.parseSubtitles(textCorpus);
            return parsedSubtitles.map(sub => sub.content);
        }
        const tokenizer = new natural.SentenceTokenizer([]);
        const sentences = tokenizer.tokenize(textCorpus);
        return sentences;
    }
    parseSubtitles(textCorpus) {
        return SubtitleParser.parseSubtitles(textCorpus);
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
    structureSubtitles(textCorpus, bufferSize = 1) {
        const parsedSubtitles = SubtitleParser.parseSubtitles(textCorpus);
        const sentenceObjectArray = parsedSubtitles.map((subtitle, i) => ({
            sentence: subtitle.content,
            index: i,
            metadata: subtitle.metadata,
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