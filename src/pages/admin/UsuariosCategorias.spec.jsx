import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../../App";
import { apiFalsa, iniciarSesionComoAdmin } from "../../test/sesiones";

const usuarioEnApi = (run) => apiFalsa().db.usuarios.find((u) => u.run === run) || null;
const categoriaEnApi = (id) => apiFalsa().db.categorias.find((c) => c.id === id) || null;

function renderAdmin(ruta) {
  iniciarSesionComoAdmin();
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>
  );
}

describe("Administración de usuarios", () => {
  it("crea un usuario con rol y lo muestra en el listado", async () => {
    const usuario = userEvent.setup();
    renderAdmin("/admin/usuarios/nuevo");
    await usuario.type(screen.getByLabelText("RUN (sin puntos ni guion)"), "187654327");
    await usuario.selectOptions(screen.getByLabelText("Rol"), "VENDEDOR");
    await usuario.type(screen.getByLabelText("Nombre"), "Tomás");
    await usuario.type(screen.getByLabelText("Apellidos"), "Muñoz");
    await usuario.type(screen.getByLabelText("Correo electrónico"), "tomas@duoc.cl");
    await usuario.type(screen.getByLabelText("Dirección"), "Calle 3");
    await usuario.selectOptions(screen.getByLabelText("Región"), "OHI");
    await usuario.selectOptions(screen.getByLabelText("Comuna"), "Rengo");
    await usuario.type(screen.getByLabelText(/^Contraseña/), "tomas1");
    await usuario.type(screen.getByLabelText("Confirmar contraseña"), "tomas1");
    await usuario.click(screen.getByRole("button", { name: "Crear usuario" }));
    expect(await screen.findByText("Usuario Tomás Muñoz creado.")).toBeInTheDocument();
    expect(await screen.findByText("tomas@duoc.cl")).toBeInTheDocument();
    expect(usuarioEnApi("187654327").rol).toBe("VENDEDOR");
    expect(usuarioEnApi("187654327").password).toBe("tomas1");
  });

  it("edita el rol de un usuario sin pedir una nueva contraseña", async () => {
    const usuario = userEvent.setup();
    renderAdmin("/admin/usuarios/201234565/editar");
    expect(await screen.findByLabelText("RUN (sin puntos ni guion)")).toHaveAttribute("readonly");
    await usuario.selectOptions(screen.getByLabelText("Rol"), "VENDEDOR");
    await usuario.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(await screen.findByText("Usuario actualizado.")).toBeInTheDocument();
    expect(usuarioEnApi("201234565").rol).toBe("VENDEDOR");
    expect(usuarioEnApi("201234565").password).toBe("cliente1");
  });

  it("elimina un usuario y no permite eliminar la cuenta propia", async () => {
    const usuario = userEvent.setup();
    renderAdmin("/admin/usuarios");
    expect(await screen.findByRole("button", { name: "Eliminar Administrador" })).toBeDisabled();
    await usuario.click(screen.getByRole("button", { name: "Eliminar Camila" }));
    await usuario.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Eliminar" }));
    expect(await screen.findByText("Usuario Camila eliminado.")).toBeInTheDocument();
    expect(usuarioEnApi("142234564")).toBeNull();
  });

  it("filtra usuarios por rol", async () => {
    const usuario = userEvent.setup();
    renderAdmin("/admin/usuarios");
    await screen.findByText("cliente@gmail.com");
    await usuario.selectOptions(screen.getByLabelText("Rol"), "CLIENTE");
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(2);
  });
});

describe("Administración de categorías", () => {
  it("crea una categoría nueva", async () => {
    const usuario = userEvent.setup();
    renderAdmin("/admin/categorias/nueva");
    await usuario.type(screen.getByLabelText("Nombre"), "Accesorios");
    await usuario.click(screen.getByRole("button", { name: "Crear categoría" }));
    expect(await screen.findByText("Categoría Accesorios creada.")).toBeInTheDocument();
    expect(categoriaEnApi("accesorios")).not.toBeNull();
  });

  it("edita una categoría existente", async () => {
    const usuario = userEvent.setup();
    renderAdmin("/admin/categorias/educacion/editar");
    const nombre = await screen.findByLabelText("Nombre");
    await usuario.clear(nombre);
    await usuario.type(nombre, "Educación al tutor");
    await usuario.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(await screen.findByText("Categoría actualizada.")).toBeInTheDocument();
    expect(categoriaEnApi("educacion").nombre).toBe("Educación al tutor");
  });

  it("no elimina una categoría que tiene productos y muestra el motivo", async () => {
    const usuario = userEvent.setup();
    renderAdmin("/admin/categorias");
    await usuario.click(await screen.findByRole("button", { name: "Eliminar Antibióticos" }));
    await usuario.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Eliminar" }));
    expect(await screen.findByText("No se puede eliminar: 3 producto(s) usan esta categoría")).toBeInTheDocument();
  });

  it("exige el nombre de la categoría", async () => {
    const usuario = userEvent.setup();
    renderAdmin("/admin/categorias/nueva");
    await usuario.click(screen.getByRole("button", { name: "Crear categoría" }));
    expect(screen.getByText("El nombre es obligatorio")).toBeInTheDocument();
  });
});