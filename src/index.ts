#!/usr/bin/env node

import { Anthropic } from '@anthropic-ai/sdk';
import * as readlineSync from 'readline-sync';
import * as util from 'util';

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

// Function to colorize and pretty-print JSON
function formatJSON(obj: any): string {
  // Use util.inspect for better formatting with colors
  return util.inspect(obj, { 
    colors: true, 
    depth: null, 
    compact: false
  });
}

// Check if debug mode is enabled
const isDebugMode = process.env.DEBUG === 'true';

// Function to get a shell command from Claude with conversation history
async function getShellCommand(promptHistory: string[]): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: getApiKey(),
  });

  // Convert prompt history to messages format
  const messages = promptHistory.map((prompt, index) => {
    // First message is the initial request, others are clarifications
    if (index === 0) {
      return {
        role: 'user' as const,
        content: `Generate a shell command to: ${prompt}`
      };
    } else {
      return {
        role: 'user' as const,
        content: `Please refine the command based on this clarification: ${prompt}`
      };
    }
  });

  // Create request payload
  const requestPayload = {
    model: 'claude-3-7-sonnet-20250219',
    max_tokens: 1000,
    system: 'You are an expert in shell commands. Given a description of what the user wants to do, respond ONLY with the exact shell command they should run, with no explanation, introduction, or markdown formatting. Just output the raw command that can be directly executed. If the user provides clarifications, update your command accordingly while maintaining the same careful approach of providing only the exact command.',
    messages,
  };

  // Log request in debug mode
  if (isDebugMode) {
    console.error('\n🔍 DEBUG: Request to Anthropic API');
    console.error('=====================================');
    console.error(formatJSON(requestPayload));
    console.error('=====================================\n');
  }

  // Make the API call
  const message = await anthropic.messages.create(requestPayload);

  // Log response in debug mode
  if (isDebugMode) {
    console.error('\n🔍 DEBUG: Response from Anthropic API');
    console.error('======================================');
    console.error(formatJSON(message));
    console.error('======================================\n');
  }

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
    console.log('Features:');
    console.log('  - Interactive clarification: refine commands by providing feedback');
    console.log('  - Debug mode: set DEBUG=true to see API interactions');
    console.log('');
    console.log('Environment variables:');
    console.log('  ANTHROPIC_API_KEY  Required: Your Anthropic API key');
    console.log('  DEBUG              Optional: Set to "true" to enable debug output');
    console.log('');
    console.log('If no prompt is provided, it will ask for one interactively.');
    console.log('After suggesting a command, you can provide clarifications');
    console.log('to refine the command until you get what you need.');
    process.exit(0);
  }
  
  // Get user prompt from command line arguments or ask for it
  let userPrompt = args.join(' ');
  
  if (!userPrompt) {
    userPrompt = readlineSync.question('What do you want to do? (describe the command you need): ');
  }
  
  // Keep track of all prompts to maintain conversation context
  const promptHistory = [userPrompt];
  
  // Log initial prompt in debug mode
  if (isDebugMode) {
    console.error('\n🔍 DEBUG: Initial prompt');
    console.error('=====================');
    console.error(userPrompt);
    console.error('=====================\n');
  }
  
  try {
    // Interactive command refinement loop
    let command = "";
    let iteration = 0;
    
    while (true) {
      // Show generating message (but only on stderr for first iteration)
      if (iteration === 0) {
        console.error('Generating command...');
      } else {
        console.log('Updating command...');
      }
      
      // Get the command based on all prompts so far
      command = await getShellCommand(promptHistory);
      iteration++;
      
      // Display the command
      console.log('\nSuggested command:');
      console.log(`${command}`);
      
      // Ask for clarification or acceptance
      const clarification = readlineSync.question('\nPress [Enter] to accept, or type a clarification: ');
      
      // If user just pressed Enter, we're done
      if (!clarification) {
        // Print just the final command to stdout without any decoration
        // This ensures the shell script can easily capture it
        console.log(command);
        break;
      }
      
      // Add the clarification to the prompt history
      promptHistory.push(clarification);
      
      // Log clarification in debug mode
      if (isDebugMode) {
        console.error('\n🔍 DEBUG: Clarification added');
        console.error('==========================');
        console.error(clarification);
        console.error('==========================\n');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main().catch(console.error);