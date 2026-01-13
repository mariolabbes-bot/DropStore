import React, { useEffect, useState } from 'react'

export default function CartPage() {
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Try to load cartId from localStorage
    const cartId = localStorage.getItem('cartId')
    if (cartId) fetch(`/api/cart?cartId=${cartId}`).then(r => r.json()).then(setCart)
  }, [])

  async function checkout() {
    setLoading(true)
    const items = cart?.items || []
    const res = await fetch('/api/stripe/create-checkout-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) })
    const data = await res.json()
    setLoading(false)
    if (data.url) return window.location.href = data.url
    if (data.id) window.location.href = `https://checkout.stripe.com/pay/${data.id}`
  }

  if (!cart) return <div className="p-8">No hay items en el carrito</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Carrito</h1>
      <ul>
        {cart.items.map((it: any) => (
          <li key={it.id} className="mb-2">{it.title} - {it.quantity} x ${(it.price/100).toFixed(2)}</li>
        ))}
      </ul>
      <button onClick={checkout} disabled={loading} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Pagar</button>
    </div>
  )
}
