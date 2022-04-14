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
        id_talonario: "",
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
        btn_agregar_detalle_producto_modal: document.getElementById("agregar_detalle_producto"),
        contenedor_cantidad: document.getElementById("opciones_extra_credito"),
        conetendor_cheque: document.getElementById("opciones_extra_cheque")
    }

    // objeto que guarda todos los componentes del detalle de la factura
    const detalle_factura = {
        lst_productos: document.getElementById("lst_productos"),
        txt_producto: document.getElementById("producto"),
        cbo_descuento: document.getElementById("descuento_producto"),
        txt_precio: document.getElementById("precio"),
        txt_cantidad: document.getElementById("cantidad_producto"),
        txt_disponible: document.getElementById("disponible"),
        id_descuento: 1,
        txt_descuento: "Exenta",
        txt_porcentaje_descuento: 0.0,
        id_producto: "",
        txt_id_impuesto: document.getElementById("id_impuesto"),
        cuerpo: document.getElementById("detalle_contenedor"),
        total_contenedor: document.getElementById("total_precio")
    }

    // control modal apertura
    factura_productos.btn_agregar_cuota.onclick = () => {
        let txt_disponible = document.getElementById("disponible");
        txt_disponible.value = "";
        let txt_cantidad_producto = document.getElementById("cantidad_producto");
        txt_cantidad_producto.value = "";
        let txt_producto = document.getElementById("producto");
        txt_producto.value = "";
        let lst_productos = document.getElementById("lst_productos");
        lst_productos.innerHTML = "";
        let cbo_descuento = document.getElementById("descuento_producto");
        cbo_descuento.innerHTML="";
        let precio = document.getElementById("precio");
        precio.value = "";
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
                url_facturacion_producto = "http://192.168.100.15:8000/factura_efectivo";
            }
            else {
                factura_productos.chk_contado.value = "C"
                factura_productos.contenedor_cantidad.style.display = "block";
                url_facturacion_producto = "http://192.168.100.15:8000/factura_credito";
            }
        }else {
            alert("Su factura no puede ser credito")
            factura_productos.chk_contado.checked = true;
        }
    };

    // Cambio de forma de pago
    factura_productos.cbo_forma_pago.onchange = function(){
      if(factura_productos.chk_contado.checked){
        if(factura_productos.cbo_forma_pago.value == "C"){
            factura_productos.conetendor_cheque.style.display = "flex";
            url_facturacion_producto = "http://192.168.100.15:8000/factura_cheque";
        }
        else if(factura_productos.cbo_forma_pago.value == "E"){
            factura_productos.conetendor_cheque.style.display = "none";
            url_facturacion_producto = "http://192.168.100.15:8000/factura_efectivo";
        }
        else if(factura_productos.cbo_forma_pago.value == "T"){
            factura_productos.conetendor_cheque.style.display = "none";
            url_facturacion_producto = "http://192.168.100.15:8000/factura_tarjeta";
        }
      }else {
        alert("No se puede cambiar si su factura es credito");
        factura_productos.cbo_forma_pago.selectedIndex = 0;
      }
    };

    //Cargar los puntos de expedicion
    factura_productos.cbo_punto_expedicion.onmouseover = async function(){
        if(factura_productos.cbo_punto_expedicion.options[1]===undefined){
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
    factura_productos.cbo_punto_expedicion.onchange = async function(){
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
              factura_productos.id_talonario = talonario_cuota[0].id_talonario;
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
                  nueva_opcion.value = dato.nombre;
                  nueva_opcion.id = dato.id_cliente;
                  factura_productos.lst_clientes.appendChild(nueva_opcion);
                  }
            }
          }
    };

    // Carga la cabecera de la factura
    factura_productos.txt_cliente.onchange = async function(){
        let id = "";
        for(let i = 0; factura_productos.lst_clientes.options.length > i; i++){
          if (factura_productos.lst_clientes.options[i].value === factura_productos.txt_cliente.value){
            id = factura_productos.lst_clientes.options[i].id;
          }
        }
        if (id !== ""){

          factura_productos.id_cliente = id;
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
        }
    };

    // Carga de Productos
    detalle_factura.txt_producto.onmouseover = async function(){
        if(detalle_factura.lst_productos.options[0]===undefined){
          const solicitud = new Request(URL_PRODUCTOS+"/"+localStorage.getItem("sucursal_elegida"), {
            method: "Get",
            withCredentials: true,
            credentials: "include",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          });
          const respuesta = await fetch(solicitud);
          const productos_disponibles = await respuesta.json();
        
          if(!respuesta.ok){
              alert("Algo salio mal al cargar los productos");
          }
          else{
            
              for (let dato of productos_disponibles) {
                let nueva_opcion = document.createElement("option");
                nueva_opcion.value = dato.producto.descripcion;
                nueva_opcion.id = dato.producto.id_producto;
                detalle_factura.lst_productos.appendChild(nueva_opcion);
                }
          }
        }
    };

    // Seleccionar producto
    detalle_factura.txt_producto.onchange = async ()=>{
      let id = "";
      for(let i = 0; detalle_factura.lst_productos.options.length > i; i++){
        if (detalle_factura.lst_productos.options[i].value === detalle_factura.txt_producto.value){
          id = detalle_factura.lst_productos.options[i].id;
        }
      }
      if(id!=="" && detalle_factura.cbo_descuento.value !== ""){
        const solicitud = new Request(URL_PRODUCTOS+"_buscar/"+localStorage.getItem("sucursal_elegida")+"/"+id, {
          method: "Get",
          withCredentials: true,
          credentials: "include",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        });
        const respuesta = await fetch(solicitud);
        const producto_unico = await respuesta.json();
      
        if(!respuesta.ok){
            alert("Algo salio mal al cargar el producto");
        }
        else{
          detalle_factura.id_descuento = detalle_factura.cbo_descuento.value;
          detalle_factura.id_producto = producto_unico.producto.id_producto;
          detalle_factura.txt_disponible.value = producto_unico.cantidad;
          detalle_factura.txt_precio.value = producto_unico.producto.precio;
        }
      }else {
        alert("No se selecciono ningun cliente o el descuento");
        detalle_factura.txt_producto.value="";
      }
    };    

    // Carga de descuentos 
    detalle_factura.cbo_descuento.onmouseover =async function(){
      if(detalle_factura.cbo_descuento.options[0]===undefined){
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
                  detalle_factura.cbo_descuento.appendChild(nueva_opcion);
                }
          }
      } 
    };
    // Carga de impuesto

    
    // Boton de agregar detalle
    factura_productos.btn_agregar_detalle_producto_modal.onclick = function(){
      let porcentaje_texto = detalle_factura.cbo_descuento.options[detalle_factura.cbo_descuento.selectedIndex].text;
      let porcentaje =parseFloat(porcentaje_texto.substring(0, porcentaje_texto.length -1), 10)/100;
      detalle_factura.txt_precio.value = detalle_factura.txt_precio.value - (detalle_factura.txt_precio.value * porcentaje);
      detalle_factura.txt_porcentaje_descuento = porcentaje;
      let fila = document.getElementsByClassName("fila_detalle");
      let btn = insertar_detalle_producto(detalle_factura);
      $('#detalle_modal').modal('hide');
      for (let i = 0; btn.length > i; i++){
        btn[i].onclick = ()=>{
          fila[i].remove();
          calcular_total(fila, detalle_factura.total_contenedor);
        }
      }
      calcular_total(fila, detalle_factura.total_contenedor);
    };
    //Boton cancelar
    factura_productos.btn_cancelar.onclick = function(){
      contenedor_factura_productos.innerHTML="";
    };

    // Boton de guardar factura
    factura_productos.btn_guardar.onclick = ()=>{
      
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

      factura_productos_item.numero_factura = factura_productos.txt_numero_factura.innerHTML;
      factura_productos_item.id_talonario = factura_productos.id_talonario;
      factura_productos_item.fecha_emision = factura_productos.txt_fecha.innerHTML;
      factura_productos_item.condicion_pago = factura_productos.chk_contado.value;
      factura_productos_item.forma_pago = factura_productos.cbo_forma_pago.value;
      factura_productos_item.id_cliente = factura_productos.id_cliente;
      factura_productos_item.id_usuario = factura_productos.id_usuario;
      factura_productos_item.id_institucion = factura_productos.id_sucursal;

      
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
          cantidad: null,
          id_producto: null
        };
        let hijo = fila[i].children;
        let id_descuento = hijo[6].value; 
        let id_producto = hijo[5].value;
        let precio = hijo[2].innerHTML;
        let cantidad = hijo[3].innerHTML;
        detalle.descuento.id_tipo_descuento = id_descuento;
        detalle.id_producto = id_producto;
        detalle.cantidad = cantidad;
        detalle.precio = precio;
        detalles.push(detalle);
      }
      
      if(!factura_productos.chk_contado.checked){
        factura_productos_item.cantidad_cuotas = factura_productos.txt_cantidad_cuotas.value;
      }
      if(factura_productos.cbo_forma_pago.value === "C"){
        factura_productos_item.numero_cheque = factura_productos.txt_cheque_numero.value;
        factura_productos_item.banco = factura_productos.txt_cheque_banco.value;
      }
      factura_productos_item.detalles_productos = detalles;
      console.log(factura_productos_item);
      insertar_factura(url_facturacion_producto, factura_productos_item);
    };
});

