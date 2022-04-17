const btn_add_talonario = document.getElementById("add_talonario");

btn_add_talonario.addEventListener("click", function(){
    contenedor_form_factura_cuotas.innerHTML = html_add_talonario;
    $("#datepicker").datepicker({
        language: "es",
        format: "yyyy-mm-dd",
      });
      $("#datepicker2").datepicker({
        language: "es",
        format: "yyyy-mm-dd",
      });

      // Datos para añadir talonario
      const datos_add_talonario = {
        txt_numero_timbrado: document.getElementById("numero_timbrado"),
        cbo_codigo_set: document.getElementById("cbo_codigo_set"),
        txt_fecha_inicio: document.getElementById("datepicker"),
        txt_fecha_fin: document.getElementById("datepicker2"),
        txt_numero_inicio: document.getElementById("numero_inicio"),
        txt_numero_fin: document.getElementById("numero_fin"),
        btn_guardar: document.getElementById("guardar"),
        btn_cancelar: document.getElementById("cancelar")
      };

      // Cancelar 
      datos_add_talonario.btn_cancelar.onclick = ()=>{
        contenedor_form_factura_cuotas.innerHTML = "";
      };

      // Cargar codigos de la set
      datos_add_talonario.cbo_codigo_set.onmouseover = async ()=>{
        if(datos_add_talonario.cbo_codigo_set.options[1]===undefined){
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
              const set_talonario = await respuesta.json();
            
              if(!respuesta.ok){
                  alert("Algo salio mal al cargar los codigos de la set");
              }
              else{
                  for (let dato of set_talonario) {
                      let nueva_opcion = document.createElement("option");
                      nueva_opcion.value = dato.id_codigo_set;
                      nueva_opcion.text = `0${dato.codigo_establecimiento} 00${dato.punto_expedicion}`;
                      datos_add_talonario.cbo_codigo_set.appendChild(nueva_opcion);
                    }
              }
        }
      };

      // Guardar nuevo talonario
      datos_add_talonario.btn_guardar.onclick = async ()=>{
        const datos = {
            numero_timbrado: datos_add_talonario.txt_numero_timbrado.value,
            fecha_inicio_vigencia: datos_add_talonario.txt_fecha_inicio.value,
            fecha_fin_vigencia: datos_add_talonario.txt_fecha_fin.value,
            numero_inicial: datos_add_talonario.txt_numero_inicio.value,
            numero_final: datos_add_talonario.txt_numero_fin.value,
            id_codigo_set: datos_add_talonario.cbo_codigo_set.value,
            id_tipo_talonario: 1,
            estado: "A"
        }
        console.log(datos)
        const solicitud = new Request(URL_TALONARIO, {
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
        const matricula = await respuesta.json();
        if (!respuesta.ok) {
            alert("Error al intentar crear el talonario");
        }
        else {
            alert("Se ha creado el talonario");
        }
      };

});


const html_add_talonario = `
<h2 id="titulo-form">Agregar Talonario</h2>
<div class="form-row-fac col-8">
  <div class="mb-3 col-4">
    <label for="numero_timbrado" class="form-label">Numero timbrado</label>
    <input type="text" class="form-control" id="numero_timbrado">
  </div>
  <div class="mb-3 col-4">
    <label for="cbo_codigo_set" class="form-label">Seleccionar Punto de expedicion</label>
    <select class="form-select" aria-label="Default select example" id="cbo_codigo_set">
      <option value="0" selected disabled>Ninguno</option>
    </select>
  </div>
</div>
<div class="form-row-fac col-8">
  <div class="mb-3 col-4">
    <label for="datepicker" class="form-label">Fecha inicio vigencia</label>
    <input type="text" class="form-control" id="datepicker">
  </div>
  <div class="mb-3 col-4">
    <label for="datepicker2" class="form-label">Fecha fin de vigencia</label>
    <input type="text" class="form-control" id="datepicker2">
  </div>
</div>
<div class="form-row-fac col-8">
  <div class="mb-3 col-4">
    <label for="numero_inicio" class="form-label">Primer numero</label>
    <input type="text" class="form-control" id="numero_inicio">
  </div>
  <div class="mb-3 col-4">
    <label for="numero_fin" class="form-label">Ultimo numero</label>
    <input type="text" class="form-control" id="numero_fin">
  </div>
</div>
<div class="form-row-fac col-8 py-3">
  <button class="btn btn-primary col-2" id="guardar">Guardar</button>
  <button class="btn btn-danger col-2" id="cancelar">Cancelar</button>
</div>
`;

const btn_edit_talonario = document.getElementById("baja_talonario");
btn_edit_talonario.addEventListener("click", function(){
    contenedor_form_factura_cuotas.innerHTML = html_edit_talonario;
    const datos_edit_talonario = {
        btn_cancelar: document.getElementById("cancelar"),
        btn_guardar: document.getElementById("guardar"),
        txt_datos: document.getElementById("datos"),
        txt_id_talonario: document.getElementById("id_talonario"),
        cbo_codigo_set: document.getElementById("cbo_codigo_set")
    }
    // Cancelar 
    datos_edit_talonario.btn_cancelar.onclick = ()=>{
        contenedor_form_factura_cuotas.innerHTML = "";
    };

    // Cargar codigos de la set
    datos_edit_talonario.cbo_codigo_set.onmouseover = async ()=>{
        if(datos_edit_talonario.cbo_codigo_set.options[1]===undefined){
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
                const set_talonario = await respuesta.json();
            
                if(!respuesta.ok){
                    alert("Algo salio mal al cargar los codigos de la set");
                }
                else{
                    for (let dato of set_talonario) {
                        let nueva_opcion = document.createElement("option");
                        nueva_opcion.value = dato.id_codigo_set;
                        nueva_opcion.text = `0${dato.codigo_establecimiento} 00${dato.punto_expedicion}`;
                        datos_edit_talonario.cbo_codigo_set.appendChild(nueva_opcion);
                    }
                }
        }
    };
    // Cambia el id del talonario
    datos_edit_talonario.cbo_codigo_set.onchange = async () =>{
        const solicitud = new Request(URL_TALONARIO + "/"+ datos_edit_talonario.cbo_codigo_set.value, {
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
              datos_edit_talonario.txt_id_talonario.value = talonario_cuota[0].id_talonario;
              datos_edit_talonario.txt_datos.value = `${talonario_cuota[0].numero_inicial}-${talonario_cuota[0].numero_final}`;
          }
    };

    // Anular talonario
    datos_edit_talonario.btn_guardar.onclick = async ()=>{
        const solicitud = new Request(URL_TALONARIO+"/"+datos_edit_talonario.txt_id_talonario.value, {
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
          }
    };
});

const html_edit_talonario = `
<h2 id="titulo-form">Dar de baja Talonario</h2>
          <div class="col-8" style="display: flex; align-items: center; flex-direction: column;">
            <div class="mb-3 col-4">
              <label for="cbo_codigo_set" class="form-label">Seleccionar Punto de expedicion</label>
              <select class="form-select" aria-label="Default select example" id="cbo_codigo_set">
                <option value="0" selected disabled>Ninguno</option>
              </select>
            </div>
            <div class="mb-3 col-4">
              <label for="datos" class="form-label">Rango numeracion</label>
              <input type="text" class="form-control" id="datos">
              <input type="hidden" value="" id="id_talonario">
            </div>
          </div> 
          <div class="form-row-fac col-6 py-3">
            <button class="btn btn-primary col-2" id="guardar">Anular</button>
            <button class="btn btn-danger col-2" id="cancelar">Cancelar</button>
          </div>     
`;


const btn_add_descuento = document.getElementById("add_descuento");
btn_add_descuento.addEventListener("click", function(){
    contenedor_form_factura_cuotas.innerHTML = html_add_descuento;
    const datos_descuento = {
        txt_denominacion: document.getElementById("descripcion_descuento"),
        txt_porcentaje: document.getElementById("porcentaje"),
        btn_guardar: document.getElementById("guardar"),
        btn_cancelar: document.getElementById("cancelar")
    }
    // Cancelar
    datos_descuento.btn_cancelar.onclick = ()=>{
        contenedor_form_factura_cuotas.innerHTML = "";
    };
    // Guardar
    datos_descuento.btn_guardar.onclick = async ()=>{
        const datos = {
            descripcion: datos_descuento.txt_denominacion.value,
            porcentaje: datos_descuento.txt_porcentaje.value
        }
        console.log(datos)
        const solicitud = new Request(URL_DESCUENTOS, {
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
        const matricula = await respuesta.json();
        if (!respuesta.ok) {
            alert("Error al intentar crear el descuento");
        }
        else {
            alert("Se ha creado el descuento");
        }
    }
});

const html_add_descuento = `
<h2 id="titulo-form">Agregar Descuento</h2>
            <div class="col-8" style="display: flex; align-items: center; flex-direction: column;">
              <div class="mb-3 col-4">
                <label for="descripcion_descuento" class="form-label">Denominacion</label>
                <input type="text" class="form-control" id="descripcion_descuento">
              </div>
              <div class="mb-3 col-4">
                <label for="porcentaje" class="form-label">Porcentaje (en decimales)</label>
                <input type="text" class="form-control" id="porcentaje">
              </div>
            </div>
            <div class="form-row-fac col-6 py-3">
              <button class="btn btn-primary col-2" id="guardar">Guardar</button>
              <button class="btn btn-danger col-2" id="cancelar">Cancelar</button>
            </div>
`;