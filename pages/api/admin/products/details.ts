
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth-options';
import { ProductService } from '../../../../services/product.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    // Admin check
    if (!session || session.user?.email !== 'admin@dropstore.com') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { id, provider } = req.query;

    if (!id) {
        return res.status(400).json({ message: 'Parameter "id" is required' });
    }

    try {
        const productService = new ProductService();
        const details = await productService.getProductDetails(id as string, (provider as string) || 'aliexpress');
        return res.status(200).json(details);
    } catch (error: any) {
        console.error('[AdminDetailsAPI] Error:', error);
        return res.status(500).json({ message: error.message || 'Error fetching product details' });
    }
}
