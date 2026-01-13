(async () => {
  let db
  try {
    const LocalPrisma = require('../node_modules/.prisma/client-local').PrismaClient
    db = new LocalPrisma()
  } catch (e) {
    db = require('../lib/prisma').default
  }
  const { fetchSampleProducts } = require('../integrations/sample-provider')

  try {
    const products = await fetchSampleProducts()
    for (const p of products) {
      await db.product.create({ data: { title: p.title, description: p.description, price: p.price, image: p.image, vendor: p.vendor } })
    }
    console.log('Seed completed')
  } catch (err) {
    console.error(err)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
})()
