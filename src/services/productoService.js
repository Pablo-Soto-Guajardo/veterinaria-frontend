import { TIENDA_URL, solicitud } from "./http";

function aCuerpo(datos) {
  const numero = (valor) => (valor === "" || valor === null || valor === undefined ? null : Number(valor));
  return {
    codigo: datos.codigo.trim().toUpperCase(),
    nombre: datos.nombre.trim(),
    categoria: datos.categoria,
    presentacion: (datos.presentacion || "").trim(),
    descripcion: (datos.descripcion || "").trim(),
    precio: numero(datos.precio),
    precioOferta: numero(datos.precioOferta),
    stock: numero(datos.stock),
    stockCritico: numero(datos.stockCritico) ?? 0,
    imagen: (datos.imagen || "").trim()
  };
}

export const listarProductos = () => solicitud(TIENDA_URL, "/productos", { publico: true });

export const listarProductosEnOferta = () =>
  solicitud(TIENDA_URL, "/productos?oferta=true", { publico: true });

export const listarProductosCriticos = () =>
  solicitud(TIENDA_URL, "/productos?criticos=true", { publico: true });

export const listarProductosPorCategoria = (idCategoria) =>
  solicitud(TIENDA_URL, `/productos?categoria=${encodeURIComponent(idCategoria)}`, { publico: true });

export const obtenerProducto = (codigo) =>
  solicitud(TIENDA_URL, `/productos/${encodeURIComponent(codigo)}`, { publico: true });

export const crearProducto = (datos) =>
  solicitud(TIENDA_URL, "/productos", { method: "POST", body: aCuerpo(datos) });

export const actualizarProducto = (codigo, datos) =>
  solicitud(TIENDA_URL, `/productos/${encodeURIComponent(codigo)}`, { method: "PUT", body: aCuerpo(datos) });

export const eliminarProducto = (codigo) =>
  solicitud(TIENDA_URL, `/productos/${encodeURIComponent(codigo)}`, { method: "DELETE" });
