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
echo "To use AIShell, you can:"
echo ""
echo "1. Run the Node.js version (generates command but can't pre-fill terminal):"
echo "   node dist/index.js \"your command description\""
echo ""
echo "2. Use the shell script version (can pre-fill terminal):"
echo "   ./aishell.sh \"your command description\""
echo ""
echo "Let's try the shell script version with an example:"
echo ""
echo "Try these examples:"
echo ""
echo "1. Find all large files in the current directory:"
echo "   ./aishell.sh \"find all files larger than 10MB in the current directory\""
echo ""
echo "2. Create a compressed archive of a directory:"
echo "   ./aishell.sh \"create a compressed tar archive of the src directory\""
echo ""
echo "3. Check system information:"
echo "   ./aishell.sh \"show detailed system information including CPU, memory, and disk space\""
echo ""
echo "Let's try the interactive mode:"
echo ""

# Run AIShell in interactive mode
node dist/index.js