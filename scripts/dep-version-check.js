const fs = require('fs');
const path = require('path');

const isStableVersion = (version) => {
    const regex = /^[0-9.]+$/;
    return regex.test(version);
};

const isStableDepVersion = (version) => {
    const regex = /alpha|beta/;
    return !regex.test(version);
};

const start = () => {
    const cwd = process.cwd();
    const pkgJson = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
    const version = pkgJson.version;

    // 非稳定版本无需检查
    if (!isStableVersion(version)) {
        return;
    }

    // 检查dependencies
    const deps = pkgJson.dependencies || {};
    for (const [dep, depVersion] of Object.entries(deps)) {
        if (!isStableDepVersion(depVersion)) {
            console.log('=======================WARNING========================');
            console.log(`Your package version [ ${version} ] is stable`);
            console.log(`But dependency [ ${dep} ] version [ ${depVersion} ] is not stable`);
            console.log(`Please check and fix it`);
            console.log('======================================================\n');
            process.exit(1);
        }
    }

    // 检查peerDependencies
    const peerDeps = pkgJson.peerDependencies || {};
    for (const [dep, depVersion] of Object.entries(peerDeps)) {
        if (!isStableDepVersion(depVersion)) {
            console.log('=======================WARNING========================');
            console.log(`Your package version [ ${version} ] is stable`);
            console.log(`But peerDependencies [ ${dep} ] version [ ${depVersion} ] is not stable`);
            console.log(`Please check and fix it`);
            console.log('======================================================\n');
            process.exit(1);
        }
    }
}

start();
