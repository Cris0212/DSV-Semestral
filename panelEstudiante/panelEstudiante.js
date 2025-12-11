// ----------------------
// VALIDACIÓN DE LOGIN & DATOS GLOBALES
// ----------------------
const isLogged = localStorage.getItem("isLoggedIn");

// QUITAMOS COMENTARIOS PARA ACTIVAR LA SEGURIDAD
if (!isLogged) {
    window.location.href = "login.html";
}

// Obtener datos del usuario y su ID
const userData = JSON.parse(localStorage.getItem("userData")) || {};
const alumnoId = userData.id; // Asumimos que el ID está en 'userData.id'

document.getElementById("alumnoNombre").textContent =
    `Bienvenido, ${userData.nombre || "Alumno"}`;


// ----------------------
// ELEMENTOS DEL DOM
// ----------------------
const btnNotas = document.getElementById("btnNotas");
const btnMaterial = document.getElementById("btnMaterial");
const seccionNotas = document.getElementById("seccionNotas");
const seccionMateriales = document.getElementById("seccionMateriales");
const logoutBtn = document.getElementById("logoutBtn");


let datosMaterias = []; 



// ----------------------
// FUNCIÓN DE FETCH CENTRAL
// ----------------------
async function obtenerDatosAlumno() {
    if (!alumnoId) {
        console.error("ID del alumno no encontrado. Forzando logout.");
        localStorage.clear();
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`https://localhost:7296/api/Notas/alumno/${alumnoId}`);

        if (!response.ok) {
          
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        datosMaterias = await response.json();
      
        return datosMaterias; 

    } catch (error) {
        console.error("Error al obtener datos del alumno:", error);
        const mensajeError = `<p class="text-red-400 p-4">Error al cargar datos. Verifique que la API esté corriendo y que la conexión sea válida. (${error.message})</p>`;
        seccionNotas.innerHTML = mensajeError;
        seccionMateriales.innerHTML = mensajeError;
        datosMaterias = []; 
    }
}


// ----------------------
// CARGAR SECCIÓN NOTAS (USA DATOS REALES)
// ----------------------
async function cargarNotas() {
    seccionNotas.classList.remove("hidden");
    seccionMateriales.classList.add("hidden");
    
    // Si los datos no se han cargado, obtenemos de la API
    if (datosMaterias.length === 0) {
        seccionNotas.innerHTML = `<p class="text-white p-4">Cargando notas...</p>`;
        await obtenerDatosAlumno(); 
    }
    
    if (datosMaterias.length === 0) {
        seccionNotas.innerHTML = `<p class="text-gray-400 p-4">No se encontraron notas registradas.</p>`;
        return;
    }

    seccionNotas.innerHTML = ""; // limpiar

    datosMaterias.forEach(mat => {
        // 🛑 Asumimos los nombres de campos de tu DTO/modelo de C#
        const card = `
            <div class="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg">
                <h3 class="text-2xl font-bold mb-4">${mat.NombreMateria || 'Materia Desconocida'}</h3>
                <p class="text-gray-300">• Nota 1: <span class="font-semibold">${mat.Nota1 || 'N/A'}</span></p>
                <p class="text-gray-300">• Nota 2: <span class="font-semibold">${mat.Nota2 || 'N/A'}</span></p>
                <p class="text-gray-300">• Final: <span class="font-semibold">${mat.NotaFinal || 'N/A'}</span></p>
            </div>
        `;
        seccionNotas.innerHTML += card;
    });
}


// ----------------------
// CARGAR SECCIÓN MATERIALES (USA DATOS REALES)
// ----------------------
async function cargarMateriales() {
    seccionMateriales.classList.remove("hidden");
    seccionNotas.classList.add("hidden");
    
    // Si los datos no se han cargado, obtenemos de la API
    if (datosMaterias.length === 0) {
        seccionMateriales.innerHTML = `<p class="text-white p-4">Cargando materiales...</p>`;
        await obtenerDatosAlumno(); 
    }

    if (datosMaterias.length === 0) {
        seccionMateriales.innerHTML = `<p class="text-gray-400 p-4">No se encontraron materiales disponibles.</p>`;
        return;
    }
    
    seccionMateriales.innerHTML = ""; // limpiar

    datosMaterias.forEach(mat => {
        let listaMaterial = "";
        
        // Asumimos que hay un array de materiales en el objeto materia
        if (mat.Materiales && Array.isArray(mat.Materiales)) {
            mat.Materiales.forEach(item => { 
                listaMaterial += `
                    <li class="mb-1">
                        <a href="${item.Url}" target="_blank" class="text-blue-400 hover:text-blue-300 underline">${item.Titulo}</a>
                    </li>`;
            });
        }

        const card = `
            <div class="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg">
                <h3 class="text-2xl font-bold mb-4">${mat.NombreMateria || 'Materia Desconocida'}</h3>
                <ul class="text-gray-300">${listaMaterial || '<li class="text-gray-500">No hay materiales cargados.</li>'}</ul>
            </div>
        `;
        seccionMateriales.innerHTML += card;
    });
}


// ----------------------
// EVENTOS DE TABS
// ----------------------
btnNotas.addEventListener("click", cargarNotas);

btnMaterial.addEventListener("click", cargarMateriales);


// ----------------------
// BOTÓN DE LOGOUT
// ----------------------
logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
});


// Cargar por defecto
cargarNotas();