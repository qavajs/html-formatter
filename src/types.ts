export type StepStatus = 'passed' | 'failed' | 'skipped' | 'undefined' | 'ambiguous' | 'pending' | 'unknown';

/** Aggregated outcome used for statistics and filtering */
export type Outcome = 'passed' | 'failed' | 'skipped';

export interface Embedding {
    data: string;
    mime_type: string;
    contentEncoding?: 'IDENTITY' | 'BASE64';
    fileName?: string;
    /** attachment written next to the report (htmlConfig.attachments: 'external'), relative to the report file */
    url?: string;
    /** size in bytes of an external attachment */
    size?: number;
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
    /** set for Before / After hooks */
    hookId?: string;
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

export interface ExampleValue {
    name: string;
    value: string;
}

export interface AttemptSummary {
    /** zero based attempt number */
    attempt: number;
    status: StepStatus;
    /** keyword and text of the first failed step */
    step?: string;
    error?: string;
    /** duration in nanoseconds */
    duration: number;
}

export interface SourceScenario {
    id: string;
    name: string;
    keyword?: string;
    type?: string;
    tags: Tag[];
    steps: Step[];
    feature: SourceFeature;
    /** values of the scenario outline examples row this scenario was generated from */
    examples?: ExampleValue[];
    /** summaries of retried attempts preceding the reported one */
    previousAttempts?: AttemptSummary[];
    /** zero based attempt number of the reported (last) attempt */
    attempt?: number;
    /** epoch ms when the first attempt started */
    startedAt?: number;
    /** epoch ms when the last attempt finished */
    finishedAt?: number;
}

export interface Scenario extends SourceScenario {
    status: StepStatus;
    outcome: Outcome;
    isFailed: boolean;
    /** passed only after one or more retries */
    isFlaky: boolean;
    /** number of retries before the reported attempt */
    retries: number;
    /** duration in nanoseconds */
    duration: number;
}

export interface Feature extends SourceFeature {
    elements: Scenario[];
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    flaky: number;
    /** duration in nanoseconds */
    duration: number;
    status: Outcome;
}

export interface RunInfo {
    /** epoch ms of the earliest scenario start */
    startedAt?: number;
    /** epoch ms of the latest scenario finish */
    finishedAt?: number;
    /** wall clock duration in nanoseconds (finishedAt - startedAt) */
    wallDuration?: number;
    /** sum of all scenario durations in nanoseconds */
    totalDuration: number;
}

export interface MetadataItem {
    id: string;
    key: string;
    value: string;
}

export interface Report {
    features: Feature[];
    metadata: MetadataItem[];
    run: RunInfo;
}
