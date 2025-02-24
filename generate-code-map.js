const fs = require('fs');
const path = require('path');

// Configurações
const EXCLUDED_DIRS = ['node_modules', '.next', '.git', '.github', 'code-map']; // Adicionado 'code-map' à exclusão
const EXCLUDED_FILES = [
  '.gitignore',
  '.env',
  'package-lock.json',
  'yarn.lock',
  'generate-code-map.js',
  'PROJECT_STRUCTURE_FULL.md'
];
const TEXT_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.json', '.css', '.scss', '.html', '.md'];
const MAX_SIZE_PER_FILE = 50000; // Limite de caracteres por arquivo
const OUTPUT_DIR = 'code-map'; // Pasta onde os arquivos serão salvos

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
      md += `${indent}- 📄 ${name}\n`;
      if (item.content !== '[Arquivo binário]') {
        const ext = path.extname(name);
        const codeLang = ext === '.ts' ? 'typescript' : 
                        ext === '.js' ? 'javascript' :
                        ext.slice(1) || 'text';
        const content = item.content;
        md += `${indent}\n\`\`\`${codeLang}\n${content}\n${indent}\`\`\`\n\n`;
      }
    } else {
      md += `${indent}- 📁 ${name}/\n`;
      md += buildMarkdown(item, depth + 1);
    }
  }
  
  return md;
}

function generateMarkdownReport(structure, partName = 'FULL') {
  return `# Estrutura do Projeto - Parte ${partName}

**Gerado em:** ${new Date().toLocaleString()}  
**Node Version:** ${process.version}  
**Diretório Raiz:** \`${structure.metadata.projectRoot}\`

${buildMarkdown(structure.structure).trim()}
`;
}

function listContents(structure, prefix = '') {
  let contents = '';
  for (const [name, item] of Object.entries(structure)) {
    const fullPath = prefix ? `${prefix}${name}` : name;
    if (item.content !== undefined) {
      contents += `  - 📄 ${fullPath}\n`;
    } else {
      contents += `  - 📁 ${fullPath}/\n`;
      contents += listContents(item, `${fullPath}/`);
    }
  }
  return contents.trim();
}

function readDirectory(dirPath, rootPath) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const structure = {};

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(rootPath, fullPath);

      if (EXCLUDED_DIRS.includes(entry.name) || EXCLUDED_FILES.includes(entry.name)) {
        continue;
      }

      if (path.basename(dirPath) === 'prisma' && entry.name !== 'schema.prisma') {
        continue;
      }

      if (entry.isDirectory()) {
        const subStructure = readDirectory(fullPath, rootPath);
        if (Object.keys(subStructure).length > 0) {
          structure[entry.name] = subStructure;
        }
      } else {
        const ext = path.extname(entry.name);
        const content = TEXT_EXTENSIONS.includes(ext)
          ? fs.readFileSync(fullPath, 'utf-8')
          : '[Arquivo binário]';
        structure[entry.name] = { content, path: relativePath, size: content.length };
      }
    }
    return structure;
  } catch (error) {
    console.error(`❌ Erro em ${dirPath}: ${error.message}`);
    return { error: error.message };
  }
}

function splitStructure(structure, maxSize) {
  const parts = [];
  let currentPart = { structure: {}, metadata: structure.metadata };
  let currentSize = 0;

  const baseHeader = generateMarkdownReport({ structure: {}, metadata: structure.metadata }, 'TEMP').length;

  for (const [name, item] of Object.entries(structure.structure)) {
    const itemMd = buildMarkdown({ [name]: item });
    const itemSize = baseHeader + itemMd.length;

    if (currentSize + itemSize > maxSize && Object.keys(currentPart.structure).length > 0) {
      parts.push(currentPart);
      currentPart = { structure: {}, metadata: structure.metadata };
      currentSize = 0;
    }

    currentPart.structure[name] = item;
    currentSize += itemSize;
  }

  if (Object.keys(currentPart.structure).length > 0) {
    parts.push(currentPart);
  }

  return parts;
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateCodeMap() {
  try {
    const projectRoot = findProjectRoot();
    console.log('\n🚀 Iniciando geração do relatório...');

    const outputDirPath = path.join(projectRoot, OUTPUT_DIR);
    ensureDirectoryExists(outputDirPath); // Cria a pasta se não existir

    const structure = {
      metadata: {
        projectRoot,
        generatedAt: new Date().toISOString(),
        nodeVersion: process.version,
        platform: process.platform
      },
      structure: readDirectory(projectRoot, projectRoot)
    };

    const fullMd = generateMarkdownReport(structure);
    if (fullMd.length <= MAX_SIZE_PER_FILE) {
      const outputFile = path.join(outputDirPath, 'PROJECT_STRUCTURE_FULL.md');
      fs.writeFileSync(outputFile, fullMd);
      console.log('\n✅ Relatório único gerado com sucesso!');
      console.log(`📁 Arquivo: ${outputFile}`);
    } else {
      const parts = splitStructure(structure, MAX_SIZE_PER_FILE);
      let indexMd = `# Índice da Estrutura do Projeto\n\n**Gerado em:** ${new Date().toLocaleString()}\n\n`;

      parts.forEach((part, index) => {
        const partName = `PART_${index + 1}`;
        const partFile = path.join(outputDirPath, `PROJECT_STRUCTURE_${partName}.md`);
        fs.writeFileSync(partFile, generateMarkdownReport(part, partName));
        
        indexMd += `## Parte ${index + 1}\n`;
        indexMd += `- [Ver detalhes](./${partName}.md)\n`; // Caminho relativo ajustado
        indexMd += `**Conteúdo:**\n`;
        indexMd += listContents(part.structure);
        indexMd += '\n\n';
        
        console.log(`✅ Gerado: ${partFile}`);
      });

      const indexFile = path.join(outputDirPath, 'PROJECT_STRUCTURE_FULL.md');
      fs.writeFileSync(indexFile, indexMd);
      console.log('\n✅ Relatórios parciais gerados com sucesso!');
      console.log(`📁 Índice: ${indexFile}`);
    }
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  }
}

generateCodeMap();