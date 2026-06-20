import express from 'express';
import { prisma } from './utils/prisma.js';

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await prisma.task.findMany();

        if (tasks.length === 0) {
            console.log('Nenhuma tarefa encontrada.');
            return res.status(200).json({ message: 'Nenhuma tarefa encontrada.' });
        }
        res.json(tasks);
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/tasks', async (req, res) => {
    const { title, complete } = req.body;
    try {
        const task = await prisma.task.create({
            data: { title, complete }
        });

        console.log('Tarefa criada:', task);
        res.status(201).json(task);
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.task.delete({
            where: { id }
        });
        console.log(`Tarefa com ID ${id} deletada.`);
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});