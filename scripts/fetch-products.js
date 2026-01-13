const http = require('http')

http.get('http://localhost:3001/api/products', (res) => {
  let data = ''
  res.on('data', chunk => data += chunk)
  res.on('end', () => {
    try {
      console.log('STATUS', res.statusCode)
      console.log(JSON.stringify(JSON.parse(data), null, 2))
    } catch (e) {
      console.error('Error parsing response', e)
      console.log(data)
    }
  })
}).on('error', (err) => {
  console.error('Request error', err)
})
