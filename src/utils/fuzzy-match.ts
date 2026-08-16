const STOP_WORDS = new Set(['a', 'an', 'the']);

function normalize(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word && !STOP_WORDS.has(word))
        .join(' ');
}

function levenshtein(a: string, b: string): number {
    const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }

    return dp[a.length][b.length];
}

function wordsClose(a: string, b: string): boolean {
    if (a === b) return true;
    if (/^\d+$/.test(a) || /^\d+$/.test(b)) return false;
    const threshold = Math.min(3, Math.max(1, Math.floor(Math.max(a.length, b.length) * 0.3)));
    return levenshtein(a, b) <= threshold;
}

export function isMercifulMatch(guess: string, answer: string): boolean {
    const normGuess = normalize(guess);
    const normAnswer = normalize(answer);
    if (!normGuess || !normAnswer) return false;
    if (normGuess === normAnswer) return true;
    const guessWords = normGuess.split(' ');
    const answerWords = normAnswer.split(' ');
    if (guessWords.length !== answerWords.length) return false;
    return guessWords.every((word, i) => wordsClose(word, answerWords[i]));
}