// Insertar detalle en el dom
const insertar_detalle_producto = (datos)=>{
  datos.cuerpo.innerHTML += `<tr class="fila_detalle">
  <th scope="row">${datos.txt_producto.value}</th>
  <td>${datos.cbo_descuento.options[datos.cbo_descuento.selectedIndex].text}</td>
  <td>${datos.txt_precio.value}</td>
  <td>${datos.txt_cantidad.value}</td>
  <td><button class="btn btn-danger eliminar_detalle">Eliminar</button></td>
  <input type="hidden" value="${datos.id_producto}">
  <input type="hidden" value="${datos.id_descuento ? datos.id_descuento : 1}">
  <input type="hidden" value="${datos.txt_descuento}">
  <input type="hidden" value="${datos.txt_porcentaje_descuento}">
  </tr>`;
  let btn_eliminar_linea = document.getElementsByClassName("eliminar_detalle");
  
  return btn_eliminar_linea;
};

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

//Calcular total precio 
const calcular_total = function(lineas, contenedor){
  let inicio = 0;
  let resultado = inicio;
  for(let i = 0; lineas.length > i; i++){
    let celda = lineas[i].cells
    
    resultado += celda[2].innerHTML * celda[3].innerHTML
    
  }
  contenedor.innerHTML = resultado;
};

