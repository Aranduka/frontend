const dominio = "sistema-app-test1.herokuapp.com";
// URL
let url_facturacion_producto = "https://"+dominio+"/factura_efectivo";
let url_imprimir = "https://"+dominio+"/facturas/imprimir";
const URL_PAGARES_PRODUCTOS = "https://"+dominio+"/pagares";
const URL_PRODUCTOS = "https://"+dominio+"/productos_sucursal";
const URL_ALUMNOS = "https://"+dominio+"/alumnos_sucursal";
// Restriccion de token

if (!localStorage.getItem("token")) {
    alert("No esta autorizado");
    window.location = "/frontend";
}

URL_SET = "https://"+dominio+"/set";
URL_TALONARIO = "https://"+dominio+"/talonarios";
URL_SIGUIENTE_NUMERO = "https://"+dominio+"/siguienteNumero";
URL_CLIENTES = "https://"+dominio+"/clientes";
URL_DESCUENTOS = "https://"+dominio+"/descuentos";
URL_PAGARES_CUOTAS = "https://"+dominio+"/pagares_cuotas";


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
        id_cliente: "",
        id_talonario: "",
        id_usuario: localStorage.getItem("id_usuario"),
        id_sucursal: localStorage.getItem("sucursal_elegida"),
        punto_expedicion_factura_cuotas: document.getElementById("punto_expedicion_factura"),
        conetendor_cheque: document.getElementById("opciones_extra_cheque"),
        chk_contado: document.getElementById("chk_contado"),
        txt_cheque_numero: document.getElementById("cheque_numero"),
        txt_cheque_banco: document.getElementById("cheque_banco"),
        cbo_forma_pago: document.getElementById("forma_pago"),
        numero_factura: document.getElementById("numero_factura"),
        id_codigo_set: document.getElementById("id_codigo_set"),
        lista_clientes: document.getElementById("lista_clientes"),
        txt_lista_cliente: document.getElementById("txt_lista_clientes"),
        cliente_nombre: document.getElementById("cliente_nombre"),
        cliente_telefono: document.getElementById("cliente_telefono"),
        cliente_direccion: document.getElementById("cliente_direccion"),
        cliente_ruc: document.getElementById("cliente_ruc"),
        fecha: document.getElementById("fecha_cliente"),
        btn_agregar_detalle_cuota: document.getElementById("agregar_cuota"),
        btn_cerrar_detalle_modal: document.getElementById("cerrar_detalle_modal"),
        btn_agregar_detalle_cuota_modal: document.getElementById("agregar_detalle_curso"),
        btn_cancelar: document.getElementById("cancelar"),
        btn_guardar: document.getElementById("guardar")
    };
    const datos_detalle = {
      cedula_alumno_cuota: document.getElementById("cedula_alumno"),
      id_pagare: "",
      id_descuento: "",
      id_impuesto: "1",
      cedula: "",
      total_contenedor: document.getElementById("total_precio"),
      txt_porcentaje_descuento: 0.0,
      txt_lista_alumnos: document.getElementById("txt_lista_alumnos"),
      txt_lista_pagare: document.getElementById("txt_lista_cuotas"),
      lst_alumnos: document.getElementById("lista_alumnos"),
      lst_cuotas: document.getElementById("lista_cuotas"),
      cbo_descuento: document.getElementById("descuento_cuota"),
      descripcion_cuota: document.getElementById("descripcion_cuota"),
      monto_cuota: document.getElementById("monto_cuota"),
      cuerpo: document.getElementById("detalle_contenedor"),
    }

    // Carga los alumnos
    datos_detalle.txt_lista_alumnos.onmouseover = async ()=>{
      
        if(datos_detalle.lst_alumnos.options[0]===undefined){
          const solicitud = new Request(URL_ALUMNOS+"/"+localStorage.getItem("sucursal_elegida"), {
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
              alert("Algo salio mal al cargar los alumnos");
          }
          else{
              for (let dato of pagares_cuotas) {
                let nueva_opcion = document.createElement("option");
                nueva_opcion.value = `${dato.nombre} ${dato.apellido}`;
                nueva_opcion.id = dato.cedula;
                datos_detalle.lst_alumnos.appendChild(nueva_opcion);
                }
          }
        }
      
    };

    // Carga de pagares
    datos_detalle.txt_lista_alumnos.onchange = async ()=>{
      if (datos_detalle.cbo_descuento.value !== "" || datos_detalle.txt_lista_alumnos.value !== ""){
        datos_detalle.lst_cuotas.innerHTML = "";
        let cedula = "";
        for(let i = 0; datos_detalle.lst_alumnos.options.length > i; i++){
          if (datos_detalle.lst_alumnos.options[i].value === datos_detalle.txt_lista_alumnos.value){
            cedula = datos_detalle.lst_alumnos.options[i].id;
            datos_detalle.cedula = cedula;
          }
        }
      
        const solicitud = new Request(URL_PAGARES_CUOTAS+"/"+cedula, {
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
              let numero_cuota = dato.numero_cuota;
              let mes = "";
              switch(numero_cuota){
                case 0:
                  mes = "Matricula";
                  break;
                case 1:
                  mes = "Febrero";
                  break;
                case 2:
                  mes = "Marzo";
                  break;
                case 3:
                  mes = "Abril";
                  break;
                case 4:
                  mes = "Mayo";
                  break;
                case 5:
                  mes = "Junio";
                  break;
                case 6:
                  mes = "Julio";
                  break;
                case 7:
                  mes = "Agosto";
                  break;
                case 8:
                  mes = "Setiembre";
                  break;
                case 9: 
                  mes = "Octubre";
                  break;
                case 10:
                  mes = "Noviembre";
                  break;
                default:
                  mes = "No hay datos";
                  break;
              }
              nueva_opcion.value = `Cuota ${mes}: Gs.${dato.monto}`;
              nueva_opcion.id = dato.id_pagare;
              datos_detalle.lst_cuotas.appendChild(nueva_opcion);
              }
        }
      }else{
       
          alert("No selecciono ningun descuento o alumno");
        
      }
    };
   

    // Carga los descuentos
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

    // Despliega el modal
    datos_facturas_cuotas_dom.btn_agregar_detalle_cuota.onclick = () =>{
      
      let cbo_descuento = document.getElementById("descuento_cuota");
      cbo_descuento.innerHTML="";
      let descripcion_cuota = document.getElementById("descripcion_cuota");
      descripcion_cuota.value = "";
      let monto_cuota = document.getElementById("monto_cuota");
      monto_cuota.value = "";
      let alumno = document.getElementById("txt_lista_alumnos");
      alumno.value = "";
      let cuota = document.getElementById("txt_lista_cuotas");
      cuota.value = "";
      let lista = document.getElementById("lista_cuotas");
      lista.innerHTML = "";
      
      $('#detalle_modal').modal('show');
    };

    datos_facturas_cuotas_dom.btn_cerrar_detalle_modal.onclick = () => {
      $('#detalle_modal').modal('hide');
    };

    let fecha = new Date()
    datos_facturas_cuotas_dom.fecha.innerHTML = fecha.toISOString().split('T')[0];

    // Lista los clientes
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
              nueva_opcion.value = dato.nombre;
              nueva_opcion.id = dato.id_cliente;
              datos_facturas_cuotas_dom.lista_clientes.appendChild(nueva_opcion);
              }
        }
      }
    };

    // Carga del codigo set
    datos_facturas_cuotas_dom.punto_expedicion_factura_cuotas.onmouseover = async () =>{
        if(datos_facturas_cuotas_dom.punto_expedicion_factura_cuotas.options[1]===undefined){
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
    // Carga de el numero de factura al dale click al codigo set
    datos_facturas_cuotas_dom.punto_expedicion_factura_cuotas.onchange = async ()=>{
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
              datos_facturas_cuotas_dom.id_talonario = talonario_cuota[0].id_talonario;
          }
    };
    // Carga de la cabecera de la factura
    datos_facturas_cuotas_dom.txt_lista_cliente.onchange = async ()=>{
      let id = "";
        for(let i = 0; datos_facturas_cuotas_dom.lista_clientes.options.length > i; i++){
          if (datos_facturas_cuotas_dom.lista_clientes.options[i].value === datos_facturas_cuotas_dom.txt_lista_cliente.value){
            id = datos_facturas_cuotas_dom.lista_clientes.options[i].id;
          }
        }
      if (id !== ""){
        datos_facturas_cuotas_dom.id_cliente = id;
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
      }
    };

    // Agrega al dom el nuevo detalle
    datos_facturas_cuotas_dom.btn_agregar_detalle_cuota_modal.onclick = () => {
      let id = "";
      for(let i = 0; datos_detalle.lst_cuotas.options.length > i; i++){
        if (datos_detalle.lst_cuotas.options[i].value === datos_detalle.txt_lista_pagare.value){
          id = datos_detalle.lst_cuotas.options[i].id;
        }
      }
      datos_detalle.id_descuento = datos_detalle.cbo_descuento.value;
      datos_detalle.id_pagare = id;
      datos_detalle.txt_porcentaje_descuento = datos_detalle.cbo_descuento.options[datos_detalle.cbo_descuento.selectedIndex].text
      let btn = insertar_detalle_cuota(datos_detalle);
      let fila = document.getElementsByClassName("fila_detalle");
      $('#detalle_modal').modal('hide');
      for (let i = 0; btn.length > i; i++){
        btn[i].onclick = ()=>{
          fila[i].remove();
          calcular_total_cuota(fila, datos_detalle.total_contenedor);
        }
      }
      calcular_total_cuota(fila, datos_detalle.total_contenedor);
    };

    // Cambio de la forma de pago
    datos_facturas_cuotas_dom.cbo_forma_pago.onchange = function(){
      if(datos_facturas_cuotas_dom.chk_contado.checked){
        if(datos_facturas_cuotas_dom.cbo_forma_pago.value == "C"){
            datos_facturas_cuotas_dom.conetendor_cheque.style.display = "flex";
            url_facturacion_producto = "https://"+ dominio +"/factura_cheque";
        }
        else if(datos_facturas_cuotas_dom.cbo_forma_pago.value == "E"){
            datos_facturas_cuotas_dom.conetendor_cheque.style.display = "none";
            url_facturacion_producto = "https://"+ dominio +"/factura_efectivo";
        }
        else if(datos_facturas_cuotas_dom.cbo_forma_pago.value == "T"){
            datos_facturas_cuotas_dom.conetendor_cheque.style.display = "none";
            url_facturacion_producto = "https://"+ dominio +"/factura_tarjeta";
        }
      }else {
        alert("No se puede cambiar si su factura es credito");
        datos_facturas_cuotas_dom.cbo_forma_pago.selectedIndex = 0;
      }
    };
    
    datos_facturas_cuotas_dom.btn_cancelar.onclick = function(){
      contenedor_form_factura_cuotas.innerHTML = ""
    };

    datos_facturas_cuotas_dom.btn_guardar.onclick = function(){
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
        id_institucion: null,
        detalles_productos: [],
        detalle_pagare: []
    }
    
    
      const detalles = [];

      factura_productos_item.numero_factura = datos_facturas_cuotas_dom.numero_factura.innerHTML;
      factura_productos_item.id_talonario = datos_facturas_cuotas_dom.id_talonario;
      factura_productos_item.fecha_emision = datos_facturas_cuotas_dom.fecha.innerHTML;
      factura_productos_item.condicion_pago = "E";
      factura_productos_item.forma_pago = datos_facturas_cuotas_dom.cbo_forma_pago.value;
      factura_productos_item.id_cliente = datos_facturas_cuotas_dom.id_cliente;
      factura_productos_item.id_usuario = datos_facturas_cuotas_dom.id_usuario;
      factura_productos_item.id_institucion = datos_facturas_cuotas_dom.id_sucursal;

      
      let fila = document.getElementsByClassName("fila_detalle");
      for (let i=0; fila.length > i; i++){
        let detalle = {
          descuento: {
            id_tipo_descuento: null,
            descripcion: "Exenta",
            porcentaje: 0.0
          },
          impuesto: {
            id_tipo_impuesto: 1,
            descripcion: "Exenta",
            porcentaje: 0.0
          },
          precio: null,
          descripcion: null,
          id_pagare: null
        };
        let hijo = fila[i].children;
        let id_descuento = hijo[5].value; 
        let id_pagare = hijo[4].value;
        let monto = hijo[2].innerHTML;
        let descripcion = hijo[0].innerHTML;
        detalle.descuento.id_tipo_descuento = id_descuento;
        detalle.id_pagare = id_pagare;
        detalle.descripcion = descripcion;
        detalle.precio = monto;
        detalles.push(detalle);
      }
      
      if(datos_facturas_cuotas_dom.cbo_forma_pago.value === "C"){
        factura_productos_item.numero_cheque = datos_facturas_cuotas_dom.txt_cheque_numero.value;
        factura_productos_item.banco = datos_facturas_cuotas_dom.txt_cheque_banco.value;
      }
      factura_productos_item.detalle_pagare = detalles;
      console.log(factura_productos_item);
      insertar_factura_cuota(url_facturacion_producto, factura_productos_item);
    };

});

