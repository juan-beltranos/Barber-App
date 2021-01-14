document.addEventListener("DOMContentLoaded", function () {
  validarAdmin();
  validarContraseña();
});

function validarAdmin() {
  const admin = document.querySelector("#admin");

  admin.addEventListener("input", (e) => {
    const adminTexto = e.target.value.trim();

    // Validación de que nombreTexto debe tener algo
    if (adminTexto === "" || adminTexto.length < 3) {
      mostrarAlerta("Nombre no valido", "error");
    } else {
      const alerta = document.querySelector(".alerta");
      if (alerta) {
        alerta.remove();
      }
      cita.nombre = nombreTexto;
    }
  });
}

function validarContraseña() {
  const contraseña = document.querySelector("#contraseña");

  contraseña.addEventListener("input", (e) => {
    const contraseñaTexto = e.target.value.trim();

    // Validación de que nombreTexto debe tener algo
    if (contraseñaTexto === "") {
      mostrarAlerta("Debes llenar el campo", "error");
    } else if (contraseñaTexto.length < 5) {
      mostrarAlerta("La contraseña debe tener almenos 5 caracteres", "error");
    } else {
      const alerta = document.querySelector(".alerta");
      if (alerta) {
        alerta.remove();
      }
      cita.nombre = nombreTexto;
    }
  });
}
function iniciarSesion() {
  if (
    document.form.admin.value == "admin" &&
    document.form.contraseña.value == "contraseña"
  ) {
    document.form.submit();
  } else {
    mostrarAlerta("Usuario o contraseña incorrectas", "error");
  }
}

function mostrarAlerta(mensaje, tipo) {
  // Si hay una alerta previa, entonces no crear otra
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

  // Insertar en el HTML
  const formulario = document.querySelector("#app");
  formulario.appendChild(alerta);

  // Eliminar la alerta después de 3 segundos
  setTimeout(() => {
    alerta.remove();
  }, 3000);
}
