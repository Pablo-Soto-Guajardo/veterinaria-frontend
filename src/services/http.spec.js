import { vi } from "vitest";
import { crearToken } from "../test/apiFalsa";
import { iniciarSesionComo } from "../test/sesiones";
import { CLAVE_TOKEN, leerToken } from "../utils/sesion";
import { ErrorApi, TIENDA_URL, procesarRespuesta, solicitud } from "./http";
import { listarBoletas } from "./boletaService";
import { listarProductos } from "./productoService";

describe("cliente HTTP (fetch + JWT)", () => {
  it("las solicitudes públicas no envían el token", async () => {
    iniciarSesionComo("ADMIN");
    await listarProductos();
    const [, opciones] = vi.mocked(fetch).mock.calls[0];
    expect(opciones.headers.Authorization).toBeUndefined();
  });

  it("las solicitudes privadas envían Authorization: Bearer <jwt>", async () => {
    iniciarSesionComo("ADMIN");
    await listarBoletas();
    const [url, opciones] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe(`${TIENDA_URL}/boletas`);
    expect(opciones.headers.Authorization).toBe(`Bearer ${leerToken()}`);
  });

  it("sin permisos, entrega el 403 como ErrorApi con mensaje legible", async () => {
    iniciarSesionComo("CLIENTE");
    await expect(listarBoletas()).rejects.toMatchObject({ name: "ErrorApi", estado: 403 });
  });

  it("si el backend responde 401, renueva el token una vez y repite la solicitud", async () => {
    iniciarSesionComo("VENDEDOR");
    // Token con firma inválida: el backend lo rechaza con 401 aunque no esté vencido.
    sessionStorage.setItem(CLAVE_TOKEN, `${crearToken({ correo: "vendedor@duoc.cl", rol: "VENDEDOR" })}x`);
    const boletas = await listarBoletas();
    expect(boletas.length).toBeGreaterThan(0);
    const rutas = globalThis.apiFalsa.llamadas.map((l) => l.ruta);
    expect(rutas).toEqual(["/boletas", "/auth/refresh", "/boletas"]);
  });

  it("si el servidor está apagado, informa un error de conexión", async () => {
    vi.stubGlobal("fetch", () => Promise.reject(new TypeError("Failed to fetch")));
    await expect(solicitud(TIENDA_URL, "/productos", { publico: true })).rejects.toThrow(
      "No se pudo conectar con el servidor"
    );
  });

  it("procesarRespuesta devuelve null en 204 y usa el mensaje del backend en errores", async () => {
    expect(await procesarRespuesta(new Response(null, { status: 204 }))).toBeNull();
    const respuesta = new Response(JSON.stringify({ error: "Stock insuficiente" }), { status: 409 });
    await expect(procesarRespuesta(respuesta)).rejects.toEqual(new ErrorApi("Stock insuficiente", 409));
  });
});