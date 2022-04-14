// Restriccion de token

if (!localStorage.getItem("token")) {
    alert("No esta autorizado");
    window.location = "/";
  }
  
  // URL 
 const URL_PRODUCTOS = "http://192.168.100.15:8000/productos";
 const URL_PRODUCTOS_SUCURSAL = "http://192.168.100.15:8000/productos_sucursal/";
 const URL_PRODUCTOS_SUCURSAL_UNICO = "http://192.168.100.15:8000/productos_sucursal_buscar";
 const URL_PROVEEDORES = "http://192.168.100.15:8000/proveedores";
  
  // Iniciar la pagina
  
  document.addEventListener("DOMContentLoaded", function () {
    cargar_titulo();
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
  
  const container_form = document.getElementById("contenedor");

  const add_productos = document.getElementById("add_productos");

  // Evento que abre el formulario de creacion de producto
  add_productos.addEventListener("click", function(){
    
    container_form.innerHTML = html_add_producto;

    const datos_producto = {
      txt_descripcion: document.getElementById("descripcion_producto"),
      txt_precio_venta: document.getElementById("producto_precio_venta"),
      txt_precio_compra: document.getElementById("producto_precio_compra"),
      cbo_tipo_producto: document.getElementById("cbo_tipo_producto"),
      lst_proveedores: document.getElementById("lista_proveedores"),
      txt_proveedor: document.getElementById("txt_proveedores"),
      id_proveedor: "",
      btn_guardar: document.getElementById("btn_guardar"),
      btn_cancelar: document.getElementById("btn_cancelar")
    };

    datos_producto.txt_proveedor.onmouseover = async function(){
      if(datos_producto.lst_proveedores.options[0]===undefined){
        const solicitud = new Request(URL_PROVEEDORES, {
          method: "Get",
          withCredentials: true,
          credentials: "include",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        });
        const respuesta = await fetch(solicitud);
        const proveedores = await respuesta.json();
      
        if(!respuesta.ok){
            alert("Algo salio mal al cargar los proveedores");
        }
        else{
            for (let dato of proveedores) {
              let nueva_opcion = document.createElement("option");
              nueva_opcion.value = dato.nombre;
              nueva_opcion.id = dato.id_proveedor;
              datos_producto.lst_proveedores.appendChild(nueva_opcion);
            }
        }
      }
    };

    // Boton de guardado
    datos_producto.btn_guardar.onclick = function(){
      insertar_productos(datos_producto);
    };

    datos_producto.btn_cancelar.onclick = function(){
      container_form.innerHTML = "";
    };

  });

  // Inserta el nuevo producto
  const insertar_productos = async function(datos){
    for(let i = 0; datos.lst_proveedores.options.length > i; i++){
      if (datos.lst_proveedores.options[i].value === datos.txt_proveedor.value){
        datos.id_proveedor = datos.lst_proveedores.options[i].id;
      }
    }
    let params = {
      descripcion: datos.txt_descripcion.value,
      precio:datos.txt_precio_venta.value,
      id_tipo_producto: cbo_tipo_producto.value,
      id_sucursal: localStorage.getItem("sucursal_elegida"),
      id_proveedor: datos.id_proveedor,
      precio_compra: datos.txt_precio_compra.value
    }
    const solicitud = new Request(URL_PRODUCTOS, {
      method: 'Post',
      withCredentials: true,
      credentials: 'include',
      headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    const respuesta = await fetch(solicitud);
    const producto_add = await respuesta.json();
    if (!respuesta.ok) {
        alert("Error al intentar agregar producto");
        console.log(producto_add.detail);
    }else{
        alert("Se ha insertado el producto: " + params.descripcion);
    }
  };


  // HTML a insertar 
  const html_add_producto = `
  <h2 id="titulo-form">Agregar Producto</h2>
          <div class="form-row col-8">
            <div class="mb-3 col-4">
              <label for="descripcion_producto" class="form-label">Descripcion</label>
              <input type="text" class="form-control" id="descripcion_producto">
            </div>
            <div class="mb-3 col-4">
              <label for="producto_precio_venta" class="form-label">Precio Venta</label>
              <input type="text" class="form-control" id="producto_precio_venta">
            </div>
          </div>
          <div class="form-row col-8">
            <div class="mb-3 col-4">
              <label for="producto_precio_compra" class="form-label">Precio Compra</label>
              <input type="text" class="form-control" id="producto_precio_compra">
            </div>
            <div class="mb-3 col-4">
              <label for="cbo_tipo_producto" class="form-label">Tipo de Producto</label>
              <select class="form-select" aria-label="Default select example" id="cbo_tipo_producto">
                <option value="2">Uniformes</option>
                <option value="3">Libros</option>
                <option value="4">Santeria</option>
              </select>
            </div>
          </div>
          <div class="form-row col-8">
            <div class="mb-3 col-10">

              <label for="txt_proveedores" class="form-label">Buscar Proveedor</label>
              <input class="form-control" list="lista_proveedores" id="txt_proveedores" placeholder="Nombre proveedor">
              <datalist id="lista_proveedores">
                
              </datalist>
            </div>
          </div>
          <div class="form-row col-8" style="margin-left: 150px; margin-top: 25px;">
            <div class="mb-3 col-4">
              <button class="btn btn-primary" id="btn_guardar">Guardar</button>
            </div>
            <div class="mb-3 col-4">
              <button class="btn btn-danger" id="btn_cancelar">Cancelar</button>
            </div>
          </div>
  `;