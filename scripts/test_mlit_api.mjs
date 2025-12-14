import fs from 'fs';
import path from 'path';

const API_KEY = process.env.MLIT_API_KEY || 'tYwqwfBBbjZx8pjqdo6nsID94EqIMmP4';
// Ensure trailing slash if required by some servers, though usually not.
// Search result said https://www.mlit-data.jp/api/v1/
const ENDPOINT = 'https://www.mlit-data.jp/api/v1/';

async function testFetch() {
  console.log(`Testing GraphQL fetch to ${ENDPOINT}...`);

  // Simple query for prefectures
  // Probe to find the right field name for prefecture link
  const query = `
    query {
      municipalities {
        code
        name
        prefectureCode_probe
      }
    }
  `;

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'apikey': API_KEY, // Critical: lowercase 'apikey'
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    console.log(`Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log('Response Body:', text.slice(0, 500)); // Log first 500 chars

  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testFetch();
