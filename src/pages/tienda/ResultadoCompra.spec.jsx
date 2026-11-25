import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { iniciarSesionComo } from "../../test/sesiones";
import { renderConRouter } from "../../test/utilidades";
import CompraError from "./CompraError";
import CompraExitosa from "./CompraExitosa";

describe("Páginas de resultado del pago", () => {
  beforeEach(() => {
    iniciarSesionComo("CLIENTE");
  });

  it("compra exitosa muestra el número, los productos y el total pagado", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<CompraExitosa />, { ruta: "/compra/exitosa/1", rutaPatron: "/compra/exitosa/:numero" });
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("Se ha realizado la compra. nro #1");
    expect(screen.getByText("Total pagado: $21.490")).toBeInTheDocument();
    expect(screen.getByLabelText("Comuna")).toHaveValue("Providencia");
    await usuario.click(screen.getByRole("button", { name: /enviar boleta por email/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Enviamos la boleta a cliente@gmail.com.");
  });

  it("pago con error muestra el motivo y el botón para reintentar", async () => {
    renderConRouter(<CompraError />, { ruta: "/compra/error/3", rutaPatron: "/compra/error/:numero" });
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("No se pudo realizar el pago. nro #3");
    expect(screen.getByRole("alert")).toHaveTextContent("Tarjeta rechazada por el emisor.");
    expect(screen.getByRole("link", { name: "Volver a realizar el pago" })).toHaveAttribute("href", "/checkout");
  });

  it("no muestra una orden pagada en la página de error", async () => {
    renderConRouter(<CompraError />, { ruta: "/compra/error/1", rutaPatron: "/compra/error/:numero" });
    expect(await screen.findByText("No encontramos un pago rechazado con ese número")).toBeInTheDocument();
  });

  it("un cliente no puede ver la boleta de otro cliente (403 del backend)", async () => {
    iniciarSesionComo("CLIENTE");
    globalThis.apiFalsa.db.boletas[0].cliente.correo = "otra@gmail.com";
    renderConRouter(<CompraExitosa />, { ruta: "/compra/exitosa/1", rutaPatron: "/compra/exitosa/:numero" });
    expect(await screen.findByText("No encontramos una compra pagada con ese número")).toBeInTheDocument();
  });
});