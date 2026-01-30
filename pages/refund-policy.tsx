
import React from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';

export default function RefundPolicy() {
    return (
        <Layout>
            <Head>
                <title>Política de Reembolso y Garantía | Nexus Finds</title>
                <meta name="description" content="Nuestra promesa de tranquilidad: Garantía de satisfacción y devoluciones simples." />
            </Head>

            <div className="bg-brand-gray-50 py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[40px] shadow-premium p-8 md:p-12">
                        <h1 className="text-4xl font-black text-brand-gray-900 mb-8 text-center">Política de Garantía</h1>

                        <div className="prose prose-lg text-brand-gray-500 mx-auto">
                            <p className="lead font-medium text-brand-gray-900">
                                En Nexus Finds, queremos que compres con total confianza. Entendemos que a veces las cosas no salen como esperamos, por eso hemos simplificado nuestro proceso de garantía al máximo.
                            </p>

                            <hr className="border-brand-gray-100 my-8" />

                            <h3 className="text-xl font-bold text-brand-gray-900">1. Garantía "Cero Riesgo" (Productos Dañados o Defectuosos)</h3>
                            <p>
                                Si tu producto llega dañado, roto o no funciona correctamente, <strong>no te preocupes</strong>. Estás cubierto al 100%.
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Plazo:</strong> Tienes 30 días desde que recibes el producto para avisarnos.</li>
                                <li><strong>Solución:</strong> Te enviamos uno nuevo totalmente gratis O te devolvemos el 100% de tu dinero. Tú eliges.</li>
                                <li><strong>¿Debo devolver el producto roto?</strong> <span className="text-green-600 font-bold">NO.</span> No queremos hacerte perder tiempo yendo al correo. Solo necesitamos que nos envíes fotos o un video claro mostrando el problema.</li>
                            </ul>

                            <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-6 my-6">
                                <p className="text-sm font-bold text-secondary m-0">
                                    💡 Cómo reportar: Envíanos un email a soporte@nexus-finds.com con tu número de orden y la foto del daño. Te responderemos en menos de 24 horas.
                                </p>
                            </div>

                            <h3 className="text-xl font-bold text-brand-gray-900 mt-8">2. Garantía de Satisfacción (Derecho a Retracto)</h3>
                            <p>
                                ¿El producto está perfecto pero cambiaste de opinión? No hay problema. Respetamos tu derecho a retracto.
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Plazo:</strong> 10 días desde que recibes el producto.</li>
                                <li><strong>Condición:</strong> El producto debe estar nuevo, sellado, sin uso y en su empaque original.</li>
                                <li><strong>Costo de Envío:</strong> En este caso, como el producto está bien, tú eres responsable de pagar el envío de regreso a nuestra bodega local.</li>
                                <li><strong>Reembolso:</strong> Una vez que recibamos el producto y verifiquemos que está nuevo, te reembolsaremos el valor total del producto.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-brand-gray-900 mt-8">3. Tiempos de Reembolso</h3>
                            <p>
                                Los reembolsos se procesan inmediatamente después de ser aprobados. Dependiendo de tu banco, el dinero puede tardar entre 5 a 10 días hábiles en aparecer en tu cuenta.
                            </p>

                            <hr className="border-brand-gray-100 my-8" />

                            <p className="text-center text-sm">
                                ¿Dudas? Escríbenos a <strong>soporte@nexus-finds.com</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
