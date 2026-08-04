/**
 * Validation Utilities
 *
 * Data validation helpers for knowledge platform
 */

import { DocumentManifest } from '../schemas/document-manifest';
import { FullDocument } from '../schemas/document';
import { Chunk } from '../schemas/chunk';
import { Embedding } from '../schemas/embedding';
import { LifecycleState } from '../schemas/lifecycle-states';

/**
 * Validation Result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate Document Manifest
 */
export function validateManifest(manifest: DocumentManifest): ValidationResult {
  const errors: string[] = [];

  // Required fields
  if (!manifest.documentId) {
    errors.push('documentId is required');
  }
  if (!manifest.institution) {
    errors.push('institution is required');
  }
  if (!manifest.caseNumber) {
    errors.push('caseNumber is required');
  }

  // IOA Category
  if (!manifest.ioaCategoryId || manifest.ioaCategoryId < 1 || manifest.ioaCategoryId > 9) {
    errors.push('ioaCategoryId must be between 1 and 9');
  }
  if (!manifest.ioaCategory) {
    errors.push('ioaCategory is required');
  }

  // Lifecycle
  if (!manifest.lifecycleState) {
    errors.push('lifecycleState is required');
  }
  if (!Array.isArray(manifest.processingHistory)) {
    errors.push('processingHistory must be an array');
  }

  // Change detection
  if (!manifest.fileHash) {
    errors.push('fileHash is required');
  }
  if (!manifest.sourceFile) {
    errors.push('sourceFile is required');
  }

  // Counts
  if (typeof manifest.chunkCount !== 'number' || manifest.chunkCount < 0) {
    errors.push('chunkCount must be a non-negative number');
  }
  if (typeof manifest.embeddingCount !== 'number' || manifest.embeddingCount < 0) {
    errors.push('embeddingCount must be a non-negative number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate Full Document
 */
export function validateDocument(document: FullDocument): ValidationResult {
  const errors: string[] = [];

  if (!document.id) {
    errors.push('id is required');
  }
  if (!document.content) {
    errors.push('content is required');
  }
  if (!document.metadata) {
    errors.push('metadata is required');
  }
  if (!document.source) {
    errors.push('source is required');
  }

  // Validate metadata
  if (document.metadata) {
    if (!document.metadata.institution) {
      errors.push('metadata.institution is required');
    }
    if (!document.metadata.documentType) {
      errors.push('metadata.documentType is required');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate Chunk
 */
export function validateChunk(chunk: Chunk): ValidationResult {
  const errors: string[] = [];

  if (!chunk.chunkId) {
    errors.push('chunkId is required');
  }
  if (!chunk.documentId) {
    errors.push('documentId is required');
  }
  if (!chunk.content) {
    errors.push('content is required');
  }
  if (typeof chunk.chunkIndex !== 'number' || chunk.chunkIndex < 0) {
    errors.push('chunkIndex must be a non-negative number');
  }
  if (!chunk.metadata) {
    errors.push('metadata is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate Embedding
 */
export function validateEmbedding(embedding: Embedding): ValidationResult {
  const errors: string[] = [];

  if (!embedding.embeddingId) {
    errors.push('embeddingId is required');
  }
  if (!embedding.chunkId) {
    errors.push('chunkId is required');
  }
  if (!embedding.documentId) {
    errors.push('documentId is required');
  }
  if (!Array.isArray(embedding.vector)) {
    errors.push('vector must be an array');
  }
  if (!embedding.model) {
    errors.push('model is required');
  }
  if (typeof embedding.dimensions !== 'number' || embedding.dimensions <= 0) {
    errors.push('dimensions must be a positive number');
  }

  // Validate vector dimensions match
  if (embedding.vector && embedding.vector.length !== embedding.dimensions) {
    errors.push(`vector length (${embedding.vector.length}) does not match dimensions (${embedding.dimensions})`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate Lifecycle State Consistency
 *
 * Checks that manifest state matches expected data availability
 */
export function validateStateConsistency(manifest: DocumentManifest): ValidationResult {
  const errors: string[] = [];
  const state = manifest.lifecycleState;

  switch (state) {
    case LifecycleState.REGISTERED:
      // Just needs file hash and source
      if (!manifest.fileHash) errors.push('REGISTERED state requires fileHash');
      if (!manifest.sourceFile) errors.push('REGISTERED state requires sourceFile');
      break;

    case LifecycleState.METADATA_EXTRACTED:
      if (!manifest.documentStorePath) {
        errors.push('METADATA_EXTRACTED state requires documentStorePath');
      }
      break;

    case LifecycleState.CATEGORIZED:
      if (!manifest.ioaCategoryId) {
        errors.push('CATEGORIZED state requires ioaCategoryId');
      }
      break;

    case LifecycleState.CHUNKED:
      if (manifest.chunkCount === 0) {
        errors.push('CHUNKED state requires chunkCount > 0');
      }
      if (!manifest.chunkStorePath) {
        errors.push('CHUNKED state requires chunkStorePath');
      }
      break;

    case LifecycleState.EMBEDDED:
      if (manifest.embeddingCount === 0) {
        errors.push('EMBEDDED state requires embeddingCount > 0');
      }
      if (!manifest.embeddingStorePath) {
        errors.push('EMBEDDED state requires embeddingStorePath');
      }
      break;

    case LifecycleState.VALIDATED:
      if (manifest.chunkCount !== manifest.embeddingCount) {
        errors.push('VALIDATED state requires chunkCount === embeddingCount');
      }
      break;

    case LifecycleState.INDEXED:
      if (!manifest.indexedAt) {
        errors.push('INDEXED state requires indexedAt timestamp');
      }
      if (manifest.indexStatus !== 'indexed') {
        errors.push('INDEXED state requires indexStatus === "indexed"');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
