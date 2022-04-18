const URL_ANULAR_FACTURA = "https://"+dominio+"/anular_factura";

const anular_factura = document.getElementById("anular_factura");
const contenedor_anular_factura = document.getElementById("contenedor");

anular_factura.addEventListener("click", function(){
    contenedor_anular_factura.innerHTML = anular_html;
    const anular_factura_variables = {
        id_talonario: "",
        numero_factura: document.getElementById("numero_factura"),
        btn_anular: document.getElementById("btn_anular"),
        cbo_codigo_set: document.getElementById("punto_expedicion_factura")
    }

    anular_factura_variables.cbo_codigo_set.onmouseover = function(){
        cargar_punto_expedicion(anular_factura_variables.cbo_codigo_set);
    };
    anular_factura_variables.cbo_codigo_set.onchange = function(){
        asignar_talonario(anular_factura_variables);
    };

    anular_factura_variables.btn_anular.onclick = function(){
        btn_anular_factura_action(anular_factura_variables);
    };
});

// Carga la lista de puntos de expedicion
const cargar_punto_expedicion = async function(select){
    if(select.options[1]===undefined){
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
                  select.appendChild(nueva_opcion);
                }
          }
    }
}

// Asignar talonario
const asignar_talonario = async function(dato){
    const solicitud = new Request(URL_TALONARIO + "/"+ dato.cbo_codigo_set.value, {
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
          alert(talonario_cuota.detail);
      }else{
          dato.id_talonario = talonario_cuota[0].id_talonario;
      }
};

// Anular Factura
const btn_anular_factura_action = async function(datos){
    const solicitud = new Request(URL_ANULAR_FACTURA+"/"+datos.id_talonario+"/"+datos.numero_factura.value, {
        method: "Put",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      const respuesta = await fetch(solicitud);
      const dato = await respuesta.json();

      if(!respuesta.ok){
          alert(dato.detail);
      }else{
          alert(dato.mensaje);
          contenedor_anular_factura.innerHTML = "";
      }
};

const anular_html = `<div class="form-row-fac col-8" style="margin-top: 50px;">
<div class="mb-3 col-4">
  <label for="punto_expedicion_factura" class="form-label">Seleccionar Punto Expedicion</label>
    <select class="form-select" aria-label="Default select example" id="punto_expedicion_factura">
      <option selected disabled>Ninguna</option>
    </select>
    <input type="hidden" id="id_codigo_set">
</div>
</div>
<div class="form-row-fac col-8">
<div class="mb-3 col-4">
  <label for="numero_factura" class="form-label">Numero de Factura</label>
  <input type="text" class="form-control" id="numero_factura">
</div>
</div>
<div class="form-row-fac col-8">
<div class="mb-3 col-4">
  <button class="btn btn-danger" style="margin-left: 6vw;" id="btn_anular">Anular</button>
</div>
</div>`;
