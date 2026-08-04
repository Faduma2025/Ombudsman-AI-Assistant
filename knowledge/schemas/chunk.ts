import { TribunalMetadata } from './document';

/**
 * Chunk Metadata
 *
 * Metadata attached to each chunk, extending tribunal metadata
 * with chunk-specific information
 */
export interface ChunkMetadata extends TribunalMetadata {
  /** Position of this chunk in the document */
  chunkIndex: number;

  /** Type of chunk (e.g., "full-case", "claim", "decision") */
  chunkType: string;

  /** Approximate token count */
  tokenCount?: number;
}

/**
 * Chunk
 *
 * A searchable unit of text extracted from a document.
 * Stored in the chunk storage layer.
 */
export interface Chunk {
  /** Unique chunk identifier (e.g., "wb-692-0") */
  chunkId: string;

  /** Parent document ID */
  documentId: string;

  /** Chunk text content */
  content: string;

  /** Position in document (0-indexed) */
  chunkIndex: number;

  /** Chunk metadata */
  metadata: ChunkMetadata;
}

/**
 * Chunker Configuration
 *
 * Configuration for chunking strategies
 */
export interface ChunkerConfig {
  /** Chunking strategy */
  strategy: 'case-level' | 'semantic' | 'fixed-size';

  /** Maximum tokens per chunk */
  maxTokens?: number;

  /** Overlap tokens between chunks */
  overlapTokens?: number;
}
