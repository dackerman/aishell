#!/bin/bash

# AIShell - Shell script wrapper for pre-filling terminal commands

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

# Function to get a prompt if not provided as an argument
get_prompt() {
  if [[ $# -eq 0 ]]; then
    read -p "What do you want to do? (describe the command you need): " prompt
    echo "${prompt}"
  else
    echo "$*"
  fi
}

# Main function
main() {
  local prompt=$(get_prompt "$@")
  
  # Generate command using the Node.js script with --command-only flag
  # This flag will be added to make the Node.js script return just the command
  echo "Generating command..."
  local command=$(node "${NODE_SCRIPT}" --command-only "${prompt}")
  
  if [[ -z "${command}" ]]; then
    echo "Failed to generate a command. Please try again."
    exit 1
  fi
  
  # Show the suggested command
  echo -e "\nSuggested command:"
  echo "${command}"
  
  # Ask user to confirm
  echo -e "\nPress Enter to use this command or Ctrl+C to cancel"
  read
  
  if [[ ${RLWRAP_AVAILABLE} -eq 1 ]]; then
    # Use rlwrap for proper readline pre-filling
    # This launches a new shell with the command pre-filled
    echo "Starting a new shell with the command pre-filled..."
    rlwrap -P "${command}" bash
  else
    # Fallback method - add to history
    # This relies on GNU readline history expansion
    history -s "${command}"
    # Print the command without executing
    echo "${command}" > ~/.aishell_current_command
    echo -e "\nCommand added to history. Press up arrow to access it."
  fi
}

# Run the main function
main "$@"