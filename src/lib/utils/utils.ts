import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
//-------------
import cl100k_base from 'tiktoken/encoders/cl100k_base';
import { Tiktoken } from 'tiktoken';
import { addProcessToQueue } from "$stores/processes";

export async function getTokens(text: string): Promise<any> {
  if (!text) return undefined;

  const processFn = async () => {
      const encoding = new Tiktoken(
          cl100k_base.bpe_ranks,
          cl100k_base.special_tokens,
          cl100k_base.pat_str
      );
      const tokens = encoding.encode(text);
      encoding.free();
      return tokens;
  };

  return addProcessToQueue('getTokens', 'Tokenize', processFn);
}

