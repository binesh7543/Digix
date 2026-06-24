// यह जानबूझकर गलत कोड है (इसमें सिंटैक्स एरर है और Hono import मिसिंग है)
const app = new Hono()

app.get('/', (c) => c.text('Hello World!'))

// यहाँ export default भी मिसिंग है

