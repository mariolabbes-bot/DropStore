
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query

    if (req.method === 'GET') {
        if (!id || Array.isArray(id)) {
            return res.status(400).json({ message: 'Invalid ID' })
        }

        try {
            const product = await prisma.product.findUnique({
                where: { id: parseInt(id) },
            })

            if (!product) {
                return res.status(404).json({ message: 'Product not found' })
            }

            return res.status(200).json(product)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
}
