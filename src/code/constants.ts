const
    GROK_BASE_URL = `https://api.x.ai/v1/`,
    GROK_PRICING_UNIT = 1_000_000,
    GROK_PRICING_TEXT = {
        'grok-4-fast': {
            prompt: 0.20,
            cached: 0.05,
            completion: 0.50,
        } as GrokPricing,
    } as const,
    GROK_PRICING_IMAGES = {
        'grok-imagine-image': {
            images: true,
            prompt: 0.002,
            cached: 0.002,
            completion: 0.02,
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
        `* respond with a valid JSON object\n`,
    GROK_IMAGE_PROMPT =
        `1. Create a 200 words prompt to generate an image based on this description:\n   DESCRIPTION_TEXT\n` +
        `2. Produce a unique interesting image.\n` +
        `3. Do not mention the number of words in the prompt.\n` +
        `4. If the prompt results in any human figure in a revealing or explicit manner, revise the prompt without deviating from the required description to describe in detail a minimalist covering for each and every revealing part, without using explicit or intimate words.`;

interface GrokPricing {
    prompt: number;
    cached: number;
    completion: number;
    images?: boolean;
}

type GrokModelText = keyof typeof GROK_PRICING_TEXT;

type GrokModelImages = keyof typeof GROK_PRICING_IMAGES;

interface GrokReqMessage {
    role: `system` | `user`,
    content: string,
};

type GrokImageTypes = `url` | `b64_json`;

type GrokReqObj = {
    model: GrokModelImages;
    prompt: string;
    response_format?: GrokImageTypes
    n: number;
} | {
    model: GrokModelText;
    messages: GrokReqMessage[];
    stream: boolean;
    temperature: number;
}

export {
    GROK_BASE_URL,
    GROK_PRICING_UNIT,
    GROK_PRICING_IMAGES,
    GROK_PRICING_TEXT,
    GROK_SETUP,
    GROK_IMAGE_PROMPT,
    grokSourcesStatement,
    GrokModelText,
    GrokModelImages,
    GrokReqMessage,
    GrokImageTypes,
    GrokReqObj,
}