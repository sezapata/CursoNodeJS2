const fs = require('fs');
listaCursos = [];
listaInscriptos = [];
mensaje = '';

let CrearCurso = (datCurso) => {
    listarCursos();
    let curso = {
        id: datCurso.id,
        nombre: datCurso.nombre,
        modalidad: datCurso.modalidad,
        valor: datCurso.valor,
        descripcion: datCurso.descripcion,
        intensidad: datCurso.intensidad,
        estado: 'disponible'
    };

    let duplicado = listaCursos.find(curs => curs.id == curso.id);
    if (!duplicado) {
        listaCursos.push(curso);
        guardarCurso();
        mensaje = `<h2>curso ${curso.nombre} creado con éxito</h2>`;
    } else {
        mensaje = `<h2>Ya existe un curso con este ID</h2>`;
    }
    return mensaje;
}


const listarCursos = () => {
    try {
        listaCursos = require('../listado.json');
    } catch {
        listaCursos = [];
    }
}

const guardarCurso = () => {
    let datos = JSON.stringify(listaCursos);
    fs.writeFile("listado.json", datos, (error) => {
        if (error) throw (error);
        console.log('Archivo creado con éxito');
    })
}

const MostrarCursos = () => {
    listarCursos();
    lCursos = `<table class="table">
                <thead>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Valor</th>
                    <th>Modalidad</th>
                    <th>Intensidad</th>
                    <th>Estado</th>
                </thead>
                <tbody>`;

    listaCursos.forEach(curso => {
        lCursos += `<tr>
                <td>${curso.id}</td>
                <td>${curso.nombre}</td>
                <td>${curso.descripcion}</td>
                <td>${curso.valor}</td>
                <td>${curso.modalidad}</td>
                <td>${curso.intensidad}</td>
                <td>${curso.estado}</td>
                </tr>
        `
    });

    lCursos += ` </tbody>
                </table>`
    return lCursos;
}

const ListaCursosDisponibles = () => {
    listarCursos();
    var opciones = '<option value=""></option>';

    listaCursos.forEach(curso => {
        if (curso.estado == 'disponible') {
            opciones += `<option value='${curso.id}'>${curso.nombre}</option>`;
        }
    });

    return opciones;
}

const verCursosDisponibles = () => {
    listarCursos();
    var cursos = '';

    listaCursos.forEach(curso => {
        if (curso.estado == 'disponible') {
            cursos += ` <div class="col-md-4" style="padding:20px">
                            <div class="card" >
                                <div class="card-body text-center" style="background:#07421C; color:#FFF">
                                    <h5 class="card-title">${curso.nombre}</h5>
                                    <p class="card-text">${curso.descripcion}</p>
                                </div>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><strong>Valor:</strong>$${curso.valor}</li>
                                    <li class="list-group-item"><strong>Modalidad:</strong>${curso.modalidad}</li>
                                    <li class="list-group-item"><strong>Intensidad:</strong>${curso.intensidad} horas</li>
                                </ul>
                                <div class="card-body text-center">
                                    <a href="/inscripcion" class="card-link"><button class="btn btn-success">Ir a inscripciones</button> </a>
                                </div>
                            </div>
                        </div> `;
        }
    });

    return cursos;
}
const CambioEstadoCurso = () => {
    lista = ListaCursosDisponibles();
    obj = "";

    if (lista != "") {
        obj += `
                    <div class="col-md-6 text-center">
                        <div class="form-group">
                            <h3>Actualizar estado de un curso</h3>
                            <label for="idCurso">Cursos disponibles</label>
                            <div class="col-md-12 text-center">
                                <select class="form-control" name="idCurso" id="idCurso" >
                                    ${lista}
                                </select>
                            </div>
                        </div>
                        <button class="btn-xs btn-success">Actualizar</button>
                    </div>
        `;
    }
    return obj;
}

let CambiarEstadoCurso = (idCurso) => {
    listarCursos();
    let curso = listaCursos.find(course => course.id == idCurso);

    if (!curso) {
        mensaje = '<div class="alert alert-danger">Curso no encontrado</div>';
    } else {

        curso['estado'] = 'cerrado';
        guardarCurso();
        mensaje = '<div class="alert alert-success">Curso actualizado con éxito</div>';
    }

    return mensaje;
}








