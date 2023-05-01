require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const PUERTO = process.env.PUERTO;
const ANFITRION = process.env.ANFITRION;
const USUARIO = process.env.USUARIO;
const CONTRASENNA = process.env.CONTRASENNA;
const BASE_DE_DATOS = process.env.BASE_DE_DATOS;
const connection = mysql.createConnection({
  host: ANFITRION,
  user: USUARIO,
  password: CONTRASENNA,
  database: BASE_DE_DATOS,
  ssl: {
    rejectUnauthorized: true
  }
})

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // Permite solicitudes desde http://localhost:3000
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Permite los métodos HTTP permitidos
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Permite las cabeceras permitidas
  next();
});

connection.connect();

app.use(bodyParser.json());

app.get('/tareas', (req, res) => {
  try {
    connection.query('SELECT * FROM tarea', (err,rows) => {
      if (err) {
        throw err;
      }
      res.status(200).json(rows);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/tareas/pendientes', (req, res) => {
  try {
    connection.query('SELECT * FROM tarea WHERE completada = 0', (err, rows) => {
      if (err) {
        throw err;
      }
      res.status(200).json(rows);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/tareas/completadas', (req, res) => {
  try {
    connection.query('SELECT * FROM tarea WHERE completada = 1', (err, rows) => {
      if (err) {
        throw err;
      }
      res.status(200).json(rows);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/tareas', (req, res) => {
  try {
    const { titulo, descripcion, completada} = req.body;
    connection.query('INSERT INTO tarea (titulo, descripcion, completada) VALUES (?, ?, ?)', [titulo, descripcion, completada], (err, result) => {
      if (err) {
        throw err;
      }
      res.status(201).json({ id: result.insertId });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/tareas/:id', (req, res) => {
  try {
    const id = req.params.id;
    const { titulo, descripcion, completada } = req.body;
    connection.query('UPDATE tarea SET titulo = ?, descripcion = ?, completada = ? WHERE id = ?', [titulo, descripcion, completada, id], (err, result) => {
      if (err) {
        throw err;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Tarea no encontrada' });
      } else {
        res.status(200).json({ message: 'Tarea actualizada correctamente' });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/tareas/:id', (req, res) => {
  try {
    const id = req.params.id;
    connection.query('DELETE FROM tarea WHERE id = ?', [id], (err, result) => {
      if (err) {
        throw err;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Tarea no encontrada' });
      } else {
        res.status(200).json({ message: 'Tarea eliminada correctamente' });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.json({message: "Hello from server!"});
});

app.listen(PUERTO, () => {
  console.log(`Server is listening on port ${PUERTO}`);
});

process.on('uncaughtException', function (err) {
  console.log(err);
});
