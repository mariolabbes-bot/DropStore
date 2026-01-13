import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts).catch(() => setProducts([]))
  }, [])

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center">Dropshipping Store</h1>
        <p className="mt-4 text-gray-600 text-center">Scaffold inicial con Next.js, Tailwind y Prisma.</p>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Productos</h2>
          {products.length === 0 ? (
            <p className="text-gray-500">No hay productos. Puedes importar ejemplo en <code>/api/import-sample</code>.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map(p => (
                <div key={p.id} className="border p-4 rounded">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-gray-600">${(p.price/100).toFixed(2)}</p>
                  <Link href={`/products/${p.id}`} className="mt-2 inline-block text-blue-600">Ver</Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