// Inserta el detalle en la facrtura
const insertar_detalle_cuota = (datos)=>{
  datos.cuerpo.innerHTML += `<tr class="fila_detalle">
  <th scope="row">${datos.descripcion_cuota.value}</th>
  <td>${datos.cbo_descuento.options[datos.cbo_descuento.selectedIndex].text}</td>
  <td>${datos.monto_cuota.value}</td>
  <td><button class="btn btn-danger eliminar_detalle">Eliminar</button></td>
  <input type="hidden" value="${datos.id_pagare}"/>
  <input type="hidden" value="${datos.id_descuento}"/>
  </tr> 
  `;
  
  let btn_eliminar_linea = document.getElementsByClassName("eliminar_detalle");
  
  return btn_eliminar_linea;
};

//Calcular total precio 
const calcular_total_cuota = function(lineas, contenedor){
  let inicio = 0;
  let resultado = inicio;
  for(let i = 0; lineas.length > i; i++){
    let celda = lineas[i].cells
    console.log(celda[2].innerHTML)
    resultado += celda[2].innerHTML * 1
  }
  contenedor.innerHTML = resultado;
};

// Inserta la factura en la base de datos
const insertar_factura_cuota = async function(path, datos){
  const solicitud = new Request(path, {
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
    const factura = await respuesta.json();
    if (!respuesta.ok) {
        alert(factura.detail);
        console.log(factura.detail);
    }else{
        alert("Se ha guardado la factura");
        // insercion de la impresion
        let link_contrato = document.getElementById("imprimir");
        link_contrato.href = `${url_imprimir}/${factura.cod}`;
        //link_contrato.download = "Contrato";
        link_contrato.style.display = "block";
        link_contrato.target = "_blank";
        link_contrato.onclick = ()=>{
             link_contrato.style.display = "none";
        };
    }
}

// Llama al ultimo numero de la factura en ese talonario
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
                      <option selected disabled>Ninguna</option>
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
                <input class="form-control" list="lista_clientes" id="txt_lista_clientes" placeholder="Nombre del cliente" autocomplete="off">
                <datalist id="lista_clientes" autocomplete="off">
                  
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
  <div class="col-4" style="font-size: 20px; font-weight: bold;" > 
    Total: <span id="total_precio">0</span>
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
            <div class="mb-3 col-10">
              <label for="txt_lista_alumnos" class="form-label">Buscar alumno</label>
              <input class="form-control" list="lista_alumnos" id="txt_lista_alumnos" placeholder="Nombre del alumno" autocomplete="off">
              <datalist id="lista_alumnos" autocomplete="off">
                
              </datalist>
            </div>
          </div>
          <div class="form-row col-12" style="justify-content: space-around;">
            <div class="mb-3 col-4">
              <label for="txt_lista_pagares" class="form-label">Buscar cuota</label>
              <input class="form-control" list="lista_cuotas" id="txt_lista_cuotas" placeholder="mes o monto" autocomplete="off">
              <datalist id="lista_cuotas">
                
              </datalist>
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
<div class="form-row col-10" style="margin-top: 60px">
  <div class="col-2"> 
    <button class="btn btn-primary" id="guardar">Guardar</button>
  </div>
  <div class="col-2" id="btn_imprimir"> 
    <a class="btn btn-primary" id="imprimir" style="display: none;">Imprimir</a>
  </div>
  <div class="col-2"> 
    <button class="btn btn-primary" id="cancelar">Cancelar</button>
  </div>
</div>`;