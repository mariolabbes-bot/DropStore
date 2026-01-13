
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth-utils';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@dropstore.com';
    const password = 'password123';
    const name = 'Admin User';

    console.log(`Creating user: ${email}...`);

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword, // Reset password if exists
            role: 'admin',
        },
        create: {
            email,
            password: hashedPassword,
            name,
            role: 'admin',
        },
    });

    console.log('✅ Usuario Administrador creado/actualizado:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
