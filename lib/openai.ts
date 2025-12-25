
export async function checkModeration(text: string): Promise<{ flagged: boolean; categories: string[] }> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.warn("OPENAI_API_KEY is missing. Skipping moderation check.");
        return { flagged: false, categories: [] };
    }

    try {
        const response = await fetch("https://api.openai.com/v1/moderations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ input: text }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenAI API Error:", errorText);
            throw new Error(`OpenAI API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const result = data.results[0];

        if (result.flagged) {
            const categories = Object.keys(result.categories).filter(
                (key) => result.categories[key]
            );
            return { flagged: true, categories };
        }

        return { flagged: false, categories: [] };
    } catch (error) {
        console.error("Moderation check failed:", error);
        // Fail open or closed? Here we fail open (allow) to prevent system blockage on API error, unless crucial.
        // For strict safety, you might want to return true (flagged) on error.
        return { flagged: false, categories: [] };
    }
}
