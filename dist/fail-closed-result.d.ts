export interface ValidationError {
    verdict: string;
    summary: string;
    findings: object[];
}
export declare function failClosedResult(error: any): ValidationError;
