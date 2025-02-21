import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Por favor defina a variável de ambiente MONGODB_URI');
}

// Interface para nossa cache global
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Cache para conexão
const globalForMongoose = global as unknown as {
  mongoose: MongooseCache | undefined;
};

// Em desenvolvimento, usamos uma variável global para preservar a conexão
// entre hot reloads, caso contrário, em produção usamos uma conexão normal
const cached: MongooseCache = globalForMongoose.mongoose ?? {
  conn: null,
  promise: null
};

// Inicializa a cache global na primeira execução
if (!globalForMongoose.mongoose) {
  globalForMongoose.mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('Conexão com MongoDB estabelecida');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}