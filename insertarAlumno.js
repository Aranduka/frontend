// Restriccion de token

if (!localStorage.getItem('token')) {
    alert('No esta autorizado');
    window.location = "/";
}

// URL
const url_alumnos = "http://localhost:8000/alumnos";
const url_sacramentos = "http://localhost:8000/sacramentos";

// Inicializar el HTML 
document.addEventListener('DOMContentLoaded', function () {
    listar_sacramentos();
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems);
});


// Sacramentos

const cbo_sacramentos = document.getElementById("sacramentos");

const listar_sacramentos = async () => {

    const solicitud = new Request(
        url_sacramentos,
        {
            method: 'Get',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token"),
                'Content-Type': 'application/json'
            }
        }
    );
    const respuesta = await fetch(solicitud);
    const datos = await respuesta.json();
    if (!respuesta.ok) {
        alert("Algo fallo al listar los sacramentos");
    }
    else {

        for (let dato of datos) {
            let nueva_opcion = document.createElement("option");
            nueva_opcion.value = dato.id_sacramento;
            nueva_opcion.text = dato.descripcion;
            cbo_sacramentos.appendChild(nueva_opcion);
        }
    }
};

const sacramentos_seleccionados = [];
const chips_sacramentos_container = document.getElementById("sacramentos_seleccionados");


const btn_agregar_sacramento = document.getElementById("agregar_sacramento");
btn_agregar_sacramento.addEventListener("click", function (e) {
    if (sacramentos_seleccionados.includes(cbo_sacramentos.value)) {
        alert("Sacramento ya agregado");
    }
    else {

        const html = `
        <div class="chip">
        ${cbo_sacramentos.options[cbo_sacramentos.selectedIndex].text}<span id="close_sacramento_${cbo_sacramentos.value}"><i class="material-icons close">close</i></span>
        </div>
        `;
        sacramentos_seleccionados.push(cbo_sacramentos.value);
        chips_sacramentos_container.innerHTML += html;

        // Agregare un event listener dentro de un for para 
        // iterar en el array con los valores y darles a cada uno que se pueda eliminar
        // con un settimeout

        for (sacramento of sacramentos_seleccionados) {
            const eliminar_sacramento = document.getElementById(`close_sacramento_${sacramento}`);
            eliminar_sacramento.onclick = () => {
                let id = eliminar_sacramento.getAttribute("id");
                let dato = id.charAt(id.length-1);
                let indice = sacramentos_seleccionados.indexOf(dato);
                sacramentos_seleccionados.slice(indice, indice + 1);
                console.log(sacramentos_seleccionados);
                console.log(dato);
                console.log(indice);
            }

        }


    }
});



