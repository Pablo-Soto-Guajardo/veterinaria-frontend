export const CLAVE_TOKEN = "sanMarcos.token";
export const CLAVE_REFRESH = "sanMarcos.refreshToken";
export const CLAVE_USUARIO = "sanMarcos.usuario";

export function guardarSesion({ token, refreshToken, usuario }) {
  sessionStorage.setItem(CLAVE_TOKEN, token);
  sessionStorage.setItem(CLAVE_REFRESH, refreshToken);
  sessionStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

export function guardarUsuarioSesion(usuario) {
  sessionStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

export function leerToken() {
  return sessionStorage.getItem(CLAVE_TOKEN);
}

export function leerRefreshToken() {
  return sessionStorage.getItem(CLAVE_REFRESH);
}

export function leerUsuarioSesion() {
  const texto = sessionStorage.getItem(CLAVE_USUARIO);
  if (!texto || !leerToken()) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

export function limpiarSesion() {
  sessionStorage.removeItem(CLAVE_TOKEN);
  sessionStorage.removeItem(CLAVE_REFRESH);
  sessionStorage.removeItem(CLAVE_USUARIO);
}


export function leerExpiracion(token) {
  try {
    const parte = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const datos = JSON.parse(atob(parte));
    return typeof datos.exp === "number" ? datos.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function tokenVencido(token, ahora = Date.now()) {
  const expiracion = leerExpiracion(token);
  return expiracion !== null && expiracion - 30000 <= ahora;
}