const app = new Hono()
app.get('/', (c) => c.text('Hello!'))
