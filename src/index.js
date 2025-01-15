const fs = require("fs");
const path = require("path");
const { parse } = require("acorn");
const glob = require("glob");
const readline = require("readline");
const { execSync } = require("child_process");

const FILE_EXTENSIONS = [
    "js",
    "ts",
    "jsx",
    "tsx",
    "mjs",
    "cjs",
    "json",
    "html",
];

function findUsedModules(srcPath = `**/*.{${FILE_EXTENSIONS.join(",")}}`) {
    const files = glob.sync(srcPath, {
        absolute: true,
        ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
    });
    const usedModules = new Set();
    const potentialModules = new Set();

    const packageJsonPath = path.resolve("package.json");
    const packageJson = require(packageJsonPath);

    const allDependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
    };

    Object.keys(allDependencies).forEach((dep) => {
        potentialModules.add(dep.split("/")[0].replace(/^@/, ""));
    });

    files.forEach((file) => {
        try {
            const code = fs.readFileSync(file, "utf-8");

            const dynamicRequireRegex =
                /(?:require|import)[\s(]?['"`](.*?)['"`]/g;
            let match;
            while ((match = dynamicRequireRegex.exec(code)) !== null) {
                const moduleName = match[1].split("/")[0].replace(/^@/, "");
                if (moduleName && potentialModules.has(moduleName)) {
                    usedModules.add(moduleName);
                }
            }

            try {
                const ast = parse(code, {
                    sourceType: "module",
                    ecmaVersion: "latest",
                    plugins: { jsx: true },
                });

                ast.body.forEach((node) => {
                    if (node.type === "ImportDeclaration") {
                        const moduleName = node.source.value
                            .split("/")[0]
                            .replace(/^@/, "");
                        if (potentialModules.has(moduleName)) {
                            usedModules.add(moduleName);
                        }
                    }

                    if (node.type === "VariableDeclaration") {
                        node.declarations.forEach((declaration) => {
                            if (
                                declaration.init &&
                                declaration.init.type === "CallExpression" &&
                                (declaration.init.callee.name === "require" ||
                                    declaration.init.callee.type === "Import")
                            ) {
                                const moduleName =
                                    declaration.init.arguments[0].value
                                        .split("/")[0]
                                        .replace(/^@/, "");
                                if (potentialModules.has(moduleName)) {
                                    usedModules.add(moduleName);
                                }
                            }
                        });
                    }
                });
            } catch (astError) {}
        } catch (fileReadError) {}
    });

    const unusedModules = [...potentialModules].filter(
        (module) => !usedModules.has(module)
    );

    return { usedModules, unusedModules };
}

async function promptUserConfirmation(unusedDependencies) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log("\nUnused Dependencies Detected:");
    unusedDependencies.forEach((dep) => console.log(`- ${dep}`));

    return new Promise((resolve) => {
        rl.question(
            "\nDo you want to remove these dependencies? (Y/N): ",
            (answer) => {
                rl.close();
                resolve(
                    answer.toLowerCase() === "y" ||
                        answer.toLowerCase() === "yes"
                );
            }
        );
    });
}

function findScriptDependencies(packageJson) {
    const scriptDependencies = new Set();

    Object.values(packageJson.scripts || {}).forEach((script) => {
        const packageMatches = script.match(
            /\b(cross-env|webpack|babel-node)\b/g
        );
        if (packageMatches) {
            packageMatches.forEach((pkg) => scriptDependencies.add(pkg));
        }
    });

    return scriptDependencies;
}

async function optimizePackageJson() {
    const { usedModules, unusedModules } = findUsedModules();
    const packageJsonPath = path.resolve("package.json");
    const packageJson = require(packageJsonPath);

    const scriptDependencies = findScriptDependencies(packageJson);

    const newDependencies = {};
    const newDevDependencies = {};

    Object.entries(packageJson.dependencies || {}).forEach(([dep, version]) => {
        const moduleName = dep.split("/")[0].replace(/^@/, "");
        if (usedModules.has(moduleName) || scriptDependencies.has(moduleName)) {
            newDependencies[dep] = version;
        }
    });

    Object.entries(packageJson.devDependencies || {}).forEach(
        ([dep, version]) => {
            const moduleName = dep.split("/")[0].replace(/^@/, "");
            if (
                usedModules.has(moduleName) ||
                scriptDependencies.has(moduleName)
            ) {
                newDevDependencies[dep] = version;
            }
        }
    );

    const filteredUnusedModules = unusedModules.filter(
        (module) => !scriptDependencies.has(module)
    );

    if (filteredUnusedModules.length > 0) {
        const confirmDelete = await promptUserConfirmation(
            filteredUnusedModules
        );

        if (confirmDelete) {
            packageJson.dependencies = newDependencies;
            packageJson.devDependencies = newDevDependencies;

            fs.writeFileSync(
                packageJsonPath,
                JSON.stringify(packageJson, null, 2),
                "utf-8"
            );

            try {
                execSync("npm install", { stdio: "inherit" });
                console.log(
                    "✅ Package.json optimized and dependencies updated."
                );
            } catch (error) {
                console.error("❌ Error updating dependencies:", error);
            }
        } else {
            console.log("❌ Dependency removal cancelled.");
        }
    } else {
        console.log("✨ All dependencies are in use. No changes made.");
    }
}

module.exports = {
    optimizePackageJson,
};
