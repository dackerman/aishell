#!/bin/bash

# AIShell - Shell script for generating commands with Claude and pre-filling them

# Check if the ANTHROPIC_API_KEY environment variable is set
if [[ -z "${ANTHROPIC_API_KEY}" ]]; then
  echo "Error: ANTHROPIC_API_KEY environment variable is not set."
  echo "Please set it with: export ANTHROPIC_API_KEY=your_api_key"
  exit 1
fi

# Default model
MODEL="claude-3-7-sonnet-20250219"

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

# Function to get a prompt if not provided as an argument
get_prompt() {
  if [[ $# -eq 0 ]]; then
    read -p "What do you want to do? (describe the command you need): " prompt
    echo "${prompt}"
  else
    echo "$*"
  fi
}

# Function to call Claude API and get a command
get_command() {
  local prompt="$1"
  local temp_file=$(mktemp)
  
  # Prepare the API request
  cat > "${temp_file}" << EOF
{
  "model": "${MODEL}",
  "max_tokens": 1000,
  "system": "You are an expert in shell commands. Given a description of what the user wants to do, respond ONLY with the exact shell command they should run, with no explanation, introduction, or markdown formatting. Just output the raw command that can be directly executed.",
  "messages": [
    {
      "role": "user",
      "content": "Generate a shell command to: ${prompt}"
    }
  ]
}
EOF

  # Make the API call
  echo "Generating command..."
  response=$(curl -s -X POST "https://api.anthropic.com/v1/messages" \
    -H "Content-Type: application/json" \
    -H "x-api-key: ${ANTHROPIC_API_KEY}" \
    -H "anthropic-version: 2023-06-01" \
    -d @"${temp_file}")
  
  # Clean up the temp file
  rm "${temp_file}"
  
  # Extract the command from the response
  echo "${response}" | grep -o '"text":"[^"]*"' | head -1 | cut -d '"' -f 4
}

# Function to pre-fill the command in the terminal
prefill_command() {
  local command="$1"
  
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

# Main function
main() {
  local prompt=$(get_prompt "$@")
  local command=$(get_command "${prompt}")
  
  if [[ -n "${command}" ]]; then
    prefill_command "${command}"
  else
    echo "Failed to generate a command. Please try again."
    exit 1
  fi
}

# Run the main function
main "$@"