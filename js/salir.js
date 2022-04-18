const btn_salir = document.getElementById("salir");
btn_salir.addEventListener("click", function(){
    localStorage.clear();
    window.location = "/";
});