import { LifecycleState, ProcessingEvent } from './lifecycle-states';

/**
 * Document Manifest
 *
 * First-class entity representing a document in the knowledge base.
 * Tracks metadata, processing status, and storage references independently
 * of the actual document content, chunks, and embeddings.
 */
export interface DocumentManifest {
  // === Identity ===
  /** Unique document identifier (e.g., "wb-692") */
  documentId: string;

  /** Institution name (e.g., "World Bank", "IMF", "UNAT") */
  institution: string;

  /** Case/document number from the source */
  caseNumber: string;

  /** Document title (if available) */
  title?: string;

  /** Year of decision/publication */
  year?: number;

  /** Decision date in original format */
  decisionDate?: string;

  // === IOA Classification ===
  /** Primary IOA category ID (1-9) */
  ioaCategoryId: number;

  /** IOA category name */
  ioaCategory: string;

  /** Original institution's category/classification (for reference) */
  originalCategory?: string;

  // === Processing Status ===
  /** Current lifecycle state */
  lifecycleState: LifecycleState;

  /** Complete history of state transitions */
  processingHistory: ProcessingEvent[];

  // === Storage References ===
  /** Number of chunks generated from this document */
  chunkCount: number;

  /** Number of embeddings generated */
  embeddingCount: number;

  /** Path to full document in storage layer */
  documentStorePath: string;

  /** Path to chunks in storage layer */
  chunkStorePath?: string;

  /** Path to embeddings in storage layer */
  embeddingStorePath?: string;

  // === Change Detection ===
  /** SHA-256 hash of source file for change detection */
  fileHash: string;

  /** Original source file path */
  sourceFile: string;

  /** Last modification time of source file */
  lastModified: Date;

  // === Indexing ===
  /** When document was indexed for search */
  indexedAt?: Date;

  /** Current indexing status */
  indexStatus: 'pending' | 'indexed' | 'failed';

  // === Metadata ===
  /** When document was first registered */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;

  /** Which plugin processed this document */
  pluginId: string;
}

/**
 * Registry Statistics
 *
 * Aggregated statistics computed from all documents in the registry
 */
export interface RegistryStats {
  /** Total number of documents */
  totalDocuments: number;

  /** Document count by institution */
  byInstitution: Record<string, number>;

  /** Document count by IOA category */
  byIOACategory: Record<number, number>;

  /** Document count by lifecycle state */
  byState: Record<LifecycleState, number>;

  /** Last time stats were computed */
  lastUpdated: Date;
}

/**
 * Registry Manifest File
 *
 * Top-level structure of the manifest.json file
 */
export interface RegistryManifest {
  /** Schema version */
  version: string;

  /** Last update timestamp */
  lastUpdated: string;

  /** Total number of documents */
  totalDocuments: number;

  /** All registered documents */
  documents: DocumentManifest[];

  /** Aggregated statistics */
  statistics: RegistryStats;
}
