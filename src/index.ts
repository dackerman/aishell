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
    model: 'claude-3-opus-20240229',
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
    return content.text;
  } else {
    throw new Error('Unexpected response format from Claude');
  }
}

// Main function
async function main() {
  // Get user prompt from command line arguments or ask for it
  const args = process.argv.slice(2);
  let userPrompt = args.join(' ');
  
  if (!userPrompt) {
    userPrompt = readlineSync.question('What do you want to do? (describe the command you need): ');
  }
  
  try {
    console.log('Generating command...');
    const command = await getShellCommand(userPrompt);
    
    // Display the command
    console.log('\nSuggested command:');
    console.log(`${command}`);
    
    // Prompt user to execute or cancel
    console.log('\nPress Enter to execute this command or Ctrl+C to cancel');
    readlineSync.question('');
    
    // The user can copy the command from here and execute it manually
    console.log(`\nCommand ready to execute: ${command}`);
    console.log('(Copy and paste this command to your terminal)');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);