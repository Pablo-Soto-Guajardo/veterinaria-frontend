import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { crearBoleta } from "../../services/boletaService";
import { renderConRouter } from "../../test/utilidades";
import Checkout from "./Checkout";

vi.mock("../../services/boletaService", () => ({
  TARJETA_APROBADA: "4111111111111111",
  TARJETA_RECHAZADA: "4000000000000002",
  crearBoleta: vi.fn()
}));

const sesion = {
  run: "201234565",
  nombre: "Javiera",
  apellidos: "Rojas Fuentes",
  correo: "cliente@gmail.com",
  direccion: "Los Crisantemos 120",
  region: "RM",
  comuna: "Providencia",
  rol: "CLIENTE"
};
const carrito = [{ codigo: "ME004", cantidad: 2 }];

function renderCheckout({ onCompraExitosa = vi.fn(), sesionActual = sesion, carritoActual = carrito } = {}) {
  renderConRouter(<Checkout carrito={carritoActual} sesion={sesionActual} onCompraExitosa={onCompraExitosa} />, {
    ruta: "/checkout",
    rutaPatron: "/checkout",
    otrasRutas: ["/compra/exitosa/:numero", "/compra/error/:numero"]
  });
}

async function pagarCon(usuario, tarjeta) {
  await usuario.type(await screen.findByLabelText("Número de tarjeta"), tarjeta);
  await usuario.click(screen.getByRole("button", { name: /pagar ahora/i }));
}

describe("Página Checkout", () => {
  beforeEach(() => vi.mocked(crearBoleta).mockReset());

  it("completa automáticamente los datos del cliente con la sesión", async () => {
    renderCheckout();
    expect(await screen.findByLabelText("Nombre")).toHaveValue("Javiera");
    expect(screen.getByLabelText("Comuna")).toHaveValue("Providencia");
    expect(screen.getByLabelText("Correo")).toHaveAttribute("readonly");
    expect(screen.getByRole("button", { name: "Pagar ahora $19.000" })).toBeInTheDocument();
  });

  it("no llama a la API si faltan datos", async () => {
    const usuario = userEvent.setup();
    renderCheckout();
    await usuario.click(await screen.findByRole("button", { name: /pagar ahora/i }));
    expect(screen.getByText("El número de tarjeta es obligatorio")).toBeInTheDocument();
    expect(crearBoleta).not.toHaveBeenCalled();
  });

  it("envía solo códigos y cantidades, y con boleta Pagada redirige a compra exitosa", async () => {
    vi.mocked(crearBoleta).mockResolvedValue({ numero: 4, estado: "Pagada" });
    const usuario = userEvent.setup();
    const onCompraExitosa = vi.fn();
    renderCheckout({ onCompraExitosa });
    await pagarCon(usuario, "4111111111111111");

    expect(await screen.findByTestId("ruta-actual")).toHaveTextContent("/compra/exitosa/4");
    expect(crearBoleta).toHaveBeenCalledWith(
      expect.objectContaining({
        numeroTarjeta: "4111111111111111",
        items: [expect.objectContaining({ codigo: "ME004", cantidad: 2 })],
        envio: expect.objectContaining({ comuna: "Providencia" })
      })
    );
    expect(onCompraExitosa).toHaveBeenCalled();
  });

  it("con boleta Rechazada va a la página de error y no vacía el carrito", async () => {
    vi.mocked(crearBoleta).mockResolvedValue({ numero: 5, estado: "Rechazada" });
    const usuario = userEvent.setup();
    const onCompraExitosa = vi.fn();
    renderCheckout({ onCompraExitosa });
    await pagarCon(usuario, "4000000000000002");

    expect(await screen.findByTestId("ruta-actual")).toHaveTextContent("/compra/error/5");
    expect(onCompraExitosa).not.toHaveBeenCalled();
  });

  it("sin sesión pide iniciar sesión antes de pagar", () => {
    renderCheckout({ sesionActual: null });
    expect(screen.getByText(/Para pagar debes iniciar sesión/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Iniciar sesión" })).toHaveAttribute("href", "/login");
  });

  it("un vendedor no puede comprar", () => {
    renderCheckout({ sesionActual: { ...sesion, rol: "VENDEDOR" } });
    expect(screen.getByText("Las cuentas con rol Vendedor no pueden realizar compras.")).toBeInTheDocument();
  });

  it("muestra un mensaje si se entra al checkout con el carrito vacío", async () => {
    renderCheckout({ carritoActual: [] });
    expect(await screen.findByText("No hay productos para pagar")).toBeInTheDocument();
  });
});