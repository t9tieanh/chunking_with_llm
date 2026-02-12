import { TextLoader } from "langchain/document_loaders/fs/text";

/**
 * Service class for loading documents from various file formats.
 */
export class DocumentLoader {
    /**
     * Asynchronously loads a text file and returns its content as a string.
     *
     * This function creates an instance of `TextLoader` to load the document
     * specified by the given relative path. It assumes the document loader
     * returns an array of documents, and extracts the page content of the first
     * document in this array.
     *
     * @param {string} relativePath - The relative path to the text file that needs to be loaded.
     * @returns {Promise<string>} A promise that resolves with the content of the text file as a string.
     */
    async loadTextFile(relativePath: string): Promise<string> {
        const loader = new TextLoader(relativePath);
        const docs = await loader.load();
        const textCorpus = docs[0].pageContent;
        return textCorpus;
    }
}
