// generate-code-map.js
const fs = require('fs');
const path = require('path');

// Configurações
const EXCLUDED_DIRS = ['node_modules', '.next', '.git', '.github'];
const EXCLUDED_FILES = ['.gitignore', '.env', 'package-lock.json', 'yarn.lock'];
const TEXT_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.json', '.css', '.scss', '.html', '.md'];
const MAX_CONTENT_LINES = 30;

function findProjectRoot() {
  let currentDir = __dirname;
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  throw new Error('Raiz do projeto não encontrada');
}

function buildMarkdown(structure, depth = 0) {
  if (!structure || typeof structure !== 'object' || Object.keys(structure).length === 0) {
    return '';
  }

  let md = '';
  const indent = '  '.repeat(depth);

  for (const [name, item] of Object.entries(structure)) {
    if (!item) continue;

    if (item.content !== undefined) {
      // Processar arquivo
      md += `${indent}- 📄 ${name}\n`;
      
      if (item.content !== '[Arquivo binário]') {
        const ext = path.extname(name);
        const codeLang = ext === '.ts' ? 'typescript' : 
                        ext === '.js' ? 'javascript' :
                        ext.slice(1) || 'text';
        
        const contentLines = item.content.split('\n');
        const truncated = contentLines.length > MAX_CONTENT_LINES;
        const content = contentLines.slice(0, MAX_CONTENT_LINES).join('\n');
        
        md += `${indent}\n\`\`\`${codeLang}\n`;
        md += `${content}${truncated ? '\n// ... (conteúdo truncado)' : ''}\n`;
        md += `${indent}\`\`\`\n\n`;
      }
    } else {
      // Processar pasta
      md += `${indent}- 📁 ${name}/\n`;
      const subMd = buildMarkdown(item, depth + 1);
      md += subMd;
    }
  }
  
  return md;
}

function generateMarkdownReport(structure) {
  return `# Estrutura do Projeto

**Gerado em:** ${new Date().toLocaleString()}  
**Node Version:** ${process.version}  
**Diretório Raiz:** \`${structure.metadata.projectRoot}\`

${buildMarkdown(structure.structure).trim()}
`;
}

function readDirectory(dirPath, rootPath) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const structure = {};

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(rootPath, fullPath);

      // Ignorar entradas excluídas
      if (EXCLUDED_DIRS.includes(entry.name) || EXCLUDED_FILES.includes(entry.name)) {
        continue;
      }

      // Processamento especial para a pasta prisma
      if (path.basename(dirPath) === 'prisma' && entry.name !== 'schema.prisma') {
        continue;
      }

      if (entry.isDirectory()) {
        const subStructure = readDirectory(fullPath, rootPath);
        if (Object.keys(subStructure).length > 0) {
          structure[entry.name] = subStructure;
        }
      } else {
        try {
          const ext = path.extname(entry.name);
          const content = TEXT_EXTENSIONS.includes(ext)
            ? fs.readFileSync(fullPath, 'utf-8')
            : '[Arquivo binário]';

          structure[entry.name] = {
            content,
            path: relativePath,
            size: content.length
          };
        } catch (error) {
          structure[entry.name] = {
            error: error.message,
            path: relativePath
          };
        }
      }
    }
    return structure;

  } catch (error) {
    console.error(`❌ Erro em ${dirPath}: ${error.message}`);
    return { error: error.message };
  }
}

function generateCodeMap() {
  try {
    const projectRoot = findProjectRoot();
    console.log('\n🚀 Iniciando geração do relatório...');

    const structure = {
      metadata: {
        projectRoot,
        generatedAt: new Date().toISOString(),
        nodeVersion: process.version,
        platform: process.platform
      },
      structure: readDirectory(projectRoot, projectRoot)
    };

    const outputFile = path.join(projectRoot, 'PROJECT_STRUCTURE.md');
    fs.writeFileSync(outputFile, generateMarkdownReport(structure));
    
    console.log('\n✅ Relatório Markdown gerado com sucesso!');
    console.log(`📁 Arquivo: ${outputFile}`);

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  }
}

generateCodeMap();