import { TIENDA_URL, solicitud } from "./http";

function aCuerpo(datos) {
  return {
    nombre: datos.nombre.trim(),
    descripcion: (datos.descripcion || "").trim(),
    imagen: (datos.imagen || "").trim()
  };
}

export const listarCategorias = () => solicitud(TIENDA_URL, "/categorias", { publico: true });

export const obtenerCategoria = (id) =>
  solicitud(TIENDA_URL, `/categorias/${encodeURIComponent(id)}`, { publico: true });

export const crearCategoria = (datos) =>
  solicitud(TIENDA_URL, "/categorias", { method: "POST", body: aCuerpo(datos) });

export const actualizarCategoria = (id, datos) =>
  solicitud(TIENDA_URL, `/categorias/${encodeURIComponent(id)}`, { method: "PUT", body: aCuerpo(datos) });

export const eliminarCategoria = (id) =>
  solicitud(TIENDA_URL, `/categorias/${encodeURIComponent(id)}`, { method: "DELETE" });
