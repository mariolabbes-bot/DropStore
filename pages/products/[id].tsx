import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/products`).then(r => r.json()).then((list) => {
      const p = list.find((x: any) => String(x.id) === String(id))
      setProduct(p)
    })
  }, [id])

  async function addToCart() {
    // Create or update cart
    const cartId = localStorage.getItem('cartId')
    const body = { cartId, productId: product.id, title: product.title, price: product.price, quantity: 1 }
    const res = await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    localStorage.setItem('cartId', data.id || data.id)
    router.push('/cart')
  }

  if (!product) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p className="mt-2">{product.description}</p>
      <p className="mt-2 font-semibold">${(product.price/100).toFixed(2)}</p>
      <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded" onClick={addToCart}>Agregar al carrito</button>
    </div>
  )
}
