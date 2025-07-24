// taller.js

// IMPORTANTE: Aquí debes poner la IP de la computadora servidor.
// Si el servidor corre en la misma máquina, puedes usar '127.0.0.1'.
const IP_SERVIDOR = "192.168.100.154"; // <-- ¡CAMBIA ESTO POR LA IP DEL SERVIDOR!
const URL_BASE = `http://${IP_SERVIDOR}:5000`;

// --- Referencias a Elementos del HTML ---
const listaMantenimientoEl = document.getElementById('listaMantenimiento');
const listaParaAsignarEl = document.getElementById('listaParaAsignar');
const listaEnRutaEl = document.getElementById('listaEnRuta');
const btnAgregar = document.getElementById('btnAgregar');

// --- Funciones de Interacción con la API ---

// Función principal para obtener y mostrar todas las unidades
async function actualizarVistas() {
    try {
        const response = await fetch(`${URL_BASE}/unidades`);
        const unidades = await response.json();

        // Limpiar listas actuales
        listaMantenimientoEl.innerHTML = '';
        listaParaAsignarEl.innerHTML = '';
        listaEnRutaEl.innerHTML = '';

        // Llenar listas según el estado de cada unidad
        unidades.forEach(u => {
            const card = document.createElement('article');
            if (u.status === 'En Mantenimiento') {
                card.innerHTML = `<h4>${u.nombre} (ID: ${u.id})</h4><p>Orden: ${u.orden_mantenimiento}</p><button onclick="completarMantenimiento(${u.id})">Mantenimiento Listo</button>`;
                listaMantenimientoEl.appendChild(card);
            } else if (u.status === 'Lista para Asignación') {
                card.innerHTML = `<h4>${u.nombre} (ID: ${u.id})</h4><button onclick="asignarRuta(${u.id})">Asignar a Ruta</button>`;
                listaParaAsignarEl.appendChild(card);
            } else if (u.status === 'En Ruta') {
                card.innerHTML = `<h4>${u.nombre} (ID: ${u.id})</h4><p>Destino: ${u.ruta_asignada}</p>`;
                listaEnRutaEl.appendChild(card);
            }
            // Botón de eliminar para todas las tarjetas
            card.innerHTML += `<button style="background-color: #990000;" onclick="eliminarUnidad(${u.id})">Eliminar</button>`;
        });

    } catch (error) {
        console.error("Error al actualizar vistas:", error);
        alert("No se pudo conectar con el servidor. ¿Está encendido?");
    }
}

// Agregar una nueva unidad
btnAgregar.onclick = async () => {
    const nombre = document.getElementById('nombre').value;
    const orden = document.getElementById('orden').value;
    if (!nombre || !orden) return alert('Por favor, completa ambos campos.');

    await fetch(`${URL_BASE}/unidades/agregar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre, orden: orden })
    });
    document.getElementById('nombre').value = '';
    document.getElementById('orden').value = '';
    actualizarVistas();
};

// Mover a 'Lista para Asignación'
async function completarMantenimiento(id) {
    await fetch(`${URL_BASE}/unidades/completar_mantenimiento/${id}`, { method: 'POST' });
    actualizarVistas();
}

// Mover a 'En Ruta'
async function asignarRuta(id) {
    const ruta = prompt("Introduce el destino o ruta para esta unidad:");
    if (!ruta) return;

    await fetch(`${URL_BASE}/unidades/asignar_ruta/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruta: ruta })
    });
    actualizarVistas();
}

// Eliminar cualquier unidad
async function eliminarUnidad(id) {
    if (!confirm(`¿Estás seguro de que quieres eliminar la unidad con ID ${id}?`)) return;
    
    await fetch(`${URL_BASE}/unidades/eliminar/${id}`, { method: 'DELETE' });
    actualizarVistas();
}

// --- Carga Inicial ---
// Llama a la función por primera vez cuando la página carga
document.addEventListener('DOMContentLoaded', actualizarVistas);
// Y actualiza la vista cada 10 segundos para mantenerla sincronizada
setInterval(actualizarVistas, 10000);