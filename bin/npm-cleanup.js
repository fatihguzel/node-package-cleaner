#!/usr/bin/env node

const { optimizePackageJson } = require("../src/index");

optimizePackageJson().catch((error) => {
    console.error("An error occurred:", error);
    process.exit(1);
});
