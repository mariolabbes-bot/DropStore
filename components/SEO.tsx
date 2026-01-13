import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
}

export default function SEO({
    title = 'DropStore - Tu Tienda de Dropshipping Premium',
    description = 'Encuentra los mejores productos a precios increíbles con envío rápido y seguro.',
    image = '/og-image.jpg',
    type = 'website'
}: SEOProps) {
    const router = useRouter();
    const siteUrl = process.env.NEXT_PUBLIC_URL || 'https://dropstore.com';
    const url = `${siteUrl}${router.asPath}`;
    const fullTitle = title === 'DropStore' ? title : `${title} | DropStore`;

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:url" content={url} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="DropStore" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Head>
    );
}
