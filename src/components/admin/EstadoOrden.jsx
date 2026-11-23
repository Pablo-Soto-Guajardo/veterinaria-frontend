
const ESTILOS = {
  Pagada: { clase: "text-bg-success", icono: "bi-check-circle" },
  Enviada: { clase: "text-bg-info", icono: "bi-truck" },
  Entregada: { clase: "text-bg-primary", icono: "bi-house-check" },
  Rechazada: { clase: "text-bg-danger", icono: "bi-x-circle" },
  Anulada: { clase: "text-bg-secondary", icono: "bi-slash-circle" }
};

function EstadoOrden({ estado }) {
  const estilo = ESTILOS[estado] || ESTILOS.Rechazada;
  return (
    <span className={`badge ${estilo.clase}`}>
      <i className={`bi ${estilo.icono} me-1`} aria-hidden="true"></i>
      {estado}
    </span>
  );
}

export default EstadoOrden;