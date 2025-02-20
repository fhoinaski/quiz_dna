// generate-code-map.js
const fs = require('fs');
const path = require('path');

// Configurações
const EXCLUDED_DIRS = ['node_modules', '.next', '.git', '.github'];
const EXCLUDED_FILES = ['.gitignore', '.env', 'package-lock.json', 'yarn.lock'];
const TEXT_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.json', '.css', '.scss', '.html', '.md'];

// Encontra a raiz do projeto procurando package.json
function findProjectRoot(startDir = __dirname) {
  let currentDir = startDir;
  
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  
  throw new Error('Não foi possível encontrar a raiz do projeto (package.json)');
}

function readDirectory(dirPath, rootPath) {
  // ... (mesma implementação anterior)
}

function generateCodeMap() {
  try {
    const projectRoot = findProjectRoot();
    const outputFile = path.join(projectRoot, 'project-structure.json');
    
    console.log(`Raiz do projeto identificada: ${projectRoot}`);
    
    const codeMap = {
      projectStructure: readDirectory(projectRoot, projectRoot),
      metadata: {
        projectRoot,
        generatedAt: new Date().toISOString(),
        nodeVersion: process.version
      }
    };

    fs.writeFileSync(outputFile, JSON.stringify(codeMap, null, 2), 'utf-8');
    console.log(`✅ Arquivo gerado em: ${outputFile}`);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

generateCodeMap();