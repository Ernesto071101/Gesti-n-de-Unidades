# servidor_api.py
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- Inicialización ---
app = Flask(__name__)
CORS(app) # Habilita CORS para permitir peticiones desde el navegador

# --- "Base de Datos" Central en Memoria ---
unidades = []
next_unit_id = 1

# --- Rutas de la API (El "Menú" del Mesero) ---

@app.route('/unidades', methods=['GET'])
def get_unidades():
    """Devuelve la lista completa de unidades."""
    return jsonify(unidades)

@app.route('/unidades/agregar', methods=['POST'])
def agregar_unidad():
    """Agrega una unidad a la lista. La pone en 'Mantenimiento'."""
    global next_unit_id
    datos = request.get_json()
    if not datos or 'nombre' not in datos or 'orden' not in datos:
        return jsonify({"error": "Faltan datos"}), 400

    nueva_unidad = {
        "id": next_unit_id,
        "nombre": datos['nombre'],
        "orden_mantenimiento": datos['orden'],
        "status": "En Mantenimiento"
    }
    unidades.append(nueva_unidad)
    next_unit_id += 1
    return jsonify(nueva_unidad), 201

@app.route('/unidades/eliminar/<int:id_unidad>', methods=['DELETE'])
def eliminar_unidad(id_unidad):
    """Elimina una unidad por su ID."""
    global unidades
    unidad_encontrada = next((u for u in unidades if u['id'] == id_unidad), None)
    if unidad_encontrada:
        unidades.remove(unidad_encontrada)
        return jsonify({"mensaje": "Unidad eliminada"}), 200
    return jsonify({"error": "Unidad no encontrada"}), 404

@app.route('/unidades/completar_mantenimiento/<int:id_unidad>', methods=['POST'])
def completar_mantenimiento(id_unidad):
    """Cambia el estado de una unidad a 'Lista para Asignación'."""
    unidad = next((u for u in unidades if u['id'] == id_unidad), None)
    if unidad:
        unidad['status'] = 'Lista para Asignación'
        return jsonify(unidad), 200
    return jsonify({"error": "Unidad no encontrada"}), 404

@app.route('/unidades/asignar_ruta/<int:id_unidad>', methods=['POST'])
def asignar_ruta(id_unidad):
    """Asigna una ruta y cambia el estado a 'En Ruta'."""
    datos = request.get_json()
    if not datos or 'ruta' not in datos:
        return jsonify({"error": "Falta la ruta"}), 400
        
    unidad = next((u for u in unidades if u['id'] == id_unidad), None)
    if unidad:
        unidad['status'] = 'En Ruta'
        unidad['ruta_asignada'] = datos['ruta']
        return jsonify(unidad), 200
    return jsonify({"error": "Unidad no encontrada"}), 404

# --- Ejecución del Servidor ---
if __name__ == '__main__':
    # host='0.0.0.0' hace que sea visible en tu red local
    app.run(host='0.0.0.0', port=5000, debug=True)