import { Col, Row } from "react-bootstrap";
import TarjetaProducto from "./TarjetaProducto";

function GrillaProductos({ productos, onAgregar, columnasXl = 4 }) {
  return (
    <Row className="g-4">
      {productos.map((producto) => (
        <Col xs={12} sm={6} lg={4} xl={12 / columnasXl} key={producto.codigo}>
          <TarjetaProducto
            producto={producto}
            nombreCategoria={producto.categoriaNombre || ""}
            onAgregar={onAgregar}
          />
        </Col>
      ))}
    </Row>
  );
}

export default GrillaProductos;
