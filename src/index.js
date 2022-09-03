const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(req, res, next) {
  const { username } = req.headers;

  const userExists = users.some(user => user.username === username);

  if (!userExists) {
    return res.status(400).json({ error: "Usuário não existe!" });
  }

  req.username = username;
  return next();
}

app.post('/users', (req, res) => {
  const { name, username } = req.body;

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  });

  return res.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (req, res) => {
  const { username } = req;

  const user = users.find(user => user.username === username);

  return res.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (req, res) => {
  const { username } = req;
  const { title, deadline } = req.body;

  const user = users.find(user => user.username === username);

  const task = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(task);

  return res.status(201).json(task);
});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  const { username } = req;
  const { title, deadline } = req.body;
  const { id } = req.params;

  const user = users.find(user => user.username === username);

  const task = user.todos.find(todo => todo.id === id);

  if (!task) {
    return res.status(400).json({ error: "Task inexistente" });
  }

  if (title) {
    task.title = title;
  }
  if (deadline) {
    task.deadline = new Date(deadline);
  }

  return res.status(201).send();
});

// ### PATCH `/todos/:id/done`

// A rota deve receber, pelo header da requisição, uma propriedade `username` contendo o username do usuário e alterar a propriedade `done` para `true` no *todo* que possuir um `id` igual ao `id` presente nos parâmetros da rota.
app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  const { username } = req;
  const { id } = req.params;

  const user = users.find(user => user.username === username);

  const task = user.todos.find(todo => todo.id === id);

  task.done = true;

  res.status(201).send();
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

module.exports = app;