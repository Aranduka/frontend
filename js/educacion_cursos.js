const btn_add_curso = document.getElementById("add_curso");
const form_container_cursos = document.getElementById("contenedor");

let lista_materia = []

btn_add_curso.addEventListener("click", function(){
    form_container_cursos.innerHTML = form_curso_insert;

    const agregar_curso = {
        descripcion_curso: document.getElementById("descripcion_curso"),
        cbo_turnos: document.getElementById("turnos"),
        cbo_secciones: document.getElementById("secciones"),
        cupos: document.getElementById("cupos"),
        precio: document.getElementById("precio_curso"),
        btn_agregar_materia: document.getElementById("agregar_materia"),
        cbo_materia: document.getElementById("materias"),
        btn_guardar_curso: document.getElementById("guardar_curso"),
        btn_cancelar_curso: document.getElementById("cancelar_curso"),
        chips_container: document.getElementById("chips_materia_container")
    }

    agregar_curso.cbo_materia.onmouseover = async ()=>{
        if (agregar_curso.cbo_materia.options[0]===undefined){

            const solicitud = new Request(URL_MATERIAS, {
              method: "Get",
              withCredentials: true,
              credentials: "include",
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
            });
            const respuesta = await fetch(solicitud);
            const datos = await respuesta.json();
          
            if(!respuesta.ok){
                alert("Algo salio mal al cargar las materias");
            }
            else{
                for (let dato of datos) {
                    let nueva_opcion = document.createElement("option");
                    nueva_opcion.value = dato.id_materia;
                    nueva_opcion.text = dato.descripcion;
                    agregar_curso.cbo_materia.appendChild(nueva_opcion);
                  }
            }
          }
    };

    agregar_curso.btn_agregar_materia.onclick = ()=> {
        let indice = agregar_curso.cbo_materia.value;
        let valor = agregar_curso.cbo_materia.options[agregar_curso.cbo_materia.selectedIndex].text;
        crear_chip(indice, valor, agregar_curso.chips_container, lista_materia);
        lista_materia.push(agregar_curso.cbo_materia.value);
    };

    agregar_curso.btn_guardar_curso.onclick = ()=>{
      crear_curso(agregar_curso);
    };

    agregar_curso.btn_cancelar_curso.onclick = ()=>{
      form_container_cursos.innerHTML = "";
    };
});

const crear_curso = async (datos_cursos)=>{
  let item_curso = {
    descripcion: datos_cursos.descripcion_curso.value,
    seccion: datos_cursos.cbo_secciones.value,
    turno: datos_cursos.cbo_turnos.value,
    id_institucion: localStorage.getItem("sucursal_elegida"),
    id_materias: lista_materia,
    cupos: datos_cursos.cupos.value,
    precio: datos_cursos.precio.value,
    id_tipo_producto: 1,
    producto: datos_cursos.descripcion_curso.value + " " + datos_cursos.cbo_secciones.value + " "+ datos_cursos.cbo_turnos.value
  };
  const solicitud = new Request(URL_CURSOS, {
    method: 'Post',
    withCredentials: true,
    credentials: 'include',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem("token"),
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(item_curso)
  });
  
  const respuesta = await fetch(solicitud);
  const respuesta_cursos = await respuesta.json();
  if (!respuesta.ok) {
    alert("Error al intentar agregar alumno");
    console.log(respuesta_cursos.detail);
  }else{
    alert("Se ha insertado el curso: " + item_curso.producto);
  }
}

const form_curso_insert = `<h2 id="titulo-form">Agregar Curso</h2>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="descripcion_curso" class="form-label">Nombre del Curso</label>
    <input type="text" class="form-control" id="descripcion_curso">
  </div>
  <div class="mb-3 col-4">
    <label for="turnos" class="form-label">Seleccionar Turno</label>
    <select class="form-select" aria-label="Default select example" id="turnos">
      <option value="TM">Turno Mañana</option>
      <option value="TT">Turno Tarde</option>
    </select>
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="secciones" class="form-label">Seleccionar Turno</label>
    <select class="form-select" aria-label="Default select example" id="secciones">
      <option value="A">Seccion A</option>
      <option value="B">Seccion B</option>
      <option value="C">Seccion C</option>
    </select>
  </div>
  <div class="mb-3 col-4">
    <label for="cupos" class="form-label">Cupos</label>
    <input type="text" class="form-control" id="cupos">
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="precio_curso" class="form-label">Precio</label>
    <input type="text" class="form-control" id="precio_curso">
  </div>
  <div class="mb-3 col-4">
    
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="materias" class="form-label">Materias</label>
    <select class="form-select" aria-label="Default select example" id="materias">
     
    </select>
  </div>
  <div class="mb-3 col-4">
    <button class="btn btn-secondary add-btn" id="agregar_materia">Agregar Materia</button>
  </div>
</div>
<div class="form-row col-8">
  <div class="form-row mb-3 col-8" id="chips_materia_container">
   
  </div>
</div>
<div class="form-row col-8 py-3">
  <button class="btn btn-primary col-2" id="guardar_curso">Guardar</button>
  <button class="btn btn-danger col-2" id="cancelar_curso">Cancelar</button>
</div>`;