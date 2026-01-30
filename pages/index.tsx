
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { toast } from 'react-hot-toast'
import VerifiedBadge from '../components/ui/VerifiedBadge';
import { useCart } from '../context/CartContext';

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setProducts([])
        setLoading(false)
      })
  }, [])

  const { addItem } = useCart();

  const addToCart = async (product: any) => {
    const loadingToast = toast.loading('Añadiendo...')
    try {
      await addItem(product);
      toast.success('¡Listo!', { id: loadingToast })
    } catch (e) {
      console.error(e)
      toast.error('Error', { id: loadingToast })
    }
  }

  // Helper
  const stripHtml = (html: string) => {
    if (!html) return ''
    const tmp = html.replace(/<[^>]*>?/gm, '')
    return tmp.length > 100 ? tmp.substring(0, 100) + '...' : tmp
  }

  return (
    <Layout>
      {/* Hero Section */}
      {/* Hero Section Minimalist */}
      <div className="relative bg-brand-gray-50 pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom duration-500">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Nueva Colección 2024
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-brand-gray-900 mb-8 animate-in fade-in slide-in-from-bottom duration-700 delay-100 leading-[0.9]">
            Exclusividad <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gray-900 via-brand-gray-700 to-brand-gray-500">
              al Detalle.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-brand-gray-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            Curaduría de productos premium con envío garantizado. <br className="hidden md:block" />
            Eleva tu estándar sin complicaciones.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <Link href="/search" className="px-10 py-5 bg-brand-gray-900 text-white rounded-full font-bold text-lg hover:bg-secondary transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
              Explorar Catálogo
            </Link>
            <Link href="#products" className="px-10 py-5 bg-white text-brand-gray-900 border border-brand-gray-200 rounded-full font-bold text-lg hover:bg-brand-gray-50 transition-all hover:border-brand-gray-300">
              Ver Tendencias
            </Link>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 opacity-30 select-none pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-3xl" />
          <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-100 to-brand-gray-200 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Product Section */}
      <section id="products" className="py-20 bg-brand-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-brand-gray-900 tracking-tight mb-4">Tendencias de la Semana</h2>
            <p className="text-brand-gray-500 text-lg">Los productos más vendidos seleccionados para ti.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 rounded-[40px] bg-white animate-pulse shadow-sm" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[40px] shadow-sm border border-brand-gray-100">
              <div className="text-6xl mb-6">🛍️</div>
              <h3 className="text-xl font-bold text-brand-gray-900 mb-2">Aún no hay productos destacados</h3>
              <p className="text-brand-gray-500 mb-8 max-w-md mx-auto">Parece que el inventario está vacío. Ve al importador para añadir productos increíbles.</p>
              <Link href="/search" className="px-8 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20">
                Ir al Importador
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((product) => (
                <div key={product.id} className="group relative flex flex-col h-full bg-white rounded-[40px] overflow-hidden border border-brand-gray-100/50 hover:border-secondary/20 transition-all duration-500 hover:shadow-premium">
                  <Link href={`/products/${product.id}`}>
                    <div className="aspect-[4/3] bg-brand-gray-50 relative overflow-hidden cursor-pointer">
                      {product.image || (product.images && product.images[0]) ? (
                        <img
                          src={product.image || product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-gray-100 text-brand-gray-400">
                          Sin Imagen
                        </div>
                      )}
                      {product.vendor && (
                        <div className="absolute top-4 left-4 inline-flex px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest">
                          {product.vendor}
                        </div>
                      )}
                      {product.verified && (
                        <div className="absolute top-4 right-4 z-10">
                          <VerifiedBadge size="md" />
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl text-brand-gray-900 mb-3 line-clamp-1">{product.title}</h3>
                    <p className="text-brand-gray-400 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">
                      {stripHtml(product.description || '') || 'Sin descripción disponible.'}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3">
                      <div className="flex flex-col mr-auto">
                        <span className="text-xs font-bold text-brand-gray-300 uppercase tracking-widest">Precio</span>
                        <span className="text-2xl font-black text-brand-gray-900">
                          ${(product.price / 100).toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        className="p-4 bg-brand-gray-100 text-brand-gray-900 rounded-2xl hover:bg-brand-gray-200 transition-all font-bold group-hover:bg-primary group-hover:text-white"
                        title="Añadir al Carrito"
                      >
                        🛒
                      </button>

                      <Link
                        href={`/products/${product.id}`}
                        className="px-6 py-4 bg-brand-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95"
                      >
                        Ver Detalle
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
