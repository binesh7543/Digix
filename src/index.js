// कोई इंपोर्ट नहीं
const app = new Hono()

app.get('/', (c) => c.text('Hello World!'))
// कोई एक्सपोर्ट नहीं
