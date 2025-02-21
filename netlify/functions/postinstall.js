// netlify/functions/postinstall.js
const { execSync } = require('child_process');

exports.handler = async function(event, context) {
  try {
    console.log('Gerando Prisma Client...');
    execSync('npx prisma generate');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Prisma Client gerado com sucesso' })
    };
  } catch (error) {
    console.error('Erro ao gerar Prisma Client:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falha ao gerar Prisma Client' })
    };
  }
};