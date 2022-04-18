const URL_MATERIAS = "https://"+dominio+"/materias";

const add_alergias = document.getElementById("add_alergia");
const add_enfermedad = document.getElementById("add_enfermedad")
const add_materia = document.getElementById("add_materia");
const container_form_utiles = document.getElementById("contenedor");

add_alergias.addEventListener("click", function(){
    container_form_utiles.innerHTML = form_alergia_insert;

    const alergia_datos = {
        descripcion: document.getElementById("descripcion_alergia"),
        btn_guardar: document.getElementById("guardar_alergia")
    }

    alergia_datos.btn_guardar.onclick = ()=>{
        guardar_utiles(URL_ALERGIAS, alergia_datos)
    };

});

add_enfermedad.addEventListener("click", function(){
    container_form_utiles.innerHTML = form_enfermedad_insert;

    const enfermedad_datos = {
        descripcion: document.getElementById("descripcion_enfermedad"),
        btn_guardar: document.getElementById("guardar_enfermedad")
    }

    enfermedad_datos.btn_guardar.onclick = ()=>{
        guardar_utiles(URL_ENFERMEDADES, enfermedad_datos)
    };
});

add_materia.addEventListener("click", function(){
    container_form_utiles.innerHTML = form_materia_insert;

    const materia_datos = {
        descripcion: document.getElementById("descripcion_materia"),
        btn_guardar: document.getElementById("guardar_materia")
    }

    materia_datos.btn_guardar.onclick = ()=>{
        guardar_utiles(URL_MATERIAS, materia_datos)
    };

});

const guardar_utiles  = async (url, datos)=>{
    let items_utiles = {descripcion: datos.descripcion.value};
    const solicitud = new Request(url, {
        method: 'Post',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(items_utiles)
    });
    const respuesta = await fetch(solicitud);
    const json_utiles = await respuesta.json();
    if (!respuesta.ok) {
        alert("Error al intentar insertar item");
    }
    else {
        alert("Se ha insertado el item " + items_utiles.descripcion);
    }
};

const form_alergia_insert = `
<h2 id="titulo-form">Agregar Alergia</h2>
<div class="form-row col-8">
<div class="mb-3 col-4">
    <label for="descripcion_alergia" class="form-label">descripcion</label>
    <input type="text" class="form-control" id="descripcion_alergia">  
</div>
<div class="mb-3 col-4">
    <button class="btn btn-secondary add-btn" id="guardar_alergia">
    Guardar
    </button>
</div>
</div>
`;

const form_enfermedad_insert = `
<h2 id="titulo-form">Agregar Enfermedad de Base</h2>
<div class="form-row col-8">
<div class="mb-3 col-4">
    <label for="descripcion_enfermedad" class="form-label">descripcion</label>
    <input type="text" class="form-control" id="descripcion_enfermedad">  
</div>
<div class="mb-3 col-4">
    <button class="btn btn-secondary add-btn" id="guardar_enfermedad">
    Guardar
    </button>
</div>
</div>
`;

const form_materia_insert = `
<h2 id="titulo-form">Agregar Materia</h2>
<div class="form-row col-8">
<div class="mb-3 col-4">
    <label for="descripcion_materia" class="form-label">descripcion</label>
    <input type="text" class="form-control" id="descripcion_materia">  
</div>
<div class="mb-3 col-4">
    <button class="btn btn-secondary add-btn" id="guardar_materia">
    Guardar
    </button>
</div>
</div>
`;