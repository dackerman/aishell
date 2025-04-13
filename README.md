# AIShell

AIShell is a command-line tool that helps you figure out what shell/bash command to run based on a description. It leverages Claude AI to generate shell commands from natural language descriptions.

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/aishell.git
   cd aishell
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the project:
   ```
   npm run build
   ```

4. Link it globally (optional):
   ```
   npm link
   ```

## Configuration

AIShell requires an Anthropic API key. Set it as an environment variable:

```sh
export ANTHROPIC_API_KEY=your_api_key_here
```

The tool uses `claude-3-7-sonnet-20250219` by default.

## Shell Integration (For Command Pre-filling)

To enable command pre-filling in your terminal, you need to set up shell integration:

1. Generate the shell function:
   ```
   npx aishell --setup
   ```
   or if globally linked:
   ```
   aishell --setup
   ```

2. Add the generated code to your shell configuration file (`~/.bashrc` or `~/.zshrc`)

3. Restart your terminal or source your configuration file:
   ```
   source ~/.bashrc  # or ~/.zshrc
   ```

4. Now you can use the `aishell` command directly in your shell:
   ```
   aishell find large files in my home directory
   ```

## Standalone Usage

Without shell integration, AIShell can still generate commands but cannot pre-fill them in your terminal. In standalone mode, it offers options to copy the command to clipboard or execute it directly:

1. With arguments:
   ```
   npx aishell "find all large files in the current directory"
   ```
   or if globally linked:
   ```
   aishell "find all large files in the current directory"
   ```

2. Interactive mode:
   ```
   npx aishell
   ```
   or if globally linked:
   ```
   aishell
   ```

## Examples

### With Shell Integration
```
$ aishell download a file from https://example.com/file.zip
Generating command...

Suggested command:
curl -O https://example.com/file.zip

# Command is automatically pre-filled in your terminal for editing
```

### Standalone Mode
```
$ aishell download a file from https://example.com/file.zip
Generating command...

Suggested command:
curl -O https://example.com/file.zip

Options:
1. Copy command to clipboard
2. Execute command now
3. Exit
```

## How It Works

When using shell integration, AIShell works by:
1. Processing your natural language request through Claude AI
2. Generating the appropriate shell command
3. Using shell history manipulation to add the command to your history
4. Pre-filling the command in your terminal without executing it

This approach allows you to review and edit the command before execution.

## License

ISC