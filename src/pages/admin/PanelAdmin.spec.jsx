import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../../App";
import { apiFalsa, iniciarSesionComo } from "../../test/sesiones";
import { CLAVE_TOKEN, CLAVE_USUARIO } from "../../utils/sesion";

function renderAdmin(ruta, rol = "ADMIN") {
  iniciarSesionComo(rol);
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>
  );
}

describe("Panel de administración: cada vista renderiza sus datos", () => {
  it.each([
    ["/admin", "¡Hola, Administrador!"],
    ["/admin/ordenes", "Órdenes y boletas"],
    ["/admin/ordenes/2", "Boleta #2"],
    ["/admin/productos/ME005", "Bravecto (Fluralaner)"],
    ["/admin/productos/ME005/editar", "Editar producto"],
    ["/admin/productos/criticos", "Productos críticos"],
    ["/admin/productos/reportes", "Reporte de productos"],
    ["/admin/categorias", "Categorías"],
    ["/admin/usuarios/201234565", "Javiera Rojas Fuentes"],
    ["/admin/usuarios/201234565/compras", "Historial de compras"],
    ["/admin/reportes", "Reportes"],
    ["/admin/perfil", "Mi perfil"]
  ])("%s muestra el título «%s»", async (ruta, titulo) => {
    renderAdmin(ruta);
    expect(await screen.findByRole("heading", { level: 1, name: titulo })).toBeInTheDocument();
  });

  it("el dashboard combina datos de ambos backends: ventas, productos críticos y usuarios", async () => {
    renderAdmin("/admin");
    expect(await screen.findByText("Total vendido: $50.480")).toBeInTheDocument();
    expect(screen.getByText("Hay 3 productos con stock crítico o agotado.")).toBeInTheDocument();
    expect(screen.getByText("Clientes registrados: 1")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "#3" })).toBeInTheDocument();
  });

  it("filtra las órdenes por estado", async () => {
    const usuario = userEvent.setup();
    renderAdmin("/admin/ordenes");
    await screen.findByRole("table");
    await usuario.selectOptions(screen.getByLabelText("Estado"), "Rechazada");
    const filas = within(screen.getByRole("table")).getAllByRole("row");
    expect(filas).toHaveLength(2);
    expect(filas[1]).toHaveTextContent("#3");
  });

  it("muestra un mensaje cuando la orden o el producto no existen", async () => {
    renderAdmin("/admin/ordenes/9999");
    expect(await screen.findByText("La orden #9999 no existe")).toBeInTheDocument();
  });

  it("edita un producto y muestra el aviso de cambios guardados", async () => {
    const usuario = userEvent.setup();
    renderAdmin("/admin/productos/ME002/editar");
    const stock = await screen.findByLabelText("Stock");
    await usuario.clear(stock);
    await usuario.type(stock, "30");
    await usuario.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(await screen.findByText("Cambios guardados correctamente.")).toBeInTheDocument();
    expect(await screen.findByText("Stock: 30 unidades")).toBeInTheDocument();
  });

  it("cerrar sesión elimina la sesión y vuelve al inicio de sesión", async () => {
    const usuario = userEvent.setup();
    renderAdmin("/admin");
    await usuario.click(screen.getByRole("button", { name: /cerrar sesión/i }));
    expect(screen.getByRole("heading", { name: "Iniciar sesión" })).toBeInTheDocument();
    expect(sessionStorage.getItem(CLAVE_TOKEN)).toBeNull();
    expect(apiFalsa().llamadas.some((l) => l.ruta === "/auth/logout")).toBe(true);
  });

  it("actualiza el perfil del administrador y su sesión", async () => {
    const usuario = userEvent.setup();
    renderAdmin("/admin/perfil");
    const nombre = await screen.findByLabelText("Nombre");
    await usuario.clear(nombre);
    await usuario.type(nombre, "Pablo");
    await usuario.click(screen.getByRole("button", { name: "Guardar perfil" }));
    expect(await screen.findByText("Tus datos fueron actualizados.")).toBeInTheDocument();
    expect(apiFalsa().db.usuarios.find((u) => u.run === "190110222").nombre).toBe("Pablo");
    expect(JSON.parse(sessionStorage.getItem(CLAVE_USUARIO)).nombre).toBe("Pablo");
  });

  it("el administrador cambia el estado de una boleta", async () => {
    const usuario = userEvent.setup();
    renderAdmin("/admin/ordenes/1");
    await usuario.selectOptions(await screen.findByLabelText("Cambiar estado a"), "Enviada");
    await usuario.click(screen.getByRole("button", { name: "Guardar estado" }));
    expect(await screen.findByText("Estado actualizado a Enviada.")).toBeInTheDocument();
  });
});

describe("Panel del Vendedor: solo ve productos y órdenes", () => {
  it("el menú muestra solo Órdenes y Productos", async () => {
    renderAdmin("/admin", "VENDEDOR");

    expect(await screen.findByRole("heading", { level: 1, name: "Productos" })).toBeInTheDocument();
    const menu = screen.getByLabelText("Menú de administración");
    expect(within(menu).getAllByRole("link").map((enlace) => enlace.textContent.trim())).toEqual(["Órdenes", "Productos"]);
  });

  it("en productos no aparecen los botones de crear, editar ni eliminar", async () => {
    renderAdmin("/admin/productos", "VENDEDOR");
    expect(await screen.findByRole("link", { name: "Ver Nexgard (Afoxolaner)" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Nuevo producto/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Editar Nexgard (Afoxolaner)" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Eliminar Nexgard (Afoxolaner)" })).not.toBeInTheDocument();
  });

  it("puede ver el detalle de una orden, pero sin la gestión del administrador", async () => {
    renderAdmin("/admin/ordenes/1", "VENDEDOR");
    expect(await screen.findByRole("heading", { level: 1, name: "Boleta #1" })).toBeInTheDocument();
    expect(screen.queryByText("Gestión de la orden (solo administrador)")).not.toBeInTheDocument();
  });

  it.each(["/admin/usuarios", "/admin/categorias", "/admin/reportes", "/admin/productos/nuevo", "/admin/perfil"])(
    "no puede entrar a %s",
    (ruta) => {
      renderAdmin(ruta, "VENDEDOR");
      expect(screen.getByRole("heading", { name: "Acceso restringido" })).toBeInTheDocument();
    }
  );
});