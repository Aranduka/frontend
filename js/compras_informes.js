const URL_INFORMES_TRANSACCION = "http://"+dominio+"/informes/transacciones";

const info_transacciones = document.getElementById("info_consultar_compras");

info_transacciones.addEventListener("click", function(){
    container_form.innerHTML = html_informe;
    const informe_transaccion = {
        fecha_inicio: document.getElementById("fecha_inicio"),
        fecha_fin: document.getElementById("fecha_fin"),
        tabla: document.getElementById("detalle_informe"),
        buscar: document.getElementById("buscar")
    }

    informe_transaccion.buscar.onclick = async ()=>{
        const solicitud = new Request(URL_INFORMES_TRANSACCION + "?fecha_inicio="+ informe_transaccion.fecha_inicio.value+ "&fecha_fin="+informe_transaccion.fecha_fin.value, {
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
                informe_transaccion.tabla.innerHTML += `
                <tr>
                    <td>${dato.id_transaccion}</td>
                    <td>${dato.descripcion}</td>
                    <td>${dato.total}</td>
                    <td>${dato.fecha}</td>
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
            { extend: 'print', footer: true},
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
                .column(2)
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

const html_informe = `
<div class="row" style="margin-top: 50px;">
    <div class="col-12">
        <h2>Rango de fecha</h2>
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
        <th>Numero transaccion</th>
        <th>Descripcion</th>
        <th>Monto</th>
        <th>Fecha</th>
        </thead>
        <tbody id="detalle_informe"> 
        
        </tbody>
        <tfoot>
        <th>Total:</th>
        <th></th>
        </tfoot>
    </table>
</div>
`

