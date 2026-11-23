import { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import EstadoOrden from "../../components/admin/EstadoOrden";
import EstadoCarga from "../../components/comunes/EstadoCarga";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import ModalConfirmacion from "../../components/comunes/ModalConfirmacion";
import DatosOrden from "../../components/compra/DatosOrden";
import TablaItemsCompra from "../../components/compra/TablaItemsCompra";
import { useCarga } from "../../hooks/useCarga";
import {
  SIGUIENTES_ESTADOS,
  cambiarEstadoBoleta,
  eliminarBoleta,
  obtenerBoleta
} from "../../services/boletaService";
import { ESTADOS_VENTA } from "../../utils/reportes";
import { tienePermiso } from "../../utils/roles";
import { formatearFechaHora } from "../../utils/texto";

function DetalleOrden({ sesion }) {
  const { numero } = useParams();
  const navigate = useNavigate();
  const { datos: orden, cargando, error, setDatos } = useCarga(() => obtenerBoleta(numero), [numero]);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [aviso, setAviso] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const puedeGestionar = tienePermiso(sesion, "ordenes.gestionar");

  if (cargando) return <EstadoCarga cargando />;
  if (!orden) {
    return <MensajeVacio icono="bi-receipt" titulo={`La orden #${numero} no existe`} texto={error} enlace="/admin/ordenes" textoEnlace="Volver a órdenes" />;
  }

  const siguientes = SIGUIENTES_ESTADOS[orden.estado] || [];
  const esVenta = ESTADOS_VENTA.includes(orden.estado);

  async function guardarEstado() {
    setAviso(null);
    try {
      const actualizada = await cambiarEstadoBoleta(orden.numero, nuevoEstado);
      setDatos(actualizada);
      setNuevoEstado("");
      setAviso({ tipo: "success", texto: `Estado actualizado a ${actualizada.estado}.` });
    } catch (err) {
      setAviso({ tipo: "danger", texto: err.message });
    }
  }

  async function eliminar() {
    setConfirmarEliminar(false);
    try {
      await eliminarBoleta(orden.numero);
      navigate("/admin/ordenes", { state: { mensaje: `Boleta #${orden.numero} eliminada.` } });
    } catch (err) {
      setAviso({ tipo: "danger", texto: err.message });
    }
  }

  return (
    <>
      <EncabezadoAdmin titulo={`Boleta #${orden.numero}`} subtitulo={formatearFechaHora(orden.fecha)}>
        <Button variant="outline-secondary" onClick={() => window.print()} className="no-imprimir">
          <i className="bi bi-printer me-1" aria-hidden="true"></i> Imprimir
        </Button>
        <Link to="/admin/ordenes" className="btn btn-outline-primary no-imprimir">Volver</Link>
      </EncabezadoAdmin>
      {aviso && (
        <Alert variant={aviso.tipo} dismissible onClose={() => setAviso(null)} role="alert">
          {aviso.texto}
        </Alert>
      )}
      <Card className="shadow-sm">
        <Card.Body>
          <p className="mb-1">
            Estado: <EstadoOrden estado={orden.estado} />
          </p>
          <p className="small text-body-secondary">
            Pago con tarjeta terminada en {orden.pago.ultimosDigitos} ·{" "}
            {orden.pago.codigoAutorizacion ? `Autorización ${orden.pago.codigoAutorizacion}` : `Motivo: ${orden.pago.motivo}`}
          </p>

          {puedeGestionar && (
            <div className="border rounded-3 p-3 mb-3 bg-body-tertiary no-imprimir">
              <h2 className="h6">Gestión de la orden (solo administrador)</h2>
              {siguientes.length > 0 ? (
                <div className="d-flex flex-wrap gap-2 align-items-end">
                  <Form.Group controlId="orden-nuevo-estado">
                    <Form.Label className="small mb-1">Cambiar estado a</Form.Label>
                    <Form.Select value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)}>
                      <option value="">Selecciona un estado</option>
                      {siguientes.map((estado) => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Button onClick={guardarEstado} disabled={!nuevoEstado}>Guardar estado</Button>
                </div>
              ) : (
                <p className="small mb-2">Esta boleta está en un estado final.</p>
              )}
              {!esVenta && (
                <Button variant="outline-danger" size="sm" className="mt-2" onClick={() => setConfirmarEliminar(true)}>
                  <i className="bi bi-trash me-1" aria-hidden="true"></i> Eliminar boleta
                </Button>
              )}
              {nuevoEstado === "Anulada" && (
                <p className="small text-body-secondary mt-2 mb-0">Al anular, el stock de los productos vuelve al inventario.</p>
              )}
            </div>
          )}

          <DatosOrden orden={orden} />
          <h2 className="h5 mt-4">Productos</h2>
          <TablaItemsCompra items={orden.items} total={orden.total} etiquetaTotal={esVenta ? "Total pagado" : "Total"} />
        </Card.Body>
      </Card>
      <ModalConfirmacion
        mostrar={confirmarEliminar}
        titulo="Eliminar boleta"
        mensaje={`¿Eliminar la boleta #${orden.numero}? Esta acción no se puede deshacer.`}
        onConfirmar={eliminar}
        onCancelar={() => setConfirmarEliminar(false)}
      />
    </>
  );
}

export default DetalleOrden;