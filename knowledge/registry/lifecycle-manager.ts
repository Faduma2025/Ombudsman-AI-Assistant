/**
 * Lifecycle Manager
 *
 * Manages document lifecycle state transitions and validation
 */

import { IDocumentRegistry } from './document-registry';
import {
  LifecycleState,
  ProcessingEvent,
  isValidTransition
} from '../schemas/lifecycle-states';

/**
 * Lifecycle Manager Interface
 */
export interface ILifecycleManager {
  // === State Transitions ===
  /**
   * Transition a document to a new lifecycle state
   */
  transition(
    documentId: string,
    toState: LifecycleState,
    metadata?: Record<string, any>
  ): Promise<void>;

  /**
   * Check if a state transition is valid
   */
  canTransition(fromState: LifecycleState, toState: LifecycleState): boolean;

  // === Batch Operations ===
  /**
   * Transition multiple documents to a new state
   */
  transitionBatch(
    documentIds: string[],
    toState: LifecycleState
  ): Promise<void>;

  // === Reprocessing ===
  /**
   * Reprocess a document from a specific lifecycle stage
   */
  reprocessFrom(
    documentId: string,
    fromState: LifecycleState
  ): Promise<void>;

  /**
   * Reprocess all failed documents
   */
  reprocessFailedDocuments(): Promise<void>;

  // === Validation ===
  /**
   * Validate that a document's state is consistent
   */
  validateState(documentId: string): Promise<boolean>;
}

/**
 * Lifecycle Manager Implementation
 */
export class LifecycleManager implements ILifecycleManager {
  constructor(private registry: IDocumentRegistry) {}

  // === State Transitions ===

  async transition(
    documentId: string,
    toState: LifecycleState,
    metadata?: Record<string, any>
  ): Promise<void> {
    const manifest = await this.registry.get(documentId);

    if (!manifest) {
      throw new Error(`Document ${documentId} not found in registry`);
    }

    const fromState = manifest.lifecycleState;

    // Validate transition
    if (!this.canTransition(fromState, toState)) {
      throw new Error(
        `Invalid state transition from ${fromState} to ${toState} for document ${documentId}`
      );
    }

    // Create processing event
    const event: ProcessingEvent = {
      state: toState,
      timestamp: new Date(),
      success: toState !== LifecycleState.FAILED,
      metadata
    };

    // Update registry
    await this.registry.updateState(documentId, toState, event);
  }

  canTransition(fromState: LifecycleState, toState: LifecycleState): boolean {
    return isValidTransition(fromState, toState);
  }

  // === Batch Operations ===

  async transitionBatch(
    documentIds: string[],
    toState: LifecycleState
  ): Promise<void> {
    const errors: string[] = [];

    for (const documentId of documentIds) {
      try {
        await this.transition(documentId, toState);
      } catch (error: any) {
        errors.push(`${documentId}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(
        `Failed to transition ${errors.length} documents:\n${errors.join('\n')}`
      );
    }
  }

  // === Reprocessing ===

  async reprocessFrom(
    documentId: string,
    fromState: LifecycleState
  ): Promise<void> {
    const manifest = await this.registry.get(documentId);

    if (!manifest) {
      throw new Error(`Document ${documentId} not found in registry`);
    }

    // Reset to the specified state
    const event: ProcessingEvent = {
      state: fromState,
      timestamp: new Date(),
      success: true,
      metadata: {
        reason: 'reprocessing',
        previousState: manifest.lifecycleState
      }
    };

    await this.registry.updateState(documentId, fromState, event);
  }

  async reprocessFailedDocuments(): Promise<void> {
    const failedDocs = await this.registry.getByState(LifecycleState.FAILED);

    for (const doc of failedDocs) {
      // Reset to REGISTERED to start over
      await this.reprocessFrom(doc.documentId, LifecycleState.REGISTERED);
    }
  }

  // === Validation ===

  async validateState(documentId: string): Promise<boolean> {
    const manifest = await this.registry.get(documentId);

    if (!manifest) {
      return false;
    }

    const state = manifest.lifecycleState;

    // Validate state-specific requirements
    switch (state) {
      case LifecycleState.REGISTERED:
        // Must have file hash and source file
        return !!(manifest.fileHash && manifest.sourceFile);

      case LifecycleState.METADATA_EXTRACTED:
        // Must have document store path
        return !!manifest.documentStorePath;

      case LifecycleState.CATEGORIZED:
        // Must have IOA category assigned
        return !!(
          manifest.ioaCategoryId &&
          manifest.ioaCategoryId >= 1 &&
          manifest.ioaCategoryId <= 9
        );

      case LifecycleState.CHUNKED:
        // Must have chunks and chunk store path
        return manifest.chunkCount > 0 && !!manifest.chunkStorePath;

      case LifecycleState.EMBEDDED:
        // Must have embeddings and embedding store path
        return manifest.embeddingCount > 0 && !!manifest.embeddingStorePath;

      case LifecycleState.VALIDATED:
        // Must have passed all previous validations
        return (
          manifest.chunkCount > 0 &&
          manifest.embeddingCount > 0 &&
          manifest.chunkCount === manifest.embeddingCount
        );

      case LifecycleState.INDEXED:
        // Must have indexed timestamp and status
        return (
          !!manifest.indexedAt && manifest.indexStatus === 'indexed'
        );

      case LifecycleState.FAILED:
        // Failed state is always valid (contains error info)
        return true;

      default:
        return false;
    }
  }
}
