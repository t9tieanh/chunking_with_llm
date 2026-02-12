import * as math from "mathjs";
import { quantile } from "d3-array";
export class SemanticAnalyzer {
    cosineSimilarity(vecA, vecB) {
        const dotProduct = math.dot(vecA, vecB);
        const normA = math.norm(vecA);
        const normB = math.norm(vecB);
        if (normA === 0 || normB === 0) {
            return 0;
        }
        const similarity = dotProduct / (normA * normB);
        return similarity;
    }
    calculateCosineDistancesAndSignificantShifts(sentenceObjectArray, percentileThreshold) {
        const distances = [];
        const updatedSentenceObjectArray = sentenceObjectArray.map((item, index, array) => {
            if (index < array.length - 1 &&
                item.combined_sentence_embedding &&
                array[index + 1].combined_sentence_embedding) {
                const embeddingCurrent = item.combined_sentence_embedding;
                const embeddingNext = array[index + 1].combined_sentence_embedding;
                const similarity = this.cosineSimilarity(embeddingCurrent, embeddingNext);
                const distance = 1 - similarity;
                distances.push(distance);
                return { ...item, distance_to_next: distance };
            }
            else {
                return { ...item, distance_to_next: undefined };
            }
        });
        const sortedDistances = [...distances].sort((a, b) => a - b);
        const quantileThreshold = percentileThreshold / 100;
        const breakpointDistanceThreshold = quantile(sortedDistances, quantileThreshold);
        if (breakpointDistanceThreshold === undefined) {
            throw new Error("Failed to calculate breakpoint distance threshold");
        }
        const significantShiftIndices = distances
            .map((distance, index) => distance > breakpointDistanceThreshold ? index : -1)
            .filter((index) => index !== -1);
        return {
            updatedArray: updatedSentenceObjectArray,
            significantShiftIndices,
        };
    }
    groupSentencesIntoChunks(sentenceObjectArray, shiftIndices) {
        let startIdx = 0;
        const chunks = [];
        const adjustedBreakpoints = [
            ...shiftIndices,
            sentenceObjectArray.length - 1,
        ];
        adjustedBreakpoints.forEach((breakpoint) => {
            const group = sentenceObjectArray.slice(startIdx, breakpoint + 1);
            const combinedText = group.map((item) => item.sentence).join(" ");
            const firstSentence = group[0];
            const lastSentence = group[group.length - 1];
            const chunkMetadata = {
                sentenceCount: group.length,
                startSentenceIndex: firstSentence.index,
                endSentenceIndex: lastSentence.index,
            };
            if (firstSentence.metadata) {
                chunkMetadata.subtitleIndex = firstSentence.metadata.subtitleIndex;
                chunkMetadata.startTime = firstSentence.metadata.startTime;
            }
            if (lastSentence.metadata) {
                chunkMetadata.endTime = lastSentence.metadata.endTime;
                if (chunkMetadata.startTime && chunkMetadata.endTime) {
                    chunkMetadata.timestamp = `${chunkMetadata.startTime} --> ${chunkMetadata.endTime}`;
                }
            }
            chunks.push({
                content: combinedText,
                metadata: chunkMetadata,
            });
            startIdx = breakpoint + 1;
        });
        return this.mergeShortChunks(chunks);
    }
    mergeShortChunks(chunks, minSentences = 2) {
        if (chunks.length === 0)
            return chunks;
        const mergedChunks = [];
        let i = 0;
        while (i < chunks.length) {
            const currentChunk = chunks[i];
            const sentenceCount = currentChunk.metadata?.sentenceCount || 1;
            if (sentenceCount >= minSentences) {
                mergedChunks.push(currentChunk);
                i++;
            }
            else {
                const hasPrevious = mergedChunks.length > 0;
                const hasNext = i + 1 < chunks.length;
                if (hasPrevious && !hasNext) {
                    const prevChunk = mergedChunks[mergedChunks.length - 1];
                    mergedChunks[mergedChunks.length - 1] = this.mergeTwoChunks(prevChunk, currentChunk);
                    i++;
                }
                else if (!hasPrevious && hasNext) {
                    const nextChunk = chunks[i + 1];
                    mergedChunks.push(this.mergeTwoChunks(currentChunk, nextChunk));
                    i += 2;
                }
                else if (hasPrevious && hasNext) {
                    const prevChunk = mergedChunks[mergedChunks.length - 1];
                    mergedChunks[mergedChunks.length - 1] = this.mergeTwoChunks(prevChunk, currentChunk);
                    i++;
                }
                else {
                    mergedChunks.push(currentChunk);
                    i++;
                }
            }
        }
        return mergedChunks;
    }
    mergeTwoChunks(chunk1, chunk2) {
        const combinedContent = `${chunk1.content} ${chunk2.content}`;
        const mergedMetadata = {
            subtitleIndex: chunk1.metadata?.subtitleIndex,
            startTime: chunk1.metadata?.startTime,
            endTime: chunk2.metadata?.endTime,
            sentenceCount: (chunk1.metadata?.sentenceCount || 0) + (chunk2.metadata?.sentenceCount || 0),
            startSentenceIndex: chunk1.metadata?.startSentenceIndex,
            endSentenceIndex: chunk2.metadata?.endSentenceIndex,
        };
        if (mergedMetadata.startTime && mergedMetadata.endTime) {
            mergedMetadata.timestamp = `${mergedMetadata.startTime} --> ${mergedMetadata.endTime}`;
        }
        return {
            content: combinedContent,
            metadata: mergedMetadata,
        };
    }
}
//# sourceMappingURL=SemanticAnalyzer.js.map