import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL chưa được định nghĩa trong file .env");
  }

  // Khởi tạo một Pool kết nối từ thư viện 'pg' thuần
  const pool = new Pool({ connectionString });
  
  // Gắn pool đó vào Adapter của Prisma
  const adapter = new PrismaPg(pool);

  // Khởi tạo PrismaClient bằng adapter đã cấu hình
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db;