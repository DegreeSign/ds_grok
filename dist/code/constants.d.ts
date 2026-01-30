declare const GROK_BASE_URL = "https://api.x.ai/v1/", GROK_PRICING_UNIT = 1000000, GROK_PRICING_TEXT: {
    readonly 'grok-4-fast': GrokPricing;
}, GROK_PRICING_IMAGES: {
    readonly 'grok-imagine-image': GrokPricing;
}, grokSourcesStatement: (type: string) => string, GROK_SETUP: string, GROK_IMAGE_PROMPT: string;
interface GrokPricing {
    prompt: number;
    cached: number;
    completion: number;
    images?: boolean;
}
type GrokModelText = keyof typeof GROK_PRICING_TEXT;
type GrokModelImages = keyof typeof GROK_PRICING_IMAGES;
interface GrokReqMessage {
    role: `system` | `user`;
    content: string;
}
type GrokImageTypes = `url` | `b64_json`;
type GrokReqObj = {
    model: GrokModelImages;
    prompt: string;
    response_format?: GrokImageTypes;
    n: number;
} | {
    model: GrokModelText;
    messages: GrokReqMessage[];
    stream: boolean;
    temperature: number;
};
export { GROK_BASE_URL, GROK_PRICING_UNIT, GROK_PRICING_IMAGES, GROK_PRICING_TEXT, GROK_SETUP, GROK_IMAGE_PROMPT, grokSourcesStatement, GrokModelText, GrokModelImages, GrokReqMessage, GrokImageTypes, GrokReqObj, };
