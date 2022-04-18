const dominio = "sistema-app-test1.herokuapp.com";
// Restriccion de token

if (!localStorage.getItem("token")) {
  alert("No esta autorizado");
  window.location = "/";
}

// URL 
const URL_ALERGIAS = "https://"+dominio+"/alergias";
const URL_ENFERMEDADES = "https://"+dominio+"/enfermedades";
const URL_ALUMNOS = "https://"+dominio+"/alumnos";
const URL_TUTOR = "https://"+dominio+"/encargados";

// Iniciar la pagina

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

const container_form = document.getElementById("contenedor");

// Tutor
const btn_agregar_tutor = document.getElementById("add_tutor");
//Alumno
const btn_agregar_alumno = document.getElementById("add_alumno");

let lista_sacramentos_seleccionados = [];
let lista_alergias_seleccionadas = [];
let lista_enfermedades_seleccionadas = [];

const nuevo_alumno = {};
// Carga la segunda parte del formulario de alumnos
btn_agregar_alumno.addEventListener("click", function () {
  container_form.innerHTML = form_add_alumno_part_1;
  $("#datepicker").datepicker({
    language: "es",
    format: "yyyy-mm-dd",
  });
  const btn_siguiente = document.getElementById("siguiente_alumno");
  const cbo_nacionalidad = document.getElementById("nacionalidad_alumno");
  const txt_cedula_tutor = document.getElementById("cedula_tutor");
  txt_cedula_tutor.onblur = () => {
    nuevo_alumno.cedula_tutor = txt_cedula_tutor.value;
    buscar_tutor();
  };
  btn_siguiente.onclick = () => {
    const rdb_femenino = document.getElementById("femenino");
    const rdb_masculino = document.getElementById("masculino");
    let sexo = "";
    if (rdb_femenino.checked) {
      sexo = rdb_femenino.value;
    } else {
      sexo = rdb_masculino.value;
    }
    nuevo_alumno.nombre_alumno = document.getElementById("nombre_alumno").value;
    nuevo_alumno.apellido_alumno = document.getElementById("apellido_alumno").value;
    nuevo_alumno.cedula_alumno = document.getElementById("cedula_alumno").value;
    nuevo_alumno.telefono_alumno = document.getElementById("telefono_alumno").value;
    nuevo_alumno.direccion_alumno = document.getElementById("direccion_alumno").value;
    nuevo_alumno.id_nacionalidad = document.getElementById("nacionalidad_alumno").value;
    nuevo_alumno.descripcion_nacionalidad = cbo_nacionalidad.options[cbo_nacionalidad.selectedIndex].text;
    nuevo_alumno.cedula_tutor = txt_cedula_tutor.value;
    nuevo_alumno.sexo = sexo;
    nuevo_alumno.fecha_nacimiento = document.getElementById("datepicker").value;
    // Carga parte 2 del formulario
    container_form.innerHTML = form_add_alumno_part_2;
    const cbo_sacramentos = document.getElementById("sacramentos");
    const cbo_enfermedades = document.getElementById("enfermedades");
    const cbo_alergias = document.getElementById("alergias");
    const lista_sacramentos = document.getElementById("lista_sacramentos");
    const lista_alergias = document.getElementById("lista_alergias");
    const lista_enfermedades = document.getElementById("lista_enfermedades");
    const btn_add_sacramento = document.getElementById("add_sacramento_alumno");
    const btn_add_alergia = document.getElementById("add_alergia_alumno");
    const btn_add_enfermedad = document.getElementById("add_enfermedad_alumno");

    cbo_alergias.onmouseover = async ()=>{
      if (cbo_alergias.options[0]===undefined){

        const solicitud = new Request(URL_ALERGIAS, {
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
      }
      
    };

    cbo_enfermedades.onmouseover = async ()=>{
      if (cbo_enfermedades.options[0]===undefined){

        const solicitud = new Request(URL_ENFERMEDADES, {
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
                cbo_enfermedades.appendChild(nueva_opcion);
              }
        }
      }
    };
    
    btn_add_sacramento.onclick = () => {
      let indice = cbo_sacramentos.value;
      let chip = cbo_sacramentos.options[cbo_sacramentos.selectedIndex].text;
      crear_chip(indice, chip, lista_sacramentos, lista_sacramentos_seleccionados);
      lista_sacramentos_seleccionados.push(cbo_sacramentos.value);
      
    };

    btn_add_alergia.onclick = () => {
      let indice = cbo_alergias.value;
      let chip = cbo_alergias.options[cbo_alergias.selectedIndex].text;
      crear_chip(indice, chip, lista_alergias, lista_alergias_seleccionadas);
      lista_alergias_seleccionadas.push(cbo_alergias.value);
      
    };

    btn_add_enfermedad.onclick = async () => {
      let indice = cbo_enfermedades.value;
      let chip = cbo_enfermedades.options[cbo_enfermedades.selectedIndex].text;
      crear_chip(indice, chip, lista_enfermedades, lista_enfermedades_seleccionadas);
      lista_enfermedades_seleccionadas.push(cbo_enfermedades.value);
    };

    const btn_guardar_alumno = document.getElementById("guardar_alumno");
    const btn_cancelar_alumno = document.getElementById("cancelar_alumno");
    
    btn_guardar_alumno.onclick = () => {
      let sacra = [];
      let aler = [];
      let enfer = [];
      sacra = lista_sacramentos_seleccionados.filter((item, index) => {
        return lista_sacramentos_seleccionados.indexOf(item) === index;
      });
      aler = lista_alergias_seleccionadas.filter((item, index) => {
        return lista_alergias_seleccionadas.indexOf(item) === index;
      });
      enfer = lista_enfermedades_seleccionadas.filter((item, index) => {
        return lista_enfermedades_seleccionadas.indexOf(item) === index;
      });

      const datos = {
        nombre: nuevo_alumno.nombre_alumno,
        apellido: nuevo_alumno.apellido_alumno,
        cedula: nuevo_alumno.cedula_alumno,
        fecha_nacimiento: nuevo_alumno.fecha_nacimiento,
        sexo: nuevo_alumno.sexo,
        nacionalidad: {
          id_nacionalidad: nuevo_alumno.id_nacionalidad,
          descripcion: nuevo_alumno.descripcion_nacionalidad
        },
        telefono: nuevo_alumno.telefono_alumno,
        direccion: nuevo_alumno.direccion_alumno,
        estado: "A",
        profesa_religion_catolica: chk_religion.checked,
        certificado_nacimiento: chk_nacimiento.checked,
        libreta_vacunacion: chk_vacunacion.checked,
        certificado_estudio_visado: chk_visado.checked,
        id_encargado: nuevo_alumno.id_tutor,
        id_enfermedades_base: enfer,
        id_alergias: aler,
        id_sacramentos: sacra
      }
      if (datos.id_sacramentos.length < 1){
        datos.id_sacramentos.push(1);
      }
      if (datos.id_alergias.length < 1){
        datos.id_alergias.push(1);
      }
      if (datos.id_enfermedades_base.length < 1){
        datos.id_enfermedades_base.push(1);
      }
      console.log(datos);
      //insertar_alumno(datos);
    };


    btn_cancelar_alumno.onclick = () => {
      limpiar_campos();
    };
  };
});

const limpiar_campos = () => { 
  container_form.innerHTML = ""
};

const insertar_alumno = async (datos) => {
  const solicitud = new Request(URL_ALUMNOS, {
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
  const data = await respuesta.json();
  if (!respuesta.ok) {
    alert("Error al intentar agregar alumno");
    console.log(datos.detail);
  }else{
    alert("Se ha insertado al alumno: " + nuevo_alumno.nombre_alumno + " " + nuevo_alumno.apellido_alumno);
  }
};

const crear_chip = (indice, chip, lista, items) => {
  let bandera = document.getElementById(`id_chip${chip}_${indice}`);
  if (bandera === null){
    let nuevo_chip = document.createElement("div");
    nuevo_chip.id = `chip_${chip}_${indice}`;
    nuevo_chip.classList.add("chip-form");
    nuevo_chip.innerHTML = `${chip} <span style="cursor: pointer;" id="id_chip${chip}_${indice}"><b>X</b></span>`;
    lista.appendChild(nuevo_chip);
    const eliminar_chip = document.getElementById(`id_chip${chip}_${indice}`);
    eliminar_chip.onclick = () => {
      remove_chip(eliminar_chip, items);
    };
  }
  else {
    alert("Ya selecciono ese item");
  }
};

const remove_chip = (elemento, lista) => {
  let padre = elemento.parentNode;
  padre.remove();
  let id = elemento.id;
  let indice = lista.indexOf(id.substr(-1));
  lista.splice(indice, indice+1);
};

// Control de tutor

btn_agregar_tutor.addEventListener("click", function () {
  container_form.innerHTML = form_add_tutor;
  $("#datepicker").datepicker({
    language: "es",
    format: "yyyy-mm-dd",
  });
  const btn_cancelar_tutor = document.getElementById("cancelar_tutor");
  btn_cancelar_tutor.onclick = () => {
    limpiar_campos();
  };
  const nombre_tutor = document.getElementById("nombre_tutor");
  const apellido_tutor = document.getElementById("apellido_tutor");
  const cedula_tutor = document.getElementById("cedula_tutor");
  const telefono_tutor = document.getElementById("telefono_tutor");
  const direccion_tutor = document.getElementById("direccion_tutor");
  const cbo_nacionalidad = document.getElementById("nacionalidad_tutor");
  const rdb_femenino = document.getElementById("femenino");
  const cbo_parentezco = document.getElementById("parentezco_tutor");
  const fecha_nacimiento = document.getElementById("datepicker");
  const btn_guardar_tutor = document.getElementById("guardar_tutor");
  btn_guardar_tutor.onclick = () => {

    let sexo = "";
    if (rdb_femenino.checked) {
      sexo = "F"
    }else{
      sexo = "M"
    }

    const datos = {
      nombre: nombre_tutor.value,
      apellido: apellido_tutor.value,
      cedula: cedula_tutor.value,
      fecha_nacimiento: fecha_nacimiento.value,
      sexo: sexo,
      nacionalidad: {
        id_nacionalidad: cbo_nacionalidad.value,
        descripcion: cbo_nacionalidad.options[cbo_nacionalidad.selectedIndex].text
      },
      telefono: telefono_tutor.value,
      direccion: direccion_tutor.value,
      estado: "A",
      parentezco: {
        id_parentezco: cbo_parentezco.value,
        descripcion: cbo_parentezco.options[cbo_parentezco.selectedIndex].text
      }
    };
    insertar_tutor(datos);
  };
});

const buscar_tutor = async () => {
  const solicitud = new Request(URL_TUTOR + "/" + nuevo_alumno.cedula_tutor, {
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
      nuevo_alumno.id_tutor = datos.id_persona;
  }
};

const insertar_tutor = async (datos) =>{
  
  const solicitud = new Request(URL_TUTOR, {
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
    const tutor = await respuesta.json();
    if (!respuesta.ok) {
        alert("Error al intentar agregar tutor");
        console.log(tutor.detail);
    }else{
        alert("Se ha insertado al tutor: " + datos.nombre + " " + datos.apellido);
    }
};

// html insertar tutor
const form_add_tutor = `
<h2 id="titulo-form">Agregar Tutor</h2>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="nombre_tutor" class="form-label">Nombre</label>
    <input type="text" class="form-control" id="nombre_tutor">
  </div>
  <div class="mb-3 col-4">
    <label for="apellido_tutor" class="form-label">Apellido</label>
    <input type="text" class="form-control" id="apellido_tutor">
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="cedula_tutor" class="form-label">Cedula</label>
    <input type="text" class="form-control" id="cedula_tutor">
  </div>
  <div class="mb-3 col-4">
    <label for="telefono_tutor" class="form-label">Telefono</label>
    <input type="text" class="form-control" id="telefono_tutor">
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="direccion_tutor" class="form-label">Direccion</label>
    <input type="text" class="form-control" id="direccion_tutor">
  </div>
  <div class="mb-3 col-4">
    <label for="nacionalidad_tutor" class="form-label">Nacionalidad</label>
    <select class="form-select" aria-label="Default select example" id="nacionalidad_tutor">
      <option value="1">Paraguaya</option>
      <option value="2">Argentina</option>
      <option value="3">Brasileña</option>
    </select>
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="nacionalidad_tutor" class="form-label">Sexo</label>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="sexo" id="masculino" value="M">
      <label class="form-check-label" for="masculino">
        Masculino
      </label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="sexo" id="femenino" value="F">
      <label class="form-check-label" for="femenino">
        Femenino
      </label>
    </div>
  </div>
  <div class="mb-3 col-4">
    <label for="nacionalidad_tutor" class="form-label">Parentezco</label>
    <select class="form-select" aria-label="Default select example" id="parentezco_tutor">
      <option value="1">Madre</option>
      <option value="2">Padre</option>
      <option value="3">Abuelo</option>
      <option value="4">Abuela</option>
      <option value="5">Primo</option>
      <option value="6">Hermano</option>
      <option value="7">Tutor</option>
    </select>
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="date" class="form-label">Fecha de Nacimiento</label>
    <input type='text' class="form-control" id='datepicker'/>
  </div>
  <div class="mb-3 col-4">
  
  </div>
</div>
<div class="form-row col-8 py-3">
  <button class="btn btn-primary col-2" id="guardar_tutor">Guardar</button>
  <button class="btn btn-danger col-2" id="cancelar_tutor">Cancelar</button>
</div>
`;

// html insertar alumno parte 1
const form_add_alumno_part_1 = `
<h2 id="titulo-form">Agregar Alumno</h2>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="nombre_alumno" class="form-label">Nombre</label>
    <input type="text" class="form-control" id="nombre_alumno">
  </div>
  <div class="mb-3 col-4">
    <label for="apellido_alumno" class="form-label">Apellido</label>
    <input type="text" class="form-control" id="apellido_alumno">
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="cedula_alumno" class="form-label">Cedula</label>
    <input type="text" class="form-control" id="cedula_alumno">
  </div>
  <div class="mb-3 col-4">
    <label for="telefono_alumno" class="form-label">Telefono</label>
    <input type="text" class="form-control" id="telefono_alumno">
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="direccion_alumno" class="form-label">Direccion</label>
    <input type="text" class="form-control" id="direccion_alumno">
  </div>
  <div class="mb-3 col-4">
    <label for="nacionalidad_alumno" class="form-label">Nacionalidad</label>
    <select class="form-select" aria-label="Default select example" id="nacionalidad_alumno">
      <option value="1">Paraguaya</option>
      <option value="2">Argentina</option>
      <option value="3">Brasileña</option>
    </select>
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="sexo_alumno" class="form-label">Sexo</label>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="sexo" id="masculino" value="M">
      <label class="form-check-label" for="masculino">
        Masculino
      </label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="sexo" id="femenino" value="F">
      <label class="form-check-label" for="femenino">
        Femenino
      </label>
    </div>
  </div>
  <div class="mb-3 col-4">
    
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="cedula_tutor" class="form-label">Cedula del Tutor</label>
    <input type="text" class="form-control" id="cedula_tutor">
  </div>
  <div class="mb-3 col-4">
    <label for="date" class="form-label">Fecha de Nacimiento</label>
    <input type='text' class="form-control" id='datepicker'/>
  </div>
</div>
<div class="form-row col-8 py-3">
  <button class="btn btn-primary col-2" id="siguiente_alumno">Siguiente -></button>
</div>
`;

// html insertar alumno parte 2
const form_add_alumno_part_2 = `
<h2 id="titulo-form">Agregar Alumno</h2>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="sacramentos" class="form-label">Sacramentos</label>
    <select class="form-select" aria-label="Default select example" id="sacramentos">
      <option value="1">Ninguno</option>
      <option value="2">Bautismo</option>
      <option value="3">Eucaristia</option>
      <option value="4">Confirmacion</option>
    </select>
    <div id="lista_sacramentos" class="form-row">
      
    </div>
  </div>
  <div class="mb-3 col-4">
    <button class="btn btn-secondary add-btn" id="add_sacramento_alumno">Agregar sacramento</button>
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="enfermedades" class="form-label">Enfermedades de Base</label>
    <select class="form-select" aria-label="Default select example" id="enfermedades">
    </select>
    <div id="lista_enfermedades" class="form-row">
    </div>
  </div>
  <div class="mb-3 col-4">
    <button class="btn btn-secondary add-btn" id="add_enfermedad_alumno">Agregar enfermedad base</button>
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="alergias" class="form-label">Alergias</label>
    <select class="form-select" aria-label="Default select example" id="alergias">
    </select>
    <div id="lista_alergias" class="form-row">
    </div>
  </div>
  <div class="mb-3 col-4">
    <button class="btn btn-secondary add-btn" id="add_alergia_alumno">Agregar alergia</button>
  </div>
</div>
<br>
<br>

<div class="form-row col-8">
  <div class="mb-3 col-4">
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="chk_religion">
      <label class="form-check-label" for="chk_religion">
        Profesa Religion Catolica?
      </label>
    </div>
  </div>
  <div class="mb-3 col-4">
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="chk_vacunacion">
      <label class="form-check-label" for="chk_vacunacion">
        Presento Certificado de Vacunación?
      </label>
    </div>
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="chk_visado">
      <label class="form-check-label" for="chk_visado">
        Presento Certificado de Educacion Visado?
      </label>
    </div>
  </div>
  <div class="mb-3 col-4">
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="chk_nacimiento">
      <label class="form-check-label" for="chk_nacimiento">
        Presento Certificado de Nacimiento?
      </label>
    </div>
  </div>
</div>
<div class="form-row col-8">
  <div class="form-row col-8 py-3">
    <button class="btn btn-primary col-2" id="guardar_alumno">Guardar</button>
    <button class="btn btn-danger col-2" id="cancelar_alumno">Cancelar</button>
  </div>
</div>
`;
