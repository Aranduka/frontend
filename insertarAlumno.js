// Restriccion de token

if (!localStorage.getItem("token")) {
  alert("No esta autorizado");
  window.location = "/";
}

// URL
const url_alumnos = "http://localhost:8000/alumnos";
const url_sacramentos = "http://localhost:8000/sacramentos";
const url_nacionalidad = "http://localhost:8000/nacionalidades";
const url_parentezco = "http://localhost:8000/parentezcos";
const url_enfermedad = "http://localhost:8000/enfermedades";
const url_alergias = "http://localhost:8000/alergias";
const url_encargado = "http://localhost:8000/encargados";

// Inicializar el HTML
document.addEventListener("DOMContentLoaded", function () {
  listar_sacramentos();
  listar_nacionalidades();
  listar_alergias();
  listar_enfermedades();
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

// Sacramentos

const cbo_sacramentos = document.getElementById("sacramentos");

const listar_sacramentos = async () => {
  const solicitud = new Request(url_sacramentos, {
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
  if (!respuesta.ok) {
    alert("Algo fallo al listar los sacramentos");
  } else {
    for (let dato of datos) {
      let nueva_opcion = document.createElement("option");
      nueva_opcion.value = dato.id_sacramento;
      nueva_opcion.text = dato.descripcion;
      cbo_sacramentos.appendChild(nueva_opcion);
    }
  }
};

const sacramentos_seleccionados = [];
const chips_sacramentos_container = document.getElementById(
  "sacramentos_seleccionados"
);

const btn_agregar_sacramento = document.getElementById("agregar_sacramento");
btn_agregar_sacramento.addEventListener("click", function (e) {
    if(cbo_sacramentos.value !== ""){
        const html = `
              <div class="chip">
              ${
                cbo_sacramentos.options[cbo_sacramentos.selectedIndex].text
              }<span id="close_sacramento_${
          cbo_sacramentos.value
        }"><i class="material-icons close">close</i></span>
              </div>
              `;
        sacramentos_seleccionados.push(cbo_sacramentos.value);
        chips_sacramentos_container.innerHTML += html;
      
        // let resultado = sacramentos_seleccionados.filter((item, index) => {
        //   return sacramentos_seleccionados.indexOf(item) === index;
        // });
        // console.log(resultado);
    }
    else {
        alert("Seleccion no disponible");
    }
});

// Nacionalidad

const cbo_nacionalidad = document.getElementById("nacionalidades");

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

// Alergia
const alergias_seleccionadas = [];
const cbo_alergias = document.getElementById("alergias");
const chips_alergias_container = document.getElementById("alergias_seleccionadas");

const btn_agregar_alergias = document.getElementById("agregar_alergia");

btn_agregar_alergias.addEventListener("click", function(e){
    if(cbo_alergias.value !== ""){
        const html = `
              <div class="chip">
              ${
                cbo_alergias.options[cbo_alergias.selectedIndex].text
              }<span id="close_sacramento_${
          cbo_alergias.value
        }"><i class="material-icons close">close</i></span>
              </div>
              `;
        alergias_seleccionadas.push(cbo_alergias.value);
        chips_alergias_container.innerHTML += html;
      
        // let resultado = sacramentos_seleccionados.filter((item, index) => {
        //   return sacramentos_seleccionados.indexOf(item) === index;
        // });
        // console.log(resultado);
    }
    else {
        alert("Seleccion no disponible");
    }
});

const listar_alergias = async () => {
    const solicitud = new Request(url_alergias, {
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
        alert("Algo salio mal al cargar las alergias");
    }
    else{
        for (let dato of datos) {
            let nueva_opcion = document.createElement("option");
            nueva_opcion.value = dato.id_alergia;
            nueva_opcion.text = dato.descripcion;
            cbo_alergias.appendChild(nueva_opcion);
          }
    }
};

// Enfermedad Base
const enfermedades_seleccionadas = [];
const cbo_enfermedad = document.getElementById("enfermedades");
const chips_enfermedades_container = document.getElementById("enfermedades_seleccionadas");
const btn_agregar_enfermedades = document.getElementById("agregar_enfermedad");

btn_agregar_enfermedades.addEventListener("click", function(e){
    if(cbo_enfermedad.value !== ""){
        const html = `
              <div class="chip">
              ${
                cbo_enfermedad.options[cbo_enfermedad.selectedIndex].text
              }<span id="close_sacramento_${
          cbo_enfermedad.value
        }"><i class="material-icons close">close</i></span>
              </div>
              `;
        enfermedades_seleccionadas.push(cbo_enfermedad.value);
        chips_enfermedades_container.innerHTML += html;
      
        // let resultado = sacramentos_seleccionados.filter((item, index) => {
        //   return sacramentos_seleccionados.indexOf(item) === index;
        // });
        // console.log(resultado);
    }
    else {
        alert("Seleccion no disponible");
    }
});

const listar_enfermedades = async () => {
    const solicitud = new Request(url_enfermedad, {
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
        alert("Algo salio mal al cargar las enfermedades");
    }
    else{
        for (let dato of datos) {
            let nueva_opcion = document.createElement("option");
            nueva_opcion.value = dato.id_enfermedad;
            nueva_opcion.text = dato.descripcion;
            cbo_enfermedad.appendChild(nueva_opcion);
          }
    }
};

// Encargado
let id_encargado = 0;
const cedula_container = document.getElementById("cedula_encargado");
cedula_container.addEventListener("blur", function(e){
    buscar_encargado();
});

const buscar_encargado = async () => {
    const solicitud = new Request(url_encargado + "/" + cedula_container.value, {
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
        alert(datos.detail);
    }
    else{
        id_encargado = datos.id_persona;
    }
};

// Agregar Alumno
const form_nombre = document.getElementById("nombre");
const form_apellido = document.getElementById("apellido");
const form_cedula = document.getElementById("cedula");
const form_fecha_nacimiento = document.getElementById("fecha_nacimiento");
const form_telefono = document.getElementById("telefono");
const form_direccion = document.getElementById("direccion");
const rdb_femenino = document.getElementById("rdb_femenino");
const rdb_masculino = document.getElementById("rdb_masculino");
const chk_religion = document.getElementById("chk_religion");
const chk_visado = document.getElementById("chk_visado");
const chk_libreta = document.getElementById("chk_libreta");
const chk_nacimiento = document.getElementById("chk_nacimiento");
const btn_guardar = document.getElementById("guardar");
const btn_cancelar = document.getElementById("cancelar");
let sexo = "";



btn_guardar.addEventListener("click", function(e){

    let sacramentos = sacramentos_seleccionados.filter((item, index) => {
        return sacramentos_seleccionados.indexOf(item) === index;
    });
    let alergias = alergias_seleccionadas.filter((item, index)=>{
        return alergias_seleccionadas.indexOf(item) === index;
    });
    let enfermedades = enfermedades_seleccionadas.filter((item, index)=>{
        return enfermedades_seleccionadas.indexOf(item) === index;
    });

    if(rdb_femenino.checked){
        sexo = rdb_femenino.value;
    }
    else if(rdb_masculino.checked){
        sexo = rdb_masculino.value;
    }
    const datos = {
        nombre: form_nombre.value,
        apellido: form_apellido.value,
        cedula: form_cedula.value,
        fecha_nacimiento: "2009-05-12",//form_fecha_nacimiento.value,
        sexo: sexo,
        nacionalidad: {
            id_nacionalidad: cbo_nacionalidad.value,
            descripcion: cbo_nacionalidad.options[cbo_nacionalidad.selectedIndex].text
        },
        telefono: form_telefono.value,
        direccion: form_direccion.value,
        estado: "A",
        profesa_religion_catolica: chk_religion.checked,
        certificado_nacimiento: chk_nacimiento.checked,
        libreta_vacunacion: chk_libreta.checked,
        certificado_estudio_visado: chk_visado.checked,
        id_encargado: id_encargado,
        id_enfermedades_base: enfermedades,
        id_alergias: alergias,
        id_sacramentos: sacramentos
    };
    insertar_alumno(datos);
    limpiar();
});

const insertar_alumno = async (params) => {

    const solicitud = new Request(url_alumnos, {
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
        alert("Error al intentar agregar alumno");
    }else{
        alert("Se ha insertado al alumno: " + form_nombre.value);
    }
};


btn_cancelar.addEventListener("click", function(e){
    limpiar();
});

const limpiar = ()=>{
    form_nombre.value = "";
    form_apellido.value = "";
    form_cedula.value = "";
    form_fecha_nacimiento.value = "";
    form_telefono.value = "";
    form_direccion.value = "";
    cedula_container.value = "";
    rdb_femenino.checked = false;
    rdb_masculino.checked = false;
    chk_libreta.checked = false;
    chk_visado.checked = false;
    chk_nacimiento.checked = false;
    chk_religion.checked = false;
    cbo_sacramentos.value = "";
    cbo_alergias.value = "";
    cbo_enfermedad.value = "";
    cbo_nacionalidad.value = "";
    chips_sacramentos_container.innerHTML = "",
    chips_alergias_container.innerHTML = "",
    chips_enfermedades_container.innerHTML =""
};