const { readFileSync, writeFileSync } = require('fs');

// Read the original package.json
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

// Remove build-related scripts that shouldn't run in the published package
delete packageJson.scripts.build;
delete packageJson.scripts['build:esm'];
delete packageJson.scripts['build:cjs'];
delete packageJson.scripts.prepublishOnly;
delete packageJson.scripts.dev;
delete packageJson.scripts.lint;

// Write the modified package.json to dist folder
writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 2));

console.log('✓ Package.json copied to dist/ with build scripts removed');
