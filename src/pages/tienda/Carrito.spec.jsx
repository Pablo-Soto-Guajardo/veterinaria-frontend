import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { renderConRouter } from "../../test/utilidades";
import Carrito from "./Carrito";

function renderCarrito(carrito, manejadores = {}) {
  const props = {
    onCambiarCantidad: vi.fn(),
    onQuitar: vi.fn(),
    onVaciar: vi.fn(),
    onAgregar: vi.fn(),
    ...manejadores
  };
  renderConRouter(<Carrito carrito={carrito} {...props} />, { ruta: "/carrito", rutaPatron: "/carrito", otrasRutas: ["/checkout"] });
  return props;
}

describe("Página Carrito", () => {
  it("muestra un mensaje cuando el carrito está vacío", async () => {
    renderCarrito([]);
    expect(await screen.findByText("Tu carrito está vacío")).toBeInTheDocument();
  });

  it("calcula el total usando el precio de oferta vigente que entrega la API", async () => {
    renderCarrito([{ codigo: "ME005", cantidad: 2 }, { codigo: "EDU001", cantidad: 1 }]);
    expect(await screen.findByTestId("total-carrito")).toHaveTextContent("$33.800");
  });

  it("los botones de cantidad y eliminar llaman a sus funciones", async () => {
    const usuario = userEvent.setup();
    const props = renderCarrito([{ codigo: "ME004", cantidad: 2 }]);
    await usuario.click(await screen.findByRole("button", { name: "Agregar una unidad de Nexgard (Afoxolaner)" }));
    expect(props.onCambiarCantidad).toHaveBeenCalledWith("ME004", 3, 60);
    await usuario.click(screen.getByRole("button", { name: "Quitar una unidad de Nexgard (Afoxolaner)" }));
    expect(props.onCambiarCantidad).toHaveBeenLastCalledWith("ME004", 1, 60);
    await usuario.click(screen.getByRole("button", { name: "Eliminar Nexgard (Afoxolaner) del carrito" }));
    expect(props.onQuitar).toHaveBeenCalledWith("ME004");
    await usuario.click(screen.getByRole("button", { name: "Limpiar carrito" }));
    expect(props.onVaciar).toHaveBeenCalled();
  });

  it("el botón Comprar ahora lleva al checkout", async () => {
    const usuario = userEvent.setup();
    renderCarrito([{ codigo: "ME004", cantidad: 1 }]);
    await usuario.click(await screen.findByRole("button", { name: "Comprar ahora" }));
    expect(screen.getByTestId("ruta-actual")).toHaveTextContent("/checkout");
  });
});
