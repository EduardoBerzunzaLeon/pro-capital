import { SubmissionResult } from "@conform-to/react";

export class ValidationConformError extends Error {

    public readonly submission: SubmissionResult;

    constructor(message: string, submission: SubmissionResult) {
        super(message);
        this.submission = submission;
    }

}