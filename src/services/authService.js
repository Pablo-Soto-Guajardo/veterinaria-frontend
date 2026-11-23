import { AUTH_URL, solicitud } from "./http";

export function login(correo, password) {
  return solicitud(AUTH_URL, "/auth/login", {
    method: "POST",
    publico: true,
    body: { correo: correo.trim().toLowerCase(), password }
  });
}

export function registrar(datos) {
  return solicitud(AUTH_URL, "/auth/registro", {
    method: "POST",
    publico: true,
    body: {
      run: datos.run.trim().toUpperCase(),
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo.trim().toLowerCase(),
      password: datos.contrasena,
      fechaNacimiento: datos.fechaNacimiento || null,
      direccion: datos.direccion.trim(),
      region: datos.region,
      comuna: datos.comuna
    }
  });
}

export async function cerrarSesionRemota(refreshToken) {
  if (!refreshToken) return;
  try {
    await solicitud(AUTH_URL, "/auth/logout", {
      method: "POST",
      publico: true,
      body: { refreshToken }
    });
  } catch {
  }
}