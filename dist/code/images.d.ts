declare const grokGenImage: ({ apiKey, description, }: {
    apiKey: string;
    description: string;
}) => Promise<{
    prompt?: string;
    url?: string;
    costUSD?: string;
}>;
export { grokGenImage, };
