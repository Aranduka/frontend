// Restriccion de token

if (!localStorage.getItem("token")) {
  alert("No esta autorizado");
  window.location = "/";
}

// Iniciar la pagina

document.addEventListener("DOMContentLoaded", function () {
    cargar_titulo();
    $('#datepicker').datepicker({
        
    });
});

const cargar_titulo = () => {
  const sucursales = JSON.parse(localStorage.getItem("sucursales"));
  const nombre_sucursal = sucursales.filter((elem) => {
    if (elem.id_institucion == localStorage.getItem("sucursal_elegida")) {
      return elem;
    }
  });
  const titulo = document.getElementById("sucursal");
  titulo.innerHTML = `${nombre_sucursal[0].descripcion}`;
};

// seleccionar boton y espacio
const btn_agregar_tutor = document.getElementById("add_tutor");
const container_form = document.getElementById("contenedor");

btn_agregar_tutor.addEventListener("click", function(){
    container_form.innerHTML = form_html;
});

// html a ser insertado
const form_html = `<h2 id="titulo-form">Agregar Tutor</h2>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="nombre_tutor" class="form-label">Nombre</label>
    <input type="text" class="form-control" id="nombre_tutor">
  </div>
  <div class="mb-3 col-4">
    <label for="apellido_tutor" class="form-label">Apellido</label>
    <input type="password" class="form-control" id="apellido_tutor">
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="cedula_tutor" class="form-label">Cedula</label>
    <input type="text" class="form-control" id="cedula_tutor">
  </div>
  <div class="mb-3 col-4">
    <label for="telefono_tutor" class="form-label">Telefono</label>
    <input type="password" class="form-control" id="telefono_tutor">
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="direccion_tutor" class="form-label">Direccion</label>
    <input type="text" class="form-control" id="direccion_tutor">
  </div>
  <div class="mb-3 col-4">
    <label for="nacionalidad_tutor" class="form-label">Nacionalidad</label>
    <select class="form-select" aria-label="Default select example" id="nacionalidad_tutor">
      <option value="1">Paraguaya</option>
      <option value="2">Argentina</option>
      <option value="3">Brasileña</option>
    </select>
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="nacionalidad_tutor" class="form-label">Sexo</label>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="sexo" id="masculino" value="M">
      <label class="form-check-label" for="masculino">
        Masculino
      </label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="sexo" id="femenino" value="F">
      <label class="form-check-label" for="femenino">
        Femenino
      </label>
    </div>
  </div>
  <div class="mb-3 col-4">
    <label for="nacionalidad_tutor" class="form-label">Parentezco</label>
    <select class="form-select" aria-label="Default select example" id="nacionalidad_tutor">
      <option value="1">Madre</option>
      <option value="2">Padre</option>
      <option value="3">Abuelo</option>
      <option value="4">Abuela</option>
      <option value="5">Primo</option>
      <option value="6">Hermano</option>
      <option value="7">Tutor</option>
    </select>
  </div>
</div>
<div class="form-row col-8">
  <button class="btn btn-primary col-2">Guardar</button>
  <button class="btn btn-danger col-2">Cancelar</button>
</div>`;


