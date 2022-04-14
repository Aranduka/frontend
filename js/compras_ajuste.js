const btn_add_ajuste = document.getElementById("add_ajuste");

btn_add_ajuste.addEventListener("click", function(){
    container_form.innerHTML = html_ajuste;
    const datos_ajuste = {
        txt_productos: document.getElementById("txt_productos"),
        lst_productos: document.getElementById("lista_productos"),
        cbo_ajuste: document.getElementById("cbo_tipo_ajuste"),
        txt_descripcion: document.getElementById("descripcion"),
        btn_agregar_producto: document.getElementById("agregar_producto"),
        contendor_detalle: document.getElementById("detalle_contenedor"),
        btn_guardar: document.getElementById("guardar"),
        btn_cancelar: document.getElementById("cancelar"),
        txt_total: document.getElementById("total_precio"),
        id_sucursal: localStorage.getItem("sucursal_elegida"),
        txt_cantidad: document.getElementById("cantidad")
    };

    datos_ajuste.txt_productos.onmouseover = async function(){
      if(datos_ajuste.lst_productos.options[0]===undefined){
        const solicitud = new Request(URL_PRODUCTOS_SUCURSAL+"/"+datos_ajuste.id_sucursal, {
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
              datos_ajuste.lst_productos.appendChild(nueva_opcion);
              }
        }
      }
    };
    // Boton insertar detalle
    datos_ajuste.btn_agregar_producto.onclick = function(){
      let id_producto = "";
      let precio_producto = "";
      for(let i = 0; datos_ajuste.lst_productos.options.length > i; i++){
        if (datos_ajuste.lst_productos.options[i].value === datos_ajuste.txt_productos.value){
          id_producto = datos_ajuste.lst_productos.options[i].id;
          precio_producto = datos_ajuste.lst_productos.options[i].class; 
        }
      }
      let btn = agregar_detalle_ajuste(datos_ajuste, precio_producto, id_producto)
      let fila = document.getElementsByClassName("fila_detalle");
        for (let i = 0; btn.length > i; i++){
          btn[i].onclick = ()=>{
            fila[i].remove();
            calcular_total_producto_ajuste(fila, datos_ajuste.txt_total);
          }
        }
        calcular_total_producto_ajuste(fila, datos_ajuste.txt_total);
    };

    // Boton cancelar
    datos_ajuste.btn_cancelar.onclick = function(){
      container_form.innerHTML = "";
    };
    // Boton guardar 
    datos_ajuste.btn_guardar.onclick = function(){
      const ajuste = {
        id_sucursal: datos_ajuste.id_sucursal,
        id_tipo_ajuste: datos_ajuste.cbo_ajuste.value,
        descripcion: datos_ajuste.txt_descripcion.value,
        detalle: []
      }
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
      ajuste.detalle = detalles;
      console.log(ajuste);
      insertar_ajuste(ajuste);
    };
});
// Insertar ajuste
const insertar_ajuste = async function(datos){
  const solicitud = new Request(URL_TRANSACCION_AJUSTE, {
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
        alert("Se añadió el ajuste");
        
    }
}
// Insertar Detalle
const agregar_detalle_ajuste = function(datos, precio_compra, id_producto){
  const tabla_detalle = document.getElementById("detalle_contenedor");
  tabla_detalle.innerHTML += `
  <tr class="fila_detalle">
  <th scope="row">${datos.txt_productos.value}</th>
  <td>${precio_compra}</td>
  <td>${datos.txt_cantidad.value}</td>
  <td><button class="btn btn-danger eliminar_detalle">Eliminar</button></td>
  <input type="hidden" value="${id_producto}"/>
  </tr> 
  `;
  let btn_eliminar_linea = document.getElementsByClassName("eliminar_detalle");

  return btn_eliminar_linea;
};

const calcular_total_producto_ajuste = function(lineas, contenedor){
  let inicio = 0;
  let resultado = inicio;
  for(let i = 0; lineas.length > i; i++){
    let celda = lineas[i].cells
    console.log(celda[1].innerHTML)
    resultado += celda[1].innerHTML * celda[2].innerHTML
  }
  contenedor.innerHTML = resultado;
};

const html_ajuste = `
<h2>Realizar ajuste</h2>
<div class="form-row col-10">
  <div class="mb-3 col-7">
      <label for="txt_productos" class="form-label">Buscar producto</label>
      <input class="form-control" list="lista_productos" id="txt_productos" placeholder="Nombre producto">
      <datalist id="lista_productos">
  </div>
  <div class="mb-3 col-3">
      <label for="cbo_tipo_ajuste" class="form-label">Tipo de ajuste</label>
      <select class="form-select" aria-label="Default select example" id="cbo_tipo_ajuste">
          <option value="1">Positivo</option>
          <option value="2">Negativo</option>
      </select>
  </div>
</div>
<div class="form-row col-10">
  <div class="mb-3 col-4">
      <label for="descripcion" class="form-label">Descripcion</label>
      <input type="text" class="form-control" id="descripcion">
  </div>   
  <div class="mb-3 col-3">
      <label for="cantidad" class="form-label">Cantidad</label>
      <input type="text" class="form-control" id="cantidad">
  </div>  
  <div class="mb-3 col-3">
      <button class="btn btn-secondary add-btn" id="agregar_producto">Agregar producto</button>
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