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
            chunks.push(combinedText);
            startIdx = breakpoint + 1;
        });
        return chunks;
    }
}
//# sourceMappingURL=SemanticAnalyzer.js.map