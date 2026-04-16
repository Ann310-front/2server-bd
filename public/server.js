
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import { fileURLToPath } from 'url';
import path from 'path';
import pug from 'pug';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify();
const port = 3000;

const projectRoot = path.join(__dirname, '..');

app.register(fastifyStatic, {
    root: path.join(__dirname, 'public')
});

app.register(fastifyView, {
    engine: { pug },
    root: path.join((projectRoot, 'views'))
});

let users = [
    { id: 1, name: 'Иван Петров', email: 'ivan@example.com' },
    { id: 2, name: 'Мария Сидорова', email: 'maria@example.com' },
    { id: 3, name: 'Алексей Иванов', email: 'alex@example.com' },
];
let nextId = 4;

app.get('/users', async (req, reply) => {
    return reply.view('users.pug', { users });
});

app.get('/users/create', async (req, reply) => {
    return reply.view('create-user.pug');
});

app.post('/users', async (req, reply) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return reply.status(400).send('Имя и email обязательны');
    }
    users.push({ id: nextId++, name: name.trim(), email: email.trim() });
    return reply.redirect('/users');
});
app.get('/', (req, res) => {
    res.send('Форма')
})
app.listen({ port }, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Сервер запущен на http://localhost:${port}`);
});