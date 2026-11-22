import { Card } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import FormularioCategoria from "../../components/admin/FormularioCategoria";
import EstadoCarga from "../../components/comunes/EstadoCarga";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import { useCarga } from "../../hooks/useCarga";
import { actualizarCategoria, obtenerCategoria } from "../../services/categoriaService";

function EditarCategoria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { datos: categoria, cargando } = useCarga(() => obtenerCategoria(id), [id]);

  if (cargando) return <EstadoCarga cargando />;
  if (!categoria) {
    return <MensajeVacio titulo="La categoría no existe" enlace="/admin/categorias" textoEnlace="Volver a categorías" />;
  }

  async function guardar(datos) {
    await actualizarCategoria(id, datos);
    navigate("/admin/categorias", { state: { mensaje: "Categoría actualizada." } });
  }

  return (
    <>
      <EncabezadoAdmin titulo="Editar categoría" subtitulo={categoria.nombre}>
        <Link to="/admin/categorias" className="btn btn-outline-secondary">Cancelar</Link>
      </EncabezadoAdmin>
      <Card className="shadow-sm">
        <Card.Body>
          <FormularioCategoria inicial={categoria} onGuardar={guardar} textoBoton="Guardar cambios" />
        </Card.Body>
      </Card>
    </>
  );
}

export default EditarCategoria;
