const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env file');
  }
  const hashed = await bcrypt.hash(password, 10);

  // Upsert super admin user
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashed,
      isAdmin: true,
      isGlobalAdmin: true,
      isActive: true,
      name: 'Super Admin',
    },
    create: {
      email,
      password: hashed,
      isAdmin: true,
      isGlobalAdmin: true,
      isActive: true,
      name: 'Super Admin',
    },
  });
  console.log('Super admin upserted:', user.email);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
