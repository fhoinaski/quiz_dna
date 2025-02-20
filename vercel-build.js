const { execSync } = require('child_process');

execSync('prisma generate', { stdio: 'inherit' });
execSync('prisma db push', { stdio: 'inherit' });