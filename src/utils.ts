export function pickRandom<T>(
    items: T[], 
    count: number
): T[] {
    const pool = [...items];
    const picked: T[] = [];
    for (let i = 0; i < count && pool.length > 0; i++) {
        const index = Math.floor(Math.random() * pool.length);
        picked.push(pool.splice(index, 1)[0]);
    }
    return picked;
}

export function randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
}


export function chunk<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size));
    }
    return chunks;
}
