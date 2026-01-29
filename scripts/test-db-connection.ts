
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Testing DB Connection...');
    try {
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@dropstore.com' }
        });

        if (admin) {
            console.log('✅ Admin user found:');
            console.log(`- ID: ${admin.id}`);
            console.log(`- Role: ${admin.role}`);

            if (!admin.password) {
                console.error('❌ No password set!');
                return;
            }

            const isValid = await bcrypt.compare('password123', admin.password);
            console.log(`🔐 Password 'password123' match? ${isValid ? 'YES' : 'NO'}`);

            if (!isValid) {
                console.log('🔄 Mismatch detected. Updating password to new known hash...');
                const salt = await bcrypt.genSalt(10);
                const newHash = await bcrypt.hash('password123', salt);
                await prisma.user.update({
                    where: { email: 'admin@dropstore.com' },
                    data: { password: newHash }
                });
                console.log('✅ Password updated successfully.');
            }

        } else {
            console.error('❌ Admin user NOT found in this DB.');
        }

    } catch (e) {
        console.error('❌ Connection Failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
