const API_URL = "http://localhost:5215/api";

let usuarioActual = null;
let profesorActual = null;

// ================== Utilidades ==================

function obtenerUsuarioActual() {
    const json = localStorage.getItem("usuarioActual");
    if (!json) return null;
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}

function obtenerProfesorActual() {
    const json = localStorage.getItem("profesorActual");
    if (!json) return null;
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}

function asegurarSesion() {
    usuarioActual = obtenerUsuarioActual();
    if (!usuarioActual) {
        alert("Debes iniciar sesión primero.");
        window.location.href = "login.html";
        return false;
    }
    return true;
}

// ================== Inicio ==================

document.addEventListener("DOMContentLoaded", async () => {
    if (!asegurarSesion()) return;

    // Mostrar nombre
    document.getElementById("prof-nombre").textContent = usuarioActual.nombre || "Profesor";

    // Cerrar sesión
    const btnCerrar = document.getElementById("btn-cerrar-sesion");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            localStorage.removeItem("usuarioActual");
            localStorage.removeItem("profesorActual");
            window.location.href = "login.html";
        });
    }

    // Cargar info de profesor
    profesorActual = obtenerProfesorActual();
    if (!profesorActual) {
        // Intentar traerla desde la API
        try {
            const resp = await fetch(`${API_URL}/Profesores/usuario/${usuarioActual.id}`);
            if (resp.ok) {
                profesorActual = await resp.json();
                localStorage.setItem("profesorActual", JSON.stringify(profesorActual));
            }
        } catch (err) {
            console.error(err);
        }
    }

    actualizarCabeceraProfesor();
});

function actualizarCabeceraProfesor() {
    const detalle = document.getElementById("prof-detalle");
    const lblColegio = document.getElementById("prof-colegio");
    const lblTurno = document.getElementById("prof-turno");

    if (!profesorActual) {
        if (detalle) detalle.textContent = "Aún no has registrado tus datos de profesor.";
        if (lblColegio) lblColegio.textContent = "Colegio: -";
        if (lblTurno) lblTurno.textContent = "Turno: -";
        return;
    }

    if (detalle) detalle.textContent =
        `Colegio: ${profesorActual.colegio} · Grupos: ${profesorActual.gruposQueDa}`;
    if (lblColegio) lblColegio.textContent = `Colegio: ${profesorActual.colegio}`;
    if (lblTurno) lblTurno.textContent = `Turno: ${profesorActual.turno}`;
}

// ================== Registro de notas ==================

function limpiarFormularioNota() {
    document.getElementById("alumnoId").value = "";
    document.getElementById("materiaId").value = "";
    document.getElementById("trimestre").value = "1";
    document.getElementById("tipo").value = "Diaria";
    document.getElementById("valor").value = "";
    const msg = document.getElementById("msg-registro");
    msg.textContent = "";
    msg.classList.remove("text-red-400", "text-green-400");
}

async function guardarNota() {
    const alumnoId = parseInt(document.getElementById("alumnoId").value);
    const materiaId = parseInt(document.getElementById("materiaId").value);
    const trimestre = parseInt(document.getElementById("trimestre").value);
    const tipo = document.getElementById("tipo").value;
    const valor = parseFloat(document.getElementById("valor").value);

    const msg = document.getElementById("msg-registro");
    msg.classList.remove("text-red-400", "text-green-400");

    if (isNaN(alumnoId) || alumnoId <= 0) {
        alert("Debes indicar un ID de alumno válido.");
        return;
    }

    if (isNaN(materiaId) || materiaId <= 0) {
        alert("Debes indicar un ID de materia válido.");
        return;
    }

    if (isNaN(valor)) {
        alert("Debes indicar un valor numérico para la nota.");
        return;
    }

    const nota = {
        alumnoId,
        materiaId,
        valor,
        tipo,
        trimestre,
        fecha: new Date().toISOString()
    };

    try {
        const resp = await fetch(`${API_URL}/Notas/crear`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nota)
        });

        if (!resp.ok) {
            const texto = await resp.text();
            msg.textContent = "Error al guardar la nota: " + texto;
            msg.classList.add("text-red-400");
            return;
        }

        const data = await resp.json();
        console.log("Nota creada:", data);

        msg.textContent = "Nota guardada correctamente.";
        msg.classList.add("text-green-400");

        // Opcional: limpiar después de un momento
        setTimeout(() => limpiarFormularioNota(), 1500);

    } catch (err) {
        console.error(err);
        msg.textContent = "Error de conexión con la API.";
        msg.classList.add("text-red-400");
    }
}

// ================== Consulta de notas ==================

async function consultarNotasAlumno() {
    const alumnoId = parseInt(document.getElementById("alumnoIdConsulta").value);
    const msg = document.getElementById("msg-consulta");
    const tbody = document.getElementById("tabla-notas");

    msg.classList.remove("text-red-400", "text-green-400");
    msg.textContent = "";
    tbody.innerHTML = "";

    if (isNaN(alumnoId) || alumnoId <= 0) {
        alert("Ingresa un ID de alumno válido.");
        return;
    }

    try {
        const resp = await fetch(`${API_URL}/Notas/alumno/${alumnoId}`);
        if (!resp.ok) {
            const texto = await resp.text();
            msg.textContent = "Error al consultar: " + texto;
            msg.classList.add("text-red-400");
            return;
        }

        const notas = await resp.json() || [];

        if (notas.length === 0) {
            msg.textContent = "No hay notas registradas para este alumno.";
            msg.classList.add("text-gray-300");
            return;
        }

        msg.textContent = `Se encontraron ${notas.length} notas.`;
        msg.classList.add("text-green-400");

        notas.forEach(n => {
            const tr = document.createElement("tr");

            const tdMateria = document.createElement("td");
            tdMateria.className = "px-2 py-1 border-b border-gray-700";
            tdMateria.textContent = n.materiaId;

            const tdTipo = document.createElement("td");
            tdTipo.className = "px-2 py-1 border-b border-gray-700";
            tdTipo.textContent = n.tipo;

            const tdTrimestre = document.createElement("td");
            tdTrimestre.className = "px-2 py-1 border-b border-gray-700";
            tdTrimestre.textContent = n.trimestre;

            const tdValor = document.createElement("td");
            tdValor.className = "px-2 py-1 border-b border-gray-700";
            tdValor.textContent = n.valor;

            const tdFecha = document.createElement("td");
            tdFecha.className = "px-2 py-1 border-b border-gray-700";
            tdFecha.textContent = n.fecha
                ? new Date(n.fecha).toLocaleDateString()
                : "-";

            tr.appendChild(tdMateria);
            tr.appendChild(tdTipo);
            tr.appendChild(tdTrimestre);
            tr.appendChild(tdValor);
            tr.appendChild(tdFecha);

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        msg.textContent = "Error de conexión con la API.";
        msg.classList.add("text-red-400");
    }
}
