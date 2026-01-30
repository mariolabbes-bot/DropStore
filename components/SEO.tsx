import Head from 'next/head';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

export default function SEO({
    title = 'Nexus Finds - Tu Tienda de Dropshipping Premium',
    description = 'Encuentra los mejores productos a precios increíbles con envío rápido y seguro.',
    image = '/og-image.jpg',
    url
}: SEOProps) {
    const siteUrl = process.env.NEXT_PUBLIC_URL || 'https://www.nexus-finds.com';
    const canonical = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : siteUrl;
    const fullTitle = title === 'Nexus Finds' ? title : `${title} | Nexus Finds`;

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonical} />

            {/* Open Graph */}
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Nexus Finds" />
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
