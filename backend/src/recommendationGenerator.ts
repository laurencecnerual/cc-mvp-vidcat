export const askChatGPT = async (userQuestion: string): Promise<string> => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'Format response as JSON string with these keys: name, release_year, consoles, reason. Make consoles a comma separated string and only include ones the user owns. Make reason only one sentence long. Answer with 1 game, but do not always pick the same game.',
          },
          {
            role: 'user',
            content: userQuestion,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from ChatGPT:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content.trim();
    return assistantMessage;
  } catch (error) {
    console.error('Error asking ChatGPT:', error.message);
    throw error;
  }
};