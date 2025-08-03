// prompts/runPrompt.js
require('dotenv').config();
const https = require('https');

// Simulated typing effect
function typeOut(text, delay = 30) {
  return new Promise(resolve => {
    let i = 0;
    const interval = setInterval(() => {
      process.stdout.write(text[i]);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, delay);
  });
}

async function runPrompt(userInput, model = 'gpt-4', temperature = 0.7, slow = false) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ GPT key not found in .env file.');
    return;
  }

  const body = JSON.stringify({
    model,
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userInput }
    ],
    temperature
  });

  const options = {
    hostname: 'api.openai.com',
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', async () => {
        try {
          const parsed = JSON.parse(data);
          const reply = parsed.choices?.[0]?.message?.content || 'No response';
          console.log(`🧠 GPT (${model}) says:`);

          if (slow) {
            await typeOut(reply + '\n');
          } else {
            console.log(reply);
          }

          resolve(reply);
        } catch (e) {
          console.error('❌ Failed to parse GPT response.');
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      console.error('❌ GPT request failed:', e.message);
      reject(e);
    });

    req.write(body);
    req.end();
  });
}

module.exports = runPrompt;
