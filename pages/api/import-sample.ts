import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchSampleProducts } from '../../integrations/sample-provider'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed')
  try {
    const products = await fetchSampleProducts()
    const created = []
    for (const p of products) {
      const c = await prisma.product.create({ data: { title: p.title, description: p.description, price: p.price, image: p.image, vendor: p.vendor } })
      created.push(c)
    }
    res.status(201).json({ created })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error importing sample products' })
  }
}
