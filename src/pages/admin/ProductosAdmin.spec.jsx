import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { apiFalsa, sesionAdmin } from "../../test/sesiones";
import { iniciarSesionComo } from "../../test/sesiones";
import { renderConRouter } from "../../test/utilidades";
import ProductosAdmin from "./ProductosAdmin";

describe("Administración de productos", () => {
  beforeEach(() => {
    iniciarSesionComo("ADMIN");
  });

  it("elimina un producto sin ventas después de confirmar en el modal (DELETE)", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<ProductosAdmin sesion={sesionAdmin} />);
    expect(await screen.findByText("16 productos en inventario")).toBeInTheDocument();
    await usuario.click(screen.getByRole("button", { name: "Eliminar Limpiador ótico" }));
    const modal = await screen.findByRole("dialog");
    await usuario.click(within(modal).getByRole("button", { name: "Eliminar" }));
    expect(await screen.findByText("15 productos en inventario")).toBeInTheDocument();
    expect(apiFalsa().db.productos.some((p) => p.codigo === "HI002")).toBe(false);
  });

  it("si el producto tiene ventas, muestra el error 409 del backend y no lo quita", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<ProductosAdmin sesion={sesionAdmin} />);
    await usuario.click(await screen.findByRole("button", { name: "Eliminar Nexgard (Afoxolaner)" }));
    await usuario.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Eliminar" }));
    expect(await screen.findByText(/el producto tiene ventas registradas/)).toBeInTheDocument();
    expect(screen.getByText("16 productos en inventario")).toBeInTheDocument();
  });

  it("filtra la tabla por texto", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<ProductosAdmin sesion={sesionAdmin} />);
    await usuario.type(await screen.findByLabelText("Buscar"), "ME00");
    expect(screen.getAllByRole("row")).toHaveLength(8);
  });
});
