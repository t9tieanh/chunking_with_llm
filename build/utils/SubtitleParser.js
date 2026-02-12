export class SubtitleParser {
    static parseSubtitles(textCorpus) {
        const subtitles = [];
        const blocks = textCorpus.split(/\n\s*\n/).filter(block => block.trim());
        for (const block of blocks) {
            const lines = block.split('\n').map(line => line.trim()).filter(line => line);
            if (lines.length < 2)
                continue;
            const subtitleIndex = parseInt(lines[0]);
            const timestampMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
            if (!timestampMatch) {
                continue;
            }
            const startTime = timestampMatch[1];
            const endTime = timestampMatch[2];
            const timestamp = lines[1];
            const content = lines.slice(2).join(' ');
            if (content && !isNaN(subtitleIndex)) {
                subtitles.push({
                    content: content.trim(),
                    metadata: {
                        subtitleIndex,
                        startTime,
                        endTime,
                        timestamp
                    }
                });
            }
        }
        return subtitles;
    }
    static isSubtitleFormat(textCorpus) {
        const timestampPattern = /\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3}/;
        return timestampPattern.test(textCorpus);
    }
}
//# sourceMappingURL=SubtitleParser.js.map