const btn_add_proveedor = document.getElementById("add_proveedor");

btn_add_proveedor.addEventListener("click", function(){
    container_form.innerHTML = html_proveedor_add;
    const datos_proveedor = {
        txt_nombre: document.getElementById("nombre_proveedor"),
        txt_ruc: document.getElementById("ruc_proveedor"),
        txt_telefono: document.getElementById("telefono_proveedor"),
        txt_direccion: document.getElementById("direccion_proveedor"),
        btn_guardar: document.getElementById("guardar_proveedor"),
        btn_cancelar: document.getElementById("cancelar_proveedor")
    };
    datos_proveedor.btn_cancelar.onclick = function(){
        container_form.innerHTML = "";
    };
    datos_proveedor.btn_guardar.onclick = async function(){
        const datos = {
            nombre: datos_proveedor.txt_nombre.value,
            direccion: datos_proveedor.txt_direccion.value,
            telefono: datos_proveedor.txt_telefono.value,
            ruc: datos_proveedor.txt_ruc.value
        }
        const solicitud = new Request(URL_PROVEEDORES, {
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
                alert("Se añadió el proveedor");
                
            }
    };
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
    const datos_edit_proveedor = {
       txt_proveedores: document.getElementById("txt_lista_proveedores"),
       lst_proveedores: document.getElementById("lista_proveedores"),
       txt_nombre: document.getElementById("nombre_proveedor"),
       txt_ruc: document.getElementById("ruc_proveedor"),
       txt_direccion: document.getElementById("direccion_proveedor"),
       txt_telefono: document.getElementById("telefono_proveedor"),
       btn_cancelar: document.getElementById("cancelar_proveedor"),
       btn_guardar: document.getElementById("guardar_proveedor"),
       id_proveedor: ""
    }

    // Cargar lista proveedores
    datos_edit_proveedor.txt_proveedores.onmouseover = async function(){
        if(datos_edit_proveedor.lst_proveedores.options[0]===undefined){
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
                    datos_edit_proveedor.lst_proveedores.appendChild(nueva_opcion);
                    }
              }
        }
    };
    // Cargar datos
    datos_edit_proveedor.txt_proveedores.onchange = async function(){
        let id_proveedor = "";
        for(let i = 0; datos_edit_proveedor.lst_proveedores.options.length > i; i++){
          if (datos_edit_proveedor.lst_proveedores.options[i].value === datos_edit_proveedor.txt_proveedores.value){
            id_proveedor = datos_edit_proveedor.lst_proveedores.options[i].id;
            datos_edit_proveedor.id_proveedor = id_proveedor;
          }
        }
        if(id_proveedor !== ""){

            const solicitud = new Request(URL_PROVEEDORES+"/"+id_proveedor, {
                method: "Get",
                withCredentials: true,
                credentials: "include",
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("token"),
                  "Content-Type": "application/json",
                },
              });
              const respuesta = await fetch(solicitud);
              const proveedor = await respuesta.json();
            
              if(!respuesta.ok){
                  alert("Algo salio mal al cargar el proveedor");
              }
              else{
                  datos_edit_proveedor.txt_nombre.value = proveedor.nombre;
                  datos_edit_proveedor.txt_ruc.value = proveedor.ruc;
                  datos_edit_proveedor.txt_direccion.value = proveedor.direccion;
                  datos_edit_proveedor.txt_telefono.value = proveedor.telefono;
              }
        }
    };
    // Cancelar
    datos_edit_proveedor.btn_cancelar.onclick = function(){
        container_form.innerHTML = "";
    };
    // Guardar cambios
    datos_edit_proveedor.btn_guardar.onclick = async function(){
        const proveedor_edit = {
            nombre: datos_edit_proveedor.txt_nombre.value,
            direccion: datos_edit_proveedor.txt_direccion.value,
            telefono: datos_edit_proveedor.txt_telefono.value,
            ruc: datos_edit_proveedor.txt_ruc.value
        };
        const solicitud = new Request(URL_PROVEEDORES+"/"+datos_edit_proveedor.id_proveedor, {
            method: "Put",
            withCredentials: true,
            credentials: "include",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(proveedor_edit)
          });
          const respuesta = await fetch(solicitud);
          const proveedor = await respuesta.json();
        
          if(!respuesta.ok){
              alert("Algo salio mal al editar el proveedor");
          }
          else{
               alert("Se ha editado el proveedor");
          }
    };
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