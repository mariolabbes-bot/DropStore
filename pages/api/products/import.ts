import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { ProductService } from '../../../services/product.service';
import { authOptions } from '../../../lib/auth-options';

const productService = new ProductService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    // Solo permitir POST por simplicidad, o GET para búsqueda
    if (req.method === 'GET') {
        // Búsqueda: /api/products/import?query=watch
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ message: 'Query string requerido' });
        }

        try {
            const results = await productService.search(query);
            return res.status(200).json(results);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error buscando productos' });
        }
    } else if (req.method === 'POST') {
        // Importación: { externalId: '...' }
        const { externalId } = req.body;
        if (!externalId) {
            return res.status(400).json({ message: 'External ID requerido' });
        }

        try {
            const product = await productService.importProduct(externalId);
            return res.status(201).json({ message: 'Producto importado', product });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error importando producto' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
