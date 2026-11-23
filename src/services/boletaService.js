
import { TIENDA_URL, solicitud } from "./http";

export const TARJETA_APROBADA = "4111111111111111";
export const TARJETA_RECHAZADA = "4000000000000002";

export const ESTADOS_BOLETA = ["Pagada", "Enviada", "Entregada", "Rechazada", "Anulada"];
export const SIGUIENTES_ESTADOS = {
  Pagada: ["Enviada", "Anulada"],
  Enviada: ["Entregada", "Anulada"]
};


export const crearBoleta = ({ cliente, envio, items, numeroTarjeta }) =>
  solicitud(TIENDA_URL, "/boletas", {
    method: "POST",
    body: {
      cliente,
      envio,
      items: items.map((item) => ({ codigo: item.codigo, cantidad: item.cantidad })),
      numeroTarjeta
    }
  });

export const listarBoletas = (correo) =>
  solicitud(TIENDA_URL, correo ? `/boletas?correo=${encodeURIComponent(correo)}` : "/boletas");

export const listarMisBoletas = () => solicitud(TIENDA_URL, "/boletas/mias");

export const obtenerBoleta = (numero) => solicitud(TIENDA_URL, `/boletas/${encodeURIComponent(numero)}`);

export const cambiarEstadoBoleta = (numero, estado) =>
  solicitud(TIENDA_URL, `/boletas/${encodeURIComponent(numero)}/estado`, { method: "PUT", body: { estado } });

export const eliminarBoleta = (numero) =>
  solicitud(TIENDA_URL, `/boletas/${encodeURIComponent(numero)}`, { method: "DELETE" });