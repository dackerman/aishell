#!/usr/bin/env node

import { Anthropic } from '@anthropic-ai/sdk';
import * as readlineSync from 'readline-sync';
import * as fs from 'fs';
import * as path from 'path';

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

// Check if this script is being run directly or sourced
function isSourced(): boolean {
  // If run via the shell function, this env var will be set
  return process.env.AISHELL_SOURCED === 'true';
}

// Generate shell function for sourcing in .bashrc/.zshrc
function generateShellFunction(): string {
  const scriptPath = path.resolve(__dirname, '../dist/index.js');
  
  return `
# AIShell function for command generation
aishell() {
  local prompt="$*"
  if [ -z "$prompt" ]; then
    echo "Usage: aishell [description of command you need]"
    return 1
  fi
  
  # Run the Node.js script with sourced flag
  AISHELL_SOURCED=true ${scriptPath} "$prompt"
  
  # Get the last command from file
  if [ -f ~/.aishell_last_command ]; then
    local cmd=$(cat ~/.aishell_last_command)
    rm ~/.aishell_last_command
    # Add to history and pre-fill command line
    history -s "$cmd"
    # Return the command but don't execute it
    echo -n "$cmd"
  fi
}
`;
}

// Main function
async function main() {
  // Show installation instructions if --setup flag is provided
  if (process.argv.includes('--setup')) {
    console.log('Add the following to your ~/.bashrc or ~/.zshrc file:');
    console.log(generateShellFunction());
    console.log('\nThen restart your terminal or run:');
    console.log('source ~/.bashrc  # or source ~/.zshrc');
    process.exit(0);
  }

  // If not sourced, show warning
  if (!isSourced()) {
    console.log('Warning: AIShell is running in standalone mode and cannot pre-fill commands.');
    console.log('Run with --setup flag to see installation instructions.');
    console.log('');
  }
  
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
    
    // If sourced, save command to file for shell function to use
    if (isSourced()) {
      fs.writeFileSync(path.join(process.env.HOME || '~', '.aishell_last_command'), command);
      process.exit(0);
    }
    
    // If not sourced, ask user to copy or execute
    console.log('\nOptions:');
    console.log('1. Copy command to clipboard');
    console.log('2. Execute command now');
    console.log('3. Exit');
    
    const choice = readlineSync.question('Enter choice (1-3): ');
    
    switch(choice) {
      case '1':
        // Copy to clipboard if available
        try {
          const { execSync } = require('child_process');
          if (process.platform === 'darwin') {
            // macOS
            execSync(`echo "${command.replace(/"/g, '\\"')}" | pbcopy`);
          } else if (process.platform === 'linux') {
            // Try xclip or xsel on Linux
            try {
              execSync(`echo "${command.replace(/"/g, '\\"')}" | xclip -selection clipboard`);
            } catch {
              try {
                execSync(`echo "${command.replace(/"/g, '\\"')}" | xsel -ib`);
              } catch {
                console.log('Clipboard utilities not available. Install xclip or xsel.');
              }
            }
          } else if (process.platform === 'win32') {
            // Windows
            execSync(`echo ${command.replace(/"/g, '\\"')} | clip`);
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
          const { execSync } = require('child_process');
          execSync(command, { stdio: 'inherit', shell: true });
        } catch (error) {
          // Command execution might throw even with successful exit
          // due to how Node.js handles process signals
        }
        break;
      case '3':
      default:
        console.log('Exiting without action.');
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);