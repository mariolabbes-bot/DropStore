
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth-options';
import { ProductService } from '../../../../services/product.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user?.role !== 'admin') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { externalId, provider } = req.body;

    if (!externalId) {
        return res.status(400).json({ message: 'externalId is required' });
    }

    try {
        const productService = new ProductService();
        const product = await productService.importProduct(externalId, provider || 'cj');
        return res.status(200).json(product);
    } catch (error: any) {
        console.error('[AdminImportAPI] Error:', error);
        return res.status(500).json({ message: error.message || 'Error importing product' });
    }
}
