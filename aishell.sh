#!/bin/bash

# AIShell - Shell script for generating and pre-filling terminal commands

# Check if rlwrap is installed
if ! command -v rlwrap &> /dev/null; then
  echo "Warning: rlwrap not found. Command pre-filling won't work optimally."
  echo "Consider installing rlwrap for better experience:"
  echo "  - Ubuntu/Debian: sudo apt install rlwrap"
  echo "  - macOS: brew install rlwrap"
  echo "  - Fedora/RHEL: sudo dnf install rlwrap"
  RLWRAP_AVAILABLE=0
else
  RLWRAP_AVAILABLE=1
fi

# Get path to the Node.js script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
NODE_SCRIPT="${SCRIPT_DIR}/dist/index.js"

# Check for help flag
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
  echo "Usage: ./aishell.sh [prompt]"
  echo ""
  echo "Generates shell commands from natural language descriptions"
  echo "and pre-fills them in your terminal."
  echo ""
  echo "Examples:"
  echo "  ./aishell.sh \"find all files larger than 100MB\""
  echo "  ./aishell.sh find files modified in the last 24 hours"
  echo ""
  echo "If no prompt is provided, it will ask for one interactively."
  exit 0
fi

# Get prompt from arguments
PROMPT="$*"

# If no prompt was provided, ask for one
if [[ -z "$PROMPT" ]]; then
  read -p "What do you want to do? (describe the command you need): " PROMPT
  if [[ -z "$PROMPT" ]]; then
    echo "No prompt provided. Exiting."
    exit 1
  fi
fi

# Generate command using the Node.js script
echo "Generating command..." >&2

# Capture the output of the Node.js script
COMMAND=$(node "${NODE_SCRIPT}" "${PROMPT}")
EXIT_CODE=$?

# Check if command generation was successful
if [[ $EXIT_CODE -ne 0 || -z "$COMMAND" ]]; then
  echo "Failed to generate a command. Please try again." >&2
  exit 1
fi

# Display the suggested command
echo -e "\nSuggested command:" >&2
echo "$COMMAND" >&2

# Ask user to confirm
echo -e "\nPress Enter to use this command or Ctrl+C to cancel" >&2
read

# Based on available tools, pre-fill the command
if [[ $RLWRAP_AVAILABLE -eq 1 ]]; then
  # Use rlwrap to start a new shell with the command pre-filled
  echo "Starting a new shell with the command pre-filled..." >&2
  rlwrap -P "${COMMAND}" bash
else
  # Fallback: Add to history and print instructions
  history -s "${COMMAND}"
  echo -e "\nCommand added to history. Press up arrow to access it." >&2
fi