// ----------------------
// VALIDACIÓN DE LOGIN
// ----------------------
const isLogged = localStorage.getItem("isLoggedIn");

//QUITAR LOS COMENTARIOS DE ESTAS TRES SIGUIENTES LINEAS CUANDO YA TODO ESTÉ LISTO!!!!!!!!
//if (!isLogged) {
//    window.location.href = "login.html";
//}

// Obtener datos del usuario
const userData = JSON.parse(localStorage.getItem("userData")) || {};
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


// ----------------------
// DATOS MOCK (TEMPORALES)
// HAY QUE CAMBIARLOS POR LO REAL DE LA API
// ----------------------
const materiasMock = [
    {
        nombre: "Matemáticas",
        notas: { nota1: 85, nota2: 92, final: 89 },
        material: [
            { titulo: "Guía de Álgebra", url: "#" },
            { titulo: "Presentación de Funciones", url: "#" }
        ]
    },
    {
        nombre: "Ciencias",
        notas: { nota1: 78, nota2: 80, final: 79 },
        material: [
            { titulo: "PDF de Biología", url: "#" },
            { titulo: "Video: La Célula", url: "#" }
        ]
    },
    {
        nombre: "Historia",
        notas: { nota1: 90, nota2: 88, final: 89 },
        material: [
            { titulo: "Linea del Tiempo", url: "#" }
        ]
    }
];


// ----------------------
// CARGAR SECCIÓN NOTAS
// ----------------------
function cargarNotas() {
    seccionNotas.innerHTML = ""; // limpiar
    materiasMock.forEach(mat => {
        const card = `
            <div class="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg">
                <h3 class="text-2xl font-bold mb-4">${mat.nombre}</h3>
                <p class="text-gray-300">• Nota 1: <span class="font-semibold">${mat.notas.nota1}</span></p>
                <p class="text-gray-300">• Nota 2: <span class="font-semibold">${mat.notas.nota2}</span></p>
                <p class="text-gray-300">• Final: <span class="font-semibold">${mat.notas.final}</span></p>
            </div>
        `;
        seccionNotas.innerHTML += card;
    });
}


// ----------------------
// CARGAR SECCIÓN MATERIALES
// ----------------------
function cargarMateriales() {
    seccionMateriales.innerHTML = ""; // limpiar

    materiasMock.forEach(mat => {
        let listaMaterial = "";
        mat.material.forEach(item => {
            listaMaterial += `
                <li class="mb-1">
                    <a href="${item.url}" class="text-blue-400 hover:text-blue-300 underline">${item.titulo}</a>
                </li>`;
        });

        const card = `
            <div class="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg">
                <h3 class="text-2xl font-bold mb-4">${mat.nombre}</h3>
                <ul class="text-gray-300">${listaMaterial}</ul>
            </div>
        `;
        seccionMateriales.innerHTML += card;
    });
}


// ----------------------
// EVENTOS DE TABS
// ----------------------
btnNotas.addEventListener("click", () => {
    seccionNotas.classList.remove("hidden");
    seccionMateriales.classList.add("hidden");
});

btnMaterial.addEventListener("click", () => {
    seccionNotas.classList.add("hidden");
    seccionMateriales.classList.remove("hidden");
    cargarMateriales(); 

});


// ----------------------
// BOTÓN DE LOGOUT
// ----------------------
logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
});


// Cargar por defecto
cargarNotas();
