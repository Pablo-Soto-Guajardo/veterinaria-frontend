import { guardarSesion } from "../utils/sesion";

export function apiFalsa() {
  return globalThis.apiFalsa;
}

export function iniciarSesionComo(rol = "ADMIN") {
  const usuario = apiFalsa().db.usuarios.find((u) => u.rol === rol);
  const sesion = apiFalsa().emitirSesion(usuario);
  guardarSesion(sesion);
  return sesion.usuario;
}

export function iniciarSesionComoAdmin() {
  return iniciarSesionComo("ADMIN");
}

export const sesionAdmin = {
  run: "190110222",
  nombre: "Administrador",
  apellidos: "San Marcos",
  correo: "admin@duoc.cl",
  rol: "ADMIN",
  fechaNacimiento: "1990-04-12",
  direccion: "Av. San Juan 1020",
  region: "OHI",
  comuna: "Rancagua"
};