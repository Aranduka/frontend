// Restriccion de token

if (!localStorage.getItem("token")) {
    alert("No esta autorizado");
    window.location = "/";
}

//Url
