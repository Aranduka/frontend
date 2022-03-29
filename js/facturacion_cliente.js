const btn_add_cliente = document.getElementById("add_cliente");
const facturacion_cliente_contenedor = document.getElementById("contenedor");

btn_add_cliente.addEventListener("click", function(){

    facturacion_cliente_contenedor.innerHTML = form_add_cliente;

    const datos_clientes = {
        nombre_cliente: document.getElementById("nombre_cliente"),
        ruc_cliente: document.getElementById("ruc_cliente"),
        direccion_cliente: document.getElementById("direccion_cliente"),
        telefono_cliente: document.getElementById("telefono_cliente"),
        btn_guardar: document.getElementById("guardar_cliente"),
        btn_cancelar: document.getElementById("cancelar_cliente")
    }

    datos_clientes.btn_cancelar.onclick = () => {
        facturacion_cliente_contenedor.innerHTML = "";
    };

    datos_clientes.btn_guardar.onclick = () => {
        insertar_cliente(datos_clientes);
    };
});

const insertar_cliente = async (datos)=>{
    let params = {
        nombre: datos.nombre_cliente.value,
        ruc:datos.ruc_cliente.value,
        telefono: datos.telefono_cliente.value,
        direccion: datos.direccion_cliente.value
    }
    const solicitud = new Request(URL_CLIENTES, {
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
        const cliente_add = await respuesta.json();
        if (!respuesta.ok) {
            alert("Error al intentar agregar cliente");
            console.log(cliente_add.detail);
        }else{
            alert("Se ha insertado al cliente: " + params.nombre);
        }
};


const btn_edit_cliente = document.getElementById("edit_cliente");

btn_edit_cliente.addEventListener("click", function(){
    facturacion_cliente_contenedor.innerHTML = form_edit_cliente;
    const datos_clientes = {
        id_cliente: "",
        lista_clientes: document.getElementById("lista_clientes"),
        txt_lista_clientes: document.getElementById("txt_lista_clientes"),
        nombre_cliente: document.getElementById("nombre_cliente"),
        ruc_cliente: document.getElementById("ruc_cliente"),
        direccion_cliente: document.getElementById("direccion_cliente"),
        telefono_cliente: document.getElementById("telefono_cliente"),
        btn_guardar: document.getElementById("guardar_cliente"),
        btn_cancelar: document.getElementById("cancelar_cliente")
    };

    datos_clientes.txt_lista_clientes.onmouseover = async () => {
        if(datos_clientes.lista_clientes.options[0]===undefined){
            const solicitud = new Request(URL_CLIENTES, {
              method: "Get",
              withCredentials: true,
              credentials: "include",
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
            });
            const respuesta = await fetch(solicitud);
            const clientes = await respuesta.json();
          
            if(!respuesta.ok){
                alert("Algo salio mal al cargar los clientes");
            }
            else{
                for (let dato of clientes) {
                  let nueva_opcion = document.createElement("option");
                  nueva_opcion.value = dato.nombre;
                  nueva_opcion.id = dato.id_cliente;
                  datos_clientes.lista_clientes.appendChild(nueva_opcion);
                  }
            }
          }
    };

    datos_clientes.txt_lista_clientes.onchange = async ()=>{
    
        for(let i = 0; datos_clientes.lista_clientes.options.length > i; i++){
          if (datos_clientes.lista_clientes.options[i].value === datos_clientes.txt_lista_clientes.value){
            datos_clientes.id_cliente = datos_clientes.lista_clientes.options[i].id;
          }
        }
        
        const solicitud = new Request(URL_CLIENTES + "/"+  datos_clientes.id_cliente, {
            method: "Get",
            withCredentials: true,
            credentials: "include",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          });
          const respuesta = await fetch(solicitud);
          const cliente_buscar = await respuesta.json();
          
          if(!respuesta.ok){
              alert("Algo salio mal al cargar el cliente");
          }
          else{
              datos_clientes.nombre_cliente.value = cliente_buscar.nombre;
              datos_clientes.ruc_cliente.value = cliente_buscar.ruc;
              datos_clientes.direccion_cliente.value = cliente_buscar.direccion;
              datos_clientes.telefono_cliente.value = cliente_buscar.telefono;
          }

    };

    datos_clientes.btn_cancelar.onclick = () => {
        facturacion_cliente_contenedor.innerHTML = "";
    };

    datos_clientes.btn_guardar.onclick = () => {
        editar_cliente(datos_clientes);
    };
});

const editar_cliente = async (datos) =>{
    let params = {
        id_cliente: datos.id_cliente,
        nombre: datos.nombre_cliente.value,
        ruc:datos.ruc_cliente.value,
        telefono: datos.telefono_cliente.value,
        direccion: datos.direccion_cliente.value
    }
    const solicitud = new Request(URL_CLIENTES + "/" + params.id_cliente, {
        method: 'PUT',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
        });
        const respuesta = await fetch(solicitud);
        const cliente_edit = await respuesta.json();
        if (!respuesta.ok) {
            alert("Error al intentar modificar cliente");
            console.log(cliente_edit.detail);
        }else{
            alert("Se ha modificado el cliente");
        }
};

const form_add_cliente = `<h2 id="titulo-form">Agregar Cliente</h2>
<div class="form-row-fac col-8">
<div class="mb-3 col-4">
  <label for="nombre_cliente" class="form-label">Nombre o Razon Social</label>
  <input type="text" class="form-control" id="nombre_cliente">
</div>
<div class="mb-3 col-4">
  <label for="ruc_cliente" class="form-label">RUC</label>
  <input type="text" class="form-control" id="ruc_cliente">
</div>
</div>
<div class="form-row-fac col-8">
  <div class="mb-3 col-4">
    <label for="direccion_cliente" class="form-label">Direccion</label>
    <input type="text" class="form-control" id="direccion_cliente">
  </div>
  <div class="mb-3 col-4">
    <label for="telefono_cliente" class="form-label">Telefono</label>
    <input type="text" class="form-control" id="telefono_cliente">
  </div>
  </div>
  <div class="form-row-fac col-8 py-3">
    <button class="btn btn-primary col-2" id="guardar_cliente">Guardar</button>
    <button class="btn btn-danger col-2" id="cancelar_cliente">Cancelar</button>
  </div>`;

  const form_edit_cliente = `
  <h2 id="titulo-form">Editar Cliente</h2>
<div class="form-row-fac col-8">
<div class="mb-3 col-4">
    <label for="txt_lista_clientes" class="form-label">Buscar cliente</label>
    <input class="form-control" list="lista_clientes" id="txt_lista_clientes" placeholder="Nombre o Razon Social">
    <datalist id="lista_clientes">
</div>
</div>
<div class="form-row-fac col-8">
<div class="mb-3 col-4">
<label for="nombre_cliente" class="form-label">Nombre o Razon Social</label>
<input type="text" class="form-control" id="nombre_cliente">
</div>
<div class="mb-3 col-4">
<label for="ruc_cliente" class="form-label">RUC</label>
<input type="text" class="form-control" id="ruc_cliente">
</div>
</div>
<div class="form-row-fac col-8">
<div class="mb-3 col-4">
<label for="direccion_cliente" class="form-label">Direccion</label>
<input type="text" class="form-control" id="direccion_cliente">
</div>
<div class="mb-3 col-4">
<label for="telefono_cliente" class="form-label">Telefono</label>
<input type="text" class="form-control" id="telefono_cliente">
</div>
</div>
<div class="form-row-fac col-8 py-3">
<button class="btn btn-primary col-2" id="guardar_cliente">Guardar</button>
<button class="btn btn-danger col-2" id="cancelar_cliente">Cancelar</button>
</div>
  `;