import { Col, Container, Row } from "react-bootstrap";
import TarjetaCategoria from "../../components/categorias/TarjetaCategoria";
import EstadoCarga from "../../components/comunes/EstadoCarga";
import { useCarga } from "../../hooks/useCarga";
import { listarCategorias } from "../../services/categoriaService";
import { listarProductos } from "../../services/productoService";

function Categorias() {
  const { datos, cargando, error, recargar } = useCarga(() =>
    Promise.all([listarCategorias(), listarProductos()])
  );
  const [categorias, productos] = datos || [[], []];

  return (
    <Container className="py-4">
      <h1>Categorías</h1>
      <p className="text-body-secondary">Elige una categoría para ver sus productos.</p>
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
      <Row className="g-4">
        {categorias.map((categoria) => (
          <Col xs={6} md={4} lg={3} xl={2} key={categoria.id}>
            <TarjetaCategoria
              categoria={categoria}
              cantidad={productos.filter((producto) => producto.categoria === categoria.id).length}
            />
          </Col>
        ))}
      </Row>
      </EstadoCarga>
    </Container>
  );
}

export default Categorias;
