interface GrokResponseMessageObj {
    /** Role of the message, e.g., "assistant" */
    role: string;
    /** Content of the message, e.g., "..." */
    content: string;
    /** Refusal reason, if any, e.g., null */
    refusal?: string;
}
interface GrokResponseChoices {
    /** Index of the choice, e.g., 0 */
    index: number;
    /** Message details for the choice */
    message: GrokResponseMessageObj;
    /** Reason the response finished, e.g., "stop" */
    finish_reason: string;
}
interface GrokPromptTokensDetails {
    /** Text tokens used, e.g., 702 */
    text_tokens: number;
    /** Audio tokens used, e.g., 0 */
    audio_tokens: number;
    /** Image tokens used, e.g., 0 */
    image_tokens: number;
    /** Cached tokens used, e.g., 679 */
    cached_tokens: number;
}
interface GrokCompletionTokensDetails {
    /** Reasoning tokens used, e.g., 136 */
    reasoning_tokens: number;
    /** Audio tokens used, e.g., 0 */
    audio_tokens: number;
    /** Accepted prediction tokens, e.g., 0 */
    accepted_prediction_tokens: number;
    /** Rejected prediction tokens, e.g., 0 */
    rejected_prediction_tokens: number;
}
interface GrokResponseUsage {
    /** Number of tokens in the prompt, e.g., 702 */
    prompt_tokens: number;
    /** Number of tokens in the completion, e.g., 47 */
    completion_tokens: number;
    /** Total number of tokens used, e.g., 885 */
    total_tokens: number;
    /** Detailed breakdown of prompt tokens */
    prompt_tokens_details: GrokPromptTokensDetails;
    /** Detailed breakdown of completion tokens */
    completion_tokens_details: GrokCompletionTokensDetails;
    /** Number of sources used, e.g., 0 */
    num_sources_used: number;
}
interface GrokTextResponse {
    /** Unique identifier for the response, e.g., "4da0b8-2f-007" */
    id: string;
    /** Type of the response object, e.g., "chat.completion" */
    object: string;
    /** Unix timestamp of when the response was created, e.g., 1757857163 */
    created: number;
    /** Model used for the response, e.g., "grok-4-fast" */
    model: string;
    /** Array of response choices */
    choices: GrokResponseChoices[];
    /** Token usage details */
    usage: GrokResponseUsage;
    /** System fingerprint, e.g., "fp_19ea" */
    system_fingerprint: string;
}
type GrokResults<T> = {
    error: undefined;
    data: T;
} | {
    error: string;
    code: string;
};
interface GrokSuccessResponse {
    success: true;
    costUSD: string;
    seconds: string;
}
interface GrokSuccessResponseText<T> extends GrokSuccessResponse {
    type: `json`;
    response: GrokFullResponse<T>;
}
interface GrokSuccessResponseImage extends GrokSuccessResponse {
    type: `image`;
    response: string;
}
interface GrokFailedResponse {
    success: false;
    error: string;
    costUSD?: string;
}
interface GrokSource {
    link: string;
    pageTitle: string;
}
interface GrokFullResponse<T> {
    data: T;
    sources: GrokSource[];
}
type GrokAITypes = `json` | `image`;
interface GrokPromptObj {
    dataKeyName: string;
    type: `number` | `boolean` | `string`;
    requiredData: string;
}
type GrokImageRequest = {
    type: `image_url`;
    image_url: {
        url: string;
        detail: string;
    };
} | {
    type: `text`;
    text: string;
};
type GrokImageResponse = {
    data: {
        url?: string;
        b64_json?: string;
        revised_prompt: string;
    }[];
};
export { GrokFullResponse, GrokTextResponse, GrokResponseUsage, GrokResults, GrokSuccessResponseText, GrokSuccessResponseImage, GrokFailedResponse, GrokSource, GrokAITypes, GrokPromptObj, GrokImageRequest, GrokImageResponse, };
