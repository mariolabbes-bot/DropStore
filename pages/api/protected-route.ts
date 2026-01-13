import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth-options';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ message: 'No autorizado. Por favor inicie sesión.' });
    }

    res.status(200).json({
        message: 'Esta es una ruta protegida',
        user: session.user
    });
}
