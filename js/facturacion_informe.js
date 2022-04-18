// URLS
const URL_INFORMES_DIARIO = "https://"+dominio+"/informes/cajadiario";
const URL_FACTURACION_INFORME = "https://"+dominio+"/informes/facturas";

const inf_caja_diaria = document.getElementById("inf_caja_diario");
const contendor_informe_diario = document.getElementById("contenedor");

var fecha_actual = "";
var fecha_actual_formateada = "";

inf_caja_diaria.addEventListener("click", function(){

    contendor_informe_diario.innerHTML = informe_caja_diario_html;

    let informe_diario_datos = {
        cbo_punto_expedicion: document.getElementById("punto_expedicion_factura"),
        tabla: document.getElementById("detalle_informe"),
        id_codigo_set: "",
        talonario: document.getElementById("id_talonario"),
        buscar: document.getElementById("buscar")
    }

    // Carga el selector de punto de expedicion
    informe_diario_datos.cbo_punto_expedicion.onmouseover = async function(){
        if(informe_diario_datos.cbo_punto_expedicion.options[1]===undefined){
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
                      let nueva_opcion = document.createElement("option");
                      nueva_opcion.value = dato.id_codigo_set;
                      nueva_opcion.text = `0${dato.codigo_establecimiento} 00${dato.punto_expedicion}`;
                      informe_diario_datos.cbo_punto_expedicion.appendChild(nueva_opcion);
                    }
              }
        }
    };
    //Busca el talonario
    informe_diario_datos.cbo_punto_expedicion.onchange = async ()=>{
        const solicitud = new Request(URL_TALONARIO + "/"+informe_diario_datos.cbo_punto_expedicion.value, {
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
            informe_diario_datos.talonario.value = talonario_cuota[0].id_talonario;
            
          }
    };
    // Carga la tabla de informe
    informe_diario_datos.buscar.onclick = async function(){
        fecha_actual = new Date
        fecha_actual_formateada = `${fecha_actual.getDate()}/${fecha_actual.getMonth()+1}/${fecha_actual.getFullYear()}`
        const solicitud = new Request(URL_INFORMES_DIARIO + "?id_talonario="+ informe_diario_datos.talonario.value, {
            method: "Get",
            withCredentials: true,
            credentials: "include",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          });
          const respuesta = await fetch(solicitud);
          const informe_diario_caja = await respuesta.json();
          if(!respuesta.ok){
            alert("Algo salio mal al cargar el informe " + informe_diario_caja.detail);
        }
        else{
            for (let dato of informe_diario_caja) {
                informe_diario_datos.tabla.innerHTML += `
                <tr>
                    <td>${dato.numero_comprobate}</td>
                    <td>${dato.descripcion}</td>
                    <td>${dato.fecha}</td>
                    <td>${dato.cantidad}</td>
                    <td>${dato.monto}</td>
                    <td>${dato.tipo_comprobante}</td>
                </tr>
                `;
              
              }
            iniciarDatatable();
        }
    };
});


function iniciarDatatable(){
    $('#tabla').DataTable({
        dom: 'Bfrtip',
        buttons: [
            { 
                extend:'print', 
                footer: true, 
                title: "",
                customize: function(win){
                    $(win.document.body).prepend(
                        `<div class="contenedor-form col-12">
                            <h3>Informe diario ${localStorage.getItem("nombre_sucursal_elegida")}</h3>
                            <div class="form-row-fac">
                                <h6>Nombre usuario: ${localStorage.getItem("nombre")}</h6>
                                <h6 style="margin-left: 30px;">Fecha: ${fecha_actual_formateada}</h6>
                            </div>
                        </div>`
                    );
                }
            },
            { extend: 'excel', footer: true },
            { extend: 'pdf', footer: true}
        ],
        'language':{
            'url': 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json'
         },
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api();
            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
 
            // Total over all pages
            var total = api
                .column(4)
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                } );
 
            // Total over this page
            // var pageTotal = api
            //     .column( 2, { page: 'current'} )
            //     .data()
            //     .reduce( function (a, b) {
            //         return intVal(a) + intVal(b);
            //     } );
 
            // Update footer
            $( api.column(1).footer() ).html(
                'Gs '+ total
            );
        }
    });
}



