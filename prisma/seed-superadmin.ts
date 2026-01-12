const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL
  const password = process.env.SUPER_ADMIN_PASSWORD
  if (!email || !password) {
    throw new Error('SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env file')
  }

  // Ensure admin role exists
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', description: 'Platform administrator' },
  })

  const hashed = await bcrypt.hash(password, 10)

  // Upsert admin user
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashed,
      isActive: true,
      name: 'Super Admin',
    },
    create: {
      email,
      password: hashed,
      isActive: true,
      name: 'Super Admin',
    },
  })

  // Assign role via RBAC
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
    update: {},
    create: { userId: user.id, roleId: adminRole.id },
  })

  console.log('Seeded super admin:', user.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())