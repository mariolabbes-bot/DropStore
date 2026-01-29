
import { PrismaClient } from '@prisma/client';

const getFixedDatabaseUrl = () => {
    let url = process.env.DATABASE_URL;
    if (!url) return undefined;
    if (url.startsWith('neondb://')) return url.replace('neondb://', 'postgresql://');
    return url;
};
const fixedUrl = getFixedDatabaseUrl();
const prisma = new PrismaClient({
    datasources: fixedUrl ? { db: { url: fixedUrl } } : undefined
});

async function main() {
    console.log('🔄 Starting Image Migration...');
    const products = await prisma.product.findMany();

    for (const product of products) {
        let needsUpdate = false;
        let newImage = product.image;
        let newImages = product.images;

        // 1. Fix Main Image if it is a stringified JSON array
        if (typeof newImage === 'string' && newImage.startsWith('["')) {
            try {
                const parsed = JSON.parse(newImage);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    newImage = parsed[0];
                    // Also populate the images array if it was empty, using this list
                    if (newImages.length === 0) {
                        newImages = parsed;
                    }
                    needsUpdate = true;
                    console.log(`✅ Fixed main URL for: ${product.title}`);
                }
            } catch (e) {
                console.error(`⚠️ Failed to parse image for ${product.id}`);
            }
        }

        // 2. Fallback: If image is empty but images exists take 0
        if (!newImage && newImages.length > 0) {
            newImage = newImages[0];
            needsUpdate = true;
        }

        // 3. Fallback: If images is empty but image acts as the source, make array
        if (newImage && newImages.length === 0) {
            newImages = [newImage];
            needsUpdate = true;
        }

        if (needsUpdate) {
            await prisma.product.update({
                where: { id: product.id },
                data: {
                    image: newImage,
                    images: newImages
                }
            });
        }
    }

    console.log('🎉 Migration Complete!');
    await prisma.$disconnect();
}

main();
