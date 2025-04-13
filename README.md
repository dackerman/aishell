# AIShell

AIShell is a command-line tool that helps you figure out what shell/bash command to run based on a description. It leverages Claude AI to generate shell commands from natural language descriptions.

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/aishell.git
   cd aishell
   ```

2. Install dependencies and build:
   ```
   npm install
   npm run build
   ```

3. Make the shell script executable:
   ```
   chmod +x aishell.sh
   ```

4. (Optional but recommended) Install rlwrap for better command pre-filling:
   ```
   # Ubuntu/Debian
   sudo apt install rlwrap
   
   # macOS with Homebrew
   brew install rlwrap
   
   # Fedora/RHEL
   sudo dnf install rlwrap
   ```

## Configuration

AIShell requires an Anthropic API key. Set it as an environment variable:

```sh
export ANTHROPIC_API_KEY=your_api_key_here
```

## Usage

### Pre-filling Commands with the Shell Script

The recommended way to use AIShell is with the shell script, which can pre-fill commands in your terminal:

```sh
./aishell.sh "find all images modified in the last week"
```

or in interactive mode:

```sh
./aishell.sh
```

When you confirm a command, it will:
1. With rlwrap: Start a new shell with the command pre-filled
2. Without rlwrap: Add the command to your shell history

### Direct Command Generation

If you just want to generate a command without pre-filling:

```sh
node dist/index.js "find large files in my home directory"
```

This outputs the raw command to stdout, suitable for scripting or piping.

## Examples

### Command Pre-filling with rlwrap
```
$ ./aishell.sh find all files larger than 100MB in my home directory
Generating command...

Suggested command:
find /home -type f -size +100M

Press Enter to use this command or Ctrl+C to cancel
# After pressing Enter, a new shell starts with the command pre-filled
```

### Direct Command Generation
```
$ node dist/index.js find all files larger than 100MB
Generating command...
find . -type f -size +100M
```

## How It Works

AIShell consists of two components:

1. **Node.js Command Generator**:
   - A simple TypeScript program that calls the Claude API
   - Takes a natural language prompt and returns a shell command
   - Minimal functionality focused on command generation

2. **Shell Script Wrapper**:
   - Calls the Node.js generator to create the command
   - Uses rlwrap to pre-fill the command in a new shell session
   - Falls back to shell history if rlwrap isn't available

## License

ISC