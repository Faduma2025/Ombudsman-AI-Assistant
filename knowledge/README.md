# Knowledge Platform - Phase 1 (Foundation)

## Overview

This is the foundation layer of the enterprise knowledge platform for managing multi-tribunal documents with document-first architecture, lifecycle management, and semantic search capabilities.

## Phase 1 Implementation

Phase 1 establishes the core foundation:

### ✅ Folder Structure
```
knowledge/
├── registry/           # Document registry and lifecycle management
├── schemas/            # Core data schemas
├── utils/              # Utility functions
└── data/               # Generated data (gitignored)
    ├── registry/       # Document manifests
    ├── documents/      # Full documents
    ├── chunks/         # Document chunks
    ├── embeddings/     # Vector embeddings
    ├── index/          # Search index
    └── logs/           # Processing logs
```

### ✅ Core Schemas

**Lifecycle States** (`schemas/lifecycle-states.ts`)
- 7-stage document lifecycle: REGISTERED → METADATA_EXTRACTED → CATEGORIZED → CHUNKED → EMBEDDED → VALIDATED → INDEXED
- State transition validation
- Processing event tracking

**Document Manifest** (`schemas/document-manifest.ts`)
- First-class document entity
- Complete metadata (institution, case number, IOA category)
- Processing status tracking
- Storage references (documents, chunks, embeddings)
- Change detection (file hashing)
- Registry statistics

**Document Schemas** (`schemas/document.ts`)
- FullDocument - Processed document with metadata and sections
- RawDocument - Unprocessed document from source
- TribunalMetadata - Standard metadata structure
- ExtractedText - Intermediate format

**Chunk Schema** (`schemas/chunk.ts`)
- Chunk - Searchable unit of text
- ChunkMetadata - Metadata attached to chunks
- ChunkerConfig - Chunking strategy configuration

**Embedding Schema** (`schemas/embedding.ts`)
- Embedding - Vector embedding with metadata
- EmbeddingMetadata - Denormalized metadata for fast search
- VectorQuery - Query structure for similarity search
- SearchResult - Result format

**IOA Taxonomy** (`schemas/ioa-taxonomy.ts`)
- 9 IOA categories (authoritative definition)
- Category lookup functions
- Validation utilities

### ✅ Document Registry

**Interface** (`registry/document-registry.ts`)
- Registration, retrieval, updates
- State management
- Change detection
- Statistics computation

**File Implementation** (`registry/file-registry.ts`)
- JSON file-based persistence
- In-memory manifest management
- Thread-safe operations
- Automatic save on updates

### ✅ Lifecycle Manager

**Implementation** (`registry/lifecycle-manager.ts`)
- State transitions with validation
- Batch operations
- Reprocessing capabilities
- State consistency validation

### ✅ Utilities

**Hash Utils** (`utils/hash-utils.ts`)
- SHA-256 file hashing for change detection
- String hashing
- Hash comparison

**Text Utils** (`utils/text-utils.ts`)
- Text cleaning (encoding fixes)
- BOM removal
- Whitespace normalization
- Token estimation

**Logger** (`utils/logger.ts`)
- Structured logging
- Log levels (DEBUG, INFO, WARN, ERROR)
- Color-coded console output
- Component-based loggers

**Validation** (`utils/validation.ts`)
- Manifest validation
- Document validation
- Chunk validation
- Embedding validation
- State consistency checks

## Usage Example

```typescript
import {
  FileDocumentRegistry,
  LifecycleManager,
  LifecycleState,
  DocumentManifest
} from './knowledge';
import { createLogger } from './knowledge/utils';

// Create logger
const logger = createLogger('example');

// Initialize registry
const registry = new FileDocumentRegistry();
await registry.load();

// Create lifecycle manager
const lifecycleManager = new LifecycleManager(registry);

// Register a document
const manifest: DocumentManifest = {
  documentId: 'wb-692',
  institution: 'World Bank',
  caseNumber: '692',
  year: 2023,
  decisionDate: '12/5/2023',
  ioaCategoryId: 6,
  ioaCategory: 'Safety, Health, and Physical Environment',
  originalCategory: 'Medical Benefits',
  lifecycleState: LifecycleState.REGISTERED,
  processingHistory: [],
  chunkCount: 0,
  embeddingCount: 0,
  documentStorePath: 'data/documents/world-bank.json',
  fileHash: 'abc123...',
  sourceFile: 'public/data/tribunal-cases.csv',
  lastModified: new Date(),
  indexStatus: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
  pluginId: 'world-bank'
};

await registry.register(manifest);

// Transition state
await lifecycleManager.transition(
  'wb-692',
  LifecycleState.METADATA_EXTRACTED,
  { timestamp: new Date() }
);

// Get statistics
const stats = await registry.getStats();
logger.info('Registry statistics', stats);
```

## What's Next?

**Phase 2** will implement:
- Three-layer storage architecture (documents, chunks, embeddings)
- Plugin architecture for tribunal sources
- World Bank plugin (CSV loader, metadata extractor, IOA mapper)

**Phase 3** will implement:
- Pipeline stages (registration → indexing)
- Chunking strategies
- Embedding generation (OpenAI text-embedding-3-small/large)

**Not Yet Implemented:**
- Storage layers
- Plugins
- Pipeline stages
- Retrieval engine
- API endpoints
- CLI scripts

## Architecture Principles

1. **Document-First**: Documents are first-class entities tracked independently
2. **Lifecycle Management**: Explicit states enable incremental processing
3. **Change Detection**: File hashing detects when documents need reprocessing
4. **Separation of Concerns**: Registry, storage, and processing are independent
5. **Extensibility**: Plugin architecture will support any tribunal source

## Testing

All schemas include TypeScript interfaces with full type safety. The registry and lifecycle manager are fully implemented and ready for integration testing once storage layers are added in Phase 2.

## Status

✅ **Phase 1 Complete** - Foundation layer ready for Phase 2

**Existing Application**: Unchanged and fully functional. This foundation layer doesn't affect the current Ombudsman application at all.