const informe_caja_diario_html = `
<div class="row" style="margin-top: 50px;">
            <div class="col-12">
              <label for="punto_expedicion_factura" class="form-label">Seleccionar Punto Expedicion</label>
              <select class="form-select" aria-label="Default select example" id="punto_expedicion_factura">
                <option selected disabled>Ninguna</option>
              </select>
              <input type="hidden" id="id_talonario">
              <button class="btn btn-secondary" id="buscar">Buscar</button>
            </div>  
          </div>
          <div class="row" style="margin-top: 50px; align-self: stretch;">
            <table class="table" id="tabla">
              <thead>
                <th>Numero Comprobante</th>
                <th>Descripcion</th>
                <th>Fecha</th>
                <th>Cantidad</th>
                <th>Monto</th>
                <th>Tipo de Comprobante</th>
              </thead>
              <tbody id="detalle_informe"> 
                
              </tbody>
              <tfoot>
                <th>Total:</th>
                <th></th>
              </tfoot>
            </table>
          </div>
`;

const btn_informe_factura = document.getElementById("inf_facturas_fecha");

btn_informe_factura.addEventListener("click", function(){
    contendor_informe_diario.innerHTML = html_informe_factura;
    const informe = {
        fecha_inicio: document.getElementById("fecha_inicio"),
        fecha_fin: document.getElementById("fecha_fin"),
        tabla: document.getElementById("detalle_informe"),
        buscar: document.getElementById("buscar"),
        cbo_punto_expedicion: document.getElementById("punto_expedicion_factura"),
        talonario: document.getElementById("id_talonario"),
        tabla:document.getElementById("detalle_informe")
    }
    informe.cbo_punto_expedicion.onmouseover = async()=>{

        if(informe.cbo_punto_expedicion.options[1]===undefined){
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
                      let nueva_opcion = document.createElement("option");
                      nueva_opcion.value = dato.id_codigo_set;
                      nueva_opcion.text = `0${dato.codigo_establecimiento} 00${dato.punto_expedicion}`;
                      informe.cbo_punto_expedicion.appendChild(nueva_opcion);
                    }
              }
        }
    };
    informe.cbo_punto_expedicion.onchange = async()=>{
        const solicitud = new Request(URL_TALONARIO + "/"+informe.cbo_punto_expedicion.value, {
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
              informe.talonario.value = talonario_cuota[0].id_talonario;
          }
    };


    informe.buscar.onclick = async ()=>{
        const solicitud = new Request(URL_FACTURACION_INFORME + "?id_talonario="+ informe.talonario.value+"&inicio="+informe.fecha_inicio.value+"&fin="+informe.fecha_fin.value, {
            method: "Get",
            withCredentials: true,
            credentials: "include",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          });
          const respuesta = await fetch(solicitud);
          const informe_diario_caja = await respuesta.json();
          if(!respuesta.ok){
            alert("Algo salio mal al cargar el informe " + informe_diario_caja.detail);
        }
        else{
            
            for (let dato of informe_diario_caja) {
                informe.tabla.innerHTML += `
                <tr>
                    <td>${dato.id_factura}</td>
                    <td>${dato.numero_factura}</td>
                    <td>${dato.cliente}</td>
                    <td>${dato.fecha}</td>
                    <td>${dato.total}</td>
                    <td>${dato.forma_pago}</td>
                </tr>
                `;
              }
            iniciarDatatable();
        }
    };
});

const html_informe_factura = `
<div class="row" style="margin-top: 50px;">
<div class="col-12">
    <h2>Rango de fecha</h2>
    <div>
        <label for="punto_expedicion_factura" class="form-label">Seleccionar Punto Expedicion</label>
        <select class="form-select" aria-label="Default select example" id="punto_expedicion_factura">
        <option selected disabled>Ninguna</option>
        </select>
        <input type="hidden" id="id_talonario">
    </div>
    <div>
        <label for="fecha_inicio" class="form-label">Fecha inicio</label>
        <input type="text" class="form-control" id="fecha_inicio">
    </div>
    <div>
        <label for="fecha_fin" class="form-label">Fecha Fin</label>
        <input type="text" class="form-control" id="fecha_fin">
    </div>
    <div>
        <button class="btn btn-primary" id="buscar">Buscar</button>
    </div>
</div>
</div>
<div class="row" style="margin-top: 50px; align-self: stretch;">
<table class="table" id="tabla">
    <thead>
    <th>ID Factura</th>
    <th>Numero Factura</th>
    <th>Cliente</th>
    <th>Fecha</th>
    <th>Monto</th>
    <th>Forma de Pago</th>
    </thead>
    <tbody id="detalle_informe"> 
    
    </tbody>
    <tfoot>
    <th>Total:</th>
    <th></th>
    </tfoot>
</table>
</div>
`;