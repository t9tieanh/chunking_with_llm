import { readFile } from "fs/promises";
export class DocumentLoader {
    async loadTextFile(relativePath) {
        const textCorpus = await readFile(relativePath, "utf-8");
        return textCorpus;
    }
}
//# sourceMappingURL=DocumentLoader.js.map