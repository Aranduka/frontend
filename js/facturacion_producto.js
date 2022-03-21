// URL
let url_facturacion_producto = "http://localhost:8000/factura_efectivo";
const URL_PAGARES_PRODUCTOS = "http://localhost:8000/pagares";

// Objeto para insertar la nueva factura
const factura_productos_item = {
    numero_factura: null,
    id_talonario: null,
    fecha_emision: null,
    condicion_pago: null,
    forma_pago: null,
    anulado: false,
    total: 0,
    id_cliente: null, 
    id_usuario: null,
    total_iva: 0,
    id_insititucion: null,
    detalles_productos: [],
    detalle_pagare: []
}



// Opcion del dropdown para facturar productos
const opcion_dropdown = document.getElementById("add_factura_productos");
// Donde se hara display de los elementos html
const contenedor_factura_productos = document.getElementById("contenedor");

// Carga el html de factura en el contendor principal
opcion_dropdown.addEventListener("click", function(){
    contenedor_factura_productos.innerHTML = html_factura_productos;
    // objeto que guarda todos los componentes de la factura
    const factura_productos = {
        id_cliente: "",
        id_usuario: localStorage.getItem("id_usuario"),
        id_sucursal: localStorage.getItem("sucursal_elegida"),
        txt_fecha: document.getElementById("fecha_cliente"),
        chk_contado: document.getElementById("chk_contado"),
        txt_cliente_nombre: document.getElementById("cliente_nombre"),
        txt_cliente_telefono: document.getElementById("cliente_telefono"),
        txt_cliente_ruc: document.getElementById("cliente_ruc"),
        txt_cliente_direccion: document.getElementById("cliente_direccion"),
        cbo_punto_expedicion: document.getElementById("punto_expedicion_factura"),
        cbo_forma_pago: document.getElementById("forma_pago"),
        id_codigo_set: document.getElementById("id_codigo_set"),
        lst_clientes: document.getElementById("lista_clientes"),
        txt_cliente: document.getElementById("txt_lista_clientes"),
        txt_numero_factura: document.getElementById("numero_factura"),
        txt_cantidad_cuotas: document.getElementById("cantidad_cuotas"),
        txt_cheque_numero: document.getElementById("cheque_numero"),
        txt_cheque_banco: document.getElementById("cheque_banco"),
        btn_agregar_cuota: document.getElementById("agregar_cuota"),
        btn_guardar: document.getElementById("guardar"),
        btn_imprimir: document.getElementById("imprimir"),
        btn_cancelar: document.getElementById("cancelar"),
        btn_cerrar_detalle_modal: document.getElementById("cerrar_detalle_modal"),
        btn_agregar_detalle_cuota_modal: document.getElementById("agregar_detalle_curso"),
        contenedor_cantidad: document.getElementById("opciones_extra_credito"),
        conetendor_cheque: document.getElementById("opciones_extra_cheque")
    }

    // objeto que guarda todos los componentes del detalle de la factura
    const detalle_factura = {
        txt_ruc_cliente_cuota: document.getElementById("cedula_alumno"),
        btn_buscar_cliente: document.getElementById("buscar_cuotas"),
        cbo_pagares: document.getElementById("pagares_cuotas"),
        cbo_descuento: document.getElementById("descuento_cuota"),
        txt_descripcion_cuota: document.getElementById("descripcion_cuota"),
        txt_monto_cuota: document.getElementById("monto_cuota"),
        cuerpo: document.getElementById("detalle_contenedor"),
    }

    // control modal apertura
    factura_productos.btn_agregar_cuota.onclick = () => {
        let cbo_pagares = document.getElementById("pagares_cuotas");
        cbo_pagares.innerHTML="";
        let cbo_descuento = document.getElementById("descuento_cuota");
        cbo_descuento.innerHTML="";
        let descripcion_cuota = document.getElementById("descripcion_cuota");
        descripcion_cuota.value = "";
        let monto_cuota = document.getElementById("monto_cuota");
        monto_cuota.value = "";
        let cedula_alumno_cuota = document.getElementById("cedula_alumno");
        cedula_alumno_cuota.value = "";
        $('#detalle_modal').modal('show');
    };
    // control modal cierre
    factura_productos.btn_cerrar_detalle_modal.onclick = ()=>{
        $('#detalle_modal').modal('hide');
    };

    // Calcular Fecha
    let fecha = new Date()
    factura_productos.txt_fecha.innerHTML = fecha.toISOString().split('T')[0];

    // Cambio de contado a credito
    factura_productos.chk_contado.onchange = ()=>{
        if(factura_productos.cbo_forma_pago.value=="E"){
            if(factura_productos.chk_contado.checked){
                factura_productos.chk_contado.value = "E";
                factura_productos.contenedor_cantidad.style.display = "none";
                url_facturacion_producto = "http://localhost:8000/factura_efectivo";
            }
            else {
                factura_productos.chk_contado.value = "C"
                factura_productos.contenedor_cantidad.style.display = "block";
                url_facturacion_producto = "http://localhost:8000/factura_credito";
            }
        }else {
            alert("Su factura no puede ser credito")
            factura_productos.chk_contado.checked = true;
        }
    };

    // Cambio de forma de pago
    factura_productos.cbo_forma_pago.onchange = function(){
        if(factura_productos.cbo_forma_pago.value == "C"){
            factura_productos.conetendor_cheque.style.display = "flex";
            url_facturacion_producto = "http://localhost:8000/factura_cheque";
        }
        else if(factura_productos.cbo_forma_pago.value == "E"){
            factura_productos.conetendor_cheque.style.display = "none";
            url_facturacion_producto = "http://localhost:8000/factura_efectivo";
        }
        else if(factura_productos.cbo_forma_pago.value == "T"){
            factura_productos.conetendor_cheque.style.display = "none";
            url_facturacion_producto = "http://localhost:8000/factura_tarjeta";
        }
    };

    //Cargar los puntos de expedicion
    factura_productos.cbo_punto_expedicion.onmouseover = async function(){
        if(factura_productos.cbo_punto_expedicion.options[0]===undefined){
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
                      factura_productos.id_codigo_set.value = dato.id_codigo_set;
                      let nueva_opcion = document.createElement("option");
                      nueva_opcion.value = dato.id_codigo_set;
                      nueva_opcion.text = `0${dato.codigo_establecimiento} 00${dato.punto_expedicion}`;
                      factura_productos.cbo_punto_expedicion.appendChild(nueva_opcion);
                    }
              }
        }
    };

    // Carga de talonario y numero factura
    factura_productos.cbo_punto_expedicion.onclick = async function(){
        const solicitud = new Request(URL_TALONARIO + "/"+ factura_productos.id_codigo_set.value, {
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
              ultimo_numero_factura_productos(talonario_cuota[0].id_talonario, factura_productos);
          }
    };

    // Carga la lista de clientes 
    factura_productos.txt_cliente.onmouseover = async function(){
        if(factura_productos.lst_clientes.options[0]===undefined){
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
                  factura_productos.lst_clientes.appendChild(nueva_opcion);
                  }
            }
          }
    };

    // Carga la cabecera de la factura
    factura_productos.txt_cliente.onchange = async function(){
        let id = factura_productos.txt_cliente.value.substr(0,1);
        factura_productos.cliente_id = id;
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
           factura_productos.txt_cliente_nombre.innerHTML = cliente_unico_cuota.nombre;
           factura_productos.txt_cliente_ruc.innerHTML = cliente_unico_cuota.ruc;
           factura_productos.txt_cliente_direccion.innerHTML = cliente_unico_cuota.direccion;
           factura_productos.txt_cliente_telefono.innerHTML = cliente_unico_cuota.telefono;
        }
    };

    // Buscar Cuotas por cedula del cliente
    detalle_factura.btn_buscar_cliente.onclick = async function(){
        if(detalle_factura.cbo_pagares.options[0]===undefined){
            const solicitud = new Request(URL_PAGARES_PRODUCTOS+"/"+detalle_factura.txt_ruc_cliente_cuota.value, {
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
                    detalle_factura.cbo_pagares.appendChild(nueva_opcion);
                  }
            }
          }
    };

});

