
import React from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';
import VerifiedBadge from '../components/ui/VerifiedBadge';

export default function AboutPage() {
    return (
        <Layout>
            <Head>
                <title>Sobre Nosotros | DropStore Certified Quality</title>
                <meta name="description" content="Conoce nuestro proceso de certificación de calidad. Probamos cada producto antes de enviártelo." />
            </Head>

            {/* Hero Section */}
            <div className="relative bg-brand-gray-900 text-white overflow-hidden py-24 lg:py-32">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10 blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-gray-900 via-transparent"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom duration-700">
                        <span className="text-xl">✨</span>
                        <span className="text-sm font-bold tracking-widest uppercase">Calidad Garantizada</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight animate-in fade-in slide-in-from-bottom duration-700 delay-100">
                        No vendemos nada <br />
                        <span className="text-secondary">que no usaríamos.</span>
                    </h1>

                    <p className="text-xl text-brand-gray-400 max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
                        DropStore no es solo una tienda. Es un filtro de calidad en un mundo lleno de opciones.
                        Probamos, verificamos y certificamos cada producto.
                    </p>
                </div>
            </div>

            {/* The Process Section */}
            <section className="py-24 bg-brand-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-brand-gray-900 mb-4">Nuestro Proceso de Certificación</h2>
                        <p className="text-brand-gray-500 max-w-2xl mx-auto"> ¿Por qué nuestros productos tienen una insignia "Certificado"? Porque pasaron por esto:</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Step 1 */}
                        <div className="bg-white p-8 rounded-[32px] shadow-premium relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                            <div className="h-20 w-20 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                                🔍
                            </div>
                            <h3 className="text-xl font-bold text-brand-gray-900 mb-4">1. Curaduría Rigurosa</h3>
                            <p className="text-brand-gray-500 leading-relaxed">
                                Analizamos miles de productos y proveedores. Descartamos el 95% de lo que vemos. Solo seleccionamos lo que tiene potencial real.
                            </p>
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black text-brand-gray-900 select-none">1</div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white p-8 rounded-[32px] shadow-premium relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 border border-secondary/10">
                            <div className="h-20 w-20 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                                🧪
                            </div>
                            <h3 className="text-xl font-bold text-brand-gray-900 mb-4">2. Prueba Física</h3>
                            <p className="text-brand-gray-500 leading-relaxed">
                                Pedimos muestras. Las tocamos, las usamos, las lavamos. Si se rompe, se despinta o no funciona como promete, <strong className="text-brand-gray-900">no entra a la tienda.</strong>
                            </p>
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black text-secondary select-none">2</div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white p-8 rounded-[32px] shadow-premium relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                            <div className="h-20 w-20 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                                ✅
                            </div>
                            <h3 className="text-xl font-bold text-brand-gray-900 mb-4">3. Aprobación y Venta</h3>
                            <p className="text-brand-gray-500 leading-relaxed">
                                Solo cuando estamos 100% seguros, le ponemos nuestro sello de <strong className="text-green-600">Certificado</strong> y lo ponemos a tu disposición.
                            </p>
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black text-brand-gray-900 select-none">3</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-block px-4 py-2 bg-brand-gray-50 rounded-lg text-xs font-bold uppercase tracking-widest text-brand-gray-500 mb-8">
                                Nuestras Fortalezas
                            </div>
                            <h2 className="text-4xl font-black text-brand-gray-900 mb-6 leading-tight">
                                Más que una tienda online, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">tu filtro de confianza.</span>
                            </h2>
                            <p className="text-xl text-brand-gray-500 mb-8">
                                Sabemos que comprar online a veces es una apuesta. Nosotros eliminamos el riesgo por ti.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { icon: "🌍", title: "Envíos Globales Rápidos", desc: "Logística optimizada para reducir tiempos de espera." },
                                    { icon: "🔒", title: "Pagos 100% Seguros", desc: "Procesados por Stripe con encriptación de nivel bancario." },
                                    { icon: "🛡️", title: "Garantía de Satisfacción", desc: "Si no es lo que esperabas, lo solucionamos." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="h-12 w-12 rounded-xl bg-brand-gray-50 flex items-center justify-center text-2xl flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-brand-gray-900">{item.title}</h4>
                                            <p className="text-brand-gray-500 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12">
                                <Link href="/#products" className="px-10 py-4 bg-brand-gray-900 text-white rounded-2xl font-bold shadow-xl hover:bg-black transition-all hover:scale-105 inline-block">
                                    Ver Catálogo Certificado
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-accent/20 rounded-[40px] rotate-3 blur-2xl"></div>
                            <div className="relative bg-brand-gray-50 rounded-[40px] p-8 border border-brand-gray-100 shadow-2xl">
                                {/* Visual Mockup of Verified Product */}
                                <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-12 w-12 bg-brand-gray-100 rounded-full animate-pulse"></div>
                                        <VerifiedBadge size="lg" showText />
                                    </div>
                                    <div className="h-4 w-3/4 bg-brand-gray-100 rounded-full mb-3 animate-pulse"></div>
                                    <div className="h-4 w-1/2 bg-brand-gray-100 rounded-full animate-pulse"></div>
                                </div>
                                <div className="bg-white/50 rounded-3xl p-6 shadow-sm blur-[2px] scale-95 opacity-50">
                                    <div className="h-4 w-full bg-brand-gray-100 rounded-full mb-2"></div>
                                    <div className="h-4 w-full bg-brand-gray-100 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
