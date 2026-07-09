import { z } from "zod";
export declare const reviewJsonSchema: {
    type: string;
    properties: {
        verdict: {
            type: string;
            enum: string[];
        };
        summary: {
            type: string;
        };
        findings: {
            type: string;
            items: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    title: {
                        type: string;
                    };
                    severity: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                    summary: {
                        type: string;
                    };
                    file_path: {
                        type: string;
                    };
                    line_number: {
                        type: string;
                    };
                    evidence: {
                        type: string;
                    };
                    recommendations: {
                        type: string;
                    };
                };
                required: string[];
                additionalProperties: boolean;
            };
        };
    };
    required: string[];
    additionalProperties: boolean;
};
export declare const reviewSchema: z.ZodObject<{
    verdict: z.ZodEnum<{
        pass: "pass";
        warn: "warn";
        fail: "fail";
    }>;
    summary: z.ZodString;
    findings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        severity: z.ZodEnum<{
            none: "none";
            low: "low";
            medium: "medium";
            high: "high";
            critical: "critical";
        }>;
        summary: z.ZodString;
        file_path: z.ZodString;
        line_number: z.ZodNumber;
        evidence: z.ZodString;
        recommendations: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
