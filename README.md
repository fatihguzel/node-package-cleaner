# node-package-cleaner

`node-package-cleaner` is a powerful CLI tool that helps you optimize your `package.json` by identifying and removing unused npm packages from your Node.js project. It helps reduce package size and speeds up build times by eliminating unnecessary dependencies.

## Features

-   🔍 **Detect Unused Packages:** Automatically finds npm packages that are not being used in your project
-   🧹 **Remove Unnecessary Dependencies:** Safely removes unused dependencies from your `package.json`
-   ⚡ **Optimize Build Times:** Reduces build times by only keeping necessary packages
-   🔬 **Smart Detection:** Analyzes code, imports, and scripts to identify truly unused packages
-   🚀 **Easy Integration:** Simple CLI tool compatible with any Node.js project

## Compatibility

-   **Platform:** Node.js server projects
-   **Supported File Types:** JavaScript, TypeScript, JSX, TSX
-   **Dependency Types:** Supports both `dependencies` and `devDependencies`

## Installation

Install globally via npm:

```bash
npm install -g node-package-cleaner
```

## Usage

1. **Navigate to Your Project:**

    ```bash
    cd /path/to/your/project
    ```

2. **Run the Cleanup:**

    ```bash
    npm-cleanup
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

## How It Works

-   Scans all project files (js, ts, jsx, tsx)
-   Identifies modules imported or required in code
-   Checks script dependencies
-   Provides an interactive confirmation process
-   Automatically updates `package.json` and reinstalls dependencies

## Limitations

-   Designed exclusively for Node.js projects
-   Requires careful review before confirming package removal

## Contributing

Feedback and contributions are welcome! Please open issues or submit pull requests on our GitHub repository.

## License

MIT License

## Stay in Touch

Author: Fatih Güzel
GitHub: https://github.com/fatihguzel/node-package-cleaner
