const API_URL = "http://localhost:5215/api";

function obtenerProfesorActual() {
    const json = localStorage.getItem("profesorActual");
    if (!json) return null;
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}

async function subirMaterial() {
    const profesor = obtenerProfesorActual();
    if (!profesor) {
        alert("No se encontraron datos del profesor. Entra primero al panel de profesor.");
        window.location.href = "panel-profesor.html";
        return;
    }

    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const urlArchivo = document.getElementById("urlArchivo").value.trim();
    const materiaId = parseInt(document.getElementById("materiaId").value);
    const grupoId = parseInt(document.getElementById("grupoId").value);
    const msg = document.getElementById("msg");

    if (!titulo) {
        alert("El título es obligatorio.");
        return;
    }

    const material = {
        profesorId: profesor.id,
        materiaId: isNaN(materiaId) ? 0 : materiaId,
        grupoId: isNaN(grupoId) ? 0 : grupoId,
        titulo,
        descripcion,
        urlArchivo
    };

    try {
        const resp = await fetch(`${API_URL}/Materiales/crear`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(material)
        });

        if (!resp.ok) {
            const texto = await resp.text();
            msg.textContent = "Error al guardar material: " + texto;
            msg.classList.remove("text-green-400");
            msg.classList.add("text-red-400");
            return;
        }

        const data = await resp.json();
        console.log("Material creado:", data);

        msg.textContent = "Material guardado correctamente.";
        msg.classList.remove("text-red-400");
        msg.classList.add("text-green-400");

        setTimeout(() => {
            window.location.href = "panel-profesor.html";
        }, 1200);

    } catch (err) {
        console.error(err);
        msg.textContent = "Error de conexión con la API.";
        msg.classList.remove("text-green-400");
        msg.classList.add("text-red-400");
    }
}
