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
    listar_instituciones();
    var elems = document.querySelectorAll('#cursos');
    var instances = M.FormSelect.init(elems);
});

// Datos Formularios

const form_ci_alumno = document.getElementById("alumno_cedula");
const form_nombre_alumno = document.getElementById("nombre_alumno");
const form_apellido_alumno = document.getElementById("apellido_alumno");
const form_ci_encargado = document.getElementById("encargado_cedula");
const form_nombre_encargado = document.getElementById("nombre_encargado");
const form_apellido_encargado = document.getElementById("apellido_encargado");
const form_cursos = document.getElementById("cursos");
const form_instituciones = document.getElementById("instituciones");
const form_id_alumno = document.getElementById("id_alumno");
const form_id_encargado = document.getElementById("id_encargado");

// Boton Buscar

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
    const datos = await respuesta.json();
    
    if (!respuesta.ok) {
        alert(datos.detail);
    }
    else {
        form_id_alumno.value = datos.id_persona;
        form_nombre_alumno. value = datos.nombre;
        form_apellido_alumno.value = datos.apellido;
        form_ci_encargado.value = datos.encargado.cedula;
        form_nombre_encargado.value = datos.encargado.nombre;
        form_apellido_encargado.value = datos.encargado.apellido;
        form_id_encargado.value = datos.encargado.id_persona;
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
    form_ci_encargado.value = "";
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
            nueva_opcion.value = curso.id_curso;
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
        const selector = document.getElementById("instituciones");
        for (let dato of datos) {
            let nueva_opcion = document.createElement("option");
            nueva_opcion.value = dato.id_institucion;
            nueva_opcion.text = dato.descripcion;
            selector.appendChild(nueva_opcion);
        }
    }

    form_instituciones.addEventListener("change", function(e){
        listar_cursos();
    });

};

// Matricula

const btn_guardar_matricula = document.getElementById("guardar_matricula");

btn_guardar_matricula.addEventListener("click", function (e) {
    guardar_matricula();
});

const guardar_matricula = async () => {
    const link_contrato = document.getElementById("link_contrato");
    const parametros = {
        "id_alumno": form_id_alumno.value,
        "id_encargado": form_id_encargado.value,
        // "fecha_inscripcion": "2022-02-01",
        "id_curso": form_cursos.value,
        "id_institucion": form_instituciones.value
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
        alert("Se incribio al alumno " + form_nombre_alumno.value)
        link_contrato.href = `${url_contratos}/${datos.cod}`;
        link_contrato.download = "Contrato";
        link_contrato.style.display = "block";
        link_contrato.addEventListener("click", function(e){
            limpiar_campos();
            link_contrato.style.display = "none";
        });
    }
};





