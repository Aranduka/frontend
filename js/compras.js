// Restriccion de token

if (!localStorage.getItem("token")) {
    alert("No esta autorizado");
    window.location = "/";
}
  
  // URL 
 const URL_TRANSACCION_COMPRA = "http://localhost:8000/transaccion_compra"
 const URL_PRODUCTOS_SUCURSAL = "http://localhost:8000/productos_sucursal";
 const URL_TRANSACCION_AJUSTE = "http://localhost:8000/transaccion_ajuste";
 const URL_ANULAR_TRANSACCION = "http://localhost:8000/transacciones";
 const URL_PROVEEDORES = "http://localhost:8000/proveedores";
  
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
        txt_proveedor: document.getElementById(""),
        lst_proveedores: document.getElementById(""),
        txt_numero_factura: document.getElementById(""),
        txt_producto: document.getElementById(""),
        lst_productos: document.getElementById(""),
        txt_cantidad: document.getElementById(""),
        btn_agregar_detalle: document.getElementById(""),
        btn_guardar: document.getElementById(""),
        btn_cancelar: document.getElementById(""),
        txt_total: document.getElementById(""),
        id_proveedor: "",
        id_sucursal: ""
      };
  });

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
      <button class="btn btn-secondary add-btn">Agregar producto</button>
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
        <button class="btn btn-primary">Anular</button>
    </div>
    <div class="mb-3 col-4" style="margin-right: 50px;">
        <button class="btn btn-danger">Cancelar</button>
    </div>
</div>
`;
