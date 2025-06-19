const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create a default admin user if it doesn't exist
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'admin' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        username: 'admin',
        passwordHash: hashedPassword,
        isAdmin: true,
      },
    });
    console.log('✅ Created admin user (username: admin, password: admin123)');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Create a test user if it doesn't exist
  const existingTestUser = await prisma.user.findUnique({
    where: { username: 'testuser' },
  });

  if (!existingTestUser) {
    const hashedPassword = await bcrypt.hash('test123', 10);
    await prisma.user.create({
      data: {
        username: 'testuser',
        passwordHash: hashedPassword,
        isAdmin: false,
      },
    });
    console.log('✅ Created test user (username: testuser, password: test123)');
  } else {
    console.log('ℹ️  Test user already exists');
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 