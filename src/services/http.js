import {
  guardarSesion,
  leerRefreshToken,
  leerToken,
  limpiarSesion,
  tokenVencido
} from "../utils/sesion";

export const AUTH_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:8081/api/v1";
export const TIENDA_URL = import.meta.env.VITE_TIENDA_API_URL || "http://localhost:8082/api/v1";

export class ErrorApi extends Error {
  constructor(mensaje, estado) {
    super(mensaje);
    this.name = "ErrorApi";
    this.estado = estado;
  }
}

const MENSAJES = {
  400: "Los datos enviados no son válidos.",
  401: "Tu sesión no es válida. Inicia sesión nuevamente.",
  403: "No tienes permisos para realizar esta acción.",
  404: "El recurso solicitado no existe.",
  409: "La operación no se puede realizar.",
  500: "Ocurrió un error en el servidor."
};

export async function procesarRespuesta(response) {
  if (!response.ok) {
    let mensaje = "";
    try {
      const cuerpo = await response.json();
      mensaje = cuerpo.error || cuerpo.mensaje || "";
    } catch {

    }
    throw new ErrorApi(mensaje || MENSAJES[response.status] || `Error ${response.status}`, response.status);
  }
  return response.status === 204 ? null : response.json();
}

async function llamar(url, opciones) {
  try {
    return await fetch(url, opciones);
  } catch {
    throw new ErrorApi("No se pudo conectar con el servidor. Revisa que el backend esté encendido.", 0);
  }
}

let renovacionEnCurso = null;

export function renovarSesion() {
  if (!renovacionEnCurso) {
    renovacionEnCurso = (async () => {
      const refreshToken = leerRefreshToken();
      if (!refreshToken) throw new ErrorApi(MENSAJES[401], 401);
      const response = await llamar(`${AUTH_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
      });
      const datos = await procesarRespuesta(response);
      guardarSesion(datos);
      window.dispatchEvent(new CustomEvent("sesion-actualizada", { detail: datos.usuario }));
      return datos.token;
    })().finally(() => {
      renovacionEnCurso = null;
    });
  }
  return renovacionEnCurso;
}

async function renovarOCerrar() {
  try {
    return await renovarSesion();
  } catch {
    limpiarSesion();
    window.dispatchEvent(new Event("sesion-expirada"));
    throw new ErrorApi("Tu sesión expiró. Inicia sesión nuevamente.", 401);
  }
}


export async function solicitud(baseUrl, ruta, { publico = false, body, ...opciones } = {}) {
  const preparar = (token) => {
    const headers = { "Content-Type": "application/json", ...opciones.headers };
    if (token) headers.Authorization = `Bearer ${token}`;
    return {
      ...opciones,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    };
  };

  let token = publico ? null : leerToken();
  if (token && tokenVencido(token)) {
    token = await renovarOCerrar();
  }

  let response = await llamar(`${baseUrl}${ruta}`, preparar(token));
  if (response.status === 401 && token) {
    token = await renovarOCerrar();
    response = await llamar(`${baseUrl}${ruta}`, preparar(token));
  }
  return procesarRespuesta(response);
}