// Restriccion de token

if (!localStorage.getItem('token')) {
    alert('No esta autorizado');
    window.location = "/";
}

// URL
const url_alumnos = "http://localhost:8000/alumnos";

// Inicializar el HTML 
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.datepicker');
    var instances1 = M.Datepicker.init(elems);
    var elems = document.querySelectorAll('.chips');
    var instances = M.Chips.init(elems);
    console.log(M.Chips.getInstance())
  });



const btn_agregar_sacramento = document.getElementById("agregar_sacramento");
const chips_sacramentos = document.querySelectorAll(".chips");
materialize_chips = M.Chips.getInstance(chips_sacramentos);

btn_agregar_sacramento.addEventListener("click", function(e){
    materialize_chips.addChip({
        tag: "Holii"
    });
});