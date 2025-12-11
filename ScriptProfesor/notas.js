const API_BASE = "http://localhost:5215/api";

document.addEventListener("DOMContentLoaded", () => {
    const cfg = leerConfigProfesor();
    if (!cfg) return;

    document.getElementById("prof-nombre").textContent = cfg.nombre || "Profesor";
    document.getElementById("prof-colegio").textContent = cfg.colegio || "-";
    document.getElementById("prof-turno").textContent = cfg.turno || "-";

    // Llenar materias
    const sel = document.getElementById("nota-materia");
    sel.innerHTML = "";
    if (cfg.materias) {
        const mats = cfg.materias.split(",").map(m => m.trim()).filter(m => m);
        if (mats.length > 0) {
            mats.forEach(m => {
                const opt = document.createElement("option");
                opt.value = m;
                opt.textContent = m;
                sel.appendChild(opt);
            });
        } else {
            const opt = document.createElement("option");
            opt.value = "";
            opt.textContent = "Sin materias definidas";
            sel.appendChild(opt);
        }
    } else {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "Sin materias definidas";
        sel.appendChild(opt);
    }

    document.getElementById("btn-guardar-nota").onclick = guardarNota;
});

function leerConfigProfesor() {
    const raw = localStorage.getItem("profesorConfig");
    if (!raw) {
        alert("Primero debes configurar tus datos de profesor.");
        window.location.href = "config-profesor.html";
        return null;
    }
    try {
        const cfg = JSON.parse(raw);
        if (!cfg.colegio || !cfg.turno) {
            window.location.href = "config-profesor.html";
            return null;
        }
        return cfg;
    } catch {
        alert("Error leyendo configuración de profesor.");
        return null;
    }
}

async function guardarNota() {
    const msg = document.getElementById("nota-msg");
    msg.textContent = "";
    msg.className = "text-sm";

    const alumno = document.getElementById("nota-alumno").value.trim();
    const materia = document.getElementById("nota-materia").value.trim();
    const grupo = document.getElementById("nota-grupo").value.trim();
    const trimestre = document.getElementById("nota-trimestre").value;
    const tipo = document.getElementById("nota-tipo").value;
    const valor = document.getElementById("nota-valor").value;
    const comentario = document.getElementById("nota-comentario").value.trim();

    if (!alumno || !materia || !grupo || !valor) {
        msg.textContent = "Alumno, materia, grupo y nota son obligatorios.";
        msg.className = "text-sm text-red-400";
        return;
    }

    const body = {
        alumnoNombre: alumno,
        materia,
        grupo,
        trimestre: parseInt(trimestre),
        tipo,
        nota: parseFloat(valor),
        comentario
    };

    try {
        const resp = await fetch(`${API_BASE}/Notas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!resp.ok) {
            msg.textContent = "No se pudo guardar la nota (revisa el API).";
            msg.className = "text-sm text-red-400";
            return;
        }

        msg.textContent = "Nota registrada correctamente.";
        msg.className = "text-sm text-green-400";

        document.getElementById("nota-valor").value = "";
        document.getElementById("nota-comentario").value = "";

    } catch (err) {
        console.error(err);
        msg.textContent = "Error de conexión con el API.";
        msg.className = "text-sm text-red-400";
    }
}
