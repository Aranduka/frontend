const url_login = "http://localhost:8000/login";
const url_usuarios = "http://localhost:8000/usuarios";

document.addEventListener("DOMContentLoaded", function(){
  localStorage.clear()
});

const username = document.getElementById("email");
const password = document.getElementById("password");

const boton = document.getElementById("login");

boton.addEventListener("click", function(e){
  login();
});


const login = async () => {

  const form_datos = new URLSearchParams();
  form_datos.append('grant_type','');
  form_datos.append('username', username.value);
  form_datos.append('password', password.value);
  form_datos.append('scope', '');
  form_datos.append('client_id', '');
  form_datos.append('client_secret', '');

  const solicitud = new Request(url_login, {
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    body: form_datos.toString(),
    json: true
  });
  
  const respuesta = await fetch(solicitud);
  const datos = await respuesta.json()
  if(!respuesta.ok){
    alert(datos.detail);
    localStorage.removeItem('token');
  }
  else{
    alert(datos)
    let texto = JSON.stringify(datos.sucursales);
    localStorage.setItem('token', datos.access_token);
    localStorage.setItem('sucursales', texto);
    localStorage.setItem('nombre', datos.usuario);
    localStorage.setItem('id_usuario', datos.id_usuario)
    window.location = "/html/home.html";
  }

};


// Usuarios

const listar_usuarios = async () => {
  const solicitud = new Request(url_usuarios, {
    method: 'GET',
    withCredentials: true,
    credentials: 'include',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  });
  
  const respuesta = await fetch(solicitud);
  const datos = await respuesta.json();

};


// Cursos

// const listar_cursos = async () => {
//   let respuesta = await fetch(url_cursos);
//   let cursos = await respuesta.json();
//   console.log(cursos);
// };


// Matricula

// const btn_guardar_matricula = document.getElementById("guardar_matricula");
// console.log(btn_guardar_matricula)

// btn_guardar_matricula.addEventListener("click", function(e){
//   guardar_matricula();
// });

// const guardar_matricula = async () =>{
//   const parametros = {
//     "id_alumno": 281,
//     "id_encargado": 300,
//     "fecha_inscripcion": "2022-01-31",
//     "id_curso": 1,
//     "id_institucion":1
//   }
//   const solicitud = new Request(url_matriculacion, {
//     method: 'Post',
//     withCredentials: true,
//     credentials: 'include',
//     headers: {
//       'Authorization': 'Bearer ' + localStorage.getItem("token"),
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(parametros)
//   });

//   const respuesta = await fetch(solicitud);
//   const datos = await respuesta.json()
//   console.log(datos)

// };
