const btn_baja = document.getElementById("baja_productos");

btn_baja.addEventListener("click", function(){
    container_form.innerHTML = html_baja_producto;
    const datos = {
        id_producto: document.getElementById("id_producto"),
        btn_baja: document.getElementById("btn_baja"),
        btn_cancelar: document.getElementById("cancelar")
    };
    datos.btn_cancelar.onclick = ()=>{
        container_form.innerHTML = "";
    };
    datos.btn_baja.onclick = async()=>{
        const solicitud = new Request(URL_PRODUCTOS+"/"+datos.id_producto.value, {
            method: "Delete",
            withCredentials: true,
            credentials: "include",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          });
          const respuesta = await fetch(solicitud);
          
          if(!respuesta.ok){
            alert("Algo salio mal al eliminar el producto");
        }
        else{
            alert("Se ha eliminado el producto");
        }
    }
});

const html_baja_producto = `
<h2>Baja Producto</h2>
          <div class="form-row col-8">
            <div class="mb-3 col-4">
              <label for="id_producto" class="form-label">Codigo del Producto</label>
              <input type="text" class="form-control" id="id_producto">
            </div>
          </div>
          <div class="form-row col-6 py-3">
            <button class="btn btn-primary col-2" id="btn_baja">Eliminar</button>
            <button class="btn btn-danger col-2" id="cancelar">Cancelar</button>
          </div>  
`

const btn_editar = document.getElementById("edit_productos");

btn_editar.addEventListener("click", function(){
  container_form.innerHTML = html_edit_producto;
  const datos = {
    btn_cancelar: document.getElementById("btn_cancelar"),
    btn_guardar: document.getElementById("btn_guardar"),
    lst_productos: document.getElementById("lista_productos"),
    txt_productos: document.getElementById("txt_productos"),
    lst_proveedores: document.getElementById("lista_proveedores"),
    txt_proveedores: document.getElementById("txt_proveedores"),
    txt_descripcion: document.getElementById("descripcion_producto"),
    txt_precio: document.getElementById("producto_precio_venta"),
    txt_precio_compra: document.getElementById("producto_precio_compra"),
    cbo_tipo_producto: document.getElementById("cbo_tipo_producto"),
    id_proveedor: "",
    id_producto: ""
  };
  // Cargar lista productos
  datos.txt_productos.onmouseover = async ()=>{
    if(datos.lst_productos.options[0]===undefined){
      const solicitud = new Request(URL_PRODUCTOS_SUCURSAL+""+localStorage.getItem("sucursal_elegida"), {
        method: "Get",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      const respuesta = await fetch(solicitud);
      const productos = await respuesta.json();
    
      if(!respuesta.ok){
          alert("Algo salio mal al cargar los productos");
      }
      else{
        
          for (let dato of productos) {
            let nueva_opcion = document.createElement("option");
            nueva_opcion.id = dato.producto.id_producto;
            nueva_opcion.value = dato.producto.descripcion;
            datos.lst_productos.appendChild(nueva_opcion);
            }
      }
    }
  };
  // Buscar producto
  datos.txt_productos.onchange = async()=>{
    let id_producto = "";
    for(let i = 0; datos.lst_productos.options.length > i; i++){
      if (datos.lst_productos.options[i].value === datos.txt_productos.value){
        id_producto= datos.lst_productos.options[i].id;
        datos.id_producto = id_producto;
      }
    }
    if(id_producto !== ""){
      const solicitud = new Request(URL_PRODUCTOS_SUCURSAL_UNICO+"/"+localStorage.getItem("sucursal_elegida")+"/"+id_producto, {
        method: "Get",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      const respuesta = await fetch(solicitud);
      const producto = await respuesta.json();
    
      if(!respuesta.ok){
          alert("Algo salio mal al cargar los productos");
      }
      else{
        datos.txt_descripcion.value = producto.producto.descripcion;
        datos.txt_precio.value = producto.producto.precio;
        datos.txt_precio_compra.value = producto.producto.precio_compra;
        datos.id_proveedor = producto.producto.id_proveedor;
        datos.cbo_tipo_producto.value = producto.producto.id_tipo_producto
      }
    }
  };

  // Buscar Proveedor
  datos.txt_proveedores.onclick = async ()=>{
    if(datos.lst_proveedores.options[0]===undefined){
      if(datos.id_proveedor !== ""){
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
              datos.lst_proveedores.appendChild(nueva_opcion);
            }
        }
      }else{
        alert("No se selecciono ningun producto");
      }
    }
  };
  // Editar
  datos.btn_guardar.onclick = async ()=>{
    let id_proveedor = "";
    for(let i = 0; datos.lst_proveedores.options.length > i; i++){
      if (datos.lst_proveedores.options[i].value === datos.txt_proveedores.value){
        id_proveedor = datos.lst_proveedores.options[i].id;
        datos.id_proveedor = id_proveedor;
      }
    }
    const edit = {
      descripcion: datos.txt_descripcion.value,
      precio: datos.txt_precio.value,
      precio_compra: datos.txt_precio_compra.value,
      id_tipo_producto: datos.cbo_tipo_producto.value,
      id_proveedor: datos.id_proveedor,
      id_sucursal: localStorage.getItem("sucursal_elegida")
    }
    const solicitud = new Request(URL_PRODUCTOS+"/"+datos.id_producto, {
      method: "Put",
      withCredentials: true,
      credentials: "include",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(edit)
    });
    const respuesta = await fetch(solicitud);
    const proveedor = await respuesta.json();
  
    if(!respuesta.ok){
        alert("Algo salio mal al editar el producto");
    }
    else{
         alert("Se ha editado el producto");
    }
  };

  // Cancelar
  datos.btn_cancelar.onclick = async ()=>{
    container_form.innerHTML = "";
  };
});


const html_edit_producto = `
<h2 id="titulo-form">Editar Producto</h2>
<div class="form-row col-8">
  <div class="mb-3 col-10">

    <label for="txt_productos" class="form-label">Buscar Producto</label>
    <input class="form-control" list="lista_productos" id="txt_productos" placeholder="Descripcion producto">
    <datalist id="lista_productos">
      
    </datalist>
  </div>
</div>
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
