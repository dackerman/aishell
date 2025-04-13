#!/usr/bin/env node

import { Anthropic } from '@anthropic-ai/sdk';
import * as readlineSync from 'readline-sync';
import * as fs from 'fs';
import * as path from 'path';
import * as childProcess from 'child_process';

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
    return content.text;
  } else {
    throw new Error('Unexpected response format from Claude');
  }
}

// Main function
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  // Check for command-only flag
  const commandOnlyFlag = args.includes('--command-only');
  
  // Remove flags from args
  let filteredArgs = args.filter(arg => !arg.startsWith('--'));
  
  // Get user prompt from command line arguments or ask for it
  let userPrompt = filteredArgs.join(' ');
  
  if (!userPrompt && !commandOnlyFlag) {
    userPrompt = readlineSync.question('What do you want to do? (describe the command you need): ');
  } else if (!userPrompt && commandOnlyFlag) {
    console.error('Error: No prompt provided with --command-only flag');
    process.exit(1);
  }
  
  try {
    // Only show "Generating command..." if not in command-only mode
    if (!commandOnlyFlag) {
      console.log('Generating command...');
    }
    
    const command = await getShellCommand(userPrompt);
    
    // If --command-only flag is set, just output the command and exit
    if (commandOnlyFlag) {
      // Output the raw command for shell script to capture
      process.stdout.write(command);
      process.exit(0);
    }
    
    // Display the command
    console.log('\nSuggested command:');
    console.log(`${command}`);
    
    // Provide options for the user
    console.log('\nOptions:');
    console.log('1. Copy command to clipboard');
    console.log('2. Execute command now');
    console.log('3. Exit');
    
    const choice = readlineSync.question('Enter choice (1-3): ');
    
    switch(choice) {
      case '1':
        // Copy to clipboard if available
        try {
          if (process.platform === 'darwin') {
            // macOS
            childProcess.execSync(`echo "${command.replace(/"/g, '\\"')}" | pbcopy`, { encoding: 'utf-8' });
          } else if (process.platform === 'linux') {
            // Try xclip or xsel on Linux
            try {
              childProcess.execSync(`echo "${command.replace(/"/g, '\\"')}" | xclip -selection clipboard`, { encoding: 'utf-8' });
            } catch {
              try {
                childProcess.execSync(`echo "${command.replace(/"/g, '\\"')}" | xsel -ib`, { encoding: 'utf-8' });
              } catch {
                console.log('Clipboard utilities not available. Install xclip or xsel.');
              }
            }
          } else if (process.platform === 'win32') {
            // Windows
            childProcess.execSync(`echo ${command.replace(/"/g, '\\"')} | clip`, { encoding: 'utf-8' });
          }
          console.log('Command copied to clipboard!');
        } catch (error) {
          console.error('Failed to copy to clipboard:', error);
        }
        break;
      case '2':
        // Execute command
        console.log(`Executing: ${command}`);
        try {
          // Execute the command in a shell with stdin/stdout/stderr inherited
          childProcess.execSync(command, { 
            stdio: 'inherit', 
            encoding: 'utf-8'
          });
        } catch (error) {
          // Command execution might throw even with successful exit
          // due to how Node.js handles process signals
        }
        break;
      case '3':
      default:
        console.log('Exiting without action.');
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main().catch(console.error);