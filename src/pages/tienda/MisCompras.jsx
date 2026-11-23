import { Card, Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import EstadoOrden from "../../components/admin/EstadoOrden";
import EstadoCarga from "../../components/comunes/EstadoCarga";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import { useCarga } from "../../hooks/useCarga";
import { listarMisBoletas } from "../../services/boletaService";
import { formatearPrecio } from "../../utils/precio";
import { formatearFechaHora } from "../../utils/texto";


function MisCompras() {
  const { datos, cargando, error, recargar } = useCarga(listarMisBoletas);
  const boletas = datos || [];

  return (
    <Container className="py-4">
      <h1>Mis compras</h1>
      <p className="text-body-secondary">Revisa el estado de tus boletas.</p>
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        {boletas.length === 0 ? (
          <MensajeVacio icono="bi-bag" titulo="Todavía no tienes compras" enlace="/productos" textoEnlace="Ver productos" />
        ) : (
          <Card className="shadow-sm">
            <Card.Body>
              <Table responsive hover className="align-middle mb-0">
                <caption>Boletas asociadas a tu cuenta</caption>
                <thead>
                  <tr>
                    <th scope="col">N°</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Estado</th>
                    <th scope="col" className="text-end">Total</th>
                    <th scope="col">Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {boletas.map((boleta) => (
                    <tr key={boleta.numero}>
                      <th scope="row">#{boleta.numero}</th>
                      <td>{formatearFechaHora(boleta.fecha)}</td>
                      <td><EstadoOrden estado={boleta.estado} /></td>
                      <td className="text-end">{formatearPrecio(boleta.total)}</td>
                      <td>
                        <Link
                          to={boleta.estado === "Rechazada" ? `/compra/error/${boleta.numero}` : `/compra/exitosa/${boleta.numero}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Ver boleta
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}
      </EstadoCarga>
    </Container>
  );
}

export default MisCompras;