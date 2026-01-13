import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      // Create or update cart item
      const { cartId, productId, title, price, quantity } = req.body
      if (!productId || !quantity) return res.status(400).json({ message: 'Missing productId or quantity' })

      let cart
      if (!cartId) {
        cart = await prisma.cart.create({ data: { items: { create: [{ productId, title, price, quantity }] } }, include: { items: true } })
      } else {
        // add item to existing cart
        cart = await prisma.cart.update({
          where: { id: Number(cartId) },
          data: { items: { create: [{ productId, title, price, quantity }] } },
          include: { items: true }
        })
      }

      return res.status(201).json(cart)
    }

    if (req.method === 'GET') {
      const { cartId } = req.query
      if (!cartId) return res.status(400).json({ message: 'Missing cartId' })
      const cart = await prisma.cart.findUnique({ where: { id: Number(cartId) }, include: { items: true } })
      return res.status(200).json(cart)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error', error })
  }
}
