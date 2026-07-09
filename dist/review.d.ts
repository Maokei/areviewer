import "dotenv/config";
export declare function reviewCode(diffText: string, reviewJsonSchema: object): Promise<import("@google/genai").GenerateContentResponse>;
