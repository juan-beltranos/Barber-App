//variables Globales

let pagina = 1;
const cita = {
  nombre: "",
  fecha: "",
  hora: "",
  servicios: [],
};

//----------------------iniciar la app---------------//
document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

function iniciarApp() {
  mostrarServicios();

  //Resalta el tab actual que se presiona
  mostrarSeccion();

  //oculta o muestra una seccion segun el tab que se presiona
  cambiarSeccion();

  //Paginacion siguiente y anterior
  paginaSiguiente();

  paginaAnterior();

  // comprueba la pagina actual
  botonesPaginador();

  //Muestra resumen de la cita o mensaje de error
  mostrarResumen();

  //Almacena el nombre de la cita en el objeto
  nombreCita();
}

//--------------------------MOSTRAR SECCION----------------------------//
function mostrarSeccion() {
  //eliminar mostrar-seccion de la seccion anterior
  const seccionAnterior = document.querySelector(".mostrar-seccion");
  if (seccionAnterior) {
    seccionAnterior.classList.remove("mostrar-seccion");
  }

  const seccionActual = document.querySelector(`#paso-${pagina}`);
  seccionActual.classList.add("mostrar-seccion");

  //eliminar la clase de actual tab anterios
  const tabAnterior = document.querySelector(".tabs .actual");
  if (tabAnterior) {
    tabAnterior.classList.remove("actual");
  }

  //resalta el tab actual
  const tab = document.querySelector(`[data-paso="${pagina}"]`);
  tab.classList.add("actual");
}

//-------------------------CAMBIAR SECCION-----------------------------------//

function cambiarSeccion() {
  const enlaces = document.querySelectorAll(".tabs button");

  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", (e) => {
      e.preventDefault();
      pagina = parseInt(e.target.dataset.paso);

      //LLamar funcion de mostrar seccion
      mostrarSeccion();

      botonesPaginador();
    });
  });
}

//---------------------------MOSTRAR SERVICIOS---------------------------//

async function mostrarServicios() {
  try {
    const res = await fetch("./servicios.json");
    const db = await res.json();

    const { servicios } = db;

    servicios.forEach((servicio) => {
      const { id, nombre, precio } = servicio;
      //DOM Scripting
      const nombreServicio = document.createElement("P");
      nombreServicio.textContent = nombre;
      nombreServicio.classList.add("nombre-servicio");

      const precioServicio = document.createElement("P");
      precioServicio.textContent = `$ ${precio}`;
      precioServicio.classList.add("precio-servicio");

      //Div contenedor del servicio
      const servicioDiv = document.createElement("DIV");
      servicioDiv.classList.add("servicio");
      servicioDiv.dataset.idServicio = id;

      //Selecciona un servicio para la cita
      servicioDiv.onclick = seleccionarServicio;

      //inyectar percio y nombre el div servicio
      servicioDiv.appendChild(nombreServicio);
      servicioDiv.appendChild(precioServicio);

      //Inyectar en HTML
      document.querySelector("#servicios").appendChild(servicioDiv);
    });
  } catch (error) {
    console.log(error);
  }
}

//---------------SELECCIONAR, AREGAR Y ELIMINAR SERVCIOS--------------///

function seleccionarServicio(e) {
  let elemento;
  // Forzar el elemnto al cual damos click sea el DIV
  if (e.target.tagName === "P") {
    elemento = e.target.parentElement;
  } else {
    elemento = e.target;
  }

  //Agregar o quitar clase al seleccionar un servicio
  if (elemento.classList.contains("seleccionado")) {
    elemento.classList.remove("seleccionado");

    const id = parseInt(elemento.dataset.idServicio);

    eliminarServicio(id);
  } else {
    elemento.classList.add("seleccionado");

    const servicioObj = {
      id: parseInt(elemento.dataset.idServicio),
      nombre: elemento.firstElementChild.textContent,
      precio: elemento.firstElementChild.nextElementSibling.textContent,
    };
    // console.log(servicioObj);
    agregarServicio(servicioObj);
  }
}

function eliminarServicio(id) {
  const { servicios } = cita;
  cita.servicios = servicios.filter((servicio) => servicio.id !== id);

  // console.log(cita);
}

function agregarServicio(servicioObj) {
  const { servicios } = cita;

  cita.servicios = [...servicios, servicioObj];

  // console.log(cita);
}

//----------------------------PAGINACION----------------//

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector("#siguiente");
  paginaSiguiente.addEventListener("click", () => {
    pagina++;

    botonesPaginador();
  });
}
function paginaAnterior() {
  const paginaAnterior = document.querySelector("#anterior");
  paginaAnterior.addEventListener("click", () => {
    pagina--;

    botonesPaginador();
  });
}

function botonesPaginador() {
  const paginaSiguiente = document.querySelector("#siguiente");
  const paginaAnterior = document.querySelector("#anterior");

  if (pagina === 1) {
    paginaAnterior.classList.add("ocultar");
  } else if (pagina === 3) {
    paginaSiguiente.classList.add("ocultar");
    paginaAnterior.classList.remove("ocultar");
  } else {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.remove("ocultar");
  }
  mostrarSeccion();
}

//--------------------------RESUMEN DE LA CITA--------------------///

function mostrarResumen() {
  const { nombre, fecha, hora, servicios } = cita;

  //Seleccionar el resumen
  const resumenDiv = document.querySelector(".contenido-resumen");

  //Validacion objeto
  if (Object.values(cita).includes("")) {
    const noServicios = document.createElement("P");
    noServicios.textContent = "Faltan datos de servicio, hora, fecha o nombre";
    noServicios.classList.add("invalidar-cita");

    //agregar a resumen div
    resumenDiv.appendChild(noServicios);
  }
}

function nombreCita() {
  const nombreInput = document.querySelector("#nombre");

  nombreInput.addEventListener("input", (e) => {
    e.preventDefault();
    const nombreTexto = e.target.value.trim();

    //Validacion que el nombre debe tener algo
    if (nombreTexto === "" || nombreTexto.length < 3) {
      mostrarAlerta("nombre no valido", "error");
    } else {
      const alerta = document.querySelector(".alerta");
      if (alerta) {
        alerta.remove();
      }
      cita.nombre = nombreTexto;
      //console.log(cita);
    }
  });
}

//------------------------ALERTAS----------------------//

function mostrarAlerta(mensaje, tipo) {
  //Si hay una alerta previa, entonces no crear otra
  const alertaPrevia = document.querySelector(".alerta");
  if (alertaPrevia) {
    return;
  }

  const alerta = document.createElement("DIV");
  alerta.textContent = mensaje;
  alerta.classList.add("alerta");

  if (tipo === "error") {
    alerta.classList.add("error");
  }

  //Inserta en el HTML
  const formulario = document.querySelector(".formulario");
  formulario.appendChild(alerta);

  //eliminar la alerta despues de 3 seg
  setTimeout(() => {
    alerta.remove();
  }, 3000);
}
