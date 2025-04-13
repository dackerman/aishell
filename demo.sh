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

# Check if rlwrap is installed
if ! command -v rlwrap &> /dev/null; then
    echo "Note: For the best experience, install rlwrap:"
    echo "  Ubuntu/Debian: sudo apt install rlwrap"
    echo "  macOS: brew install rlwrap"
    echo "  Fedora/RHEL: sudo dnf install rlwrap"
    echo ""
fi

echo "AIShell lets you generate shell commands from natural language descriptions."
echo "The generated commands will be pre-filled in your terminal for you to review"
echo "before executing them."
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
echo "Let's try it now with an interactive example:"
echo ""

# Run AIShell in interactive mode
./aishell.sh