// Restriccion de token

if (!localStorage.getItem("token")) {
    alert("No esta autorizado");
    window.location = "/";
}

URL_SET = "http://localhost:8000/set";
URL_TALONARIO = "http://localhost:8000/talonarios";
URL_SIGUIENTE_NUMERO = "http://localhost:8000/siguienteNumero";
URL_CLIENTES = "http://localhost:8000/clientes";
URL_DESCUENTOS = "http://localhost:8000/descuentos";
URL_PAGARES = "http://localhost:8000/pagares_cuotas";


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

const facturas_cuotas = document.getElementById("add_factura_cuotas");
const contenedor_form_factura_cuotas = document.getElementById("contenedor");
facturas_cuotas.addEventListener("click", function(){
    contenedor_form_factura_cuotas.innerHTML = form_factura_sineldetallemodal;
    const datos_facturas_cuotas_dom = {
        punto_expedicion_factura_cuotas: document.getElementById("punto_expedicion_factura"),
        numero_factura: document.getElementById("numero_factura"),
        id_codigo_set: document.getElementById("id_codigo_set"),
        lista_clientes: document.getElementById("lista_clientes"),
        txt_lista_cliente: document.getElementById("txt_lista_clientes"),
        cliente_nombre: document.getElementById("cliente_nombre"),
        cliente_telefono: document.getElementById("cliente_telefono"),
        cliente_direccion: document.getElementById("cliente_direccion"),
        cliente_ruc: document.getElementById("cliente_ruc"),
        cliente_id: "",
        fecha: document.getElementById("fecha_cliente"),
        btn_agregar_detalle_cuota: document.getElementById("agregar_cuota"),
        btn_cerrar_detalle_modal: document.getElementById("cerrar_detalle_modal"),
        btn_agregar_detalle_cuota_modal: document.getElementById("agregar_detalle_curso")
    };
    const datos_detalle = {
      cedula_alumno_cuota: document.getElementById("cedula_alumno"),
      btn_buscar_alumno: document.getElementById("buscar_cuotas"),
      cbo_pagares: document.getElementById("pagares_cuotas"),
      cbo_descuento: document.getElementById("descuento_cuota"),
      descripcion_cuota: document.getElementById("descripcion_cuota"),
      monto_cuota: document.getElementById("monto_cuota"),
      cuerpo: document.getElementById("detalle_contenedor"),
      contador: 1
    }

    datos_detalle.btn_buscar_alumno.onclick = async ()=>{
      if(datos_detalle.cbo_pagares.options[0]===undefined){
        const solicitud = new Request(URL_PAGARES+"/"+datos_detalle.cedula_alumno_cuota.value, {
          method: "Get",
          withCredentials: true,
          credentials: "include",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        });
        const respuesta = await fetch(solicitud);
        const pagares_cuotas = await respuesta.json();
      
        if(!respuesta.ok){
            alert("Algo salio mal al cargar los pagares");
        }
        else{
            for (let dato of pagares_cuotas) {
                let nueva_opcion = document.createElement("option");
                nueva_opcion.value = dato.id_pagare;
                nueva_opcion.text = `Cuota numero:${dato.numero_cuota} monto:${dato.monto}`;
                datos_detalle.cbo_pagares.appendChild(nueva_opcion);
              }
        }
      }
    };

    datos_detalle.cbo_descuento.onmouseover = async ()=>{
      if(datos_detalle.cbo_descuento.options[0]===undefined){
        const solicitud = new Request(URL_DESCUENTOS, {
            method: "Get",
            withCredentials: true,
            credentials: "include",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          });
          const respuesta = await fetch(solicitud);
          const descuento_cuota= await respuesta.json();
        
          if(!respuesta.ok){
              alert("Algo salio mal al cargar los descuentos");
          }
          else{
              for (let dato of descuento_cuota) {
                  let nueva_opcion = document.createElement("option");
                  nueva_opcion.value = dato.id_tipo_descuento;
                  nueva_opcion.text = `${dato.porcentaje * 100}%`;
                  datos_detalle.cbo_descuento.appendChild(nueva_opcion);
                }
          }
      } 
    };

    datos_facturas_cuotas_dom.btn_agregar_detalle_cuota.onclick = () =>{
      $('#detalle_modal').modal('show');
    };

    datos_facturas_cuotas_dom.btn_cerrar_detalle_modal.onclick = () => {
      $('#detalle_modal').modal('hide');
    };

    let fecha = new Date()
    datos_facturas_cuotas_dom.fecha.innerHTML = fecha.toISOString().split('T')[0];
    datos_facturas_cuotas_dom.txt_lista_cliente.onmouseover = async ()=>{
      if(datos_facturas_cuotas_dom.lista_clientes.options[0]===undefined){
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
        const clientes_cuotas = await respuesta.json();
      
        if(!respuesta.ok){
            alert("Algo salio mal al cargar los clientes");
        }
        else{
            for (let dato of clientes_cuotas) {
              let nueva_opcion = document.createElement("option");
              nueva_opcion.value = dato.id_cliente + " " + dato.nombre;
              datos_facturas_cuotas_dom.lista_clientes.appendChild(nueva_opcion);
              }
        }
      }
    };

    datos_facturas_cuotas_dom.punto_expedicion_factura_cuotas.onmouseover = async () =>{
        if(datos_facturas_cuotas_dom.punto_expedicion_factura_cuotas.options[0]===undefined){
            const solicitud = new Request(URL_SET + "/"+ localStorage.getItem("sucursal_elegida"), {
                method: "Get",
                withCredentials: true,
                credentials: "include",
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("token"),
                  "Content-Type": "application/json",
                },
              });
              const respuesta = await fetch(solicitud);
              const set_factura_cuota = await respuesta.json();
            
              if(!respuesta.ok){
                  alert("Algo salio mal al cargar los codigos de la set");
              }
              else{
                  for (let dato of set_factura_cuota) {
                      datos_facturas_cuotas_dom.id_codigo_set.value = dato.id_codigo_set;
                      let nueva_opcion = document.createElement("option");
                      nueva_opcion.value = dato.id_codigo_set;
                      nueva_opcion.text = `0${dato.codigo_establecimiento} 00${dato.punto_expedicion}`;
                      datos_facturas_cuotas_dom.punto_expedicion_factura_cuotas.appendChild(nueva_opcion);
                    }
              }
        }
    };

    datos_facturas_cuotas_dom.punto_expedicion_factura_cuotas.onclick = async ()=>{
        const solicitud = new Request(URL_TALONARIO + "/"+ datos_facturas_cuotas_dom.id_codigo_set.value, {
            method: "Get",
            withCredentials: true,
            credentials: "include",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          });
          const respuesta = await fetch(solicitud);
          const talonario_cuota = await respuesta.json();
          
          if(!respuesta.ok){
              alert("Algo salio mal al cargar el talonario");
          }
          else{
              ultimo_numero_factura(talonario_cuota[0].id_talonario, datos_facturas_cuotas_dom);
          }
    };

    datos_facturas_cuotas_dom.txt_lista_cliente.onchange = async ()=>{
      let id = datos_facturas_cuotas_dom.txt_lista_cliente.value.substr(0,1);
      datos_facturas_cuotas_dom.cliente_id = id;
      const solicitud = new Request(URL_CLIENTES + "/"+ id, {
        method: "Get",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      const respuesta = await fetch(solicitud);
      const cliente_unico_cuota = await respuesta.json();
      
      if(!respuesta.ok){
          alert("Algo salio mal al cargar el cliente");
      }
      else{
          datos_facturas_cuotas_dom.cliente_nombre.innerHTML = cliente_unico_cuota.nombre;
          datos_facturas_cuotas_dom.cliente_ruc.innerHTML = cliente_unico_cuota.ruc;
          datos_facturas_cuotas_dom.cliente_direccion.innerHTML = cliente_unico_cuota.direccion;
          datos_facturas_cuotas_dom.cliente_telefono.innerHTML = cliente_unico_cuota.telefono;
      }
    };

    datos_facturas_cuotas_dom.btn_agregar_detalle_cuota_modal.onclick = () => {
      let btn = insertar_detalle_cuota(datos_detalle);
      let fila = document.getElementsByClassName("fila_detalle");
      $('#detalle_modal').modal('hide');
      for (let i = 0; btn.length > i; i++){
        btn[i].onclick = ()=>{
          fila[i].remove();
        }
      }
    };
});

const insertar_detalle_cuota = (datos)=>{
  datos.cuerpo.innerHTML += `<tr class="fila_detalle">
  <th scope="row">${datos.descripcion_cuota.value}</th>
  <td>${datos.cbo_descuento.options[datos.cbo_descuento.selectedIndex].text}</td>
  <td>${datos.monto_cuota.value}</td>
  <td><button class="btn btn-danger eliminar_detalle">Eliminar</button></td>
  </tr>`;
  
  let btn_eliminar_linea = document.getElementsByClassName("eliminar_detalle");
  datos.contador+=1;
  return btn_eliminar_linea;
};


const ultimo_numero_factura = async (id_talonario, datos)=>{
    const solicitud = new Request(URL_SIGUIENTE_NUMERO + "/"+ id_talonario, {
        method: "Get",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      const respuesta = await fetch(solicitud);
      const numero_factura_cuota = await respuesta.json();
      
      if(!respuesta.ok){
          alert("Algo salio mal al cargar el ultimo numero de factura");
      }
      else{
          
          datos.numero_factura.innerHTML = numero_factura_cuota.cod
      }
};


const form_factura_sineldetallemodal = `
<div class="col-8">
<label for="txt_lista_clientes" class="form-label">Buscar cliente</label>
  <input class="form-control" list="lista_clientes" id="txt_lista_clientes" placeholder="Nombre o Razon Social">
  <datalist id="lista_clientes">
   
  </datalist>
</div>
<input type="hidden" id="cliente_id">
<div class="col-12 form-row">
  <div class="col-7 factura-info">
    <div class="form-row col-12 datos-text" >
      <div class="col-6">Fecha: <span id="fecha_cliente"></span></div>
      <div class="form-check col-6">
        <label class="form-check-label" for="chk_contado">
          Contado
        </label>
        <input class="form-check-input" type="checkbox" value="E" id="chk_contado" checked disabled>
      </div>
    </div>
    <div class="form-row col-12 datos-text">
      <div class="col-6">Cliente: <span id="cliente_nombre"></span></div>
      <div class="col-6">Telefono: <span id="cliente_telefono"></span></div>
    </div>
    <div class="form-row col-12 datos-text">
      <div class="col-6">RUC: <span id="cliente_ruc"></span></div>
      <div class="col-6">Direccion: <span id="cliente_direccion"></span></div>
    </div>
  </div>
  <div class="col-4 factura-info">
    <div class="form-row col-12">
      <div class="col-6" style="margin-top: 20px; margin-left: 90px;">
        <label for="punto_expedicion_factura" class="form-label">Punto Expedicion</label>
        <select class="form-select" aria-label="Default select example" id="punto_expedicion_factura">
          
        </select>
        <input type="hidden" id="id_codigo_set">
      </div>
    </div>
    <div class="form-row col-12">
      <div class="col-6" style="margin-top: 20px; margin-left: 120px; font-size: 20px;">
        Factura N°: <span id="numero_factura">2000</span>
      </div>
    </div>
  </div>
</div>

<div id="detalle_table_contenedor" class="col-10">

  <table class="table">
    <thead>
      <tr>
        <th scope="col">Descripcion</th>
        <th scope="col">Descuento</th>
        <th scope="col">Monto</th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody id="detalle_contenedor">
      
    </tbody>
  </table>

</div>


<div class="form-row col-9">
  <div class="col-4"> 
    <button class="btn btn-primary" id="agregar_cuota" data-toggle="modal" data-target="detalle_modal">Agregar cuota</button>
  </div>
</div>
<!-- Modal  -->
<div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" id="detalle_modal">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Busqueda de Cuotas</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="cerrar_detalle_modal">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div>
          <div class="form-row col-12" style="justify-content: space-around;">
            <div class="mb-3 col-4">
              <label for="cedula_alumno" class="form-label">Cedula</label>
              <input type="text" class="form-control" id="cedula_alumno">
            </div>
            <div class="mb-3 col-4">
              <button class="btn btn-secondary add-btn" id="buscar_cuotas">Buscar cuotas</button>
            </div>
          </div>
          <div class="form-row col-12" style="justify-content: space-around;">
            <div class="mb-3 col-4">
              <label for="pagares_cuotas" class="form-label">Lista de cuotas</label>
              <select class="form-select" aria-label="Default select example" id="pagares_cuotas">
              </select>
            </div>
            <div class="mb-3 col-4">
              <label for="descuento_cuota" class="form-label">Descuento</label>
              <select class="form-select" aria-label="Default select example" id="descuento_cuota">
              </select>
            </div>
          </div>
          <div class="form-row col-12" style="justify-content: space-around;">
            <div class="mb-3 col-4">
              <label for="descripcion_cuota" class="form-label">Descripcion</label>
              <input type="text" class="form-control" id="descripcion_cuota">
            </div>
            <div class="mb-3 col-4">
              <label for="monto_cuota" class="form-label">Monto Abonado</label>
              <input type="text" class="form-control" id="monto_cuota">
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" id="agregar_detalle_curso">Agregar</button>
      </div>
    </div>
  </div>
</div>
<!--  -->
<hr>
<div class="form-row col-10" style="margin-top: 60px; margin-left: 1000px;">
  <div class="col-2"> 
    <button class="btn btn-primary">Guardar</button>
  </div>
  <div class="col-2" id="btn_imprimir"> 
    <!-- <button class="btn btn-primary">Imprimir</button> -->
  </div>
  <div class="col-2"> 
    <button class="btn btn-primary">Cancelar</button>
  </div>
</div>`;