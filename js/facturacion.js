// Restriccion de token

if (!localStorage.getItem("token")) {
    alert("No esta autorizado");
    window.location = "/";
}

URL_SET = "http://localhost:8000/set";
URL_TALONARIO = "http://localhost:8000/talonarios"
URL_SIGUIENTE_NUMERO = "http://localhost:8000/siguienteNumero";
URL_CLIENTES = "http://localhost:8000/clientes";


const btn_agregar_detalle_cuota = document.getElementById("agregar_cuota");
btn_agregar_detalle_cuota.addEventListener("click", function(){
  $('#detalle_modal').modal('show');
}); 
const btn_cerrar_detalle_modal = document.getElementById("cerrar_detalle_modal");
btn_cerrar_detalle_modal.addEventListener("click", function(){
  $('#detalle_modal').modal('hide');
});

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
        fecha: document.getElementById("fecha_cliente")
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
});

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


const form_factura_sineldetallemodal = `<h2 id="titulo-form">Facturar Cuotas</h2>
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
<hr>
<div id="detalle_contenedor" class="">

</div>
<hr>
<div class="form-row col-9">
  <div class="col-4"> 
    <button class="btn btn-primary">Agregar cuota</button>
  </div>
</div>
<hr style="background-color: black;">
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