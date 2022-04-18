const dominio = "sistema-app-test1.herokuapp.com";
// Restriccion de token

if (!localStorage.getItem("token")) {
    alert("No esta autorizado");
    window.location = "/";
}
  
  // URL 
 const URL_TRANSACCION_COMPRA = "https://"+dominio+"/transaccion_compra"
 const URL_PRODUCTOS_SUCURSAL = "https://"+dominio+"/productos_sucursal";
 const URL_TRANSACCION_AJUSTE = "https://"+dominio+"/transaccion_ajuste";
 const URL_ANULAR_TRANSACCION = "https://"+dominio+"/transacciones";
 const URL_PROVEEDORES = "https://"+dominio+"/proveedores";
 const URL_PRODUCTOS_PROVEEDORES = "https://"+dominio+"/productos_proveedor";
  
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
  const btn_add_compra = document.getElementById("add_compra");

  // Al abrir el formulario de compra
  btn_add_compra.addEventListener("click", function(){
      container_form.innerHTML = html_producto_compra;
      const datos_compra = {
        txt_proveedor: document.getElementById("txt_proveedores"),
        lst_proveedores: document.getElementById("lista_proveedores"),
        txt_numero_factura: document.getElementById("numero_factura_compra"),
        txt_producto: document.getElementById("txt_productos"),
        lst_productos: document.getElementById("lista_productos"),
        txt_cantidad: document.getElementById("cantidad"),
        btn_agregar_detalle: document.getElementById("btn-agregar-producto"),
        btn_guardar: document.getElementById("guardar"),
        btn_cancelar: document.getElementById("cancelar"),
        txt_total: document.getElementById("total_precio"),
        id_proveedor: "",
        id_sucursal: localStorage.getItem("sucursal_elegida")
      };

      // Cargar Proveedores
      datos_compra.txt_proveedor.onmouseover = async ()=>{
        if (datos_compra.lst_proveedores.options[0]===undefined){
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
                datos_compra.lst_proveedores.appendChild(nueva_opcion);
                }
          }
        }
      };
      // Cargar Productos
      datos_compra.txt_proveedor.onchange = async ()=>{
        datos_compra.lst_productos.innerHTML = "";
        let id_proveedor = "";
        for(let i = 0; datos_compra.lst_proveedores.options.length > i; i++){
          if (datos_compra.lst_proveedores.options[i].value === datos_compra.txt_proveedor.value){
            id_proveedor = datos_compra.lst_proveedores.options[i].id;
            datos_compra.id_proveedor = id_proveedor;
          }
        }
      
        const solicitud = new Request(URL_PRODUCTOS_PROVEEDORES+"/"+id_proveedor, {
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
              nueva_opcion.value = `${dato.producto.descripcion}`;
              nueva_opcion.id = dato.producto.id_producto;
              nueva_opcion.class = dato.producto.precio_compra;
              datos_compra.lst_productos.appendChild(nueva_opcion);
              }
        }
      };

      // Agregar al detalle
      datos_compra.btn_agregar_detalle.onclick = () =>{
        let id_producto = "";
        let precio_producto = "";
        for(let i = 0; datos_compra.lst_productos.options.length > i; i++){
          if (datos_compra.lst_productos.options[i].value === datos_compra.txt_producto.value){
            id_producto = datos_compra.lst_productos.options[i].id;
            precio_producto = datos_compra.lst_productos.options[i].class; 
          }
        }
        
        let btn = insertar_detalle_compra(datos_compra, id_producto, precio_producto);
        
        let fila = document.getElementsByClassName("fila_detalle");
        for (let i = 0; btn.length > i; i++){
          btn[i].onclick = ()=>{
            fila[i].remove();
            calcular_total_producto_compra(fila, datos_compra.txt_total);
          }
        }
        calcular_total_producto_compra(fila, datos_compra.txt_total);
      };

      // Cancelar
      datos_compra.btn_cancelar.onclick = function(){
        container_form.innerHTML = "";
      }

      // Guardar
      datos_compra.btn_guardar.onclick = function(){
        const compra_items = {
          id_sucursal: datos_compra.id_sucursal,
          id_proveedor: datos_compra.id_proveedor,
          nro_factura_proveedor: datos_compra.txt_numero_factura.value,
          detalle: []
        };
        const detalles = [];

        let fila = document.getElementsByClassName("fila_detalle");
        for (let i=0; fila.length > i; i++){
          let detalle_compra = {
            id_producto: "",
            cantidad: "",
            costo_compra: "",
            id_tipo_impuesto: 1
          };

          let hijo = fila[i].children;
          let precio_compra = hijo[1].innerHTML;
          let id_producto = hijo[4].value;
          let cantidad = hijo[2].innerHTML;
          detalle_compra.id_producto = id_producto;
          detalle_compra.cantidad = cantidad;
          detalle_compra.costo_compra = precio_compra;

          detalles.push(detalle_compra);
        }
        compra_items.detalle = detalles;
        console.log(compra_items);
        insertar_compra(compra_items);
      }
  });

  // Insertar Compra
