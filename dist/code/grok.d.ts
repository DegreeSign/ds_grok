import { GrokSuccessResponse, GrokAITypes, GrokPromptObj, GrokFailedResponse } from "../types";
import { GrokModelTypes } from "./constants";
interface GrokInputParams {
    apiKey: string;
    responseType: GrokAITypes;
    prompt: string | GrokPromptObj[];
    model?: GrokModelTypes;
}
declare const 
/** Grok AI Text */
grokAI: <T>({ apiKey, responseType, prompt, model, }: GrokInputParams) => Promise<GrokSuccessResponse<T> | GrokFailedResponse>;
export { GrokInputParams, grokAI, };
