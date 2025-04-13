#!/usr/bin/env node

import { Anthropic } from '@anthropic-ai/sdk';
import * as readlineSync from 'readline-sync';

// Function to check and get API key
function getApiKey(): string {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
    console.error('Please set it with: export ANTHROPIC_API_KEY=your_api_key');
    process.exit(1);
  }
  return apiKey;
}

// Function to get a shell command from Claude
async function getShellCommand(prompt: string): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: getApiKey(),
  });

  const message = await anthropic.messages.create({
    model: 'claude-3-7-sonnet-20250219',
    max_tokens: 1000,
    system: 'You are an expert in shell commands. Given a description of what the user wants to do, respond ONLY with the exact shell command they should run, with no explanation, introduction, or markdown formatting. Just output the raw command that can be directly executed.',
    messages: [
      {
        role: 'user',
        content: `Generate a shell command to: ${prompt}`
      }
    ],
  });

  // Handle different content types
  const content = message.content[0];
  if ('text' in content) {
    return content.text.trim();
  } else {
    throw new Error('Unexpected response format from Claude');
  }
}

// Main function
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  // Check for help flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: aishell [prompt]');
    console.log('Generates shell commands from natural language descriptions.');
    console.log('');
    console.log('Example: aishell "find all files larger than 100MB"');
    console.log('');
    console.log('If no prompt is provided, it will ask for one interactively.');
    process.exit(0);
  }
  
  // Get user prompt from command line arguments or ask for it
  let userPrompt = args.join(' ');
  
  if (!userPrompt) {
    userPrompt = readlineSync.question('What do you want to do? (describe the command you need): ');
  }
  
  try {
    // Show that we're generating
    console.error('Generating command...');
    
    const command = await getShellCommand(userPrompt);
    
    // Output the raw command to stdout for easy capture by scripts
    console.log(command);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main().catch(console.error);