// insertar factura 
const insertar_factura = async function(path, datos){
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
        alert("Se ha la factura");
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
              <input class="form-control" list="lista_clientes" id="txt_lista_clientes" placeholder="Nombre del cliente">
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
                  <th scope="col">Precio Unitario</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody id="detalle_contenedor">
                
              </tbody>
            </table>
          
          </div>


          <div class="form-row col-9">
          <div class="col-4"> 
            <button class="btn btn-primary" id="agregar_cuota" data-toggle="modal" data-target="detalle_modal">Agregar producto</button>
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
                  <h5 class="modal-title" id="exampleModalLongTitle">Busqueda de productos</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="cerrar_detalle_modal">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div>
                    <div class="form-row col-12" style="justify-content: space-around;">
                      <div class="col-10">
                        <label for="producto" class="form-label">Buscar producto</label>
                        <input class="form-control" list="lst_productos" id="producto" placeholder="nombre del producto">
                        <datalist id="lst_productos">
                          
                        </datalist>
                      </div>
                    </div>
                    <div class="form-row col-12" style="justify-content: space-around; margin-top: 10px;">
                      <div class="mb-3 col-4">
                        <label for="cantidad_producto" class="form-label">Cantidad</label>
                        <input type="text" class="form-control" id="cantidad_producto">
                      </div>
                      <div class="mb-3 col-4">
                        <label for="descuento_producto" class="form-label">Descuento</label>
                        <select class="form-select" aria-label="Default select example" id="descuento_producto">
                        </select>
                      </div>
                    </div>
                    <div class="form-row col-12" style="justify-content: space-around;">
                      <div class="mb-3 col-4">
                        <label for="disponible" class="form-label">Disponibilidad</label>
                        <input type="text" class="form-control" id="disponible" disabled>
                      </div>
                      <div class="mb-3 col-4">
                        <label for="precio" class="form-label">Precio</label>
                        <input type="text" class="form-control" id="precio" disabled>
                      </div>
                    </div>
                  </div>
                </div>
                <input type="hidden" id="id_impuesto" value="0">
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary" id="agregar_detalle_producto">Agregar</button>
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
                <a class="btn btn-secondary" id="imprimir" style="display: none;">Imprimir</a>
              </div>
              <div class="col-2"> 
                <button class="btn btn-danger" id="cancelar">Cancelar</button>
              </div>
          </div>
`;