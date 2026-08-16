import type { IFeudAnswerWithQuestion } from "@/types";

export function feudAnswerDTO(
    line: string
): IFeudAnswerWithQuestion {
    
    const segs = line
    .trim()
    .replace('\r', '')
    .replace(/\s+/, ' ')
    .split(',');

    return {
        question: segs[0]?.trim(),
        text: segs[1]?.trim(),
        position: Number(segs[2]),
        points: Number(segs[3])
    }

}