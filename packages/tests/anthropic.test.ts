import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { describe, it, expect } from 'vitest';
import { checkAnthropicKey } from './src/anthropic';

// Load the .env at the repo root (two levels up from packages/tests)
config({ path: fileURLToPath(new URL('../../.env', import.meta.url)), quiet: true });

describe('Anthropic API key', () => {
  it('fails clearly when the key is missing', async () => {
    await expect(checkAnthropicKey(undefined)).rejects.toThrow(/missing/);
  });

  it('fails clearly when the key is rejected', async () => {
    await expect(checkAnthropicKey('sk-ant-invalid-key-for-testing')).rejects.toThrow(/rejected/);
  }, 30_000);

  it('calls Anthropic with the key from the environment', async () => {
    const reply = await checkAnthropicKey(process.env.ANTHROPIC_API_KEY);
    expect(reply.length).toBeGreaterThan(0);
  }, 30_000);
});
