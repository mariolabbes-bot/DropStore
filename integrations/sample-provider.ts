// Adaptador de proveedor de ejemplo que devuelve productos hardcodeados
export async function fetchSampleProducts() {
  return [
    { title: 'Auriculares bluetooth', description: 'Auriculares con cancelación de ruido', price: 4999, image: '', vendor: 'SampleCo' },
    { title: 'Lámpara LED', description: 'Lámpara para escritorio con brillo ajustable', price: 2999, image: '', vendor: 'SampleCo' },
    { title: 'Mochila urbana', description: 'Mochila resistente al agua', price: 7999, image: '', vendor: 'SampleCo' }
  ]
}
