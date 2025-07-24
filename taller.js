// Variable para asignar un ID único a cada unidad.
let nextUnitId = 1;

// Listas que actúan como nuestra base de datos.
let unidadesEnMantenimiento = [];
let unidadesListasParaAsignacion = [];
let unidadesEnRuta = [];

// Referencias a los elementos del HTML donde mostraremos las listas.
const listaMantenimientoEl = document.getElementById('listaMantenimiento');
const listaParaAsignarEl = document.getElementById('listaParaAsignar');
const listaEnRutaEl = document.getElementById('listaEnRuta');
const listaConsolidadaEl = document.getElementById('listaConsolidada'); 

// Referencias a los botones de acción.
const btnAgregar = document.getElementById('btnAgregar');
const btnCompletar = document.getElementById('btnCompletar');
const btnAsignar = document.getElementById('btnAsignar');
const btnEliminar = document.getElementById('btnEliminar'); // <-- NUEVA REFERENCIA

/**
 * Función para actualizar la visualización de las listas por estado en el HTML.
 */
function mostrarListasPorEstado() {
    // ... (sin cambios en esta función)
    listaMantenimientoEl.textContent = unidadesEnMantenimiento.length > 0 ? '' : 'Ninguna.';
    unidadesEnMantenimiento.forEach(u => {
        listaMantenimientoEl.textContent += `ID: ${u.id}, Nombre: ${u.nombre}\nOrden: ${u.orden_mantenimiento}\n\n`;
    });
    listaParaAsignarEl.textContent = unidadesListasParaAsignacion.length > 0 ? '' : 'Ninguna.';
    unidadesListasParaAsignacion.forEach(u => {
        listaParaAsignarEl.textContent += `ID: ${u.id}, Nombre: ${u.nombre}\n\n`;
    });
    listaEnRutaEl.textContent = unidadesEnRuta.length > 0 ? '' : 'Ninguna.';
    unidadesEnRuta.forEach(u => {
        listaEnRutaEl.textContent += `ID: ${u.id}, Nombre: ${u.nombre}\nRuta: ${u.ruta_asignada}\n\n`;
    });
}

/**
 * Muestra una lista única con todas las unidades.
 */
function mostrarListaConsolidada() {
    // ... (sin cambios en esta función)
    const todasLasUnidades = [...unidadesEnMantenimiento, ...unidadesListasParaAsignacion, ...unidadesEnRuta];
    todasLasUnidades.sort((a, b) => a.id - b.id);
    if (todasLasUnidades.length === 0) {
        listaConsolidadaEl.textContent = 'No hay unidades registradas.';
        return;
    }
    listaConsolidadaEl.textContent = '';
    todasLasUnidades.forEach(u => {
        let estadoEmoji = '';
        if (u.status === 'En Mantenimiento') estadoEmoji = '🛠️';
        if (u.status === 'Lista para Asignación') estadoEmoji = '✅';
        if (u.status === 'En Ruta') estadoEmoji = '🚚';
        listaConsolidadaEl.textContent += `ID: ${u.id}, Nombre: ${u.nombre} -> Estado: ${estadoEmoji} ${u.status}\n`;
    });
}

/**
 * Función maestra para actualizar todas las vistas.
 */
function actualizarVistas() {
    mostrarListasPorEstado();
    mostrarListaConsolidada();
}

/**
 * Registra una nueva unidad en el sistema.
 */
function agregarUnidad() {
    // ... (sin cambios en esta función)
    const nombreUnidad = prompt("Introduce el nombre de la unidad (ej. Camión 01):");
    if (!nombreUnidad) return; 
    const ordenMantenimiento = prompt("Describe la orden de mantenimiento:");
    if (!ordenMantenimiento) return;
    const unidad = {
        id: nextUnitId,
        nombre: nombreUnidad,
        status: "En Mantenimiento",
        orden_mantenimiento: ordenMantenimiento
    };
    unidadesEnMantenimiento.push(unidad);
    nextUnitId++;
    alert(`✅ ¡Éxito! La unidad '${nombreUnidad}' ha sido registrada.`);
    actualizarVistas();
}

/**
 * Mueve una unidad de 'En Mantenimiento' a 'Lista para Asignación'.
 */
