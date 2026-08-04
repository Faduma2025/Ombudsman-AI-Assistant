/**
 * Embedding Metadata
 *
 * Denormalized metadata stored with embeddings for fast filtering
 * during vector search without needing to load full documents
 */
export interface EmbeddingMetadata {
  /** Institution name */
  institution: string;

  /** IOA category ID (1-9) */
  ioaCategoryId: number;

  /** IOA category name */
  ioaCategory: string;

  /** Case number */
  caseNumber?: string;

  /** Year */
  year?: number;

  /** Ruling outcome */
  ruling?: string;

  /** Document type */
  documentType: string;
}

/**
 * Embedding
 *
 * Vector embedding of a chunk with metadata.
 * Stored in the embedding storage layer.
 */
export interface Embedding {
  /** Unique embedding identifier */
  embeddingId: string;

  /** Links to chunk layer */
  chunkId: string;

  /** Links to document layer */
  documentId: string;

  /** Embedding vector (1536 or 3072 dimensions) */
  vector: number[];

  /** Model used to generate embedding */
  model: string;

  /** Vector dimensions */
  dimensions: number;

  /** Denormalized metadata for fast search */
  metadata: EmbeddingMetadata;
}

/**
 * Embedder Configuration
 *
 * Configuration for embedding generation
 */
export interface EmbedderConfig {
  /** Embedding model */
  model: 'text-embedding-3-small' | 'text-embedding-3-large';

  /** Optional dimension reduction */
  dimensions?: number;

  /** Batch size for API calls */
  batchSize: number;

  /** Retry attempts on failure */
  retryAttempts: number;

  /** OpenAI API key */
  apiKey?: string;
}

/**
 * Vector Query
 *
 * Query for vector similarity search
 */
export interface VectorQuery {
  /** Query embedding vector */
  queryEmbedding: number[];

  /** Number of results to return */
  topK: number;

  /** Filters to apply */
  filters?: {
    ioaCategoryId?: number;
    ioaCategoryIds?: number[];
    institution?: string;
    institutions?: string[];
    yearRange?: [number, number];
    documentType?: string;
  };

  /** Minimum similarity threshold (0-1) */
  threshold?: number;
}

/**
 * Search Result
 *
 * Result from vector similarity search
 */
export interface SearchResult {
  /** Document ID */
  documentId: string;

  /** Chunk ID */
  chunkId: string;

  /** Chunk content */
  content: string;

  /** Similarity score (0-1) */
  score: number;

  /** Result metadata */
  metadata: {
    institution: string;
    caseNumber?: string;
    title?: string;
    ioaCategoryId: number;
    ioaCategory: string;
    year?: number;
    ruling?: string;
  };
}
