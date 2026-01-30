import {
    GrokTextResponse,
    GrokResponseUsage,
    GrokResults,
    GrokSuccessResponseText,
    GrokSuccessResponseImage,
    GrokPromptObj,
    GrokImageResponse,
    GrokFailedResponse,
    GrokFullResponse,
} from "../types";
import {
    GROK_BASE_URL,
    GROK_PRICING_TEXT,
    GROK_PRICING_IMAGES,
    GROK_PRICING_UNIT,
    GROK_SETUP,
    GrokModelText,
    GrokReqObj,
    grokSourcesStatement,
    GrokModelImages,
    GrokImageTypes,
} from "./constants";

type GrokInputParams = {
    apiKey: string;
} & ({
    responseType: `json`;
    prompt: GrokPromptObj[];
    model?: GrokModelText;
    format?: undefined;
} | {
    responseType: `image`;
    prompt: string;
    model?: GrokModelImages;
    format?: GrokImageTypes;
})

const
    /** Calculates cost of Grok API call based on token usage and model */
    calculateGrokCost = ({
        usage,
        model
    }: {
        usage: GrokResponseUsage;
        model: GrokModelText | GrokModelImages
    }): number | undefined => {
        try {
            const
                pricing = GROK_PRICING_TEXT[model as GrokModelText]
                    || GROK_PRICING_IMAGES[model as GrokModelImages],
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
        format,
    }: GrokInputParams): Promise<
        GrokSuccessResponseText<T>
        | GrokSuccessResponseImage
        | GrokFailedResponse
    > => {
        try {
            const
                isImage = responseType == `image` && typeof prompt == `string`,
                isJSON = responseType == `json` && typeof prompt != `string`;
            model = model || (
                isImage ? Object.keys(GROK_PRICING_IMAGES)?.[0] as GrokModelText
                    : Object.keys(GROK_PRICING_TEXT)?.[0] as GrokModelImages
            );
            const
                start = performance.now(),
                reqData: GrokReqObj | undefined = isImage ? {
                    model: model as GrokModelImages,
                    prompt,
                    response_format: format || `url`,
                    n: 1,
                } : isJSON ? {
                    messages: [{
                        role: `system`,
                        content: GROK_SETUP
                    }, {
                        role: `user`,
                        content: grokRequest(prompt)
                    }],
                    model: model as GrokModelText,
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
            let
                costUSD = GROK_PRICING_IMAGES[model as GrokModelImages]?.completion || 0,
                resultTextJSON: GrokFullResponse<T> = undefined as any,
                resultImage: string = ``;
            if (res?.error != undefined) {
                console.log(`aiData error`, res?.error);
                return {
                    success: false,
                    error: res?.error,
                    costUSD: isImage ? costUSD.toFixed(4) : `0`
                };
            } else {
                if (!res?.data)
                    return {
                        success: false,
                        error: ``,
                        costUSD: isImage ? costUSD.toFixed(4) : `0`
                    };

                if (`choices` in res?.data) {
                    costUSD = calculateGrokCost({ usage: res?.data?.usage, model }) || 0;
                    const responseStr = res?.data?.choices?.[0]?.message?.content;
                    resultTextJSON = JSON.parse(responseStr);
                } else if (isImage) {
                    const imageData = res?.data?.data?.[0];
                    resultImage = imageData?.url
                        || imageData?.b64_json
                        || ``;
                } else console.log(`aiData issue`, res);
            };
            return {
                success: true,
                costUSD: costUSD.toFixed(4),
                seconds: ((performance.now() - start) / 1_000, 2).toFixed(2),
                ...isImage ? {
                    type: `image`,
                    response: resultImage,
                } : {
                    type: `json`,
                    response: resultTextJSON,
                },
            };
        } catch (e) {
            console.log(`aiData failed`, e);
        };
        return {
            success: false,
            error: ``
        };
    };

export {
    GrokInputParams,
    grokAI,
};