function completarMantenimiento() {
    // ... (sin cambios en esta función)
    if (unidadesEnMantenimiento.length === 0) {
        alert("⚠️ No hay unidades en mantenimiento.");
        return;
    }
    const idInput = prompt("Introduce el ID de la unidad que terminó su mantenimiento:");
    const idAMover = parseInt(idInput);
    if(isNaN(idAMover)) return;
    const indiceUnidad = unidadesEnMantenimiento.findIndex(u => u.id === idAMover);
    if (indiceUnidad !== -1) {
        const unidadMovida = unidadesEnMantenimiento.splice(indiceUnidad, 1)[0];
        unidadMovida.status = 'Lista para Asignación';
        unidadesListasParaAsignacion.push(unidadMovida);
        alert(`✅ ¡Perfecto! La unidad '${unidadMovida.nombre}' ahora está lista para ser asignada.`);
        actualizarVistas();
    } else {
        alert(`❌ Error: No se encontró una unidad con el ID ${idAMover} en mantenimiento.`);
    }
}

/**
 * Asigna una ruta a una unidad disponible y la mueve a 'En Ruta'.
 */
function asignarRuta() {
    // ... (sin cambios en esta función)
    if (unidadesListasParaAsignacion.length === 0) {
        alert("⚠️ No hay unidades listas para asignar.");
        return;
    }
    const idInput = prompt("Introduce el ID de la unidad a la que quieres asignar una ruta:");
    const idAAsignar = parseInt(idInput);
    if(isNaN(idAAsignar)) return;
    const indiceUnidad = unidadesListasParaAsignacion.findIndex(u => u.id === idAAsignar);
    if (indiceUnidad !== -1) {
        const ruta = prompt("Introduce el destino o ruta:");
        if (!ruta) return;
        const unidadAsignada = unidadesListasParaAsignacion.splice(indiceUnidad, 1)[0];
        unidadAsignada.status = 'En Ruta';
        unidadAsignada.ruta_asignada = ruta;
        unidadesEnRuta.push(unidadAsignada);
        alert(`✅ ¡Hecho! La unidad '${unidadAsignada.nombre}' fue asignada a la ruta: '${ruta}'.`);
        actualizarVistas();
    } else {
        alert(`❌ Error: No se encontró una unidad con el ID ${idAAsignar} lista para asignación.`);
    }
}

/**
 * NUEVA FUNCIÓN: Elimina una unidad del sistema desde cualquier lista.
 */
function eliminarUnidad() {
    const idInput = prompt("Introduce el ID de la unidad que deseas eliminar:");
    const idAEliminar = parseInt(idInput);
    if(isNaN(idAEliminar)) return; // Si el usuario cancela o no introduce un número

    let unidadEliminada = false;

    // Buscar en la lista de mantenimiento
    let indice = unidadesEnMantenimiento.findIndex(u => u.id === idAEliminar);
    if (indice !== -1) {
        unidadesEnMantenimiento.splice(indice, 1);
        unidadEliminada = true;
    }

    // Buscar en la lista para asignación (si no se encontró antes)
    if (!unidadEliminada) {
        indice = unidadesListasParaAsignacion.findIndex(u => u.id === idAEliminar);
        if (indice !== -1) {
            unidadesListasParaAsignacion.splice(indice, 1);
            unidadEliminada = true;
        }
    }

    // Buscar en la lista en ruta (si no se encontró antes)
    if (!unidadEliminada) {
        indice = unidadesEnRuta.findIndex(u => u.id === idAEliminar);
        if (indice !== -1) {
            unidadesEnRuta.splice(indice, 1);
            unidadEliminada = true;
        }
    }

    if (unidadEliminada) {
        alert(`✅ La unidad con ID ${idAEliminar} ha sido eliminada del sistema.`);
        actualizarVistas();
    } else {
        alert(`❌ Error: No se encontró ninguna unidad con el ID ${idAEliminar}.`);
    }
}

// --- Asignación de eventos a los botones ---
btnAgregar.addEventListener('click', agregarUnidad);
btnCompletar.addEventListener('click', completarMantenimiento);
btnAsignar.addEventListener('click', asignarRuta);
btnEliminar.addEventListener('click', eliminarUnidad); // <-- NUEVO EVENTO

// Mostrar las listas al cargar la página.
document.addEventListener('DOMContentLoaded', actualizarVistas);