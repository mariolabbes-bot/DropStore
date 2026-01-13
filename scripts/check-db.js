const { PrismaClient } = require('./node_modules/.prisma/client-local')
;(async () => {
  const p = new PrismaClient()
  try {
    const prods = await p.product.findMany()
    console.log('COUNT', prods.length)
    console.log(JSON.stringify(prods, null, 2))
  } catch (e) {
    console.error('ERR', e)
  } finally {
    await p.$disconnect()
  }
})()
