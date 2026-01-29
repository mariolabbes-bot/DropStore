
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth-options';
import { ProductService } from '../../../../services/product.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    // Simple admin check based on your current schema/setup
    if (!session || session.user?.email !== 'admin@dropstore.com') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { q, provider } = req.query;

    if (!q) {
        return res.status(400).json({ message: 'Query parameter "q" is required' });
    }

    try {
        const productService = new ProductService();
        const results = await productService.search(q as string, (provider as string) || 'cj');
        return res.status(200).json(results);
    } catch (error: any) {
        console.error('[AdminSearchAPI] Error:', error);
        return res.status(500).json({ message: error.message || 'Error searching products' });
    }
}
