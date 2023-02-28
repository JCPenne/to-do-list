const express = require('express');
const app = express();
const pool = require('./db');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/todos', async (req, res) => {
  try {
    const allToDos = await pool.query('SELECT * FROM todo');
    res.json(allToDos.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const singleToDo = await pool.query(
      'SELECT * FROM todo WHERE id = $1',
      [id]
    );
    res.json(singleToDo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateToDo = await pool.query(
      'UPDATE todo SET description = $1 WHERE id = $2 RETURNING *',
      [description, id]
    );
    res.json(updateToDo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

app.post('/todos', async (req, res) => {
  console.log('post hit');
  try {
    const { description } = req.body;
    const newToDo = await pool.query(
      'INSERT INTO todo (description) VALUES ($1) RETURNING *',
      [description]
    );

    res.json(newToDo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteToDo = await pool.query(
      'DELETE FROM todo WHERE id = $1',
      [id]
    );
    res.json(`To Do #${id} was Deleted`);
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(3003, () => {
  console.log('Server Listening on Port 3003');
});
