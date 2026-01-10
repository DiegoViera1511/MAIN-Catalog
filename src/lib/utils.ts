import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {SupaBaseRoutes} from "@/lib/routes.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function copyTextToClipboard(text: string) {
    return navigator.clipboard.writeText(text)
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function decodeUrlText (encodedText: string) {
    return decodeURIComponent(encodedText.replace(/%20/g, ' ').replace(/%0A/g, '\n'));
}

export function getDiscountPercentage (price: number, discountPrice:number) {
    const discount = ((price - discountPrice) / price) * 100;
    return Math.round(discount);
}

export function getSupabaseFilePath(fileName: string) {
    const fileExt = fileName.split('.').pop()
    return `${SupaBaseRoutes.IMAGES}${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
}