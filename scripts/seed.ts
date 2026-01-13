let db
try {
  // prefer local generated client for demo (schema.local)
  const LocalPrisma = require('../node_modules/.prisma/client-local').PrismaClient
  db = new LocalPrisma()
} catch (e) {
  db = require('../lib/prisma').default
}
const { fetchSampleProducts } = require('../integrations/sample-provider')

async function main() {
  const products = await fetchSampleProducts()
  for (const p of products) {
    await db.product.create({ data: { title: p.title, description: p.description, price: p.price, image: p.image, vendor: p.vendor } })
  }
  console.log('Seed completed')
}

main().catch((e: any) => { console.error(e); process.exit(1) }).finally(() => db.$disconnect())
