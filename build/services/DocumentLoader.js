import { TextLoader } from "langchain/document_loaders/fs/text";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
export class DocumentLoader {
    async loadTextFile(relativePath) {
        const loader = new TextLoader(relativePath);
        const docs = await loader.load();
        const textCorpus = docs[0].pageContent;
        return textCorpus;
    }
    async loadDocxFile(relativePath) {
        const loader = new DocxLoader(relativePath);
        const docs = await loader.load();
        const textCorpus = docs[0].pageContent;
        return textCorpus;
    }
}
//# sourceMappingURL=DocumentLoader.js.map