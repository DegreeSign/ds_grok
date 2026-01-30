import { GrokSuccessResponseText, GrokSuccessResponseImage, GrokPromptObj, GrokFailedResponse } from "../types";
import { GrokModelText, GrokModelImages, GrokImageTypes } from "./constants";
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
});
declare const 
/** Grok AI Text */
grokAI: <T>({ apiKey, responseType, prompt, model, format, }: GrokInputParams) => Promise<GrokSuccessResponseText<T> | GrokSuccessResponseImage | GrokFailedResponse>;
export { GrokInputParams, grokAI, };
