/**
 * Document Registry Interface
 *
 * The registry is the central manifest tracking all documents
 * as first-class entities independent of their derived data.
 */

import {
  DocumentManifest,
  RegistryStats
} from '../schemas/document-manifest';
import { LifecycleState, ProcessingEvent } from '../schemas/lifecycle-states';

/**
 * Document Registry
 *
 * Central registry for tracking all documents and their processing status
 */
export interface IDocumentRegistry {
  // === Registration ===
  /**
   * Register a new document in the registry
   */
  register(manifest: DocumentManifest): Promise<void>;

  // === Retrieval ===
  /**
   * Get document by ID
   */
  get(documentId: string): Promise<DocumentManifest | null>;

  /**
   * Get all documents from a specific institution
   */
  getByInstitution(institution: string): Promise<DocumentManifest[]>;

  /**
   * Get all documents in a specific lifecycle state
   */
  getByState(state: LifecycleState): Promise<DocumentManifest[]>;

  /**
   * Get all documents in a specific IOA category
   */
  getByIOACategory(categoryId: number): Promise<DocumentManifest[]>;

  /**
   * Get all documents
   */
  getAll(): Promise<DocumentManifest[]>;

  // === Updates ===
  /**
   * Update document lifecycle state
   */
  updateState(
    documentId: string,
    state: LifecycleState,
    event: ProcessingEvent
  ): Promise<void>;

  /**
   * Update chunk count for a document
   */
  updateChunkCount(documentId: string, count: number): Promise<void>;

  /**
   * Update embedding count for a document
   */
  updateEmbeddingCount(documentId: string, count: number): Promise<void>;

  /**
   * Update index status for a document
   */
  updateIndexStatus(
    documentId: string,
    status: 'pending' | 'indexed' | 'failed'
  ): Promise<void>;

  /**
   * Update storage paths for a document
   */
  updateStoragePaths(
    documentId: string,
    paths: {
      documentStorePath?: string;
      chunkStorePath?: string;
      embeddingStorePath?: string;
    }
  ): Promise<void>;

  // === Change Detection ===
  /**
   * Check if a document has changed (file hash comparison)
   */
  hasChanged(documentId: string, currentHash: string): Promise<boolean>;

  /**
   * Get all documents that have changed since a given date
   */
  getChangedDocuments(since?: Date): Promise<DocumentManifest[]>;

  // === Statistics ===
  /**
   * Get registry statistics
   */
  getStats(): Promise<RegistryStats>;

  /**
   * Get distribution of documents by lifecycle state
   */
  getStateDistribution(): Promise<Record<LifecycleState, number>>;

  // === Persistence ===
  /**
   * Save registry to persistent storage
   */
  save(): Promise<void>;

  /**
   * Load registry from persistent storage
   */
  load(): Promise<void>;
}
