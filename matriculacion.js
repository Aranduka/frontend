// Restriccion de token

if (!localStorage.getItem('token')) {
    alert('No esta autorizado');
    window.location = "/";
}

// URL 

const url_cursos = "http://localhost:8000/cursos";
const url_matriculacion = "http://localhost:8000/matriculacion";
const url_contratos = "http://localhost:8000/contratos";
const url_instituciones = "http://localhost:8000/instituciones";
const url_alumnos = "http://localhost:8000/alumnos";

document.addEventListener('DOMContentLoaded', function () {
    listar_cursos();
    var elems = document.querySelectorAll('#cursos');
    var instances = M.FormSelect.init(elems);
});

// Datos Formularios

const form_ci_alumno = document.getElementById("alumno_cedula");
const form_nombre_alumno = document.getElementById("nombre_alumno");
const form_apellido_alumno = document.getElementById("apellido_alumno");
const form_ci_encargado = document.getElementById("cedula_encargado");
const form_nombre_encargado = document.getElementById("nombre_encargado");
const form_apellido_encargado = document.getElementById("apellido_encargado");
const form_cursos = document.getElementById("cursos");
const form_instituciones = document.getElementById("instituciones");
const form_id_alumno = document.getElementById("id_alumno");
const form_id_encargado = document.getElementById("id_encargado");

// Boton Buscar
// Crear un campo no visible en el form para acceder a la propiedad id_alumno
const btn_buscar_alumno = document.getElementById("buscar_alumno");
btn_buscar_alumno.addEventListener("click", function (e) {
    buscar_alumno(form_ci_alumno.value);
});

const buscar_alumno = async (cedula) => {

    const solicitud = new Request(
        url_alumnos + "/" + cedula,
        {
            method: 'Get',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token"),
                'Content-Type': 'application/json'
            }
        });

    const respuesta = await fetch(solicitud);
    const datos = await respuesta.datos
    if (!respuesta.ok) {
        alert(datos.detail);
    }
    else {
        // Cargar datos del alumno
    }
};

// Boton Cancelar

const btn_cancelar = document.getElementById("cancelar_matricula");
btn_cancelar.addEventListener("click", function (e) {
    limpiar_campos();
});

function limpiar_campos() {
    form_ci_alumno.value = "";
    form_nombre_alumno.value = "";
    form_apellido_alumno.value = "";
    form_nombre_encargado.value = "";
    form_apellido_encargado.value = "";
    form_cursos.value = "";
    form_instituciones.value = "";
}

//Listar Cursos

const listar_cursos = async () => {
    const solicitud = new Request(
        url_cursos + "/" + form_instituciones.value,
        {
            method: 'Get',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token"),
                'Content-Type': 'application/json'
            }
        });

    const respuesta = await fetch(solicitud);
    const cursos = await respuesta.json();

    if (!respuesta.ok) {
        alert("Algo fallo al listar los cursos");
    }
    else {
        const selector = document.getElementById("cursos");
        for (let curso of cursos) {
            let nueva_opcion = document.createElement("option");
            nueva_opcion.value = curso.id_curso
            nueva_opcion.text = curso.descripcion + " " + curso.seccion + " " + curso.turno;
            selector.appendChild(nueva_opcion);
        }
    }
};

// Listar Instituciones

const listar_instituciones = async () => {

    const solicitud = new Request(
        url_instituciones,
        {
            method: 'Get',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token"),
                'Content-Type': 'application/json'
            }
        });

    const respuesta = await fetch(solicitud);
    const datos = await respuesta.json();
    if (!respuesta.ok) {
        alert(datos.detail);
    }
    else {
        // lista instituciones
    }

};

// Matricula

const btn_guardar_matricula = document.getElementById("guardar_matricula");

btn_guardar_matricula.addEventListener("click", function (e) {
    guardar_matricula();
});

const guardar_matricula = async () => {
    const parametros = {
        "id_alumno": form_id_alumno.value,
        "id_encargado": 300,
        "fecha_inscripcion": "2022-02-01",
        "id_curso": 1,
        "id_institucion": 1
    }
    const solicitud = new Request(url_matriculacion, {
        method: 'Post',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(parametros)
    });

    const respuesta = await fetch(solicitud);
    const datos = await respuesta.json();
    if (!respuesta.ok) {
        alert("Error al intentar ingresar Matricula");
    }
    else {
        alert(datos.mensaje)
        alert(datos.url)
        const texto = `<a id="btn_descarga" href="${url_contratos}/${datos.id_matricula}" id="link_contrato">Descargar Contrato</a>`;
        const div_descargar = document.getElementById("descarga");
        div_descargar.innerHTML = texto;
        const link = document.getElementById("link_contrato");

        link.addEventListener("click", function (e) {
            limpiar_campos();

        });

    }
};


