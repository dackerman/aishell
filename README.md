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

AIShell provides two interfaces for the same functionality:

### Shell Script (Recommended for Command Pre-filling)

The shell script version uses rlwrap to pre-fill commands in your terminal:

```sh
./aishell.sh "find all images modified in the last week"
```

or in interactive mode:

```sh
./aishell.sh
```

With rlwrap installed, this starts a new shell with the command pre-filled, ready for editing or execution.

### Node.js Interface

The Node.js interface provides options to copy or execute the command:

```sh
node dist/index.js "find large files in my home directory"
```

or if you've linked it globally with `npm link`:

```sh
aishell "find large files in my home directory"
```

## Examples

### Shell Script with rlwrap
```
$ ./aishell.sh find all files larger than 100MB in my home directory
Generating command...

Suggested command:
find /home -type f -size +100M

Press Enter to use this command or Ctrl+C to cancel
# After pressing Enter, a new shell starts with the command pre-filled
```

### Node.js Interface
```
$ node dist/index.js find all files larger than 100MB
Generating command...

Suggested command:
find . -type f -size +100M

Options:
1. Copy command to clipboard
2. Execute command now
3. Exit
```

## How It Works

AIShell combines several technologies:

1. **Command Generation**: Node.js script with Anthropic's Claude API generates commands from natural language descriptions

2. **Command Pre-filling**:
   - The shell script uses rlwrap to pre-fill commands in a new shell session
   - rlwrap creates a new shell with the command already typed in but not executed
   - This gives you a chance to review and edit before running

3. **Fallbacks**:
   - Without rlwrap, the shell script falls back to adding commands to shell history
   - The Node.js interface offers clipboard copying and direct execution options

## License

ISC