/**
 * Document Lifecycle States
 *
 * Defines the 7-stage lifecycle that every document goes through
 * from initial registration to being fully indexed for search.
 */

export enum LifecycleState {
  /** Document registered in manifest with file hash */
  REGISTERED = 'registered',

  /** Metadata extracted via tribunal plugin */
  METADATA_EXTRACTED = 'metadata_extracted',

  /** IOA category assigned */
  CATEGORIZED = 'categorized',

  /** Document split into searchable chunks */
  CHUNKED = 'chunked',

  /** Vector embeddings generated */
  EMBEDDED = 'embedded',

  /** Quality validation passed */
  VALIDATED = 'validated',

  /** Indexed for search */
  INDEXED = 'indexed',

  /** Processing failed at some stage */
  FAILED = 'failed'
}

/**
 * Processing Event
 *
 * Records a state transition in the document lifecycle
 */
export interface ProcessingEvent {
  /** The lifecycle state that was reached */
  state: LifecycleState;

  /** When this state was reached */
  timestamp: Date;

  /** Whether the transition was successful */
  success: boolean;

  /** Error message if transition failed */
  error?: string;

  /** Additional metadata about the transition */
  metadata?: Record<string, any>;
}

/**
 * Valid state transitions
 *
 * Defines which state transitions are allowed.
 * Documents must progress sequentially through states.
 */
export const VALID_TRANSITIONS: Record<LifecycleState, LifecycleState[]> = {
  [LifecycleState.REGISTERED]: [
    LifecycleState.METADATA_EXTRACTED,
    LifecycleState.FAILED
  ],
  [LifecycleState.METADATA_EXTRACTED]: [
    LifecycleState.CATEGORIZED,
    LifecycleState.FAILED
  ],
  [LifecycleState.CATEGORIZED]: [
    LifecycleState.CHUNKED,
    LifecycleState.FAILED
  ],
  [LifecycleState.CHUNKED]: [
    LifecycleState.EMBEDDED,
    LifecycleState.FAILED
  ],
  [LifecycleState.EMBEDDED]: [
    LifecycleState.VALIDATED,
    LifecycleState.FAILED
  ],
  [LifecycleState.VALIDATED]: [
    LifecycleState.INDEXED,
    LifecycleState.FAILED
  ],
  [LifecycleState.INDEXED]: [
    // Can re-index or fail
    LifecycleState.INDEXED,
    LifecycleState.FAILED
  ],
  [LifecycleState.FAILED]: [
    // Can retry from registered
    LifecycleState.REGISTERED
  ]
};

/**
 * Check if a state transition is valid
 */
export function isValidTransition(
  from: LifecycleState,
  to: LifecycleState
): boolean {
  const allowed = VALID_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}
