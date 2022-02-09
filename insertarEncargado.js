// Restriccion de token

if (!localStorage.getItem("token")) {
    alert("No esta autorizado");
    window.location = "/";
}

// URL

const url_encargado = "http://localhost:8000/encargados";
const url_nacionalidad = "http://localhost:8000/nacionalidades";
const url_parentezco = "http://localhost:8000/parentezcos";

// Iniciar HTML

document.addEventListener("DOMContentLoaded", function(e){
    listar_nacionalidades();
    listar_parentezco();
    const calendario = document.querySelectorAll(".datepicker");
  M.Datepicker.init(calendario, {
      format: "yyyy-mm-dd",
      i18n:{
          months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"],
          monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
          weekdays: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
          weekdaysShort:["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
          weekdaysAbbrev: ["D", "L", "M", "X", "J", "V", "S"]
      },
      yearRange: 100
  });
});

// Campos

const form_nombre = document.getElementById("nombre");
const form_apellido = document.getElementById("apellido");
const form_cedula = document.getElementById("cedula");
const form_fecha_nacimiento = document.getElementById("fecha_nacimiento");
const form_telefono = document.getElementById("telefono");
const form_direccion = document.getElementById("direccion");
const rdb_femenino = document.getElementById("rdb_femenino");
const rdb_masculino = document.getElementById("rdb_masculino");
const cbo_parentezco = document.getElementById("parentezcos");
const cbo_nacionalidad = document.getElementById("nacionalidades");

// Nacionalidad

const listar_nacionalidades = async () => {
    const solicitud = new Request(url_nacionalidad, {
        method: "Get",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
    const respuesta = await fetch(solicitud);
    const datos = await respuesta.json();

    if(!respuesta.ok){
        alert("Algo salio mal al cargar las nacionalidades");
    }
    else{
        for (let dato of datos) {
            let nueva_opcion = document.createElement("option");
            nueva_opcion.value = dato.id_nacionalidad;
            nueva_opcion.text = dato.descripcion;
            cbo_nacionalidad.appendChild(nueva_opcion);
          }
    }
};


// Parentezco

const listar_parentezco = async () => {
    const solicitud = new Request(url_parentezco, {
        method: "Get",
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
    const respuesta = await fetch(solicitud);
    const datos = await respuesta.json();

    if(!respuesta.ok){
        alert("Algo salio mal al cargar los parentezcos");
    }
    else{
        for (let dato of datos) {
            let nueva_opcion = document.createElement("option");
            nueva_opcion.value = dato.id_parentezco;
            nueva_opcion.text = dato.descripcion;
            cbo_parentezco.appendChild(nueva_opcion);
          }
    }
};

const btn_guardar = document.getElementById("guardar");
const btn_cancelar = document.getElementById("cancelar");

btn_cancelar.addEventListener("click", function(e){
    limpiar();
});

const limpiar = () => {
    form_nombre.value = "";
    form_apellido.value = "";
    form_cedula.value = "";
    form_fecha_nacimiento.value = "";
    form_telefono.value = "";
    form_direccion.value = "";
    rdb_femenino.checked = false;
    rdb_masculino.checked = false;
    cbo_parentezco.value = "";
    cbo_nacionalidad.value = "";
};

btn_guardar.addEventListener("click", function(e){

    let sexo = "";
    if (rdb_femenino.checked){
        sexo = rdb_femenino.value
    }
    else if(rdb_masculino.checked){
        sexo = rdb_masculino.value
    }

    let datos = {
        nombre: form_nombre.value,
        apellido: form_apellido.value,
        cedula: form_cedula.value,
        fecha_nacimiento: form_fecha_nacimiento.value,
        sexo: sexo,
        nacionalidad: {
            id_nacionalidad: cbo_nacionalidad.value,
            descripcion: cbo_nacionalidad.options[cbo_nacionalidad.selectedIndex].text
        },
        telefono: form_telefono.value,
        direccion: form_direccion.value,
        estado: "A",
        parentezco: {
            id_parentezco: cbo_parentezco.value,
            descripcion: cbo_parentezco.options[cbo_parentezco.selectedIndex].text
        }
    }
    
    insertar_encargado(datos);
    
});

const insertar_encargado = async (params) => {

    const solicitud = new Request(url_encargado, {
        method: 'Post',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    });
    const respuesta = await fetch(solicitud);
    const datos = await respuesta.json();
    if (!respuesta.ok) {
        alert("Error al intentar agregar tutor");
        console.log(datos.detail);
    }else{
        alert("Se ha insertado al tutor: " + form_nombre.value);
    }
}


