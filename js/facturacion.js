// Restriccion de token

if (!localStorage.getItem("token")) {
    alert("No esta autorizado");
    window.location = "/";
}

URL_SET = "http://localhost:8000/set";
URL_TALONARIO = "http://localhost:8000/talonarios"
URL_SIGUIENTE_NUMERO = "http://localhost:8000/siguienteNumero";


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
        id_codigo_set: document.getElementById("id_codigo_set")
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
  <label for="cliente" class="form-label" style="font-size: 20px;">Buscar Cliente</label>
  <input type="text" class="form-control col-8" id="cliente" placeholder="Nombre o Razon Social">
</div>
<input type="hidden" id="cliente_id">
<div class="col-12 form-row">
  <div class="col-7 factura-info">
    <div class="form-row col-12 datos-text" >
      <div class="col-6">Fecha: <span id="fecha_cliente">2022-03-01</span></div>
      <div class="form-check col-6">
        <label class="form-check-label" for="chk_contado">
          Contado
        </label>
        <input class="form-check-input" type="checkbox" value="E" id="chk_contado" checked disabled>
      </div>
    </div>
    <div class="form-row col-12 datos-text">
      <div class="col-6">Cliente: <span id="cliente_nombre">Cosme Fulanito</span></div>
      <div class="col-6">Telefono: <span id="cliente_telefono">0987433443</span></div>
    </div>
    <div class="form-row col-12 datos-text">
      <div class="col-6">RUC: <span id="cliente_ruc">890987-0</span></div>
      <div class="col-6">Direccion: <span id="cliente_direccion">23 proyectadas y estados unidos</span></div>
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