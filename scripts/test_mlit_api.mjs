import fs from 'fs';
import path from 'path';

const API_KEY = process.env.MLIT_API_KEY || 'tYwqwfBBbjZx8pjqdo6nsID94EqIMmP4';
const ENDPOINT = 'https://www.mlit-data.jp/api/v1'; // Guessing base endpoint for GraphQL

async function testFetch() {
    console.log(`Testing GraphQL fetch to ${ENDPOINT}...`);

    const query = `
      query {
        prefectures {
          code
          name
        }
      }
    `;

    try {
        const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });

        console.log(`Status: ${res.status} ${res.statusText}`);
        const text = await res.text();
        console.log('Response Body:', text);

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testFetch();
