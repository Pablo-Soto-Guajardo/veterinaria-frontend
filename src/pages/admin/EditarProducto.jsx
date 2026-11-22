import { Card } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import FormularioProducto from "../../components/admin/FormularioProducto";
import EstadoCarga from "../../components/comunes/EstadoCarga";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import { useCarga } from "../../hooks/useCarga";
import { actualizarProducto, obtenerProducto } from "../../services/productoService";

function EditarProducto() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const { datos: producto, cargando, error } = useCarga(() => obtenerProducto(codigo), [codigo]);

  if (cargando) return <EstadoCarga cargando />;
  if (!producto) {
    return <MensajeVacio titulo={`El producto ${codigo} no existe`} texto={error} enlace="/admin/productos" textoEnlace="Volver a productos" />;
  }

  async function guardar(datos) {
    await actualizarProducto(codigo, datos);
    navigate(`/admin/productos/${codigo}`, { state: { mensaje: "Cambios guardados correctamente." } });
  }

  return (
    <>
      <EncabezadoAdmin titulo="Editar producto" subtitulo={`${producto.codigo} · ${producto.nombre}`}>
        <Link to={`/admin/productos/${codigo}`} className="btn btn-outline-secondary">Cancelar</Link>
      </EncabezadoAdmin>
      <Card className="shadow-sm">
        <Card.Body>
          <FormularioProducto inicial={producto} onGuardar={guardar} textoBoton="Guardar cambios" editando />
        </Card.Body>
      </Card>
    </>
  );
}

export default EditarProducto;
