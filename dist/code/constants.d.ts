declare const GROK_BASE_URL = "https://api.x.ai/v1/", GROK_PRICING_UNIT = 1000000, GROK_PRICING_DATA: {
    readonly 'grok-code-fast-1': GrokPricing;
    readonly 'grok-4-0709': GrokPricing;
    readonly 'grok-3': GrokPricing;
    readonly 'grok-3-mini': GrokPricing;
    readonly 'grok-2-image-1212': GrokPricing;
}, grokSourcesStatement: (type: string) => string, GROK_SETUP: string;
interface GrokPricing {
    prompt: number;
    cached: number;
    completion: number;
    images?: boolean;
}
type GrokModelTypes = keyof typeof GROK_PRICING_DATA;
interface GrokReqMessage {
    role: `system` | `user`;
    content: string;
}
type GrokImageTypes = `url` | `b64_json`;
type GrokReqObj = {
    model: GrokModelTypes;
    prompt: string;
    response_format?: GrokImageTypes;
    n: number;
} | {
    model: GrokModelTypes;
    messages: GrokReqMessage[];
    stream: boolean;
    temperature: number;
};
export { GROK_BASE_URL, GROK_PRICING_UNIT, GROK_PRICING_DATA, GROK_SETUP, grokSourcesStatement, GrokModelTypes, GrokReqMessage, GrokImageTypes, GrokReqObj, };
