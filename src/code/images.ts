// import ffmpegStatic from 'ffmpeg-static';
// import ffmpegObj from 'fluent-ffmpeg';
import { grokAI } from './grok';
import { GrokImageRequest } from '../types';

const
    // getFFMPEG = () => {
    //     if (ffmpegStatic)
    //         ffmpegObj.setFfmpegPath(ffmpegStatic);
    //     return ffmpegObj
    // },
    // ffmpeg = getFFMPEG(),
    // getImageData = async ({
    //     path,
    // }: {
    //     path: string;
    // }): Promise<string> => {
    //     try {
    //         let buffer: Buffer;

    //         // online images
    //         if (path?.includes('http')) {
    //             const response = await fetch(path);
    //             buffer = Buffer.from(await response.arrayBuffer());


    //             // local images
    //         } else {
    //             buffer = await new Promise<Buffer>((resolve, reject) => {
    //                 ffmpeg(path)
    //                     .outputFormat('jpg')
    //                     .toFormat('jpg')
    //                     .pipe()
    //                     .on('data', (chunk: Buffer) => resolve(chunk))
    //                     .on('error', reject);
    //             });
    //         };

    //         // Convert buffer to base64
    //         const base64_image = buffer.toString('base64');
    //         return `data:image/jpeg;base64,${base64_image}`;
    //     } catch (e) {
    //         console.log(`imageData failed`, e);
    //         return ``
    //     };
    // },
    // grokImageProcessing = async ({
    //     description,
    //     imagesPath,
    // }: {
    //     description: string,
    //     imagesPath: string[]
    // }): Promise<GrokImageRequest[]> => {
    //     try {
    //         const imagesData: GrokImageRequest[] = [];
    //         for (let i = 0; i < imagesPath.length; i++)
    //             imagesData.push({
    //                 type: `image_url`,
    //                 image_url: {
    //                     url: await getImageData({ path: imagesPath[i] }),
    //                     detail: "high",
    //                 }
    //             });
    //         return [
    //             ...imagesData,
    //             {
    //                 type: `text`,
    //                 text: description,
    //             }
    //         ];
    //     } catch (e) {
    //         console.log(`grokImages failed`, e);
    //         return []
    //     };
    // },
    grokGenImage = async ({
        apiKey,
        prompt,
    }: {
        apiKey: string;
        prompt: string;
    }) => {
        try {
            const data = await grokAI({
                apiKey,
                prompt,
                responseType: `image`,
            });
            if (data?.success)
                return data?.response
        } catch (e) {
            console.log(`grokGenImage failed`, e);
            return ``
        };
    };

export {
    grokGenImage,
};