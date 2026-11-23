import { Alert, Container } from "react-bootstrap";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { nombreRol, rutaInicial, tienePermiso } from "../../utils/roles";

function RutaProtegida({ sesion, permiso, children }) {
  const ubicacion = useLocation();

  if (!sesion) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }

  if (permiso && !tienePermiso(sesion, permiso)) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading as="h1" className="h4">Acceso restringido</Alert.Heading>
          <p>Tu cuenta ({nombreRol(sesion.rol)}) no tiene permisos para ver esta sección.</p>
          <Link to={rutaInicial(sesion)} className="btn btn-primary">Volver</Link>
        </Alert>
      </Container>
    );
  }

  return children ?? <Outlet />;
}

export default RutaProtegida;