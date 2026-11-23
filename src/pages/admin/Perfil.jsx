import { useState } from "react";
import { Alert, Card } from "react-bootstrap";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import EstadoCarga from "../../components/comunes/EstadoCarga";
import FormularioUsuario from "../../components/formularios/FormularioUsuario";
import { useCarga } from "../../hooks/useCarga";
import { actualizarPerfil, obtenerPerfil } from "../../services/usuarioService";
import { nombreRol } from "../../utils/roles";

function Perfil({ sesion, onActualizarSesion }) {
  const [guardado, setGuardado] = useState(false);
  const { datos, cargando, error, recargar } = useCarga(obtenerPerfil);
  const usuario = datos || sesion;

  async function guardar(cambios) {
    const actualizado = await actualizarPerfil(cambios);
    onActualizarSesion(actualizado);
    setGuardado(true);
  }

  return (
    <>
      <EncabezadoAdmin titulo="Mi perfil" subtitulo={`${nombreRol(usuario.rol)} · ${usuario.correo}`} />
      {guardado && (
        <Alert variant="success" dismissible onClose={() => setGuardado(false)}>
          Tus datos fueron actualizados.
        </Alert>
      )}
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        <Card className="shadow-sm">
          <Card.Body>
            <FormularioUsuario modo="perfil" inicial={usuario} onGuardar={guardar} textoBoton="Guardar perfil" />
          </Card.Body>
        </Card>
      </EstadoCarga>
    </>
  );
}

export default Perfil;