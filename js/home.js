// Restriccion de token

if (!localStorage.getItem("token")) {
  alert("No esta autorizado");
  window.location = "/";
}

//Url

//LocalStorage

const nombre_container = document.getElementById("nombre_usuario");
nombre_container.innerHTML = `<h4>${localStorage.getItem("nombre")}</h4>`;

// Listar Sucursales por usuario
const cbo_seleccionar_sucursal = document.getElementById("sucursales");

// Iniciar la pagina
document.addEventListener("DOMContentLoaded", function () {
  const obj_sucursal = JSON.parse(localStorage.getItem("sucursales"));
  for (let dato of obj_sucursal) {
    let nueva_opcion = document.createElement("option");
    nueva_opcion.value = dato.id_institucion;
    nueva_opcion.text = dato.descripcion;
    cbo_seleccionar_sucursal.appendChild(nueva_opcion);
  }
});

//Botones para redireccionar

const rrhh = document.getElementById("rrhh");
const educacion = document.getElementById("educacion");
const inventario = document.getElementById("inventario");
const facturacion = document.getElementById("facturacion");
const libro = document.getElementById("libro");
const compra = document.getElementById("compra");

educacion.addEventListener("click", function () {
  if(cbo_seleccionar_sucursal.value !== ""){
    localStorage.setItem("sucursal_elegida", cbo_seleccionar_sucursal.value);
    window.location = "/html/educacion.html";
  }else{
    alert("No has elegido ninguna sucursal");
  }
});

facturacion.addEventListener("click", function () {
    if(cbo_seleccionar_sucursal.value !== ""){
        localStorage.setItem("sucursal_elegida", cbo_seleccionar_sucursal.value);
        localStorage.setItem("nombre_sucursal_elegida", cbo_seleccionar_sucursal.options[cbo_seleccionar_sucursal.selectedIndex].text);
        window.location = "/html/facturacion.html";
      }else{
        alert("No has elegido ninguna sucursal");
      }
});

inventario.addEventListener("click", function(){
    if(cbo_seleccionar_sucursal.value !== ""){
      localStorage.setItem("sucursal_elegida", cbo_seleccionar_sucursal.value);
      localStorage.setItem("nombre_sucursal_elegida", cbo_seleccionar_sucursal.options[cbo_seleccionar_sucursal.selectedIndex].text);
      window.location = "/html/inventario.html";
    }else{
      alert("No has elegido ninguna sucursal");
    }
});


