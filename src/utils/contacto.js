
import { guardarDatos, leerDatos } from "./almacenamiento";

export const CLAVE_MENSAJES = "sanMarcos.mensajes";

export function crearMensajeContacto(datos) {
  const mensajes = leerDatos(CLAVE_MENSAJES, []);
  const nuevo = {
    id: mensajes.length + 1,
    fecha: new Date().toISOString(),
    nombre: datos.nombre.trim(),
    correo: datos.correo.trim().toLowerCase(),
    comentario: datos.comentario.trim()
  };
  guardarDatos(CLAVE_MENSAJES, [...mensajes, nuevo]);
  return nuevo;
}

export function listarMensajesContacto() {
  return leerDatos(CLAVE_MENSAJES, []);
}