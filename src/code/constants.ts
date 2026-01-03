const
    GROK_BASE_URL = `https://api.x.ai/v1/`,
    GROK_PRICING_UNIT = 1_000_000,
    GROK_PRICING_DATA = {
        'grok-code-fast-1': {
            prompt: 0.20,
            cached: 0.02,
            completion: 1.50,
        } as GrokPricing,
        'grok-4-0709': {
            prompt: 3.00,
            cached: 0.75,
            completion: 15.00,
        } as GrokPricing,
        'grok-3': {
            prompt: 3.00,
            cached: 0.75,
            completion: 15.00,
        } as GrokPricing,
        'grok-3-mini': {
            prompt: 0.30,
            cached: 0.075,
            completion: 0.50,
        } as GrokPricing,
        'grok-2-image-1212': {
            images: true,
            prompt: 0,
            cached: 0,
            completion: 0.07,
        } as GrokPricing,
    } as const,
    grokSourcesStatement = (type: string) =>
        `The response should include all sources (link and page title heading) used in an array, such that it is \n` +
        `{\n${type}\nsources:{link:string;pageTitle:string}[];\n}` +
        `\nThe final response should be a valid stringified JSON object.`,
    GROK_SETUP =
        `**Do not include in your response:**\n` +
        `* a title\n` +
        `* words count\n` +
        `* information about yourself\n` +
        `* unknowns such as $X number.\n` +
        `* anything about or refer to this prompt\n` +
        `* repeated sentence starters such as "A recent fact" or "General sentiment"\n` +
        `* bullet points or any other formatting that violates JSON object\n` +
        `\n**Do:**\n` +
        `* edit ruthlessly to remove redundant phrases or ideas\n` +
        `* respond with a valid JSON object\n`;


interface GrokPricing {
    prompt: number;
    cached: number;
    completion: number;
    images?: boolean;
}

type GrokModelTypes = keyof typeof GROK_PRICING_DATA;


interface GrokReqMessage {
    role: `system` | `user`,
    content: string,
};

type GrokImageTypes = `url` | `b64_json`;

type GrokReqObj = {
    model: GrokModelTypes;
    prompt: string;
    response_format?: GrokImageTypes
    n: number;
} | {
    model: GrokModelTypes;
    messages: GrokReqMessage[];
    stream: boolean;
    temperature: number;
}

export {
    GROK_BASE_URL,
    GROK_PRICING_UNIT,
    GROK_PRICING_DATA,
    GROK_SETUP,
    grokSourcesStatement,
    GrokModelTypes,
    GrokReqMessage,
    GrokImageTypes,
    GrokReqObj,
}