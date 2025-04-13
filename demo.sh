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

echo "Example 1: Find all large files in the current directory"
echo "--------------------------------------------------------"
node dist/index.js "find all files larger than 10MB in the current directory"

echo ""
echo "Example 2: Create a compressed archive of a directory"
echo "----------------------------------------------------"
node dist/index.js "create a compressed tar archive of the src directory"

echo ""
echo "Example 3: Check system information"
echo "----------------------------------"
node dist/index.js "show detailed system information including CPU, memory, and disk space"

echo ""
echo "Demo completed!"