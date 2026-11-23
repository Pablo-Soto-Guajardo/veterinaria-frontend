import { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import EstadoCarga from "../../components/comunes/EstadoCarga";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import TablaItemsCompra from "../../components/compra/TablaItemsCompra";
import SelectorRegionComuna from "../../components/formularios/SelectorRegionComuna";
import { useCarga } from "../../hooks/useCarga";
import { TARJETA_APROBADA, TARJETA_RECHAZADA, crearBoleta } from "../../services/boletaService";
import { listarProductos } from "../../services/productoService";
import { calcularTotal, detallarCarrito } from "../../utils/carrito";
import { formatearPrecio } from "../../utils/precio";
import { nombreRol, tienePermiso } from "../../utils/roles";
import { esFormularioValido, validarCheckout } from "../../utils/validaciones";

function datosIniciales(sesion) {
  return {
    nombre: sesion?.nombre || "",
    apellidos: sesion?.apellidos || "",
    correo: sesion?.correo || "",
    calle: sesion?.direccion || "",
    departamento: "",
    region: sesion?.region || "",
    comuna: sesion?.comuna || "",
    indicaciones: "",
    tarjeta: ""
  };
}

function Checkout({ carrito, sesion, onCompraExitosa }) {
  const [datos, setDatos] = useState(() => datosIniciales(sesion));
  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);
  const [errorPago, setErrorPago] = useState("");
  const navigate = useNavigate();
  const { datos: productos, cargando, error, recargar } = useCarga(listarProductos);


  if (!sesion) {
    return (
      <Container className="py-5">
        <h1 className="h3">Checkout</h1>
        <Alert variant="info">
          <p>Para pagar debes iniciar sesión. Tu carrito se mantiene guardado.</p>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/login" state={{ desde: "/checkout" }} className="btn btn-primary">Iniciar sesión</Link>
            <Link to="/registro" className="btn btn-outline-primary">Crear cuenta</Link>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!tienePermiso(sesion, "comprar")) {
    return (
      <Container className="py-5">
        <h1 className="h3">Checkout</h1>
        <Alert variant="warning">
          Las cuentas con rol {nombreRol(sesion.rol)} no pueden realizar compras.
        </Alert>
      </Container>
    );
  }

  if (!productos) {
    return (
      <Container className="py-5">
        <h1 className="visually-hidden">Checkout</h1>
        <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
      </Container>
    );
  }

  const items = detallarCarrito(carrito, productos);
  const total = calcularTotal(items);
  const textoTotal = total === 0 ? "$0" : formatearPrecio(total);


  if (items.length === 0 && procesando) {
    return (
      <Container className="py-5 text-center" role="status">
        <h1 className="visually-hidden">Checkout</h1>
        <Spinner aria-hidden="true" />
        <p className="mt-3">Confirmando tu compra...</p>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-5">
        <h1 className="visually-hidden">Checkout</h1>
        <MensajeVacio
          icono="bi-cart-x"
          titulo="No hay productos para pagar"
          texto="Tu carrito está vacío."
          enlace="/productos"
          textoEnlace="Ver productos"
        />
      </Container>
    );
  }

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  async function pagar(evento) {
    evento.preventDefault();
    const nuevosErrores = validarCheckout(datos);
    setErrores(nuevosErrores);
    if (!esFormularioValido(nuevosErrores)) return;

    setProcesando(true);
    setErrorPago("");
    try {

      const boleta = await crearBoleta({
        cliente: { nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim() },
        envio: {
          calle: datos.calle.trim(),
          departamento: datos.departamento.trim(),
          region: datos.region,
          comuna: datos.comuna,
          indicaciones: datos.indicaciones.trim()
        },
        items,
        numeroTarjeta: datos.tarjeta.replace(/\s/g, "")
      });
      if (boleta.estado === "Pagada") {
        onCompraExitosa();
        navigate(`/compra/exitosa/${boleta.numero}`);
      } else {
        navigate(`/compra/error/${boleta.numero}`);
      }
    } catch (err) {
      setErrorPago(err.message);
      setProcesando(false);
    }
  }

  function campo(nombre, etiqueta, propiedades = {}, columnas = 6) {
    return (
      <Col xs={12} md={columnas}>
        <Form.Group controlId={`checkout-${nombre}`}>
          <Form.Label>{etiqueta}</Form.Label>
          <Form.Control
            name={nombre}
            value={datos[nombre]}
            onChange={cambiar}
            isInvalid={Boolean(errores[nombre])}
            disabled={procesando}
            {...propiedades}
          />
          <Form.Control.Feedback type="invalid">{errores[nombre]}</Form.Control.Feedback>
        </Form.Group>
      </Col>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} xl={10}>
          <Card className="shadow-sm">
            <Card.Body className="p-3 p-md-4">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <h1 className="h3 mb-1">Carrito de compra</h1>
                  <p className="text-body-secondary mb-0">Completa la siguiente información para finalizar tu pedido.</p>
                </div>
                <span className="btn btn-primary pe-none">Total a pagar: {textoTotal}</span>
              </div>

              <TablaItemsCompra items={items} total={total} />

              <Form noValidate onSubmit={pagar} className="mt-4" aria-label="Datos de compra">
                {errorPago && (
                  <Alert variant="danger" role="alert">{errorPago}</Alert>
                )}
                {!esFormularioValido(errores) && (
                  <Alert variant="warning" role="alert">
                    Revisa los campos marcados antes de pagar.
                  </Alert>
                )}

                <h2 className="h5">Información del cliente</h2>
                {sesion && (
                  <p className="small text-body-secondary">
                    Completamos tus datos con la información de tu cuenta. Puedes modificarlos.
                  </p>
                )}
                <Row className="g-3 mb-4">
                  {campo("nombre", "Nombre", { autoComplete: "given-name" }, 4)}
                  {campo("apellidos", "Apellidos", { autoComplete: "family-name" }, 4)}
                  {campo("correo", "Correo", { type: "email", autoComplete: "email", readOnly: true, className: "bg-body-tertiary" }, 4)}
                </Row>

                <h2 className="h5">Dirección de entrega</h2>
                <Row className="g-3 mb-4">
                  {campo("calle", "Calle y número", { autoComplete: "street-address" })}
                  {campo("departamento", "Departamento (opcional)", { placeholder: "Ej: 603" })}
                  <SelectorRegionComuna
                    prefijo="checkout-"
                    region={datos.region}
                    comuna={datos.comuna}
                    errores={errores}
                    onCambiarRegion={(region) => setDatos({ ...datos, region, comuna: "" })}
                    onCambiarComuna={(comuna) => setDatos({ ...datos, comuna })}
                  />
                  {campo("indicaciones", "Indicaciones para la entrega (opcional)", {
                    as: "textarea",
                    rows: 2,
                    maxLength: 300,
                    placeholder: "Ej: Entre calles, color del edificio, no tiene timbre."
                  }, 12)}
                </Row>

                <h2 className="h5">Pago con tarjeta (simulado)</h2>
                <Row className="g-3">
                  {campo("tarjeta", "Número de tarjeta", {
                    inputMode: "numeric",
                    maxLength: 19,
                    placeholder: "4111 1111 1111 1111",
                    autoComplete: "cc-number"
                  })}
                  <Col xs={12} md={6}>
                    <Alert variant="light" className="small border mb-0">
                      <strong>Tarjetas de prueba:</strong>
                      <br />
                      Aprobada: {TARJETA_APROBADA.replace(/(\d{4})/g, "$1 ").trim()}
                      <br />
                      Rechazada: {TARJETA_RECHAZADA.replace(/(\d{4})/g, "$1 ").trim()}
                    </Alert>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-4">
                  <Button type="submit" variant="success" size="lg" disabled={procesando}>
                    {procesando ? (
                      <>
                        <Spinner size="sm" className="me-2" aria-hidden="true" />
                        Procesando pago...
                      </>
                    ) : (
                      `Pagar ahora ${textoTotal}`
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Checkout;