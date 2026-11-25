import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LayoutAdmin from "./components/layout/LayoutAdmin";
import LayoutTienda from "./components/layout/LayoutTienda";
import RutaProtegida from "./components/layout/RutaProtegida";
import NoEncontrada from "./pages/NoEncontrada";
import CategoriasAdmin from "./pages/admin/CategoriasAdmin";
import Dashboard from "./pages/admin/Dashboard";
import DetalleOrden from "./pages/admin/DetalleOrden";
import DetalleProductoAdmin from "./pages/admin/DetalleProductoAdmin";
import DetalleUsuario from "./pages/admin/DetalleUsuario";
import EditarCategoria from "./pages/admin/EditarCategoria";
import EditarProducto from "./pages/admin/EditarProducto";
import EditarUsuario from "./pages/admin/EditarUsuario";
import HistorialCompras from "./pages/admin/HistorialCompras";
import NuevaCategoria from "./pages/admin/NuevaCategoria";
import NuevoProducto from "./pages/admin/NuevoProducto";
import NuevoUsuario from "./pages/admin/NuevoUsuario";
import Ordenes from "./pages/admin/Ordenes";
import Perfil from "./pages/admin/Perfil";
import ProductosAdmin from "./pages/admin/ProductosAdmin";
import ProductosCriticos from "./pages/admin/ProductosCriticos";
import ReporteProductos from "./pages/admin/ReporteProductos";
import Reportes from "./pages/admin/Reportes";
import UsuariosAdmin from "./pages/admin/UsuariosAdmin";
import Blogs from "./pages/tienda/Blogs";
import Carrito from "./pages/tienda/Carrito";
import CategoriaDetalle from "./pages/tienda/CategoriaDetalle";
import Categorias from "./pages/tienda/Categorias";
import Checkout from "./pages/tienda/Checkout";
import CompraError from "./pages/tienda/CompraError";
import CompraExitosa from "./pages/tienda/CompraExitosa";
import Contacto from "./pages/tienda/Contacto";
import DetalleBlog from "./pages/tienda/DetalleBlog";
import DetalleProducto from "./pages/tienda/DetalleProducto";
import Inicio from "./pages/tienda/Inicio";
import Login from "./pages/tienda/Login";
import MisCompras from "./pages/tienda/MisCompras";
import Nosotros from "./pages/tienda/Nosotros";
import Ofertas from "./pages/tienda/Ofertas";
import Productos from "./pages/tienda/Productos";
import Registro from "./pages/tienda/Registro";
import { cerrarSesionRemota } from "./services/authService";
import { obtenerPerfil } from "./services/usuarioService";
import { agregarItem, cambiarCantidad, quitarItem } from "./utils/carrito";
import { guardarCarrito, leerCarrito } from "./utils/persistencia";
import { tienePermiso } from "./utils/roles";
import {
  guardarSesion,
  guardarUsuarioSesion,
  leerRefreshToken,
  leerUsuarioSesion,
  limpiarSesion
} from "./utils/sesion";


