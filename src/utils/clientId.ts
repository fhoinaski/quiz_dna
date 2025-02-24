// src/utils/clientId.ts

/**
 * Utilitário para gerar e gerenciar IDs de cliente para identificação de participantes
 */

// Chave para armazenamento do ID do cliente no localStorage
const CLIENT_ID_KEY = 'quiz_client_id';

/**
 * Gera um ID único para o cliente
 * @returns String de ID aleatório
 */
function generateClientId(): string {
  return 'client_' + 
    Date.now().toString(36) + 
    Math.random().toString(36).substring(2, 10);
}

/**
 * Obtém o ID do cliente atual ou gera um novo se não existir
 * @returns ID do cliente
 */
export function getClientId(): string {
  if (typeof window === 'undefined') {
    return generateClientId();
  }
  
  let clientId = localStorage.getItem(CLIENT_ID_KEY);
  
  if (!clientId) {
    clientId = generateClientId();
    localStorage.setItem(CLIENT_ID_KEY, clientId);
  }
  
  return clientId;
}

/**
 * Reinicia o ID do cliente, gerando um novo
 * @returns Novo ID de cliente
 */
export function resetClientId(): string {
  if (typeof window === 'undefined') {
    return generateClientId();
  }
  
  const newClientId = generateClientId();
  localStorage.setItem(CLIENT_ID_KEY, newClientId);
  return newClientId;
}

/**
 * Verifica se existe um ID de cliente armazenado
 * @returns true se existir um ID, false caso contrário
 */
export function hasClientId(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return localStorage.getItem(CLIENT_ID_KEY) !== null;
}

/**
 * Obtém o prefixo para chaves de sessão do quiz
 * @param quizId ID do quiz
 * @returns String de chave para armazenamento de sessão do quiz
 */
export function getQuizSessionKey(quizId: string): string {
  return `quiz_session_${quizId}`;
}

/**
 * Armazena dados de sessão de quiz para o cliente atual
 * @param quizId ID do quiz
 * @param data Dados a serem armazenados
 */
export function storeQuizSession(quizId: string, data: any): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const sessionKey = getQuizSessionKey(quizId);
  localStorage.setItem(sessionKey, JSON.stringify({
    ...data,
    clientId: getClientId(),
    timestamp: new Date().toISOString()
  }));
}

/**
 * Recupera dados de sessão de quiz para o cliente atual
 * @param quizId ID do quiz
 * @returns Dados da sessão armazenada ou null se não existir
 */
export function getQuizSession(quizId: string): any | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const sessionKey = getQuizSessionKey(quizId);
  const data = localStorage.getItem(sessionKey);
  
  if (!data) {
    return null;
  }
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao analisar dados da sessão:', error);
    localStorage.removeItem(sessionKey);
    return null;
  }
}

/**
 * Remove dados de sessão de quiz para o cliente atual
 * @param quizId ID do quiz
 */
export function clearQuizSession(quizId: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const sessionKey = getQuizSessionKey(quizId);
  localStorage.removeItem(sessionKey);
}

/**
 * Verifica se o cliente tem uma sessão ativa para um quiz específico
 * @param quizId ID do quiz
 * @returns true se existir uma sessão, false caso contrário
 */
export function hasActiveQuizSession(quizId: string): boolean {
  return getQuizSession(quizId) !== null;
}