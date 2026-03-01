const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./src', function (filePath) {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        // Fix the crazy nested backticks/quotes for baseURL
        content = content.replace(/baseURL:\s*`\$\{process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*'\$\{process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*'http:\/\/localhost:5000\/api'\}'\}`/g, "baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'");
        content = content.replace(/baseURL:\s*`\$\{process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*'http:\/\/localhost:5000\/api'\}`/g, "baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'");


        // Fix single quote around the template literal variable
        // Basically finding things like:
        // '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/teachers'
        // or
        // "${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/teachers"

        // Replace starting quote
        content = content.replace(/'\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/localhost:5000\/api'\}([^']*)'/g, function (match, inner) {
            return `\`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}${inner}\``;
        });

        content = content.replace(/"\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/localhost:5000\/api'\}([^"]*)"/g, function (match, inner) {
            return `\`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}${inner}\``;
        });

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed:', filePath);
        }
    }
});
