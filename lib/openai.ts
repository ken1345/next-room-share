type ModerationInput = string | { type: "image_url"; image_url: { url: string } }[];

export async function checkModeration(input: ModerationInput): Promise<{ flagged: boolean; categories: string[] }> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is missing");

    const response = await fetch("https://api.openai.com/v1/moderations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "omni-moderation-latest", input }),
        signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) throw new Error(`OpenAI moderation HTTP ${response.status}`);

    const result = (await response.json()).results?.[0];
    if (typeof result?.flagged !== "boolean") throw new Error("Invalid moderation response");
    const categories = Object.entries(result.categories ?? {}).filter(([, flagged]) => flagged).map(([key]) => key);
    return { flagged: result.flagged, categories };
}
