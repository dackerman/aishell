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

## Usage

You can use AIShell in two ways:

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

The tool will generate a shell command based on your description and display it for you to review. You can then press Enter to copy it to your clipboard, ready to paste and execute, or press Ctrl+C to cancel.

## Examples

```
$ aishell "download a file from https://example.com/file.zip"
Generating command...

Suggested command:
curl -O https://example.com/file.zip

Press Enter to execute this command or Ctrl+C to cancel
```

## License

ISC