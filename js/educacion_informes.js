const URL_INFORME_CURSOS = "http://"+dominio+"/informes/alumnoscursos";

const btn_lista = document.getElementById("info_lista_alumnos");

btn_lista.addEventListener("click", function(){
    container_form.innerHTML = html_informe_alumnos;
    const datos = {
        btn_buscar: document.getElementById("buscar"),
        lst_cursos: document.getElementById("lista_cursos"),
        txt_cursos: document.getElementById("txt_cursos"),
        tabla: document.getElementById("detalle_informe"),
        txt_anho: document.getElementById("year"),
        id_curso: "",
        curso: ""
    }
    // Carga los cursos
    datos.txt_cursos.onmouseover = async ()=>{
        if(datos.lst_cursos.options[0]===undefined){
            const solicitud = new Request(URL_CURSOS+"/"+localStorage.getItem("sucursal_elegida"), {
                method: "Get",
                withCredentials: true,
                credentials: "include",
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("token"),
                  "Content-Type": "application/json",
                },
              });
              const respuesta = await fetch(solicitud);
              const cursos = await respuesta.json();
            
              if(!respuesta.ok){
                  alert("Algo salio mal al cargar los cursos");
              }
              else{
                  for (let dato of cursos) {
                    let nueva_opcion = document.createElement("option");
                    nueva_opcion.value = `${dato.descripcion} ${dato.seccion} ${dato.turno}`;
                    nueva_opcion.id = dato.id_curso;
                    datos.lst_cursos.appendChild(nueva_opcion);
                    }
              }
        }
    };
    // Busca los alumnos
    datos.btn_buscar.onclick = async ()=>{
        let id_curso = "";
        for(let i = 0; datos.lst_cursos.options.length > i; i++){
          if (datos.lst_cursos.options[i].value === datos.txt_cursos.value){
            id_curso = datos.lst_cursos.options[i].id;
            datos.id_curso = id_curso;
          }
        }
        if(datos.id_curso!==""){
            const solicitud = new Request(URL_INFORME_CURSOS + "?id_curso="+ datos.id_curso+ "&year="+datos.txt_anho.value, {
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
                let curso = informe_diario_caja[0];
                datos.curso = curso.curso;
                for (let dato of curso.alumnos) {
                    datos.tabla.innerHTML += `
                    <tr>
                        <td>${dato}</td>
                    </tr>
                    `;
                  
                  }
                iniciarDatatable();
            }
        }else{
            alert("No selecciono ningun curso");
        }
    };


});

function iniciarDatatable(){
    $('#tabla').DataTable({
        dom: 'Bfrtip',
        buttons: [
            { extend: 'print'},
            { extend: 'excel'},
            { extend: 'pdf'}
        ],
        'language':{
            'url': 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json'
         }
        
    });
}

const html_informe_alumnos = `
<h2 id="titulo-form">Lista de alumnos por curso</h2>
<div class="form-row col-8">
  <div class="mb-3 col-10">
    <label for="txt_cursos" class="form-label">Buscar Curso</label>
    <input class="form-control" list="lista_cursos" id="txt_cursos" placeholder="Cursos">
    <datalist id="lista_cursos">
    </datalist>
  </div>
</div>
<div class="form-row col-8">
  <div class="mb-3 col-4">
    <label for="year" class="form-label">Año</label>
    <input type="text" class="form-control" id="year">
  </div>
  <div class="mb-3 col-4">
    <button class="btn btn-secondary add-btn" id="buscar">Buscar</button>
  </div>
</div>
<div class="row" style="margin-top: 50px; align-self: stretch;">
<table class="table" id="tabla">
    <thead>
    <th>Datos (Nombre y Cedula)</th>
    </thead>
    <tbody id="detalle_informe"> 
    
    </tbody>
</table>
</div>
`;