function App() {
  const [carrito, setCarrito] = useState(() => leerCarrito());

  const [sesion, setSesion] = useState(() => leerUsuarioSesion());
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    guardarCarrito(carrito);
  }, [carrito]);


  useEffect(() => {
    if (!leerUsuarioSesion()) return;
    obtenerPerfil()
      .then((usuario) => {
        guardarUsuarioSesion(usuario);
        setSesion(usuario);
      })
      .catch(() => {
        limpiarSesion();
        setSesion(null);
      });
  }, []);


  useEffect(() => {
    function alActualizar(evento) {
      setSesion(evento.detail);
    }
    function alExpirar() {
      setSesion(null);
      setAviso({ tipo: "error", texto: "Tu sesión expiró. Inicia sesión nuevamente." });
    }
    window.addEventListener("sesion-actualizada", alActualizar);
    window.addEventListener("sesion-expirada", alExpirar);
    return () => {
      window.removeEventListener("sesion-actualizada", alActualizar);
      window.removeEventListener("sesion-expirada", alExpirar);
    };
  }, []);

  function iniciarSesion(respuesta) {
    guardarSesion(respuesta);
    setSesion(respuesta.usuario);
  }

  function actualizarSesion(usuario) {
    guardarUsuarioSesion(usuario);
    setSesion(usuario);
  }

  function cerrarSesion() {
    cerrarSesionRemota(leerRefreshToken());
    limpiarSesion();
    setSesion(null);
  }

  function agregarAlCarrito(producto, cantidad = 1) {
    try {
      setCarrito(agregarItem(carrito, producto, cantidad));
      setAviso({ tipo: "exito", texto: `"${producto.nombre}" se agregó al carrito.` });
    } catch (error) {
      setAviso({ tipo: "error", texto: error.message });
    }
  }

  function cambiarCantidadCarrito(codigo, cantidad, stock) {
    setCarrito(cambiarCantidad(carrito, codigo, cantidad, stock));
  }

  function quitarDelCarrito(codigo) {
    setCarrito(quitarItem(carrito, codigo));
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  const propsTienda = { onAgregar: agregarAlCarrito };

  return (
    <Routes>
      <Route
        element={
          <LayoutTienda
            carrito={carrito}
            sesion={sesion}
            onCerrarSesion={cerrarSesion}
            aviso={aviso}
            onCerrarAviso={() => setAviso(null)}
          />
        }
      >
        <Route index element={<Inicio {...propsTienda} />} />
        <Route path="productos" element={<Productos {...propsTienda} />} />
        <Route path="productos/:codigo" element={<DetalleProducto {...propsTienda} />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="categorias/:id" element={<CategoriaDetalle {...propsTienda} />} />
        <Route path="ofertas" element={<Ofertas {...propsTienda} />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:id" element={<DetalleBlog />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="registro" element={<Registro sesion={sesion} onIniciarSesion={iniciarSesion} />} />
        <Route path="login" element={<Login sesion={sesion} onIniciarSesion={iniciarSesion} />} />
        <Route
          path="carrito"
          element={
            <Carrito
              carrito={carrito}
              onCambiarCantidad={cambiarCantidadCarrito}
              onQuitar={quitarDelCarrito}
              onVaciar={vaciarCarrito}
              onAgregar={agregarAlCarrito}
            />
          }
        />
        <Route
          path="checkout"
          element={<Checkout carrito={carrito} sesion={sesion} onCompraExitosa={vaciarCarrito} />}
        />
        {/* Páginas que requieren haber iniciado sesión */}
        <Route element={<RutaProtegida sesion={sesion} />}>
          <Route path="mis-compras" element={<MisCompras />} />
          <Route path="compra/exitosa/:numero" element={<CompraExitosa />} />
          <Route path="compra/error/:numero" element={<CompraError />} />
        </Route>
        <Route path="*" element={<NoEncontrada />} />
      </Route>

      {/* Panel: Administrador y Vendedor. Cada grupo exige su propio permiso. */}
      <Route path="admin" element={<RutaProtegida sesion={sesion} permiso="panel" />}>
        <Route element={<LayoutAdmin sesion={sesion} onCerrarSesion={cerrarSesion} />}>
          <Route
            index
            element={
              tienePermiso(sesion, "dashboard") ? (
                <Dashboard sesion={sesion} />
              ) : (
                <Navigate to="/admin/productos" replace />
              )
            }
          />
          <Route element={<RutaProtegida sesion={sesion} permiso="ordenes" />}>
            <Route path="ordenes" element={<Ordenes />} />
            <Route path="ordenes/:numero" element={<DetalleOrden sesion={sesion} />} />
          </Route>
          <Route element={<RutaProtegida sesion={sesion} permiso="productos" />}>
            <Route path="productos" element={<ProductosAdmin sesion={sesion} />} />
            <Route path="productos/:codigo" element={<DetalleProductoAdmin sesion={sesion} />} />
          </Route>
          <Route element={<RutaProtegida sesion={sesion} permiso="productos.gestionar" />}>
            <Route path="productos/nuevo" element={<NuevoProducto />} />
            <Route path="productos/criticos" element={<ProductosCriticos />} />
            <Route path="productos/reportes" element={<ReporteProductos />} />
            <Route path="productos/:codigo/editar" element={<EditarProducto />} />
          </Route>
          <Route element={<RutaProtegida sesion={sesion} permiso="categorias" />}>
            <Route path="categorias" element={<CategoriasAdmin />} />
            <Route path="categorias/nueva" element={<NuevaCategoria />} />
            <Route path="categorias/:id/editar" element={<EditarCategoria />} />
          </Route>
          <Route element={<RutaProtegida sesion={sesion} permiso="usuarios" />}>
            <Route path="usuarios" element={<UsuariosAdmin sesion={sesion} />} />
            <Route path="usuarios/nuevo" element={<NuevoUsuario />} />
            <Route path="usuarios/:run" element={<DetalleUsuario />} />
            <Route
              path="usuarios/:run/editar"
              element={<EditarUsuario sesion={sesion} onActualizarSesion={actualizarSesion} />}
            />
            <Route path="usuarios/:run/compras" element={<HistorialCompras />} />
          </Route>
          <Route element={<RutaProtegida sesion={sesion} permiso="reportes" />}>
            <Route path="reportes" element={<Reportes />} />
          </Route>
          <Route element={<RutaProtegida sesion={sesion} permiso="perfil" />}>
            <Route path="perfil" element={<Perfil sesion={sesion} onActualizarSesion={actualizarSesion} />} />
          </Route>
          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;