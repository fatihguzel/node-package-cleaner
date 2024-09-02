# node-package-cleaner

`node-package-cleaner` is a tool that helps you optimize your `package.json` by identifying and removing unused npm packages from your project. It helps reduce package size and speeds up build times by eliminating unnecessary dependencies.

## Development Stage:

Please note that this library is currently in development. Features and functionality may change as we work towards a stable release. We appreciate your feedback and contributions during this phase.

## Features

- **Detect Unused Packages:** Automatically finds npm packages in your project that are not being used.
- **Remove Unnecessary Dependencies:** Safely removes unused dependencies from your `package.json`.
- **Optimize Build Times:** Reduces build times by only downloading the necessary packages.
- **Easy Integration:** Can be easily run via CLI and is compatible with any Node.js project.

## Installation

You can install `node-package-cleaner` globally:

    npm install -g node-package-cleaner

## Usage

To use `node-package-cleaner`, follow these steps:

1. **Navigate to Your Project Directory:**

   Make sure you are in the root directory of your Node.js project.

   ```bash
   cd /path/to/your/project

   ```

2. **Run the Command:**

   ```bash
   npm-cleanup

   ```

3. **Review the Output:**
   The tool will list packages that are detected as unused. Review the list carefully.

4. **Confirm Removal:**
   You will be prompted to confirm the removal of these packages. Confirm to proceed with removing the unused packages from your package.json.

   ```bash
   Scanning for unused packages...
   - package1
   - package2
   - package3

   Confirm removal of these packages? (y/n):

   ```

5. **Verify Changes:**
   Check your package.json to ensure that the unused packages have been removed. You may also run npm install to update your node_modules directory accordingly.
   ```bash
   npm install
   ```

## Stay in touch

```
Author - Fatih Güzel
```
