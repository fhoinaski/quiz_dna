// src/lib/cache.ts
import { LRUCache } from "lru-cache"; // Importação nomeada correta

// Configuração do cache com LRUCache
const cache = new LRUCache<string, any>({
  max: 100, // Máximo de 100 entradas no cache
  ttl: 1000 * 60 * 5, // Tempo de vida (TTL) de 5 minutos (300 segundos)
});

// Funções para interagir com o cache
export const getCachedData = (key: string) => {
  return cache.get(key);
};

export const setCachedData = (key: string, value: any) => {
  cache.set(key, value);
};

export const clearCachedData = (key: string) => {
  cache.delete(key);
};