
export const ROLES = ["ADMIN", "VENDEDOR", "CLIENTE"];

export const NOMBRES_ROL = {
  ADMIN: "Administrador",
  VENDEDOR: "Vendedor",
  CLIENTE: "Cliente"
};


export const PERMISOS = {
  ADMIN: [
    "panel",
    "dashboard",
    "ordenes",
    "ordenes.gestionar",
    "productos",
    "productos.gestionar",
    "categorias",
    "usuarios",
    "reportes",
    "perfil",
    "comprar"
  ],
  VENDEDOR: ["panel", "ordenes", "productos"],
  CLIENTE: ["comprar"]
};

export function nombreRol(rol) {
  return NOMBRES_ROL[rol] || rol;
}

export function tienePermiso(sesion, permiso) {
  return Boolean(sesion && PERMISOS[sesion.rol]?.includes(permiso));
}


export function rutaInicial(sesion) {
  if (tienePermiso(sesion, "dashboard")) return "/admin";
  if (tienePermiso(sesion, "panel")) return "/admin/productos";
  return "/";
}