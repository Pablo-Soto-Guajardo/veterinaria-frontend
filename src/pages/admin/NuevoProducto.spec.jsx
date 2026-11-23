import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { apiFalsa, iniciarSesionComo } from "../../test/sesiones";
import { renderConRouter } from "../../test/utilidades";
import NuevoProducto from "./NuevoProducto";

beforeEach(() => {
  iniciarSesionComo("ADMIN");
});

async function completar(usuario, codigo) {
  await screen.findByRole("option", { name: "Antiparasitarios" });
  await usuario.type(screen.getByLabelText("Código"), codigo);
  await usuario.type(screen.getByLabelText("Nombre"), "Collar antipulgas");
  await usuario.selectOptions(screen.getByLabelText("Categoría"), "antiparasitarios");
  await usuario.type(screen.getByLabelText("Precio (pesos)"), "12990");
  await usuario.type(screen.getByLabelText("Stock"), "15");
}

describe("Administración: nuevo producto", () => {
  it("crea el producto y vuelve al listado", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<NuevoProducto />, { ruta: "/admin/productos/nuevo", rutaPatron: "/admin/productos/nuevo", otrasRutas: ["/admin/productos"] });
    await completar(usuario, "AP050");
    await usuario.click(screen.getByRole("button", { name: "Crear producto" }));
    expect(await screen.findByTestId("ruta-actual")).toHaveTextContent("/admin/productos");
    // El service convierte los textos del formulario en números antes del POST.
    expect(apiFalsa().db.productos.find((p) => p.codigo === "AP050")).toMatchObject({ nombre: "Collar antipulgas", precio: 12990, stock: 15 });
  });

  it("muestra el error de código repetido que entrega la base de datos", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<NuevoProducto />);
    await completar(usuario, "ME004");
    await usuario.click(screen.getByRole("button", { name: "Crear producto" }));
    expect(await screen.findByText("Ya existe un producto con el código ME004")).toBeInTheDocument();
  });

  it("muestra errores de validación junto a los campos", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<NuevoProducto />);
    await usuario.type(screen.getByLabelText("Stock"), "-2");
    await usuario.click(screen.getByRole("button", { name: "Crear producto" }));
    expect(screen.getByText("El código es obligatorio y debe tener al menos 3 caracteres")).toBeInTheDocument();
    expect(screen.getByText("El stock no puede ser negativo")).toBeInTheDocument();
  });
});
