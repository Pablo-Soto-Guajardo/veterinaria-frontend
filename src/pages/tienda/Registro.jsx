import { useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormularioUsuario from "../../components/formularios/FormularioUsuario";
import { registrar as registrarCliente } from "../../services/authService";

function Registro({ onIniciarSesion }) {
  const [usuarioCreado, setUsuarioCreado] = useState(null);
  async function registrar(datos) {
    const respuesta = await registrarCliente(datos);
    onIniciarSesion(respuesta);
    setUsuarioCreado(respuesta.usuario);
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} lg={9} xl={8}>
          <h1>Registro de usuario</h1>
          <p className="text-body-secondary">
            Crea tu cuenta para comprar más rápido: tus datos de despacho se completarán automáticamente.
          </p>
          {usuarioCreado ? (
            <Alert variant="success">
              <Alert.Heading as="h2" className="h4">¡Bienvenido/a, {usuarioCreado.nombre}!</Alert.Heading>
              <p>Tu cuenta fue creada y ya iniciaste sesión.</p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/productos" className="btn btn-primary">Ir a comprar</Link>
                <Link to="/" className="btn btn-outline-primary">Volver al inicio</Link>
              </div>
            </Alert>
          ) : (
            <div className="bg-white border rounded-3 p-4">
              <FormularioUsuario modo="registro" onGuardar={registrar} textoBoton="Registrarme" />
              <p className="mt-3 mb-0">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
              </p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Registro;
