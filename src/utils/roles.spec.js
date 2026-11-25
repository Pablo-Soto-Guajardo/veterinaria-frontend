import { nombreRol, rutaInicial, tienePermiso } from "./roles";

const admin = { rol: "ADMIN" };
const vendedor = { rol: "VENDEDOR" };
const cliente = { rol: "CLIENTE" };

describe("permisos por rol (Anexo 1)", () => {
  it("el administrador tiene acceso total", () => {
    for (const permiso of ["dashboard", "productos.gestionar", "categorias", "usuarios", "reportes", "ordenes.gestionar"]) {
      expect(tienePermiso(admin, permiso)).toBe(true);
    }
  });

  it("el vendedor solo ve productos y órdenes, sin gestionarlos", () => {
    expect(tienePermiso(vendedor, "productos")).toBe(true);
    expect(tienePermiso(vendedor, "ordenes")).toBe(true);
    for (const permiso of ["dashboard", "productos.gestionar", "categorias", "usuarios", "reportes", "perfil", "ordenes.gestionar"]) {
      expect(tienePermiso(vendedor, permiso)).toBe(false);
    }
  });

  it("el cliente solo puede comprar en la tienda", () => {
    expect(tienePermiso(cliente, "panel")).toBe(false);
    expect(tienePermiso(cliente, "comprar")).toBe(true);
    expect(tienePermiso(null, "comprar")).toBe(false);
  });

  it("cada rol llega a su página inicial y tiene un nombre legible", () => {
    expect(rutaInicial(admin)).toBe("/admin");
    expect(rutaInicial(vendedor)).toBe("/admin/productos");
    expect(rutaInicial(cliente)).toBe("/");
    expect(nombreRol("VENDEDOR")).toBe("Vendedor");
  });
});