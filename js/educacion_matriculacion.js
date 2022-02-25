// URL
const URL_CURSOS = "http://localhost:8000/cursos";
const URL_CONTRATOS = "http://localhost:8000/contratos";
const URL_MATRICULACION = "http://localhost:8000/matriculacion";

const btn_inscribir = document.getElementById("inscribir");
const container_form_matriculacion = document.getElementById("contenedor");


btn_inscribir.addEventListener("click", function(){
   container_form_matriculacion.innerHTML = form_matriculacion;
   const form_matricula = {
       id_alumno_matriculacion: document.getElementById("id_alumno"),
       id_encargado_matriculacion: document.getElementById("id_encargado"),
       cedula_alumno: document.getElementById("cedula_alumno"),
       btn_buscar_alumno: document.getElementById("buscar_alumno"),
       nombre_alumno: document.getElementById("nombre_alumno"),
       apellido_alumno: document.getElementById("apellido_alumno"),
       cedula_tutor: document.getElementById("cedula_tutor"),
       nombre_tutor: document.getElementById("nombre_tutor"),
       precio_febrero: document.getElementById("precio_febrero"),
       cbo_cursos: document.getElementById("cursos"),
       btn_guardar_matricula: document.getElementById("crear_matricula"),
       btn_cancelar_matriculacion: document.getElementById("cancelar_matriculacion")
   }
   form_matricula.btn_buscar_alumno.onclick = ()=>{
    buscar_alumno(cedula_alumno.value, form_matricula);
   };

   form_matricula.cbo_cursos.onmouseover = ()=>{
    listar_cursos(localStorage.getItem("sucursal_elegida"), form_matricula);
   }

   form_matricula.btn_cancelar_matriculacion.onclick = () => {
    container_form_matriculacion.innerHTML = "";
   };

   form_matricula.btn_guardar_matricula.onclick = () => {
    guardar_matricula(form_matricula);
   };
});

const listar_cursos = async (id, form) => {
    const solicitud = new Request(
        URL_CURSOS + "/" + id,
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
        
        for (let curso of cursos) {
            let nueva_opcion = document.createElement("option");
            nueva_opcion.value = curso.id_curso;
            nueva_opcion.text = curso.descripcion + " " + curso.seccion + " " + curso.turno;
            form.cbo_cursos.appendChild(nueva_opcion);
        }
    }
};

const buscar_alumno = async (cedula, form) => {

    const solicitud = new Request(
        URL_ALUMNOS + "/" + cedula,
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
    const alumno = await respuesta.json();
    
    if (!respuesta.ok) {
        alert(alumno.detail);
    }
    else {
        form.id_alumno_matriculacion.value = alumno.id_persona;
        form.nombre_alumno.value = alumno.nombre;
        form.apellido_alumno.value = alumno.apellido;
        form.cedula_tutor.value = alumno.encargado.cedula;
        form.nombre_tutor.value = ""+alumno.encargado.nombre+" "+alumno.encargado.apellido;
        form.id_encargado_matriculacion.value = alumno.encargado.id_persona;
    }
};

const guardar_matricula = async (form) => {
    const link_contrato = document.getElementById("link_contrato");
    const parametros = {
        "id_alumno": form.id_alumno_matriculacion.value,
        "id_encargado": form.id_encargado_matriculacion.value,
        "id_curso": form.cbo_cursos.value,
        "id_institucion": localStorage.getItem("sucursal_elegida"),
        "precio_febrero": form.precio_febrero.value
    }
    const solicitud = new Request(URL_MATRICULACION, {
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
    const matricula = await respuesta.json();
    if (!respuesta.ok) {
        alert("Error al intentar ingresar Matricula");
    }
    else {
        alert("Se incribio al alumno " + form.nombre_alumno.value + " " + form.apellido_alumno.value);
        link_contrato.href = `${URL_CONTRATOS}/${matricula.cod}`;
        link_contrato.download = "Contrato";
        link_contrato.style.display = "block";
        link_contrato.onclick = ()=>{
             link_contrato.style.display = "none";
        };
    }
}

const form_matriculacion = `
<h2 id="titulo-form">Inscribir Alumno</h2>
<input type="hidden" id="id_alumno">
<input type="hidden" id="id_encargado">
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="cedula_alumno" class="form-label">Cedula del Alumno</label>
    <input type="text" class="form-control" id="cedula_alumno">   
  </div>
  <div class="mb-3 col-4">
    <button class="btn btn-secondary add-btn" id="buscar_alumno">
      Buscar Alumno
    </button>  
  </div>
</div>  
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="nombre_alumno" class="form-label">Nombre del Alumno</label>
    <input type="text" class="form-control" id="nombre_alumno" disabled>   
  </div>
  <div class="mb-3 col-4">
    <label for="apellido_alumno" class="form-label">Apellido del Alumno</label>
    <input type="text" class="form-control" id="apellido_alumno" disabled> 
  </div>
</div>  
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="cedula_tutor" class="form-label">Cedula del Tutor</label>
    <input type="text" class="form-control" id="cedula_tutor" disabled>   
  </div>
  <div class="mb-3 col-4">
    <label for="nombre_tutor" class="form-label">Nombre del Tutor</label>
    <input type="text" class="form-control" id="nombre_tutor" disabled>
  </div>
</div>  
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="cursos" class="form-label">Seleccionar Curso</label>
    <select class="form-select" aria-label="Default select example" id="cursos">
    </select>
  </div>
  <div class="mb-3 col-4">
    <label for="precio_febrero" class="form-label">Precio Febrero</label>
    <input type="text" class="form-control" id="precio_febrero">
  </select>
</div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-2 py-3">
    <button class="btn btn-primary" id="crear_matricula">
      Guardar
    </button>
    <div id="descarga">
        <a href="" id="link_contrato" style="display: none;">Descargar Contrato</a>
    </div>
  </div>
  <div class="mb-3 col-2 py-3">
    <button class="btn btn-danger" id="cancelar_matriculacion">
      Cancelar
    </button>
  </div>
</div>
`;