// Funcion para llamar al ultimo numero de factura
const ultimo_numero_factura_productos = async function(id_talonario, datos){
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
          
          datos.txt_numero_factura.innerHTML = numero_factura_cuota.cod
      }
}

// El html a insertarse en el contenedor
const html_factura_productos = `
<input type="hidden" id="cliente_id">
          <div class="col-12 form-row">
            <div class="col-7 factura-info">
              <div class="form-row col-12 datos-text" >
                <div class="col-6">Fecha: <span id="fecha_cliente"></span></div>
                <div class="form-check col-6">
                  <label class="form-check-label" for="chk_contado">
                    Contado
                  </label>
                  <input class="form-check-input" type="checkbox" value="E" id="chk_contado" checked>
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
                  Factura N°: <span id="numero_factura">0000</span>
                </div>
              </div>
            </div>
          </div>
          <div class=" form-row col-10">
            <div class="col-6">
              <label for="txt_lista_clientes" class="form-label">Buscar cliente</label>
              <input class="form-control" list="lista_clientes" id="txt_lista_clientes" placeholder="Nombre o Razon Social">
              <datalist id="lista_clientes">
                
              </datalist>
            </div>
            <div class="col-4" style="margin-left: 150px;">
              <label for="forma_pago" class="form-label">Forma de Pago</label>
              <select class="form-select" aria-label="Default select example" id="forma_pago">
                <option value="E">Efectivo</option>
                <option value="C">Cheque</option>
                <option value="T">Tarjeta</option>
              </select>
            </div>
          </div>
          <div id="opciones_extra_credito" class="form-row col-10" style="margin-top: 25px; display: none;">
            <div class="mb-3 col-4">
              <label for="cantidad_cuotas" class="form-label">Cantidad de Cuotas</label>
              <input type="text" class="form-control" id="cantidad_cuotas">
            </div>
          </div>
          <div id="opciones_extra_cheque" class="form-row col-10" style="margin-top: 25px; display: none;">           
            <div class="mb-3 col-4">
              <label for="cheque_numero" class="form-label">Cheque numero</label>
              <input type="text" class="form-control" id="cheque_numero">
            </div>
            <div class="mb-3 col-4" style="margin-left: 150px;">
              <label for="cheque_banco" class="form-label">Banco</label>
              <input type="text" class="form-control" id="cheque_banco">
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
          <div class="form-row col-10" style="margin-top: 60px;">
              <div class="col-2"> 
                <button class="btn btn-primary" id="guardar">Guardar</button>
              </div>
              <div class="col-2" id="btn_imprimir"> 
                <!-- <button class="btn btn-primary" id="imprimir">Imprimir</button> -->
              </div>
              <div class="col-2"> 
                <button class="btn btn-primary" id="cancelar">Cancelar</button>
              </div>
          </div>
`;