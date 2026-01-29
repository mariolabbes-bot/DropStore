
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking latest product in DB...');
    const product = await prisma.product.findFirst({
        orderBy: { createdAt: 'desc' }
    });

    if (product) {
        console.log('Latest Product:', JSON.stringify(product, null, 2));
    } else {
        console.log('No products found.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
