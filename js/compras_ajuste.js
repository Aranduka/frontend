const btn_add_ajuste = document.getElementById("add_ajuste");

btn_add_ajuste.addEventListener("click", function(){
    container_form.innerHTML = html_ajuste;
    const datos_ajuste = {
        
    };
});

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
  <div class="mb-3 col-7">
      <label for="descripcion" class="form-label">Descripcion</label>
      <input type="text" class="form-control" id="descripcion">
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