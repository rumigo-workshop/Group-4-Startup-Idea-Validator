import Anthropic from '@anthropic-ai/sdk';

const PLACEHOLDER = 'your-anthropic-api-key-here';

/**
 * Sends a tiny request to Anthropic to prove the key works.
 * Throws a clear error if the key is missing or rejected.
 */
export async function checkAnthropicKey(apiKey: string | undefined): Promise<string> {
  if (!apiKey || apiKey.trim() === '' || apiKey === PLACEHOLDER) {
    throw new Error(
      'ANTHROPIC_API_KEY is missing. Copy .env.example to .env at the repo root and set a real key.'
    );
  }

  const model = process.env.ANTHROPIC_MODEL ?? 'claude-haiku-5-5';
  const client = new Anthropic({ apiKey });

  try {
    const msg = await client.messages.create({
      model,
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Reply with the word OK.' }],
    });
    const block = msg.content[0];
    return block?.type === 'text' ? block.text : '';
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      throw new Error(
        'ANTHROPIC_API_KEY was rejected by Anthropic (401). Check that the key in .env is correct and active.'
      );
    }
    if (err instanceof Anthropic.PermissionDeniedError) {
      throw new Error('ANTHROPIC_API_KEY does not have permission for this request (403).');
    }
    if (err instanceof Anthropic.NotFoundError) {
      throw new Error(`Model "${model}" was not found. Set ANTHROPIC_MODEL in .env to a valid model.`);
    }
    throw err;
  }
}
