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
              'Format response as JSON string. Each object should have these keys: name, release_year, consoles, reason. Make consoles a comma separated string and only include ones the user owns. Make reason one sentence long.',
          },
          {
            role: 'user',
            content: userQuestion,
          },
        ],
        max_tokens: 300,
        temperature: 0.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
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