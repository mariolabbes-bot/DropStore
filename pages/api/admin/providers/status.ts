
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth-options';
import { ProviderFactory } from '../../../../lib/providers/factory';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user?.email !== 'admin@dropstore.com') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const providers = ['cj', 'aliexpress'];
        const statuses = await Promise.all(providers.map(async (p) => {
            const provider = ProviderFactory.getProvider(p);
            let currentStatus: { connected: boolean; message?: string } = { connected: false, message: 'Not checked' };
            if (provider.checkStatus) {
                currentStatus = await provider.checkStatus();
            } else {
                currentStatus = { connected: false, message: 'Status check not implemented' };
            }
            return {
                name: provider.name,
                id: p,
                ...currentStatus
            };
        }));

        return res.status(200).json(statuses);
    } catch (error: any) {
        return res.status(500).json({ message: error.message || 'Error checking status' });
    }
}
