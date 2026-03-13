const apiKey = process.env.GEMINI_API_KEY;
const baseUrl = process.env.GOOGLE_GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/';
console.log("baseUrl", baseUrl);

const url = new URL('gemini/v1beta/models/gemini-2.0-flash:generateContent', baseUrl);
url.searchParams.set('key', apiKey);

console.log("Fetching from", url.toString());

const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello" }] }]
    })
});

console.log("Status:", response.status);
console.log("Body:", await response.text());
