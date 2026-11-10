export type StepStatus = 'passed' | 'failed' | 'skipped' | 'undefined' | 'ambiguous' | 'pending' | 'unknown';

/** Aggregated outcome used for statistics and filtering */
export type Outcome = 'passed' | 'failed' | 'skipped';

export interface Embedding {
    data: string;
    mime_type: string;
    contentEncoding?: 'IDENTITY' | 'BASE64';
    fileName?: string;
}

export interface DataTable {
    rows: Array<{ cells: Array<{ value: string }> }>;
}

export interface DocString {
    content: string;
    mediaType?: string;
}

export type StepArgument = Partial<DataTable & DocString>;

export interface StepResult {
    status: StepStatus;
    /** duration in nanoseconds */
    duration: number;
    error_message?: string;
}

export interface Step {
    id: string;
    name?: string;
    keyword?: string;
    result: StepResult;
    embeddings?: Embedding[];
    arguments?: StepArgument[];
}

export interface Tag {
    name: string;
    line?: number;
}

export interface SourceFeature {
    id: string;
    name: string;
    uri?: string;
    description?: string;
    keyword?: string;
    line?: number;
    tags: Tag[];
}

export interface SourceScenario {
    id: string;
    name: string;
    keyword?: string;
    type?: string;
    tags: Tag[];
    steps: Step[];
    feature: SourceFeature;
}

export interface Scenario extends SourceScenario {
    status: StepStatus;
    outcome: Outcome;
    isFailed: boolean;
    /** duration in nanoseconds */
    duration: number;
}

export interface Feature extends SourceFeature {
    elements: Scenario[];
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    /** duration in nanoseconds */
    duration: number;
    status: Outcome;
}

export interface MetadataItem {
    id: string;
    key: string;
    value: string;
}

export interface Report {
    features: Feature[];
    metadata: MetadataItem[];
}
