// Restriccion de token

if (!localStorage.getItem('token')) {
    alert('No esta autorizado');
    window.location = "/";
}

// URL
const url_alumnos = "http://localhost:8000/alumnos";

