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

// ### PUT `/todos/:id`
// A rota deve receber, pelo header da requisição, uma propriedade `username` contendo o username do usuário e receber as propriedades `title` e `deadline` dentro do corpo. É preciso alterar **apenas** o `title` e o `deadline` da tarefa que possua o `id` igual ao `id` presente nos parâmetros da rota.
app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  const { username } = req;
  const { title, deadline } = req.body;
  const { id } = req.params;

  const user = users.find(user => user.username === username);

  const task = user.todos.find(todo => todo.id === id);

  if(!task){
    return res.status(400).json({error: "Task inexistente"});
  }

  if(title){
    task.title = title;
  }
  if(deadline){
    task.deadline = new Date(deadline);
  }

  return res.status(201).send();
});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

module.exports = app;