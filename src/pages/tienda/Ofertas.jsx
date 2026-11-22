import { Container } from "react-bootstrap";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import GrillaProductos from "../../components/productos/GrillaProductos";
import EstadoCarga from "../../components/comunes/EstadoCarga";
import { useCarga } from "../../hooks/useCarga";
import { listarProductosEnOferta } from "../../services/productoService";
import { porcentajeDescuento } from "../../utils/precio";

function Ofertas({ onAgregar }) {

  const { datos, cargando, error, recargar } = useCarga(listarProductosEnOferta);
  if (!datos) return <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />;
  const ofertas = [...datos].sort(
    (a, b) => porcentajeDescuento(b) - porcentajeDescuento(a)
  );

  return (
    <Container className="py-4">
      <h1>Ofertas</h1>
      <p className="text-body-secondary">Productos con precio rebajado por tiempo limitado.</p>
      {ofertas.length === 0 ? (
        <MensajeVacio icono="bi-percent" titulo="No hay ofertas vigentes" enlace="/productos" textoEnlace="Ver catálogo" />
      ) : (
        <GrillaProductos productos={ofertas} onAgregar={onAgregar} />
      )}
    </Container>
  );
}

export default Ofertas;
