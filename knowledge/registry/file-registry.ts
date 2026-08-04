/**
 * File-Based Document Registry
 *
 * Stores the document registry in a JSON file for persistence
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { IDocumentRegistry } from './document-registry';
import {
  DocumentManifest,
  RegistryManifest,
  RegistryStats
} from '../schemas/document-manifest';
import { LifecycleState, ProcessingEvent } from '../schemas/lifecycle-states';

export class FileDocumentRegistry implements IDocumentRegistry {
  private manifests: Map<string, DocumentManifest> = new Map();
  private registryPath: string;
  private isLoaded: boolean = false;

  constructor(registryPath?: string) {
    // Default path: knowledge/data/registry/manifest.json
    this.registryPath = registryPath || path.join(
      process.cwd(),
      'knowledge',
      'data',
      'registry',
      'manifest.json'
    );
  }

  // === Registration ===

  async register(manifest: DocumentManifest): Promise<void> {
    await this.ensureLoaded();

    if (this.manifests.has(manifest.documentId)) {
      throw new Error(`Document ${manifest.documentId} already registered`);
    }

    this.manifests.set(manifest.documentId, manifest);
    await this.save();
  }

  // === Retrieval ===

  async get(documentId: string): Promise<DocumentManifest | null> {
    await this.ensureLoaded();
    return this.manifests.get(documentId) || null;
  }

  async getByInstitution(institution: string): Promise<DocumentManifest[]> {
    await this.ensureLoaded();
    return Array.from(this.manifests.values()).filter(
      m => m.institution === institution
    );
  }

  async getByState(state: LifecycleState): Promise<DocumentManifest[]> {
    await this.ensureLoaded();
    return Array.from(this.manifests.values()).filter(
      m => m.lifecycleState === state
    );
  }

  async getByIOACategory(categoryId: number): Promise<DocumentManifest[]> {
    await this.ensureLoaded();
    return Array.from(this.manifests.values()).filter(
      m => m.ioaCategoryId === categoryId
    );
  }

  async getAll(): Promise<DocumentManifest[]> {
    await this.ensureLoaded();
    return Array.from(this.manifests.values());
  }

  // === Updates ===

  async updateState(
    documentId: string,
    state: LifecycleState,
    event: ProcessingEvent
  ): Promise<void> {
    await this.ensureLoaded();

    const manifest = this.manifests.get(documentId);
    if (!manifest) {
      throw new Error(`Document ${documentId} not found in registry`);
    }

    manifest.lifecycleState = state;
    manifest.processingHistory.push(event);
    manifest.updatedAt = new Date();

    // Update indexed timestamp if reaching indexed state
    if (state === LifecycleState.INDEXED) {
      manifest.indexedAt = new Date();
    }

    this.manifests.set(documentId, manifest);
    await this.save();
  }

  async updateChunkCount(documentId: string, count: number): Promise<void> {
    await this.ensureLoaded();

    const manifest = this.manifests.get(documentId);
    if (!manifest) {
      throw new Error(`Document ${documentId} not found in registry`);
    }

    manifest.chunkCount = count;
    manifest.updatedAt = new Date();

    this.manifests.set(documentId, manifest);
    await this.save();
  }

  async updateEmbeddingCount(documentId: string, count: number): Promise<void> {
    await this.ensureLoaded();

    const manifest = this.manifests.get(documentId);
    if (!manifest) {
      throw new Error(`Document ${documentId} not found in registry`);
    }

    manifest.embeddingCount = count;
    manifest.updatedAt = new Date();

    this.manifests.set(documentId, manifest);
    await this.save();
  }

  async updateIndexStatus(
    documentId: string,
    status: 'pending' | 'indexed' | 'failed'
  ): Promise<void> {
    await this.ensureLoaded();

    const manifest = this.manifests.get(documentId);
    if (!manifest) {
      throw new Error(`Document ${documentId} not found in registry`);
    }

    manifest.indexStatus = status;
    manifest.updatedAt = new Date();

    this.manifests.set(documentId, manifest);
    await this.save();
  }

  async updateStoragePaths(
    documentId: string,
    paths: {
      documentStorePath?: string;
      chunkStorePath?: string;
      embeddingStorePath?: string;
    }
  ): Promise<void> {
    await this.ensureLoaded();

    const manifest = this.manifests.get(documentId);
    if (!manifest) {
      throw new Error(`Document ${documentId} not found in registry`);
    }

    if (paths.documentStorePath !== undefined) {
      manifest.documentStorePath = paths.documentStorePath;
    }
    if (paths.chunkStorePath !== undefined) {
      manifest.chunkStorePath = paths.chunkStorePath;
    }
    if (paths.embeddingStorePath !== undefined) {
      manifest.embeddingStorePath = paths.embeddingStorePath;
    }

    manifest.updatedAt = new Date();

    this.manifests.set(documentId, manifest);
    await this.save();
  }

  // === Change Detection ===

  async hasChanged(documentId: string, currentHash: string): Promise<boolean> {
    await this.ensureLoaded();

    const manifest = this.manifests.get(documentId);
    if (!manifest) {
      // Document not in registry, so it's "new" (changed)
      return true;
    }

    return manifest.fileHash !== currentHash;
  }

  async getChangedDocuments(since?: Date): Promise<DocumentManifest[]> {
    await this.ensureLoaded();

    if (!since) {
      // Return all documents
      return Array.from(this.manifests.values());
    }

    return Array.from(this.manifests.values()).filter(
      m => m.updatedAt > since || m.lastModified > since
    );
  }

  // === Statistics ===

  async getStats(): Promise<RegistryStats> {
    await this.ensureLoaded();

    const manifests = Array.from(this.manifests.values());

    const byInstitution: Record<string, number> = {};
    const byIOACategory: Record<number, number> = {};
    const byState: Record<LifecycleState, number> = {};

    for (const manifest of manifests) {
      // By institution
      byInstitution[manifest.institution] =
        (byInstitution[manifest.institution] || 0) + 1;

      // By IOA category
      byIOACategory[manifest.ioaCategoryId] =
        (byIOACategory[manifest.ioaCategoryId] || 0) + 1;

      // By state
      byState[manifest.lifecycleState] =
        (byState[manifest.lifecycleState] || 0) + 1;
    }

    return {
      totalDocuments: manifests.length,
      byInstitution,
      byIOACategory,
      byState,
      lastUpdated: new Date()
    };
  }

  async getStateDistribution(): Promise<Record<LifecycleState, number>> {
    await this.ensureLoaded();

    const manifests = Array.from(this.manifests.values());
    const distribution: Record<LifecycleState, number> = {} as any;

    for (const manifest of manifests) {
      distribution[manifest.lifecycleState] =
        (distribution[manifest.lifecycleState] || 0) + 1;
    }

    return distribution;
  }

  // === Persistence ===

  async save(): Promise<void> {
    const manifests = Array.from(this.manifests.values());
    const stats = await this.getStats();

    const registryManifest: RegistryManifest = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      totalDocuments: manifests.length,
      documents: manifests,
      statistics: stats
    };

    // Ensure directory exists
    const dir = path.dirname(this.registryPath);
    await fs.mkdir(dir, { recursive: true });

    // Write to file (pretty-printed for readability)
    await fs.writeFile(
      this.registryPath,
      JSON.stringify(registryManifest, null, 2),
      'utf-8'
    );
  }

  async load(): Promise<void> {
    try {
      const content = await fs.readFile(this.registryPath, 'utf-8');
      const registryManifest: RegistryManifest = JSON.parse(content);

      this.manifests.clear();

      for (const manifest of registryManifest.documents) {
        // Convert date strings back to Date objects
        manifest.createdAt = new Date(manifest.createdAt);
        manifest.updatedAt = new Date(manifest.updatedAt);
        manifest.lastModified = new Date(manifest.lastModified);
        if (manifest.indexedAt) {
          manifest.indexedAt = new Date(manifest.indexedAt);
        }

        // Convert processing history timestamps
        manifest.processingHistory = manifest.processingHistory.map(event => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }));

        this.manifests.set(manifest.documentId, manifest);
      }

      this.isLoaded = true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist yet, start with empty registry
        this.manifests.clear();
        this.isLoaded = true;
      } else {
        throw error;
      }
    }
  }

  // === Private Helpers ===

  private async ensureLoaded(): Promise<void> {
    if (!this.isLoaded) {
      await this.load();
    }
  }
}
