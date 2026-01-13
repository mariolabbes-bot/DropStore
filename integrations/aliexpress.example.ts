// Ejemplo de adaptador (placeholder) para AliExpress

export async function fetchProducts(query: string) {
  // Llamar a API de proveedor o usar scraping según proveedor
  return [
    { id: 'ali-1', title: 'Producto Ali', price: 1299, image: '' }
  ]
}
