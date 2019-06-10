const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const funciones = require('./funciones');

const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../partials');

app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index', {
        Nombre: 'Sergio'
    });
});

app.get('/curso', (req, res) => {
    res.render('curso', {
        Nombre: 'Esteban'
    });
});

app.post('/listacursos', (req, res) => {
    var Curso = req.body;
    crear = funciones.CrearCurso(Curso);
    lista = funciones.MostrarCursos();
    res.render('listacursos', {
        tablaCursos: lista,
        mensaje: crear
    });
});

app.get('/listacursos', (req, res) => {
    estado = funciones.CambioEstadoCurso();
    lista = funciones.MostrarCursos();
    res.render('listacursos', {
        tablaCursos: lista,
        cambioEstado: estado
    });
});


app.get('/vercursos', (req, res) => {
    lista = funciones.verCursosDisponibles();
    console.log(lista)
    res.render('vercursos', {
        tablaCursos: lista
    });
});

app.post('/listadocursos', (req, res) => {
    mensaje = "";
    var Id = req.body.idCurso;
    mensaje = funciones.CambiarEstadoCurso(Id);

    lista = funciones.MostrarCursos();
    res.render('listadocursos', {
        tablaCursos: lista,
        mensaje: mensaje
    });
});


/********************************************************************/
/********************************************************************/
/************************** INSCRIPCION *****************************/
/********************************************************************/


app.get('/inscripcion', (req, res) => {
    lista = funciones.ListaCursosDisponibles();
    res.render('inscripcion', {
        Titulo: 'Formulario para inscribirse en un curso',
        Subtitulo: 'Utilice este formulario para inscribirse en un curso',
        listaCursos: lista
    });
});

app.post('/guardarinscripcion', (req, res) => {
    var Inscripcion = req.body;
    crear = funciones.CrearInscripcion(Inscripcion);
    res.render('guardarinscripcion', {
        mensaje: crear
    });
});

app.get('/listainscriptos', (req, res) => {
    lista = funciones.ListarCursosInscripciones();
    res.render('listainscriptos', {
        tablaCursosInscriptos: lista
    });
   // $('.collapse').collapse();
});

app.get('/eliminarinscripto', (req, res) => {
    console.log('ddd')
    var codigo = req.query.id;
    var respuesta = funciones.eliminarinscripto(codigo);
    

    setTimeout(function(){
        lista = funciones.ListarCursosInscripciones();
        res.render('eliminarinscripto', {
            mensaje: respuesta,
            tablaCursosInscriptos: lista
        });
    },4000)
});



app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
});