import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
//-------------
import cl100k_base from 'tiktoken/encoders/cl100k_base';
import { Tiktoken } from 'tiktoken';
import { processingQueue } from "$stores/stores";
import { get } from "svelte/store";

export function getTokens(text:string){
  if(!text) return undefined;
    //If a getTokens process is already running, return
    const curQueue = get(processingQueue);
    if (curQueue.some((item: any) => item.process === 'getTokens')) {
        console.log('getTokens process is already running');
        return;
    }
    //add to processingQueue
    processingQueue.update((queue: any) => [...queue, {process: 'getTokens', humanName: 'Tokenize', start: Date.now()}]);
    const encoding = new Tiktoken(
        cl100k_base.bpe_ranks,
        cl100k_base.special_tokens,
        cl100k_base.pat_str
      );
    const tokens = encoding.encode(text);
    encoding.free();
    //remove from processingQueue
    processingQueue.update((queue: any) => queue.filter((item: any) => item.process !== 'getTokens'));
    return tokens;
};

