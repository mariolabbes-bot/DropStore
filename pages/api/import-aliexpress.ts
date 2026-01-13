import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

// dynamic import to allow JS/TS adapter
async function fetchFromAdapter(query: string) {
  try {
    // prefer JS adapter when running in node
    // @ts-ignore
    const adapter = require('../../integrations/aliexpress.example')
    return adapter.fetchAliProducts ? await adapter.fetchAliProducts(query) : []
  } catch (e) {
    console.warn('AliExpress adapter not available', e)
    return []
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed')
  const { query } = req.body
  if (!query) return res.status(400).json({ message: 'Missing query' })

  try {
    const products = await fetchFromAdapter(query)
    const created = []
    for (const p of products) {
      const c = await prisma.product.create({ data: { title: p.title, description: p.description, price: p.price, image: p.images?.[0] || '', vendor: p.vendor } })
      created.push(c)
    }
    res.status(201).json({ created })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error importing from AliExpress' })
  }
}
