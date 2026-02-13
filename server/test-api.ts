/**
 * Quick test to verify Anthropic API key works
 */

import '@anthropic-ai/sdk/shims/node';
import * as dotenv from 'dotenv';
import { getCoaching } from './services/llm-coaching';

dotenv.config();

async function testAPI() {
  console.log('Testing Anthropic API connection...\n');

  const testRequest = {
    name: 'React',
    quadrant: 'languages-and-frameworks' as const,
    ring: 'adopt' as const,
    description: 'A library for building UIs'
  };

  try {
    console.log('Sending request to LLM...');
    const response = await getCoaching(testRequest);

    if (response.unavailable) {
      console.log('❌ API unavailable:', response.coaching);
      process.exit(1);
    }

    console.log('✅ API connection successful!\n');
    console.log('Coaching received:');
    console.log('-'.repeat(50));
    console.log(response.coaching);
    console.log('-'.repeat(50));
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testAPI();
