/**
 * fix-vuln-deps.js
 *
 * Removes nested vulnerable dependency copies that cannot be overridden via
 * npm `overrides` due to exact-version pins (e.g. "=4.11.9").
 * After removal, Node.js module resolution falls back to the root
 * node_modules/bn.js which is pinned to 4.12.3 via the root `overrides` field.
 *
 * Also patches package-lock.json so that `npm audit` reports the correct
 * (safe) version instead of the original pinned version.
 *
 * Run automatically via the root package.json `postinstall` hook.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Nested vulnerable packages to remove (keyed by their lock file path)
const NESTED_VULN_BN = [
  'node_modules/@scrypt-inc/bsv/node_modules/bn.js',
  'node_modules/bitcore-lib-inquisition/node_modules/bn.js',
];

// Step 1: Delete the nested vulnerable directories
for (const rel of NESTED_VULN_BN) {
  const fullPath = path.join(ROOT, rel);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`[fix-vuln-deps] Removed nested vulnerable dep: ${rel}`);
  }
}

// Step 2: Patch package-lock.json so npm audit reports the safe version
const lockPath = path.join(ROOT, 'package-lock.json');
if (!fs.existsSync(lockPath)) {
  console.log('[fix-vuln-deps] No package-lock.json found, skipping lock patch.');
  process.exit(0);
}

try {
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  const packages = lock.packages || {};

  // Get the safe bn.js entry from the root install
  const safeBn = packages['node_modules/bn.js'];
  if (!safeBn) {
    console.log('[fix-vuln-deps] Root bn.js not found in lock file, skipping patch.');
    process.exit(0);
  }

  let changed = false;
  for (const rel of NESTED_VULN_BN) {
    if (packages[rel] && packages[rel].version !== safeBn.version) {
      const oldVer = packages[rel].version;
      packages[rel] = {
        version: safeBn.version,
        resolved: safeBn.resolved,
        integrity: safeBn.integrity,
        license: safeBn.license || 'MIT',
      };
      console.log(`[fix-vuln-deps] Patched lock file: ${rel} ${oldVer} -> ${safeBn.version}`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n', 'utf8');
    console.log('[fix-vuln-deps] package-lock.json updated.');
  }
} catch (err) {
  console.warn('[fix-vuln-deps] Failed to patch lock file:', err.message);
}
