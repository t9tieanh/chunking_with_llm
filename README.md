# Semantic Chunking TypeScript

A TypeScript-based semantic text chunking library that intelligently splits documents into meaningful segments based on semantic similarity. This library uses embeddings and cosine distance analysis to detect natural topic boundaries in text, making it ideal for processing large documents, subtitles, and transcripts for RAG (Retrieval-Augmented Generation) applications.

## 🌟 Features

- **Semantic-Based Chunking**: Splits text based on semantic similarity rather than arbitrary character or token limits
- **Subtitle Format Support**: Native support for SRT subtitle files with timestamp preservation
- **Metadata Preservation**: Maintains important metadata like timestamps, sentence indices, and subtitle information
- **Flexible Configuration**: Customizable buffer sizes, percentile thresholds, and chunking parameters
- **Embedding-Powered**: Uses OpenAI embeddings to understand semantic relationships
- **TypeScript First**: Full TypeScript support with comprehensive type definitions

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Architecture](#architecture)
- [License](#license)

## 🚀 Installation

```bash
npm install
```

or with pnpm:

```bash
pnpm install
```

## ⚙️ Setup

1. Clone the repository
2. Install dependencies
3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Add your OpenAI API key to the `.env` file:

```env
OPENAI_API_KEY=your_api_key_here
```

## 🎯 Quick Start

```typescript
import { SemanticChunkingService } from "./services/SemanticChunkingService.js";

async function main() {
  // Create an instance of the semantic chunking service
  const semanticChunkingService = new SemanticChunkingService();

  // Process a text file with custom configuration
  const semanticChunks = await semanticChunkingService.processTextFile(
    "assets/state_of_the_union.txt",
    {
      bufferSize: 1,
      percentileThreshold: 90,
    }
  );

  // Log the semantic chunks with formatting
  semanticChunkingService.logSemanticChunks(semanticChunks);
}

main();
```

Run the application:

```bash
# Development mode with hot reload
npm run dev

# Build the project
npm run build

# Run the built project
npm start
```

## ⚙️ Configuration

### SemanticChunkingConfig

Configure the chunking behavior with these options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `bufferSize` | `number` | `1` | Number of sentences to include before and after the current sentence for context |
| `percentileThreshold` | `number` | `90` | Percentile threshold for identifying significant semantic shifts (0-100) |
| `chunkSize` | `number` | `200` | Maximum size of each chunk (when using recursive character splitting) |
| `chunkOverlap` | `number` | `20` | Overlap between chunks (when using recursive character splitting) |

## 📚 API Reference

### SemanticChunkingService

Main service class for semantic chunking.

#### `processTextFile(filePath: string, config?: SemanticChunkingConfig): Promise<SemanticChunk[]>`

Processes a text file and returns semantic chunks with metadata.

**Parameters:**
- `filePath`: Path to the text file or subtitle file
- `config`: Optional configuration object

**Returns:** Array of `SemanticChunk` objects

#### `logSemanticChunks(semanticChunks: SemanticChunk[]): void`

Logs semantic chunks with formatted output.

### SentenceProcessor

Handles sentence tokenization and structuring.

#### `splitToSentencesUsingNLP(textCorpus: string): string[]`

Splits text into sentences using NLP. Automatically detects and parses subtitle format.

#### `structureSubtitles(textCorpus: string, bufferSize?: number): SentenceObject[]`

Structures subtitle content with metadata preservation.

### SubtitleParser

Utility class for parsing SRT subtitle files.

#### `static parseSubtitles(textCorpus: string): ParsedSubtitle[]`

Parses SRT format and extracts content with metadata.

#### `static isSubtitleFormat(textCorpus: string): boolean`

Checks if text is in SRT subtitle format.

### SemanticAnalyzer

Performs semantic analysis and chunking.

#### `calculateCosineDistancesAndSignificantShifts(sentenceObjectArray: SentenceObject[], percentileThreshold: number)`

Calculates cosine distances between sentences and identifies semantic shifts.

#### `groupSentencesIntoChunks(sentenceObjectArray: SentenceObject[], shiftIndices: number[]): SemanticChunk[]`

Groups sentences into semantic chunks based on identified shifts.

## 💡 Examples

### Processing a Plain Text File

```typescript
const service = new SemanticChunkingService();

const chunks = await service.processTextFile(
  "document.txt",
  {
    bufferSize: 2,
    percentileThreshold: 85,
  }
);

chunks.forEach((chunk, index) => {
  console.log(`Chunk ${index + 1}:`, chunk.content);
});
```

### Processing Subtitle Files (SRT)

```typescript
const service = new SemanticChunkingService();

const chunks = await service.processTextFile(
  "subtitles.srt",
  {
    bufferSize: 1,
    percentileThreshold: 90,
  }
);

// Access subtitle metadata
chunks.forEach((chunk) => {
  if (chunk.metadata) {
    console.log(`Timestamp: ${chunk.metadata.timestamp}`);
    console.log(`Subtitle Index: ${chunk.metadata.subtitleIndex}`);
    console.log(`Content: ${chunk.content}`);
  }
});
```

### Manual Sentence Processing

```typescript
import { SentenceProcessor } from "./services/SentenceProcessor.js";

const processor = new SentenceProcessor();

// Split text into sentences
const text = "Hello world. This is a test. Natural language processing is amazing.";
const sentences = processor.splitToSentencesUsingNLP(text);

// Structure sentences with context
const structured = processor.structureSentences(sentences, 1);

console.log(structured);
```

## 🏗️ Architecture

### Project Structure

```
src/
├── app.ts                      # Entry point
├── services/
│   ├── DocumentLoader.ts       # Loads documents from files
│   ├── SentenceProcessor.ts    # Sentence tokenization and structuring
│   ├── EmbeddingService.ts     # Generates embeddings using OpenAI
│   ├── SemanticAnalyzer.ts     # Analyzes semantic distances and creates chunks
│   └── SemanticChunkingService.ts # Main orchestration service
├── types/
│   └── index.ts               # TypeScript type definitions
└── utils/
    └── SubtitleParser.ts      # SRT subtitle parsing utilities
```

### How It Works

1. **Document Loading**: Load text from files (supports plain text and SRT subtitles)
2. **Sentence Splitting**: Parse sentences using NLP or subtitle format
3. **Sentence Structuring**: Create sentence objects with context windows (buffer)
4. **Embedding Generation**: Generate embeddings for combined sentences using OpenAI
5. **Distance Calculation**: Calculate cosine distances between consecutive embeddings
6. **Shift Detection**: Identify significant semantic shifts using percentile threshold
7. **Chunk Formation**: Group sentences into chunks based on semantic boundaries
8. **Metadata Aggregation**: Preserve and aggregate metadata (timestamps, indices)

### Key Concepts

- **Buffer Size**: Controls how much context is included around each sentence. A larger buffer size provides more context but may smooth out topic boundaries.
- **Percentile Threshold**: Determines how sensitive the chunking is to semantic shifts. Higher values (e.g., 95) create fewer, larger chunks. Lower values (e.g., 75) create more, smaller chunks.
- **Combined Sentences**: Each sentence is analyzed with its surrounding context, creating embeddings that capture local semantic meaning.

## 🔧 Technologies Used

- **TypeScript**: Type-safe development
- **Natural**: NLP sentence tokenization
- **LangChain**: Text splitting utilities
- **OpenAI**: Embedding generation
- **Math.js**: Vector mathematics
- **D3-Array**: Statistical functions (percentile calculation)

## 📝 Data Types

### SentenceObject

```typescript
interface SentenceObject {
  sentence: string;
  index: number;
  combined_sentence?: string;
  combined_sentence_embedding?: number[];
  distance_to_next?: number;
  metadata?: SubtitleMetadata;
}
```

### SemanticChunk

```typescript
interface SemanticChunk {
  content: string;
  metadata?: {
    subtitleIndex?: number;
    startTime?: string;
    endTime?: string;
    timestamp?: string;
    sentenceCount?: number;
    startSentenceIndex?: number;
    endSentenceIndex?: number;
  };
}
```

### SubtitleMetadata

```typescript
interface SubtitleMetadata {
  subtitleIndex?: number;
  startTime?: string;
  endTime?: string;
  timestamp?: string;
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

## 🙏 Acknowledgments

This project is inspired by semantic chunking techniques used in RAG applications and document processing pipelines.

---

**Note**: Make sure to add your OpenAI API key to the `.env` file before running the application. The library requires OpenAI embeddings for semantic analysis.
