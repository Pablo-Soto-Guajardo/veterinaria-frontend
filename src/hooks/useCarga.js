import { useCallback, useEffect, useState } from "react";

export function useCarga(cargar, dependencias = []) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: "" });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let activo = true; // evita actualizar un componente que ya se desmontó
    setEstado((anterior) => ({ ...anterior, cargando: true, error: "" }));
    cargar()
      .then((datos) => {
        if (activo) setEstado({ datos, cargando: false, error: "" });
      })
      .catch((error) => {
        if (activo) setEstado({ datos: null, cargando: false, error: error.message });
      });
    return () => {
      activo = false;
    };

  }, [...dependencias, version]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);
  const setDatos = useCallback(
    (cambio) =>
      setEstado((anterior) => ({
        ...anterior,
        datos: typeof cambio === "function" ? cambio(anterior.datos) : cambio
      })),
    []
  );

  return { ...estado, recargar, setDatos };
}
