import { Alert, Button, Spinner } from "react-bootstrap";

function EstadoCarga({ cargando, error, onReintentar, children }) {
  if (cargando) {
    return (
      <div className="text-center py-5" role="status">
        <Spinner aria-hidden="true" />
        <p className="mt-2 mb-0">Cargando...</p>
      </div>
    );
  }
  if (error) {
    return (
      <Alert variant="danger" role="alert" className="my-3">
        <p className="mb-2">{error}</p>
        {onReintentar && (
          <Button size="sm" variant="outline-danger" onClick={onReintentar}>
            Reintentar
          </Button>
        )}
      </Alert>
    );
  }
  return children;
}

export default EstadoCarga;
