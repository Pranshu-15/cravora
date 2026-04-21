const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return [];
    fs.readdirSync(dir).forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let foundMismatch = false;
files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const regex = /from\s+['"](\.[^'"]*)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        let importPath = match[1];
        let targetPath = path.resolve(path.dirname(file), importPath);
        
        let extensionsToTry = ['', '.jsx', '.js'];
        let matchedTgt = null;
        for (let ext of extensionsToTry) {
            if (fs.existsSync(targetPath + ext) && fs.statSync(targetPath + ext).isFile()) {
                matchedTgt = targetPath + ext;
                break;
            }
        }
        
        if (!matchedTgt) {
            if (fs.existsSync(targetPath + '/index.js')) {
                matchedTgt = targetPath + '/index.js';
            } else if (fs.existsSync(targetPath + '/index.jsx')) {
                matchedTgt = targetPath + '/index.jsx';
            } else {
                continue; // Can't find file, could be CSS or external
            }
        }
        
        const p = path.parse(matchedTgt);
        if (fs.existsSync(p.dir)) {
            const actualFiles = fs.readdirSync(p.dir);
            if (!actualFiles.includes(p.base)) {
                const actualBase = actualFiles.find(x => x.toLowerCase() === p.base.toLowerCase());
                console.log(`Mismatch in ${file}: imported '${importPath}' resolved to '${p.base}', but actual file is '${actualBase}'`);
                foundMismatch = true;
            }
        }
    }
});

if (!foundMismatch) {
    console.log("All imports look case-correct!");
}
