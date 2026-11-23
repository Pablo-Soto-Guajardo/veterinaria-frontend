
import { guardarDatos, leerDatos } from "./almacenamiento";

export const CLAVE_CARRITO = "sanMarcos.carrito";

export function leerCarrito() {
  return leerDatos(CLAVE_CARRITO, []);
}

export function guardarCarrito(carrito) {
  guardarDatos(CLAVE_CARRITO, carrito);
}