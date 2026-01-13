import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts)
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="border p-4 rounded">
            <h2 className="font-semibold">{p.title}</h2>
            <p className="text-sm text-gray-600">${(p.price/100).toFixed(2)}</p>
            <Link href={`/products/${p.id}`} className="mt-2 inline-block text-blue-600">Ver</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
