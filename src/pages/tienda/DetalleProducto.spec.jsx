import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { renderConRouter } from "../../test/utilidades";
import DetalleProducto from "./DetalleProducto";

describe("Página DetalleProducto", () => {
  it("muestra el producto obtenido desde el parámetro de la URL", async () => {
    renderConRouter(<DetalleProducto onAgregar={vi.fn()} />, { ruta: "/productos/ME013", rutaPatron: "/productos/:codigo" });
    expect(await screen.findByRole("heading", { level: 1, name: "Apoquel 16mg (Oclacitinib)" })).toBeInTheDocument();
    // Comprueba que se llamó al endpoint versionado del backend Tienda.
    expect(fetch).toHaveBeenCalledWith("http://localhost:8082/api/v1/productos/ME013", expect.any(Object));
    expect(screen.getByRole("heading", { name: "Productos relacionados" })).toBeInTheDocument();
  });

  it("muestra un mensaje de error cuando la API responde 404", async () => {
    renderConRouter(<DetalleProducto onAgregar={vi.fn()} />, { ruta: "/productos/XX999", rutaPatron: "/productos/:codigo" });
    expect(await screen.findByText("El producto solicitado no existe")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver al catálogo" })).toBeInTheDocument();
  });

  it("agrega la cantidad elegida sin superar el stock", async () => {
    const usuario = userEvent.setup();
    const onAgregar = vi.fn();
    renderConRouter(<DetalleProducto onAgregar={onAgregar} />, { ruta: "/productos/ME002", rutaPatron: "/productos/:codigo" });
    const aumentar = await screen.findByRole("button", { name: "Aumentar cantidad" });
    for (let i = 0; i < 5; i++) await usuario.click(aumentar);
    expect(screen.getByLabelText("Cantidad")).toHaveValue(4);
    expect(aumentar).toBeDisabled();
    await usuario.click(screen.getByRole("button", { name: /añadir al carrito/i }));
    expect(onAgregar).toHaveBeenCalledWith(expect.objectContaining({ codigo: "ME002" }), 4);
  });
});
