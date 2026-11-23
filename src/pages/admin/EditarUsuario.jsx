import { Card } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import EstadoCarga from "../../components/comunes/EstadoCarga";
import MensajeVacio from "../../components/comunes/MensajeVacio";
import FormularioUsuario from "../../components/formularios/FormularioUsuario";
import { useCarga } from "../../hooks/useCarga";
import { actualizarUsuario, obtenerUsuario } from "../../services/usuarioService";

function EditarUsuario({ sesion, onActualizarSesion }) {
  const { run } = useParams();
  const navigate = useNavigate();
  const { datos: usuario, cargando, error } = useCarga(() => obtenerUsuario(run), [run]);

  if (cargando) return <EstadoCarga cargando />;
  if (!usuario) {
    return <MensajeVacio titulo="El usuario no existe" texto={error} enlace="/admin/usuarios" textoEnlace="Volver a usuarios" />;
  }

  async function guardar(datos) {
    const actualizado = await actualizarUsuario(run, datos);
    if (sesion.run === run) onActualizarSesion(actualizado);
    navigate(`/admin/usuarios/${run}`, { state: { mensaje: "Usuario actualizado." } });
  }

  return (
    <>
      <EncabezadoAdmin titulo="Editar usuario" subtitulo={`${usuario.nombre} ${usuario.apellidos}`}>
        <Link to={`/admin/usuarios/${run}`} className="btn btn-outline-secondary">Cancelar</Link>
      </EncabezadoAdmin>
      <Card className="shadow-sm">
        <Card.Body>
          <FormularioUsuario modo="editar" inicial={usuario} onGuardar={guardar} textoBoton="Guardar cambios" />
        </Card.Body>
      </Card>
    </>
  );
}

export default EditarUsuario;