const insertar_compra = async function(datos){
  const solicitud = new Request(URL_TRANSACCION_COMPRA, {
    method: 'Post',
    withCredentials: true,
    credentials: 'include',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem("token"),
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
    });
    const respuesta = await fetch(solicitud);
    const factura = await respuesta.json();
    if (!respuesta.ok) {
        alert(factura.detail);
        console.log(factura.detail);
    }else{
        alert("Se ha insertado la transaccion");
        
    }
}

  // Insertar Detalle
const insertar_detalle_compra = function(datos, id_producto, precio_compra){
  const tabla_detalle = document.getElementById("detalle_contenedor");
  tabla_detalle.innerHTML += `
  <tr class="fila_detalle">
  <th scope="row">${datos.txt_producto.value}</th>
  <td>${precio_compra}</td>
  <td>${datos.txt_cantidad.value}</td>
  <td><button class="btn btn-danger eliminar_detalle">Eliminar</button></td>
  <input type="hidden" value="${id_producto}"/>
  </tr> 
  `;
  let btn_eliminar_linea = document.getElementsByClassName("eliminar_detalle");

  return btn_eliminar_linea;
}

  // Calcular totales
const calcular_total_producto_compra = function(lineas, contenedor){
  let inicio = 0;
  let resultado = inicio;
  for(let i = 0; lineas.length > i; i++){
    let celda = lineas[i].cells
    console.log(celda[1].innerHTML)
    resultado += celda[1].innerHTML * celda[2].innerHTML
  }
  contenedor.innerHTML = resultado;
};



const html_producto_compra = `
<h2>Registro de compra</h2>
<div class="form-row col-10">
  <div class="mb-3 col-7">
    <label for="txt_proveedores" class="form-label">Buscar Proveedor</label>
    <input class="form-control" list="lista_proveedores" id="txt_proveedores" placeholder="Nombre proveedor">
    <datalist id="lista_proveedores">
  </div>
  <div class="mb-3 col-3">
    <label for="numero_factura_compra" class="form-label">Numero de Factura</label>
    <input type="text" class="form-control" id="numero_factura_compra">
  </div>
</div>
<div class="form-row col-10" style="margin-top: 30px;">
  <div class="mb-3 col-6">
    <label for="txt_productos" class="form-label">Buscar producto</label>
    <input class="form-control" list="lista_productos" id="txt_productos" placeholder="Nombre producto">
    <datalist id="lista_productos">
  </div>
  <div class="mb-3 col-1">
    <label for="cantidad" class="form-label">Cantidad</label>
    <input type="text" class="form-control" id="cantidad">
  </div>
  <div class="mb-3 col-3">
    <button class="btn btn-secondary add-btn" id="btn-agregar-producto">Agregar producto</button>
  </div>
</div>
<div id="detalle_table_contenedor" class="col-10" style="margin-top: 30px;">

  <table class="table">
    <thead>
      <tr>
        <th scope="col">Descripcion</th>
        <th scope="col">Precio Unitario</th>
        <th scope="col">Cantidad</th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody id="detalle_contenedor">
      
    </tbody>
  </table>
  
</div>
<div class="col-4" style="font-size: 20px; font-weight: bold;" > 
  Total: <span id="total_precio">0</span>
</div>
<div class="form-row col-10" style="margin-top: 60px;">
  <div class="col-2"> 
    <button class="btn btn-primary" id="guardar">Guardar</button>
  </div>
  
  <div class="col-2"> 
    <button class="btn btn-danger" id="cancelar">Cancelar</button>
  </div>
</div>
`;

const btn_anular_compra = document.getElementById("anular_compra");
btn_anular_compra.addEventListener("click", function(){
  container_form.innerHTML = html_anular_compra;
  const anular_transaccion = {
    txt_numero_transaccion: document.getElementById("numero_transaccion"),
    btn_anular: document.getElementById("anular"),
    btn_cancelar: document.getElementById("cancelar")
  }

  anular_transaccion.btn_anular.onclick = async function(){
    const solicitud = new Request(URL_ANULAR_TRANSACCION+"/"+anular_transaccion.txt_numero_transaccion.value, {
      method: 'Put',
      withCredentials: true,
      credentials: 'include',
      headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'Content-Type': 'application/json'
      }
      });
      const respuesta = await fetch(solicitud);
      const transaccion = await respuesta.json();
      if (!respuesta.ok) {
          alert(factura.detail);
          console.log(factura.detail);
      }else{
          alert("Se ha anulado la transaccion");
          
      }
  };
  anular_transaccion.btn_cancelar.onclick = function(){
    container_form.innerHTML = "";
  }

});

const html_anular_compra = `
<h2 style="margin-top: 30px;">Anular transaccion</h2>
<div class="form-row col-8">
  <div class="mb-3 col-4">
      <label for="numero_transaccion" class="form-label">Número de transacción</label>
      <input type="text" class="form-control" id="numero_transaccion">
  </div>
</div>
<div class="form-row col-6" style="margin-top: 30px;">
  <div class="mb-3 col-4" style="margin-left: 150px;">
      <button class="btn btn-primary" id="anular">Anular</button>
  </div>
  <div class="mb-3 col-4" style="margin-right: 50px;">
      <button class="btn btn-danger" id="cancelar">Cancelar</button>
  </div>
</div>
`;
