// gptClient.js

/**
 * Loads the custom Jarvis persona for the GPT prompt.
 * Assumes getJarvisPersona() is defined in persona.js
 */

// ✅ Main function to call GPT with the Jarvis persona
async function runTestPrompt() {
  try {
    const persona = getJarvisPersona(); // pulls from persona.js

    const payload = {
      model: 'gpt-4',
      messages: [
        persona,
        {
          role: 'user',
          content: 'Jarvis, what’s your boot-up status today?'
        }
      ]
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + ScriptProperties.getProperty('OPENAI_API_KEY'),
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };

    const response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', options);
    const json = JSON.parse(response.getContentText());

    Logger.log('🟢 GPT Response:\n' + json.choices[0].message.content);
  } catch (error) {
    Logger.log('❌ Error during GPT call: ' + error);
  }
}
