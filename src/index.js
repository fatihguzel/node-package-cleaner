const fs = require("fs");
const path = require("path");
const { parse } = require("acorn");
const glob = require("glob");

const dynamicRequireRegex = /require\(['"`](.*?)['"`]\)/g;

function findUsedModules(srcPath = "src/**/*.{js,ts}") {
  const files = glob.sync(srcPath, { absolute: true });
  const usedModules = new Set();

  files.forEach((file) => {
    const code = fs.readFileSync(file, "utf-8");

    let match;
    while ((match = dynamicRequireRegex.exec(code)) !== null) {
      usedModules.add(match[1]);
    }

    const ast = parse(code, { sourceType: "module", ecmaVersion: "latest" });

    ast.body.forEach((node) => {
      if (node.type === "ImportDeclaration") {
        usedModules.add(node.source.value);
      }
      if (node.type === "VariableDeclaration") {
        node.declarations.forEach((declaration) => {
          if (
            declaration.init &&
            declaration.init.type === "CallExpression" &&
            declaration.init.callee.name === "require"
          ) {
            usedModules.add(declaration.init.arguments[0].value);
          }
        });
      }
    });
  });

  return usedModules;
}

function findScriptDependencies(packageJson) {
  const scriptDependencies = new Set();

  Object.values(packageJson.scripts || {}).forEach((script) => {
    const matches = script.match(
      /(?:npm|yarn|pnpm) install ([^ \n]+)(?:\s|$)/g
    );
    if (matches) {
      matches.forEach((match) => {
        const dep = match.replace(/(?:npm|yarn|pnpm) install /, "").trim();
        scriptDependencies.add(dep);
      });
    }
  });

  return scriptDependencies;
}

function optimizePackageJson() {
  const usedModules = findUsedModules();
  const packageJsonPath = path.resolve("package.json");
  const packageJson = require(packageJsonPath);
  const newDependencies = {};

  const scriptDependencies = findScriptDependencies(packageJson);

  Object.keys(packageJson.dependencies).forEach((dep) => {
    if (usedModules.has(dep) || scriptDependencies.has(dep)) {
      newDependencies[dep] = packageJson.dependencies[dep];
    }
  });

  packageJson.dependencies = newDependencies;

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    "utf-8"
  );
  console.log("package.json optimized");
}

module.exports = {
  optimizePackageJson,
};
