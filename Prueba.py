# -*- coding: utf-8 -*-

# Usaremos esta variable para asignar un ID único y autoincremental a cada unidad.
next_unit_id = 1

# Estas listas actuarán como nuestra base de datos para almacenar las unidades.
unidades_en_mantenimiento = []
unidades_listas_para_asignacion = []
unidades_en_ruta = []

def agregar_unidad():
    """
    Registra una nueva unidad en el sistema.
    Pide los datos, crea la orden de mantenimiento y la agrega a la lista de 'En Mantenimiento'.
    """
    global next_unit_id
    print("\n--- Agregar Nueva Unidad ---")
    
    # 1. Pedir datos de la unidad
    nombre_unidad = input("Introduce el nombre o identificador de la unidad (ej. Camión 01): ")
    orden_mantenimiento = input("Describe la orden de mantenimiento para esta unidad: ")
    
    # 2. Crear el objeto 'unidad' usando un diccionario
    #    El estado inicial siempre es 'En Mantenimiento'.
    unidad = {
        "id": next_unit_id,
        "nombre": nombre_unidad,
        "status": "En Mantenimiento",
        "orden_mantenimiento": orden_mantenimiento
    }
    
    # 3. Agregar la unidad a la lista correspondiente
    unidades_en_mantenimiento.append(unidad)
    
    # 4. Incrementar el ID para la siguiente unidad
    next_unit_id += 1
    
    print(f"\n✅ ¡Éxito! La unidad '{nombre_unidad}' ha sido registrada con el ID {unidad['id']} y está en mantenimiento.")

def completar_mantenimiento():
    """
    Mueve una unidad de 'En Mantenimiento' a 'Lista para Asignación'.
    """
    print("\n--- Completar Mantenimiento y Poner Lista para Asignación ---")
    
    # Validar si hay unidades en mantenimiento
    if not unidades_en_mantenimiento:
        print("⚠️ No hay unidades en mantenimiento en este momento.")
        return
        
    # Mostrar las unidades disponibles para mover
    print("Unidades actualmente en mantenimiento:")
    for u in unidades_en_mantenimiento:
        print(f"  ID: {u['id']}, Nombre: {u['nombre']}, Orden: {u['orden_mantenimiento']}")

    try:
        id_a_mover = int(input("\nIntroduce el ID de la unidad cuyo mantenimiento ha finalizado: "))
    except ValueError:
        print("❌ Error: Por favor, introduce un número de ID válido.")
        return

    # Buscar la unidad y moverla
    unidad_encontrada = None
    for unidad in unidades_en_mantenimiento:
        if unidad['id'] == id_a_mover:
            unidad_encontrada = unidad
            break
            
    if unidad_encontrada:
        # Actualizar el estado y mover la unidad de lista
        unidad_encontrada['status'] = 'Lista para Asignación'
        unidades_listas_para_asignacion.append(unidad_encontrada)
        unidades_en_mantenimiento.remove(unidad_encontrada)
        print(f"\n✅ ¡Perfecto! La unidad '{unidad_encontrada['nombre']}' ahora está lista para ser asignada a una ruta.")
    else:
        print(f"❌ Error: No se encontró ninguna unidad con el ID {id_a_mover} en mantenimiento.")

def asignar_ruta():
    """
    Asigna una ruta a una unidad que está 'Lista para Asignación' y la mueve a 'En Ruta'.
    """
    print("\n--- Asignar Unidad a una Ruta ---")
    
    # Validar si hay unidades listas para asignar
    if not unidades_listas_para_asignacion:
        print("⚠️ No hay unidades listas para asignar en este momento.")
        return

    # Mostrar unidades disponibles
    print("Unidades listas para asignación:")
    for u in unidades_listas_para_asignacion:
        print(f"  ID: {u['id']}, Nombre: {u['nombre']}")

    try:
        id_a_asignar = int(input("\nIntroduce el ID de la unidad que quieres asignar: "))
    except ValueError:
        print("❌ Error: Por favor, introduce un número de ID válido.")
        return

    # Buscar la unidad
    unidad_encontrada = None
    for unidad in unidades_listas_para_asignacion:
        if unidad['id'] == id_a_asignar:
            unidad_encontrada = unidad
            break

    if unidad_encontrada:
        ruta = input(f"Introduce el destino o ruta para la unidad '{unidad_encontrada['nombre']}': ")
        
        # Actualizar estado, añadir info de la ruta y mover de lista
        unidad_encontrada['status'] = 'En Ruta'
        unidad_encontrada['ruta_asignada'] = ruta
        unidades_en_ruta.append(unidad_encontrada)
        unidades_listas_para_asignacion.remove(unidad_encontrada)
        print(f"\n✅ ¡Hecho! La unidad '{unidad_encontrada['nombre']}' ha sido asignada a la ruta: '{ruta}'.")
    else:
        print(f"❌ Error: No se encontró ninguna unidad con el ID {id_a_asignar} lista para asignación.")

def mostrar_listas():
    """
    Muestra un resumen de todas las unidades en sus respectivos estados.
    """
    print("\n--- Estado Actual del Taller ---")
    
    print("\n>> 🛠️  Unidades en Mantenimiento:")
    if unidades_en_mantenimiento:
        for u in unidades_en_mantenimiento:
            print(f"   - ID: {u['id']}, Nombre: {u['nombre']}, Orden: {u['orden_mantenimiento']}")
    else:
        print("   - Ninguna.")
        
    print("\n>> ✅  Unidades Listas para Asignación:")
    if unidades_listas_para_asignacion:
        for u in unidades_listas_para_asignacion:
            print(f"   - ID: {u['id']}, Nombre: {u['nombre']}")
    else:
        print("   - Ninguna.")

    print("\n>> 🚚  Unidades en Ruta:")
    if unidades_en_ruta:
        for u in unidades_en_ruta:
            print(f"   - ID: {u['id']}, Nombre: {u['nombre']}, Ruta: {u['ruta_asignada']}")
    else:
        print("   - Ninguna.")

def main():
    """
    Función principal que muestra el menú y maneja la lógica del programa.
    """
    while True:
        print("\n\n--- Sistema de Gestión de Taller ---")
        print("1. Agregar nueva unidad a mantenimiento")
        print("2. Marcar unidad como 'Lista para Asignación'")
        print("3. Asignar unidad a una ruta")
        print("4. Ver todas las listas")
        print("5. Salir")
        
        opcion = input("Elige una opción: ")
        
        if opcion == '1':
            agregar_unidad()
        elif opcion == '2':
            completar_mantenimiento()
        elif opcion == '3':
            asignar_ruta()
        elif opcion == '4':
            mostrar_listas()
        elif opcion == '5':
            print("\n¡Hasta luego! 👋")
            break
        else:
            print("\n❌ Opción no válida. Por favor, elige un número del 1 al 5.")

# Punto de entrada para ejecutar el programa
if __name__ == "__main__":
    main()