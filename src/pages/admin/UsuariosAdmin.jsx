import { useState } from "react";
import { Alert, Card, Col, Form, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import AvisoNavegacion from "../../components/admin/AvisoNavegacion";
import EncabezadoAdmin from "../../components/admin/EncabezadoAdmin";
import EstadoCarga from "../../components/comunes/EstadoCarga";
import ModalConfirmacion from "../../components/comunes/ModalConfirmacion";
import { useCarga } from "../../hooks/useCarga";
import { eliminarUsuario, listarUsuarios } from "../../services/usuarioService";
import { NOMBRES_ROL, ROLES } from "../../utils/roles";

const COLOR_ROL = { ADMIN: "text-bg-primary", VENDEDOR: "text-bg-info", CLIENTE: "text-bg-secondary" };

// GET /api/v1/usuarios en el backend Auth (solo ADMIN).
function UsuariosAdmin({ sesion }) {
  const { datos, cargando, error, recargar, setDatos } = useCarga(listarUsuarios);
  const usuarios = datos || [];
  const [busqueda, setBusqueda] = useState("");
  const [rol, setRol] = useState("");
  const [porEliminar, setPorEliminar] = useState(null);
  const [aviso, setAviso] = useState(null);

  const texto = busqueda.trim().toLowerCase();
  const visibles = usuarios.filter((usuario) => {
    const datos = `${usuario.run} ${usuario.nombre} ${usuario.apellidos} ${usuario.correo}`.toLowerCase();
    return (texto === "" || datos.includes(texto)) && (rol === "" || usuario.rol === rol);
  });

  async function confirmarEliminacion() {
    const usuario = porEliminar;
    setPorEliminar(null);
    try {
      await eliminarUsuario(usuario.run);
      setDatos((lista) => lista.filter((u) => u.run !== usuario.run));
      setAviso({ tipo: "success", texto: `Usuario ${usuario.nombre} eliminado.` });
    } catch (err) {
      setAviso({ tipo: "danger", texto: err.message });
    }
  }

  return (
    <>
      <EncabezadoAdmin titulo="Usuarios" subtitulo={`${usuarios.length} usuarios registrados`}>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary">
          <i className="bi bi-person-plus me-1" aria-hidden="true"></i> Nuevo usuario
        </Link>
      </EncabezadoAdmin>
      <AvisoNavegacion />
      {aviso && (
        <Alert variant={aviso.tipo} dismissible onClose={() => setAviso(null)}>
          {aviso.texto}
        </Alert>
      )}
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
      <Card className="shadow-sm">
        <Card.Body>
          <Row className="g-3 mb-3">
            <Col xs={12} md={8}>
              <Form.Group controlId="usuarios-busqueda">
                <Form.Label>Buscar</Form.Label>
                <Form.Control type="search" placeholder="RUN, nombre o correo" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} />
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group controlId="usuarios-rol">
                <Form.Label>Rol</Form.Label>
                <Form.Select value={rol} onChange={(evento) => setRol(evento.target.value)}>
                  <option value="">Todos</option>
                  {ROLES.map((item) => (
                    <option key={item} value={item}>{NOMBRES_ROL[item]}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Table responsive hover className="align-middle">
            <caption>Listado de personal clínico y clientes</caption>
            <thead>
              <tr>
                <th scope="col">RUN</th>
                <th scope="col">Nombre completo</th>
                <th scope="col">Correo</th>
                <th scope="col">Rol</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((usuario) => (
                <tr key={usuario.run}>
                  <th scope="row">{usuario.run}</th>
                  <td>{usuario.nombre} {usuario.apellidos}</td>
                  <td>{usuario.correo}</td>
                  <td>
                    <span className={`badge ${COLOR_ROL[usuario.rol] || "text-bg-secondary"}`}>
                      {NOMBRES_ROL[usuario.rol] || usuario.rol}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link to={`/admin/usuarios/${usuario.run}`} className="btn btn-sm btn-outline-secondary" aria-label={`Ver ${usuario.nombre}`}>
                        <i className="bi bi-eye" aria-hidden="true"></i>
                      </Link>
                      <Link to={`/admin/usuarios/${usuario.run}/editar`} className="btn btn-sm btn-outline-primary" aria-label={`Editar ${usuario.nombre}`}>
                        <i className="bi bi-pencil" aria-hidden="true"></i>
                      </Link>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setPorEliminar(usuario)}
                        disabled={usuario.run === sesion.run}
                        aria-label={`Eliminar ${usuario.nombre}`}
                        title={usuario.run === sesion.run ? "No puedes eliminar tu propia cuenta" : undefined}
                      >
                        <i className="bi bi-trash" aria-hidden="true"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibles.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-body-secondary py-4">No hay usuarios que coincidan con la búsqueda.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      </EstadoCarga>
      <ModalConfirmacion
        mostrar={Boolean(porEliminar)}
        titulo="Eliminar usuario"
        mensaje={`¿Eliminar la cuenta de ${porEliminar?.nombre} ${porEliminar?.apellidos}?`}
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
}

export default UsuariosAdmin;