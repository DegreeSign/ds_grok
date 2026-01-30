import {
    GrokTextResponse,
    GrokResponseUsage,
    GrokResults,
    GrokSuccessResponse,
    GrokAITypes,
    GrokPromptObj,
    GrokImageResponse,
    GrokFailedResponse,
} from "../types";
import {
    GROK_BASE_URL,
    GROK_PRICING_DATA,
    GROK_PRICING_UNIT,
    GROK_SETUP,
    GrokModelTypes,
    GrokReqObj,
    grokSourcesStatement,
} from "./constants";

interface GrokInputParams {
    apiKey: string;
    responseType: GrokAITypes;
    prompt: string | GrokPromptObj[];
    model?: GrokModelTypes;
}

const
    /** Calculates cost of Grok API call based on token usage and model */
    calculateGrokCost = ({
        usage,
        model
    }: {
        usage: GrokResponseUsage;
        model: GrokModelTypes
    }): number | undefined => {
        try {
            const
                pricing = GROK_PRICING_DATA[model],
                {
                    prompt_tokens: prompt,
                    prompt_tokens_details: { cached_tokens: cached },
                    total_tokens: total,
                } = usage || { prompt_tokens_details: {} },
                completion = total - prompt,
                promptCost = prompt * pricing.prompt,
                cachedCost = cached * pricing.cached,
                completionCost = completion * pricing.completion;
            return (
                promptCost +
                cachedCost +
                completionCost
            ) / GROK_PRICING_UNIT
        } catch (e) {
            console.log(`calculateGrokCost failed`, e);
        };
    },
    grokRequest = (
        prompt: GrokPromptObj[],
    ) =>
        `The JSON response object should follow this TS interface. \n` +
        `interface ResponseType {\n` +
        prompt.map(t => `${t.dataKeyName}: ${t.type}; // ${t.requiredData}\n`) +
        `};\n` +
        grokSourcesStatement(`data:ResponseType;`),
    /** Grok AI Text */
    grokAI = async <T>({
        apiKey,
        responseType,
        prompt,
        model,
    }: GrokInputParams): Promise<
        GrokSuccessResponse<T>
        | GrokFailedResponse
    > => {
        try {
            const
                isImage = responseType == `image` && typeof prompt == `string`,
                isJSON = responseType == `json` && typeof prompt != `string`;
            model = model || (
                isImage ? `grok-imagine-image`
                    : `grok-4-fast`
            );
            const
                start = performance.now(),
                reqData: GrokReqObj | undefined = isImage ? {
                    model,
                    prompt,
                    response_format: `url`,
                    n: 1,
                } : isJSON ? {
                    messages: [{
                        role: `system`,
                        content: GROK_SETUP
                    }, {
                        role: `user`,
                        content: grokRequest(prompt)
                    }],
                    model,
                    stream: false,
                    temperature: responseType == `json` ? 0.3 : 0.7,
                } : undefined,
                reqURI = isImage ? `images/generations`
                    : `chat/completions`,
                response = !apiKey || !reqData ? undefined
                    : await fetch(`${GROK_BASE_URL}${reqURI}`, {
                        method: `POST`,
                        headers: {
                            'Content-Type': `application/json`,
                            Authorization: `Bearer ${apiKey}`,
                        },
                        body: JSON.stringify(reqData),
                    }),
                data = await response?.json(),
                res: GrokResults<GrokTextResponse | GrokImageResponse> = data?.error ? {
                    code: data?.code,
                    error: data?.error
                } : {
                    data,
                    error: undefined,
                };
            if (res?.error != undefined) {
                console.log(`aiData error`, res?.error);
                return {
                    success: false,
                    error: res?.error
                };
            } else {
                let
                    costUSD = 0,
                    response = `` as string | T;
                if (`choices` in res?.data) {
                    costUSD = calculateGrokCost({ usage: res?.data?.usage, model }) || 0;
                    const responseStr = res?.data?.choices?.[0]?.message?.content;
                    response = JSON.parse(responseStr);
                } else if (isImage) {
                    const imageData = res?.data?.data?.[0];
                    costUSD = 0.07;
                    response = imageData?.url
                        || imageData?.b64_json
                        || ``;
                };
                if (!response) console.log(`aiData issue`, res);
                return {
                    success: true,
                    response,
                    costUSD: costUSD.toFixed(2),
                    seconds: ((performance.now() - start) / 1_000, 2).toFixed(2),
                };
            };
        } catch (e) {
            console.log(`aiData failed`, e);
            return {
                success: false,
                error: ``
            };
        };
    };

export {
    GrokInputParams,
    grokAI,
};