let CrearInscripcion = (datInscripcion) => {
    listadoInscriptos();
    let inscripto = {
        documento: datInscripcion.documento,
        nombre: datInscripcion.nombre,
        correo: datInscripcion.email,
        telefono: datInscripcion.telefono,
        curso: datInscripcion.cursos,
        codigo: datInscripcion.documento + datInscripcion.cursos
    };

    let duplicado = listaInscriptos.find(inscr => inscr.documento == inscripto.documento && inscr.curso == inscripto.curso);
    if (!duplicado) {
        listaInscriptos.push(inscripto);
        guardarInscripto();
        mensaje = `<div class="alert alert-info">Estudiante ${inscripto.nombre} inscripto con éxito en el curso de ${ consultarNombreCurso(inscripto.curso) }</h2>`;
    } else {
        mensaje = `<div class="alert alert-danger">Ya se encuentra inscripto en este curso</div>`;
    }
    return mensaje;
}

const consultarNombreCurso = (idCurso) => {
    listarCursos();
    let nombre= '';

    listaCursos.forEach(curso => {
        if(curso.id  == idCurso){
            nombre = curso.nombre;
            return nombre;
        }
    });
    return nombre;
}

const listadoInscriptos = () => {
    try {
        listaInscriptos = require('../inscriptos.json');
    } catch {
        listaInscriptos = [];
    }
}

const guardarInscripto = () => {
    
    let datos = JSON.stringify(listaInscriptos);
    fs.writeFile("inscriptos.json", datos, (error) => {
        if (error) throw (error);
        console.log('Inscripto creado con éxito');
    })
}

const ListarCursosInscripciones = () =>{
    //CONSULTAR CURSOS ACTIVOS
    listaInscriptos = [];
    listarCursos();

    var obj = '<div class="row">';
    listaCursos.forEach(curso => {
        if (curso.estado == 'disponible') {
            listaInscriptos = [];
            obj += `
            <div class="col-md-6" style="padding:10px;margin:5px 0">
                <div id="accordion">
                    <div class="card">
                        <div class="card-header" id="heading${curso.id}">
                            <h5 class="mb-0">
                            <button class="btn btn-link" data-toggle="collapse" data-target="#collapse${curso.id}" aria-expanded="true" aria-controls="collapse${curso.id}">
                                ${curso.nombre}
                            </button>
                            </h5>
                        </div>
            
                        <div id="collapse${curso.id}" class="collapse show" aria-labelledby="heading${curso.id}" data-parent="#accordion">
                            <div class="card-body">
                                <div class="col-md-12">
                                    ${ ListadoInscriptosxCurso(curso.id) }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
    })
    obj += '</div>';
    return obj;
}


const ListadoInscriptosxCurso = (idCurso) => {
    listaInscriptos=[];
    listadoInscriptos();

    table = `<table class="table table-xs" style="font-size:10px">
                <thead>
                    <th>DNI</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Acción</th>
                </thead>
                <tbody>`;

    listaInscriptos.forEach(inscripto => {
        if(inscripto.curso == idCurso){
        table += `<tr>
                <td>${inscripto.documento}</td>
                <td>${inscripto.nombre}</td>
                <td>${inscripto.correo}</td>
                <td>${inscripto.telefono}</td>
                <td><a href="/eliminarinscripto?id=${inscripto.codigo}"><button class=" btn-danger btn-xs">Eliminar</button></a></td>
                </tr>
        `;
        }
    });

    table += ` </tbody>
                </table>`
    return table;
}

const eliminarinscripto = (codInscripto) =>{
    
    listadoInscriptos();
    listado = [];
    mensaje = '';

    listaInscriptos.forEach(inscripto => {
        if(inscripto.codigo!=codInscripto){
            listado.push(inscripto);
        }
    })
console.log('cuneta'+listado.length);
    /*if(listado.length ==0){
        listado = '';
    }*/
    listaInscriptos = [];
        listaInscriptos = listado;
        guardarInscripto();
        mensaje = `<div class="alert alert-danger">Se eilimino el inscripto del curso</div>`;
    //}
    console.log(listaInscriptos)
    return mensaje;
}


module.exports = {
    CrearCurso,
    MostrarCursos,
    ListaCursosDisponibles,
    CrearInscripcion,
    verCursosDisponibles,
    CambioEstadoCurso,
    CambiarEstadoCurso,
    ListarCursosInscripciones,
    eliminarinscripto
}