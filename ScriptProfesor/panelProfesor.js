const API_URL = "http://localhost:5215/api";

let usuarioActual = null;
let profesorActual = null;

// =========== Helpers ===========

function obtenerUsuarioActual() {
    const json = localStorage.getItem("usuarioActual");
    if (!json) return null;
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}

function asegurarSesionProfesor() {
    usuarioActual = obtenerUsuarioActual();
    if (!usuarioActual) {
        alert("Debes iniciar sesión primero.");
        window.location.href = "login.html";
        return false;
    }

    // Por ahora asumimos que solo un profesor entra aquí
    return true;
}

// =========== Cargar datos al iniciar ===========

document.addEventListener("DOMContentLoaded", async () => {
    if (!asegurarSesionProfesor()) return;

    // Mostrar nombre rápido
    document.getElementById("prof-nombre").textContent = usuarioActual.nombre || "Profesor";
    document.getElementById("prof-mini").textContent = `${usuarioActual.nombre} (${usuarioActual.correo})`;

    // Eventos de navegación
    configurarNavegacion();
    configurarCerrarSesion();

    // Cargar datos del profesor (colegio, turno, grupos)
    await cargarDatosProfesor();

    // Cargar resumen de quizzes y materiales
    if (profesorActual && profesorActual.id) {
        await Promise.all([
            cargarQuizzes(profesorActual.id),
            cargarMateriales(profesorActual.id)
        ]);
    }
});

// =========== Navegación ===========

function configurarNavegacion() {
    const btnIrQuiz = document.getElementById("btn-ir-quiz");
    const btnIrMaterial = document.getElementById("btn-ir-material");
    const navQuizzes = document.getElementById("nav-quizzes");
    const navMateriales = document.getElementById("nav-materiales");
    const navNotas = document.getElementById("nav-notas");

    if (btnIrQuiz) btnIrQuiz.addEventListener("click", () => {
        window.location.href = "crear-quiz.html";
    });

    if (btnIrMaterial) btnIrMaterial.addEventListener("click", () => {
        window.location.href = "subir-material.html";
    });

    if (navQuizzes) navQuizzes.addEventListener("click", () => {
        window.location.href = "crear-quiz.html";
    });

    if (navMateriales) navMateriales.addEventListener("click", () => {
        window.location.href = "subir-material.html";
    });

    if (navNotas) navNotas.addEventListener("click", () => {
        // Puedes crear luego un notas-profesor.html
        alert("Pantalla de notas en construcción.");
    });
}

function configurarCerrarSesion() {
    const btnSalir = document.getElementById("btn-salir");
    if (!btnSalir) return;

    btnSalir.addEventListener("click", () => {
        localStorage.removeItem("usuarioActual");
        window.location.href = "login.html";
    });
}

// =========== Cargar datos de profesor ===========

async function cargarDatosProfesor() {
    try {
        const resp = await fetch(`${API_URL}/Profesores/usuario/${usuarioActual.id}`);
        if (!resp.ok) {
            document.getElementById("prof-subtitulo").textContent =
                "Aún no has configurado tus datos de profesor.";
            return;
        }

        const prof = await resp.json();
        profesorActual = prof;

        document.getElementById("prof-colegio").textContent = prof.colegio || "-";
        document.getElementById("prof-turno").textContent = prof.turno || "-";
        document.getElementById("contador-grupos").textContent = prof.gruposQueDa || 0;
        document.getElementById("prof-subtitulo").textContent =
            `Colegio: ${prof.colegio} · Turno: ${prof.turno}`;

        // Guardar también en localStorage para otras pantallas
        localStorage.setItem("profesorActual", JSON.stringify(prof));

    } catch (err) {
        console.error(err);
        document.getElementById("prof-subtitulo").textContent =
            "Error cargando datos del profesor.";
    }
}

// =========== Cargar quizzes ===========

async function cargarQuizzes(profesorId) {
    try {
        const resp = await fetch(`${API_URL}/Quizzes/profesor/${profesorId}`);
        if (!resp.ok) return;

        const quizzes = await resp.json() || [];
        const contador = document.getElementById("contador-materias");
        const lista = document.getElementById("lista-quizzes");

        if (contador) contador.textContent = quizzes.length;
        if (!lista) return;

        lista.innerHTML = "";

        quizzes.slice(0, 5).forEach(q => {
            const li = document.createElement("li");
            li.textContent = `${q.titulo} · ${new Date(q.fechaCreacion).toLocaleDateString()}`;
            lista.appendChild(li);
        });
    } catch (err) {
        console.error(err);
    }
}

// =========== Cargar materiales ===========

async function cargarMateriales(profesorId) {
    try {
        const resp = await fetch(`${API_URL}/Materiales/profesor/${profesorId}`);
        if (!resp.ok) return;

        const materiales = await resp.json() || [];
        const lista = document.getElementById("lista-materiales");

        if (!lista) return;
        lista.innerHTML = "";

        materiales.slice(0, 5).forEach(m => {
            const li = document.createElement("li");
            li.textContent = `${m.titulo} · ${new Date(m.fechaSubida).toLocaleDateString()}`;
            lista.appendChild(li);
        });
    } catch (err) {
        console.error(err);
    }
}