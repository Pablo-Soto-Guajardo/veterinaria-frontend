import { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { nombreRol, rutaInicial, tienePermiso } from "../../utils/roles";

const enlacesAdmin = [
  { to: "/admin", texto: "Dashboard", icono: "bi-speedometer2", exacto: true, permiso: "dashboard" },
  { to: "/admin/ordenes", texto: "Órdenes", icono: "bi-receipt", permiso: "ordenes" },
  { to: "/admin/productos", texto: "Productos", icono: "bi-box-seam", permiso: "productos" },
  { to: "/admin/categorias", texto: "Categorías", icono: "bi-tags", permiso: "categorias" },
  { to: "/admin/usuarios", texto: "Usuarios", icono: "bi-people", permiso: "usuarios" },
  { to: "/admin/reportes", texto: "Reportes", icono: "bi-graph-up", permiso: "reportes" },
  { to: "/admin/perfil", texto: "Perfil", icono: "bi-person-circle", permiso: "perfil" }
];

function LayoutAdmin({ sesion, onCerrarSesion }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();
  const enlacesVisibles = enlacesAdmin.filter((enlace) => tienePermiso(sesion, enlace.permiso));
  const esAdmin = tienePermiso(sesion, "dashboard");

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  function cerrarSesion() {
    onCerrarSesion();
    navigate("/login");
  }

  return (
    <div className="d-flex flex-column flex-lg-row flex-grow-1">
      <aside className="barra-admin">
        <Navbar
          expand="lg"
          variant="dark"
          className="flex-lg-column align-items-stretch p-3"
          expanded={menuAbierto}
          onToggle={setMenuAbierto}
        >
          <div className="d-flex align-items-center justify-content-between w-100">
            <Navbar.Brand as={Link} to={rutaInicial(sesion)} onClick={cerrarMenu} className="fw-bold fs-6 me-0">
              <i className="bi bi-heart-pulse me-2" aria-hidden="true"></i>
              {esAdmin ? "San Marcos Admin" : "San Marcos Ventas"}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="menu-admin" label="Abrir o cerrar el menú de administración" />
          </div>
          <Navbar.Collapse id="menu-admin" className="flex-lg-column align-items-stretch mt-lg-3">
            <Nav className="flex-column gap-1 w-100" aria-label="Menú de administración">
              {enlacesVisibles.map((enlace) => (
                <NavLink
                  key={enlace.to}
                  to={enlace.to}
                  end={enlace.exacto}
                  className="nav-link"
                  onClick={cerrarMenu}
                >
                  <i className={`bi ${enlace.icono} me-2`} aria-hidden="true"></i>
                  {enlace.texto}
                </NavLink>
              ))}
            </Nav>
            <hr className="border-light opacity-50" />
            <p className="small text-white-50 mb-2">
              Sesión: {sesion.nombre} {sesion.apellidos}
              <br />
              <span className="badge text-bg-light mt-1">{nombreRol(sesion.rol)}</span>
            </p>
            <div className="d-grid gap-2">
              <Link to="/" className="btn btn-outline-light btn-sm" onClick={cerrarMenu}>
                <i className="bi bi-shop me-1" aria-hidden="true"></i> Ir a la tienda
              </Link>
              <button type="button" className="btn btn-danger btn-sm" onClick={cerrarSesion}>
                <i className="bi bi-box-arrow-right me-1" aria-hidden="true"></i> Cerrar sesión
              </button>
            </div>
          </Navbar.Collapse>
        </Navbar>
      </aside>
      <main id="contenido-principal" className="flex-grow-1 p-3 p-md-4 bg-body-tertiary overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutAdmin;