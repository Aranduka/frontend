// URLS
const URL_INFORMES_DIARIO = "http://localhost:8000/informes/cajadiario";

$(document).ready( function () {
    console.log("Holi")
    $('#contenedor_informe').DataTable();
} );

let informe_diario_datos = {
    cbo_punto_expedicion: document.getElementById("punto_expedicion_factura"),
    tabla: document.getElementById("contendor_informe"),
    id_codigo_set: ""
}

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

informe_diario_datos.cbo_punto_expedicion.onchange = async function(){
    const solicitud = new Request(URL_INFORMES_DIARIO + "?id_talonario="+ informe_diario_datos.cbo_punto_expedicion.value, {
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
        console.log(informe_diario_caja)
        for (let dato of informe_diario_caja) {
            let html = `
            <tr>
                <td>${dato.descripcion}</td>
                <td>${dato.cantidad}</td>
                <td>${dato.monto}</td>
                <td>${dato.fecha}</td>
                <td>${dato.tipo_comprobante}</td>
                <td>${dato.numero_comprobate}</td>
            </tr>
            `;
            informe_diario_datos.tabla.innerHTML += html;
          }
          
    }
};