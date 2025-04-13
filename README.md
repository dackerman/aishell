# AIShell

AIShell is a command-line tool that helps you figure out what shell/bash command to run based on a description. It leverages Claude AI to generate shell commands from natural language descriptions.

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/aishell.git
   cd aishell
   ```

2. For the Node.js version:
   ```
   npm install
   npm run build
   ```

3. For the shell script version:
   ```
   chmod +x aishell.sh
   ```

4. (Optional) Install rlwrap for better command pre-filling:
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

AIShell comes in two versions:

### Shell Script Version (Recommended for Command Pre-filling)

The shell script version can pre-fill commands in your terminal using rlwrap:

```sh
./aishell.sh "find all images modified in the last week"
```

or in interactive mode:

```sh
./aishell.sh
```

This version uses rlwrap (if installed) to start a new shell with the command pre-filled, ready for editing or execution.

### Node.js Version

The Node.js version offers more features but cannot pre-fill commands in your terminal:

```sh
node dist/index.js "find large files in my home directory"
```

or if you've linked it globally:

```sh
aishell "find large files in my home directory"
```

The Node.js version provides options to:
1. Copy the command to clipboard
2. Execute the command directly
3. Exit without action

## Examples

### Shell Script Version
```
$ ./aishell.sh download a file from https://example.com/file.zip
Generating command...

Suggested command:
curl -O https://example.com/file.zip

Press Enter to use this command or Ctrl+C to cancel
# After pressing Enter, a new shell opens with the command pre-filled
```

### Node.js Version
```
$ node dist/index.js download a file from https://example.com/file.zip
Generating command...

Suggested command:
curl -O https://example.com/file.zip

Options:
1. Copy command to clipboard
2. Execute command now
3. Exit
```

## How It Works

AIShell uses two different approaches:

1. **Shell Script Version:**
   - Makes a direct curl request to the Anthropic API
   - Uses rlwrap to pre-fill commands in a new shell session
   - Falls back to adding commands to shell history if rlwrap is not available

2. **Node.js Version:**
   - Uses the Anthropic Node.js SDK
   - Provides options to copy or execute commands
   - More user-friendly interface but lacks command pre-filling capability

## License

ISC