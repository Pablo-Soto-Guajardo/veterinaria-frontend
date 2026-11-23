import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { renderConRouter } from "../../test/utilidades";
import Login from "./Login";

describe("Página Login", () => {
  it("valida el formato antes de consultar las credenciales", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<Login sesion={null} onIniciarSesion={vi.fn()} />);
    await usuario.type(screen.getByLabelText("Correo"), "persona@yahoo.com");
    await usuario.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(screen.getByText(/Solo se aceptan correos/)).toBeInTheDocument();
    expect(screen.getByText("La contraseña es obligatoria")).toBeInTheDocument();
  });

  it("muestra un error cuando la contraseña es incorrecta", async () => {
    const usuario = userEvent.setup();
    const onIniciarSesion = vi.fn();
    renderConRouter(<Login sesion={null} onIniciarSesion={onIniciarSesion} />);
    await usuario.type(screen.getByLabelText("Correo"), "admin@duoc.cl");
    await usuario.type(screen.getByLabelText("Contraseña"), "incorrecta");
    await usuario.click(screen.getByRole("button", { name: "Ingresar" }));
    // El mensaje viene del backend Auth (respuesta 401).
    expect(await screen.findByRole("alert")).toHaveTextContent("Correo o contraseña incorrectos");
    expect(onIniciarSesion).not.toHaveBeenCalled();
  });

  it("inicia sesión como administrador y redirige al panel", async () => {
    const usuario = userEvent.setup();
    const onIniciarSesion = vi.fn();
    renderConRouter(<Login sesion={null} onIniciarSesion={onIniciarSesion} />, { ruta: "/login", rutaPatron: "/login", otrasRutas: ["/admin"] });
    await usuario.type(screen.getByLabelText("Correo"), "admin@duoc.cl");
    await usuario.type(screen.getByLabelText("Contraseña"), "admin123");
    await usuario.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(await screen.findByTestId("ruta-actual")).toHaveTextContent("/admin");
    expect(onIniciarSesion).toHaveBeenCalledWith(
      expect.objectContaining({ token: expect.any(String), refreshToken: expect.any(String), rol: "ADMIN" })
    );
  });

  it("el vendedor inicia sesión y llega directo a productos", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<Login sesion={null} onIniciarSesion={vi.fn()} />, { ruta: "/login", rutaPatron: "/login", otrasRutas: ["/admin/productos"] });
    await usuario.type(screen.getByLabelText("Correo"), "vendedor@duoc.cl");
    await usuario.type(screen.getByLabelText("Contraseña"), "vende123");
    await usuario.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(await screen.findByTestId("ruta-actual")).toHaveTextContent("/admin/productos");
  });
});
