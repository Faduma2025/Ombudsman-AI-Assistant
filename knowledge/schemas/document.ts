/**
 * Document Schemas
 *
 * Defines the structure of documents at various stages of processing
 */

/**
 * Tribunal Metadata
 *
 * Standard metadata fields extracted from tribunal documents
 */
export interface TribunalMetadata {
  /** Institution name */
  institution: string;

  /** Case number */
  caseNumber?: string;

  /** Document title */
  title?: string;

  /** Decision date */
  decisionDate?: string;

  /** Year of decision */
  year?: number;

  /** Document type (e.g., "tribunal-case", "policy-doc") */
  documentType: string;

  /** Original institution category */
  originalCategory?: string;

  /** IOA category ID (1-9) */
  ioaCategoryId?: number;

  /** IOA category name */
  ioaCategory?: string;

  /** Ruling outcome (for tribunal cases) */
  ruling?: string;

  /** Additional metadata fields (extensible) */
  [key: string]: any;
}

/**
 * Document Section
 *
 * A named section within a document (e.g., claim, decision, lessons)
 */
export interface DocumentSection {
  /** Section name */
  name: string;

  /** Section content */
  content: string;

  /** Importance weight for this section (used in chunking/embedding) */
  weight?: number;
}

/**
 * Full Document
 *
 * Complete processed document with metadata and structured sections.
 * Stored in the document storage layer.
 */
export interface FullDocument {
  /** Unique document identifier */
  id: string;

  /** Complete document text */
  content: string;

  /** Structured metadata */
  metadata: TribunalMetadata;

  /** Document sections (claim, decision, lessons, etc.) */
  sections: DocumentSection[];

  /** Source identifier (e.g., "world-bank") */
  source: string;
}

/**
 * Raw Document
 *
 * Unprocessed document as loaded by a plugin loader.
 * Contains raw content before any extraction or transformation.
 */
export interface RawDocument {
  /** Unique identifier */
  id: string;

  /** Raw content from source */
  content: string;

  /** Source file path */
  sourceFile: string;

  /** File metadata (modification time, size, etc.) */
  fileMetadata?: {
    lastModified?: Date;
    size?: number;
    format?: string;
  };

  /** Any raw metadata extracted during loading */
  rawMetadata?: Record<string, any>;
}

/**
 * Extracted Text
 *
 * Intermediate format after text extraction but before chunking
 */
export interface ExtractedText {
  /** Document ID */
  documentId: string;

  /** Full extracted text */
  fullText: string;

  /** Structured sections */
  sections: DocumentSection[];

  /** Preserved metadata */
  metadata: Record<string, any>;
}
