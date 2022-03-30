const btn_add_proveedor = document.getElementById("add_proveedor");

btn_add_proveedor.addEventListener("click", function(){
    container_form.innerHTML = html_proveedor_add;
});

const html_proveedor_add = `
    <h2 style="margin-top: 30px;">Insertar proveedor</h2>
    <div class="form-row col-8">
        <div class="mb-3 col-4">
            <label for="nombre_proveedor" class="form-label">Nombre o Razon Social</label>
            <input type="text" class="form-control" id="nombre_proveedor">
        </div>
        <div class="mb-3 col-4">
            <label for="ruc_proveedor" class="form-label">RUC</label>
            <input type="text" class="form-control" id="ruc_proveedor">
        </div>
    </div>
    <div class="form-row col-8">
        <div class="mb-3 col-4">
            <label for="direccion_proveedor" class="form-label">Direccion</label>
            <input type="text" class="form-control" id="direccion_proveedor">
        </div>
        <div class="mb-3 col-4">
            <label for="telefono_proveedor" class="form-label">Telefono</label>
            <input type="text" class="form-control" id="telefono_proveedor">
        </div>
    </div>
    <div class="form-row col-8 py-3">
        <button class="btn btn-primary col-2" id="guardar_proveedor">Guardar</button>
        <button class="btn btn-danger col-2" id="cancelar_proveedor">Cancelar</button>
    </div>
`;

const btn_edit_proveedor = document.getElementById("edit_proveedor");
btn_edit_proveedor.addEventListener("click", function(){
    container_form.innerHTML = html_editar_proveedor;
});

const html_editar_proveedor = `
<h2 id="titulo-form">Editar Cliente</h2>
            <div class="form-row col-8">
                <div class="mb-3 col-4">
                    <label for="txt_lista_proveedores" class="form-label">Buscar proveedor</label>
                    <input class="form-control" list="lista_proveedores" id="txt_lista_proveedores" placeholder="Nombre o Razon Social">
                    <datalist id="lista_proveedores">
                </div>
            </div>
            <div class="form-row col-8">
                <div class="mb-3 col-4">
                    <label for="nombre_proveedor" class="form-label">Nombre o Razon Social</label>
                    <input type="text" class="form-control" id="nombre_proveedor">
                </div>
                <div class="mb-3 col-4">
                    <label for="ruc_proveedor" class="form-label">RUC</label>
                    <input type="text" class="form-control" id="ruc_proveedor">
                </div>
            </div>
            <div class="form-row col-8">
                <div class="mb-3 col-4">
                    <label for="direccion_proveedor" class="form-label">Direccion</label>
                    <input type="text" class="form-control" id="direccion_proveedor">
                  </div>
                  <div class="mb-3 col-4">
                    <label for="telefono_proveedor" class="form-label">Telefono</label>
                    <input type="text" class="form-control" id="telefono_proveedor">
                  </div>
            </div>
            <div class="form-row col-8 py-3">
                <button class="btn btn-primary col-2" id="guardar_proveedor">Guardar</button>
                <button class="btn btn-danger col-2" id="cancelar_proveedor">Cancelar</button>
            </div>
`;