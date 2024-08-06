const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000;

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rutas para las páginas HTML en la carpeta 'public/html'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/admin-dashboard.html'));
});

app.get('/verpacientes.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/verpacientes.html'));
});

app.get('/editarpaciente.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/editarpaciente.html'));
});

app.get('/med-verpacientes.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/med-verpacientes.html'));
});

app.get('/agregarpaciente.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/agregarpaciente.html'));
});

app.get('/med-agregarpacientes.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/med-agregarpacientes.html'));
});

app.get('/medico-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/medico-dashboard.html'));
});

app.post('/login', (req, res) => {
    // Aquí manejarías el envío del formulario y la autenticación
    res.redirect('/admin-dashboard.html');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
