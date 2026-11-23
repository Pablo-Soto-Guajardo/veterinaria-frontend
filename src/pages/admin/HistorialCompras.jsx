import { Card, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import EstadoOrden from "../../components/admin/EstadoOrden";
import EstadoCarga from "../../components/comunes/EstadoCarga";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import { useCarga } from "../../hooks/useCarga";
import { listarBoletas } from "../../services/boletaService";
import { obtenerUsuario } from "../../services/usuarioService";
import { formatearPrecio } from "../../utils/precio";
import { formatearFechaHora } from "../../utils/texto";

function HistorialCompras() {
  const { run } = useParams();
  // GET /usuarios/{run} (Auth) y luego GET /boletas?correo= (Tienda)
  const { datos, cargando, error } = useCarga(async () => {
    const usuario = await obtenerUsuario(run);
    const ordenes = await listarBoletas(usuario.correo);
    return { usuario, ordenes };
  }, [run]);

  if (cargando) return <EstadoCarga cargando />;
  if (!datos) {
    return <MensajeVacio titulo="El usuario no existe" texto={error} enlace="/admin/usuarios" textoEnlace="Volver a usuarios" />;
  }

  const { usuario, ordenes } = datos;

  return (
    <>
      <EncabezadoAdmin titulo="Historial de compras" subtitulo={`${usuario.nombre} ${usuario.apellidos} · ${usuario.correo}`}>
        <Link to={`/admin/usuarios/${run}`} className="btn btn-outline-secondary">Volver al usuario</Link>
      </EncabezadoAdmin>
      {ordenes.length === 0 ? (
        <MensajeVacio icono="bi-bag-x" titulo="Este usuario todavía no registra compras" />
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <Table responsive hover className="align-middle mb-0">
              <caption>Órdenes realizadas por el usuario</caption>
              <thead>
                <tr>
                  <th scope="col">N°</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Productos</th>
                  <th scope="col">Estado</th>
                  <th scope="col" className="text-end">Total</th>
                  <th scope="col">Boleta</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((orden) => (
                  <tr key={orden.numero}>
                    <th scope="row">#{orden.numero}</th>
                    <td>{formatearFechaHora(orden.fecha)}</td>
                    <td>{orden.items.map((item) => `${item.nombre} x${item.cantidad}`).join(", ")}</td>
                    <td><EstadoOrden estado={orden.estado} /></td>
                    <td className="text-end">{formatearPrecio(orden.total)}</td>
                    <td>
                      <Link to={`/admin/ordenes/${orden.numero}`} className="btn btn-sm btn-outline-primary">Ver</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </>
  );
}

export default HistorialCompras;