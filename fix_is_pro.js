const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace sub?.status === 'active'
    content = content.replace(/sub\?\.status === 'active'/g, "['active', 'trialing'].includes(sub?.status as string)");
    content = content.replace(/sub\?\.status === "active"/g, "['active', 'trialing'].includes(sub?.status as string)");
    // Replace subscription?.status === 'active'
    content = content.replace(/subscription\?\.status === 'active'/g, "['active', 'trialing'].includes(subscription?.status as string)");

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed:', filePath);
    }
}

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && !file.startsWith('.')) {
                traverse(fullPath);
            }
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            replaceInFile(fullPath);
        }
    }
}

traverse(path.join(__dirname, 'src'));
console.log('Done replacing isPro checks.');
