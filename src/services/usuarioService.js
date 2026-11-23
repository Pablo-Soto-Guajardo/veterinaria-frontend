import { AUTH_URL, solicitud } from "./http";

function aCuerpo(datos) {
  return {
    run: datos.run.trim().toUpperCase(),
    nombre: datos.nombre.trim(),
    apellidos: datos.apellidos.trim(),
    correo: datos.correo.trim().toLowerCase(),
    password: datos.contrasena || null,
    rol: datos.rol,
    fechaNacimiento: datos.fechaNacimiento || null,
    direccion: datos.direccion.trim(),
    region: datos.region,
    comuna: datos.comuna
  };
}

export const listarUsuarios = () => solicitud(AUTH_URL, "/usuarios");

export const obtenerUsuario = (run) => solicitud(AUTH_URL, `/usuarios/${encodeURIComponent(run)}`);

export const crearUsuario = (datos) =>
  solicitud(AUTH_URL, "/usuarios", { method: "POST", body: aCuerpo(datos) });

export const actualizarUsuario = (run, datos) =>
  solicitud(AUTH_URL, `/usuarios/${encodeURIComponent(run)}`, { method: "PUT", body: aCuerpo(datos) });

export const eliminarUsuario = (run) =>
  solicitud(AUTH_URL, `/usuarios/${encodeURIComponent(run)}`, { method: "DELETE" });

export const obtenerPerfil = () => solicitud(AUTH_URL, "/usuarios/me");

export const actualizarPerfil = (datos) =>
  solicitud(AUTH_URL, "/usuarios/me", {
    method: "PUT",
    body: {
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      password: datos.contrasena || null,
      fechaNacimiento: datos.fechaNacimiento || null,
      direccion: datos.direccion.trim(),
      region: datos.region,
      comuna: datos.comuna
    }
  });