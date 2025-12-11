// ScripAuth/configProfesor.js

document.addEventListener("DOMContentLoaded", () => {
    // Si ya está configurado, mandamos directo al panel
    const configGuardada = localStorage.getItem("profesorConfig");
    if (configGuardada) {
        try {
            const cfg = JSON.parse(configGuardada);
            // Si ya tiene colegio y turno guardados, asumimos que ya hizo esta pantalla
            if (cfg.colegio && cfg.turno) {
                window.location.href = "panel-profesor.html";
                return;
            }
        } catch {
            // Si falla el parse, seguimos normal
        }
    }

    const btnGuardar = document.getElementById("cfg-guardar");
    const btnSaltar = document.getElementById("cfg-saltar");

    if (btnGuardar) btnGuardar.onclick = guardarConfigProfesor;
    if (btnSaltar) btnSaltar.onclick = () => {
        window.location.href = "panel-profesor.html";
    };
});

function guardarConfigProfesor() {
    const colegio = document.getElementById("cfg-colegio").value.trim();
    const turno = document.getElementById("cfg-turno").value;
    const gruposTxt = document.getElementById("cfg-grupos").value.trim();
    const materiasTxt = document.getElementById("cfg-materias").value.trim();
    const msg = document.getElementById("cfg-msg");

    if (!colegio || !turno || !gruposTxt) {
        msg.textContent = "Colegio, turno y cantidad de grupos son obligatorios.";
        msg.className = "text-xs text-red-400 mt-1";
        return;
    }

    const cantGrupos = parseInt(gruposTxt);
    if (isNaN(cantGrupos) || cantGrupos <= 0) {
        msg.textContent = "La cantidad de grupos debe ser un número mayor que 0.";
        msg.className = "text-xs text-red-400 mt-1";
        return;
    }

    // Si ya había configuración previa (por ejemplo nombre/correo desde otro lugar), la reutilizamos
    let base = {};
    const anterior = localStorage.getItem("profesorConfig");
    if (anterior) {
        try {
            base = JSON.parse(anterior) || {};
        } catch {
            base = {};
        }
    }

    const nuevaConfig = {
        ...base,
        colegio,
        turno,
        cantGrupos,
        materias: materiasTxt
    };

    localStorage.setItem("profesorConfig", JSON.stringify(nuevaConfig));

    msg.textContent = "Información guardada. Redirigiendo al panel...";
    msg.className = "text-xs text-green-400 mt-1";

    setTimeout(() => {
        window.location.href = "panel-profesor.html";
    }, 700);
}
