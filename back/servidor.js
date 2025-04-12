const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: true }));

// INICIAMOS CONEXION A SERVIDOR LEVANTADO POR JSON 
mongoose.connect('mongodb+srv://student:dPgF0sb0ADBUZHCI@clusterunam.6pxlppf.mongodb.net/?retryWrites=true&w=majority&appName=ClusterUNAM', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch(err => {
  console.error('Error de conexión:', err);
});

// INDICANDO QUE ESPERAMOS DENTRO DE LOS CAMPOS DEL LOGIN
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
  username: String,
  password: String
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front', 'index.html'));
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;


  // USAMOS UN TRY CATCH PARA CAPTURAR EXCEPCIONES QUE SURGAN ADEMAS DE USAR IF PARA INDICAR SI SE DIO ACCESO O NO
  try {
    const user = await Usuario.findOne({ username, password });

    if (user) {
      res.send('✅ Acceso concedido');
    } else {
      res.send('❌ Acceso incorrecto');
    }
  } catch (err) {
    res.status(500).send('Error del servidor');
  }
});

app.get('/crear-usuario', async (req, res) => {
  try {
    const nuevoUsuario = new Usuario({
      username: 'student',
      password: 'dPgF0sb0ADBUZHCI'
    });
    await nuevoUsuario.save();
    res.send('Usuario creado correctamente');
  } catch (err) {
    res.status(500).send('Error al crear usuario');
  }
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
