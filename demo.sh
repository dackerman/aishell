#!/bin/bash

# Demo script for AIShell

echo "AIShell Demo"
echo "-----------"
echo ""

# Check if ANTHROPIC_API_KEY is set
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "Error: ANTHROPIC_API_KEY is not set."
    echo "Please set it with: export ANTHROPIC_API_KEY=your_api_key"
    exit 1
fi

echo "AIShell lets you generate shell commands from natural language descriptions."
echo ""
echo "To enable command pre-filling, you need to set up the shell integration:"
echo ""
echo "1. Generate the shell function for your .bashrc or .zshrc:"
echo "   node dist/index.js --setup"
echo ""
echo "2. Add the generated code to your shell configuration file"
echo ""
echo "3. Restart your terminal or source your configuration file:"
echo "   source ~/.bashrc  # or ~/.zshrc"
echo ""
echo "After setting up, you can use AIShell with these examples:"
echo ""
echo "1. Find all large files in the current directory:"
echo "   aishell find all files larger than 10MB in the current directory"
echo ""
echo "2. Create a compressed archive of a directory:"
echo "   aishell create a compressed tar archive of the src directory"
echo ""
echo "3. Check system information:"
echo "   aishell show detailed system information including CPU, memory, and disk space"
echo ""
echo "Let's try the standalone mode now (without command pre-filling):"
echo ""

# Run AIShell in interactive mode
node dist/index.js