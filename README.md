## Usage

1. **Navigate to Your Project:**

    ```bash
    cd /path/to/your/project
    ```

2. **Run the Cleanup:**

    ```bash
    npm run cleanup
    ```

3. **Review and Confirm:**
    - The tool will list detected unused packages
    - You'll be prompted to confirm removal
    - If confirmed, it automatically runs `npm install`

## Example Workflow

```bash
$ npm run cleanup

Unused Dependencies Detected:
- axios
- lodash

Do you want to remove these dependencies? (Y/N): y
✅ Package.json optimized and dependencies updated.
```

## Alternative Global Installation

If you prefer global installation:

```bash
# Install globally
npm install -g node-package-cleaner

# Run from any project directory
npm-cleanup
```

## Project-Specific Setup

Add to your project's `package.json`:

```json
{
    "scripts": {
        "cleanup": "node-package-cleaner"
    }
}
```

Then run:

```bash
npm run cleanup
```
