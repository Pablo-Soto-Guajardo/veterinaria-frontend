import {
  boletasIniciales,
  categoriasIniciales,
  productosIniciales,
  usuariosIniciales
} from "./datosPrueba";

const copiar = (valor) => JSON.parse(JSON.stringify(valor));
const QUINCE_MINUTOS = 15 * 60 * 1000;

function base64Url(texto) {
  return btoa(unescape(encodeURIComponent(texto))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function crearToken(usuario, expiraEn = Date.now() + QUINCE_MINUTOS) {
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({ iss: "veterinaria-auth", sub: usuario.correo, rol: usuario.rol, exp: Math.floor(expiraEn / 1000) })
  );
  return `${header}.${payload}.firma-de-prueba`;
}

function leerToken(token) {
  try {
    const [, payload, firma] = token.split(".");
    if (firma !== "firma-de-prueba") return null;
    const datos = JSON.parse(decodeURIComponent(escape(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))));
    if (datos.exp * 1000 <= Date.now()) return null;
    return datos;
  } catch {
    return null;
  }
}

function respuesta(estado, cuerpo) {
  return new Response(estado === 204 ? null : JSON.stringify(cuerpo), {
    status: estado,
    headers: { "Content-Type": "application/json" }
  });
}

const error = (estado, mensaje) => respuesta(estado, { error: mensaje });

function sinPassword(usuario) {
  const { password: _password, ...publico } = usuario;
  return publico;
}

function slug(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const ESTADOS_VENTA = ["Pagada", "Enviada", "Entregada"];
const TRANSICIONES = { Pagada: ["Enviada", "Anulada"], Enviada: ["Entregada", "Anulada"] };

export function crearApiFalsa({ duracionTokenMs = QUINCE_MINUTOS } = {}) {
  const db = {
    categorias: copiar(categoriasIniciales),
    productos: copiar(productosIniciales),
    usuarios: copiar(usuariosIniciales),
    boletas: copiar(boletasIniciales),
    refresh: new Map()
  };
  const llamadas = [];
  let contadorRefresh = 0;

  function emitirSesion(usuario) {
    contadorRefresh += 1;
    const refreshToken = `refresh-${contadorRefresh}`;
    db.refresh.set(refreshToken, { correo: usuario.correo, usado: false });
    return {
      token: crearToken(usuario, Date.now() + duracionTokenMs),
      refreshToken,
      expiraEnSegundos: Math.floor(duracionTokenMs / 1000),
      correo: usuario.correo,
      rol: usuario.rol,
      usuario: sinPassword(usuario)
    };
  }

  const conCategoria = (producto) => ({
    ...producto,
    categoriaNombre: db.categorias.find((c) => c.id === producto.categoria)?.nombre || ""
  });

  function precioVigente(producto) {
    return producto.precioOferta !== null && producto.precioOferta < producto.precio
      ? producto.precioOferta
      : producto.precio;
  }

  async function fetchFalso(url, opciones = {}) {
    const direccion = new URL(url, "http://localhost");
    const metodo = (opciones.method || "GET").toUpperCase();
    const cuerpo = opciones.body ? JSON.parse(opciones.body) : null;
    const autorizacion = opciones.headers?.Authorization || "";
    const servicio = direccion.port === "8081" || direccion.pathname.includes("auth-service") ? "auth" : "tienda";
    const ruta = direccion.pathname.replace(/^.*\/v1/, "");
    const partes = ruta.split("/").filter(Boolean);
    llamadas.push({ servicio, metodo, ruta: `${ruta}${direccion.search}`, autorizacion });

    const claims = autorizacion.startsWith("Bearer ") ? leerToken(autorizacion.slice(7)) : null;
    const usuarioActual = claims ? db.usuarios.find((u) => u.correo === claims.sub) : null;
    const rol = claims?.rol;
    const autenticado = () => Boolean(claims);
    const exigir = (...roles) => {
      if (!claims) return error(401, "No autenticado");
      if (roles.length && !roles.includes(rol)) return error(403, "Sin permisos");
      return null;
    };

    if (servicio === "auth") {
      if (partes[0] === "auth") {
        if (partes[1] === "login" && metodo === "POST") {
          const usuario = db.usuarios.find((u) => u.correo === cuerpo.correo.toLowerCase());
          if (!usuario || usuario.password !== cuerpo.password) {
            return error(401, "Correo o contraseña incorrectos");
          }
          return respuesta(200, emitirSesion(usuario));
        }
        if (partes[1] === "registro" && metodo === "POST") {
          if (db.usuarios.some((u) => u.run === cuerpo.run)) {
            return error(409, "Ya existe un usuario registrado con ese RUN");
          }
          if (db.usuarios.some((u) => u.correo === cuerpo.correo)) {
            return error(409, "Ya existe un usuario registrado con ese correo");
          }
          const nuevo = { ...cuerpo, rol: "CLIENTE" };
          db.usuarios.push(nuevo);
          return respuesta(201, emitirSesion(nuevo));
        }
        if (partes[1] === "refresh" && metodo === "POST") {
          const registro = db.refresh.get(cuerpo.refreshToken);
          if (!registro || registro.usado) return error(401, "Sesión no válida, vuelve a iniciar sesión");
          registro.usado = true;
          const usuario = db.usuarios.find((u) => u.correo === registro.correo);
          return respuesta(200, emitirSesion(usuario));
        }
        if (partes[1] === "logout" && metodo === "POST") {
          const registro = db.refresh.get(cuerpo.refreshToken);
          if (registro) registro.usado = true;
          return respuesta(204);
        }
      }

      if (partes[0] === "usuarios") {
        if (partes[1] === "me") {
          const rechazo = exigir();
          if (rechazo) return rechazo;
          if (metodo === "PUT") {
            const { password, ...cambios } = cuerpo;
            Object.assign(usuarioActual, cambios, password ? { password } : {});
          }
          return respuesta(200, sinPassword(usuarioActual));
        }
        const rechazo = exigir("ADMIN");
        if (rechazo) return rechazo;
        if (partes.length === 1 && metodo === "GET") return respuesta(200, db.usuarios.map(sinPassword));
        if (partes.length === 1 && metodo === "POST") {
          if (db.usuarios.some((u) => u.run === cuerpo.run)) return error(409, "Ya existe un usuario registrado con ese RUN");
          if (db.usuarios.some((u) => u.correo === cuerpo.correo)) return error(409, "Ya existe un usuario registrado con ese correo");
          db.usuarios.push({ ...cuerpo });
          return respuesta(201, sinPassword(cuerpo));
        }
        const usuario = db.usuarios.find((u) => u.run === partes[1]);
        if (!usuario) return error(404, `Usuario no encontrado: ${partes[1]}`);
        if (metodo === "GET") return respuesta(200, sinPassword(usuario));
        if (metodo === "PUT") {
          const { password, run: _run, ...cambios } = cuerpo;
          Object.assign(usuario, cambios, password ? { password } : {});
          return respuesta(200, sinPassword(usuario));
        }
        if (metodo === "DELETE") {
          if (usuario.correo === claims.sub) return error(409, "No puedes eliminar tu propia cuenta");
          db.usuarios = db.usuarios.filter((u) => u !== usuario);
          return respuesta(204);
        }
      }
      return error(404, "Ruta no encontrada");
    }

    if (partes[0] === "categorias") {
      if (metodo === "GET") {
        if (partes.length === 1) return respuesta(200, db.categorias);
        const categoria = db.categorias.find((c) => c.id === partes[1]);
        return categoria ? respuesta(200, categoria) : error(404, `Categoría no encontrada: ${partes[1]}`);
      }
      const rechazo = exigir("ADMIN");
      if (rechazo) return rechazo;
      if (metodo === "POST") {
        const nueva = { id: slug(cuerpo.nombre), ...cuerpo };
        if (db.categorias.some((c) => c.id === nueva.id)) return error(409, `Ya existe la categoría ${cuerpo.nombre}`);
        db.categorias.push(nueva);
        return respuesta(201, nueva);
      }
      const categoria = db.categorias.find((c) => c.id === partes[1]);
      if (!categoria) return error(404, "Categoría no encontrada");
      if (metodo === "PUT") {
        Object.assign(categoria, cuerpo);
        return respuesta(200, categoria);
      }
      if (metodo === "DELETE") {
        const enUso = db.productos.filter((p) => p.categoria === categoria.id).length;
        if (enUso > 0) return error(409, `No se puede eliminar: ${enUso} producto(s) usan esta categoría`);
        db.categorias = db.categorias.filter((c) => c !== categoria);
        return respuesta(204);
      }
    }

    if (partes[0] === "productos") {
      if (metodo === "GET") {
        if (partes.length === 1) {
          let lista = db.productos;
          const categoria = direccion.searchParams.get("categoria");
          if (categoria) lista = lista.filter((p) => p.categoria === categoria);
          if (direccion.searchParams.get("oferta") === "true") {
            lista = lista.filter((p) => p.precioOferta !== null && p.precioOferta < p.precio);
          }
          if (direccion.searchParams.get("criticos") === "true") {
            lista = lista.filter((p) => p.stock <= p.stockCritico);
          }
          return respuesta(200, lista.map(conCategoria));
        }
        const producto = db.productos.find((p) => p.codigo === partes[1]);
        return producto ? respuesta(200, conCategoria(producto)) : error(404, `Producto no encontrado: ${partes[1]}`);
      }
      const rechazo = exigir("ADMIN");
      if (rechazo) return rechazo;
      if (metodo === "POST") {
        if (db.productos.some((p) => p.codigo === cuerpo.codigo)) {
          return error(409, `Ya existe un producto con el código ${cuerpo.codigo}`);
        }
        db.productos.push({ ...cuerpo });
        return respuesta(201, conCategoria(cuerpo));
      }
      const producto = db.productos.find((p) => p.codigo === partes[1]);
      if (!producto) return error(404, "Producto no encontrado");
      if (metodo === "PUT") {
        Object.assign(producto, cuerpo, { codigo: producto.codigo });
        return respuesta(200, conCategoria(producto));
      }
      if (metodo === "DELETE") {
        const vendido = db.boletas.some((b) => b.items.some((i) => i.codigo === producto.codigo));
        if (vendido) return error(409, "No se puede eliminar: el producto tiene ventas registradas.");
        db.productos = db.productos.filter((p) => p !== producto);
        return respuesta(204);
      }
    }

    if (partes[0] === "boletas") {
      if (partes.length === 1 && metodo === "POST") {
        const rechazo = exigir("CLIENTE", "ADMIN");
        if (rechazo) return rechazo;
        const items = cuerpo.items.map(({ codigo, cantidad }) => {
          const producto = db.productos.find((p) => p.codigo === codigo);
          const precioUnitario = precioVigente(producto);
          return { codigo, nombre: producto.nombre, precioUnitario, cantidad, subtotal: precioUnitario * cantidad, imagen: producto.imagen, producto };
        });
        const total = items.reduce((suma, item) => suma + item.subtotal, 0);
        const sinStock = items.find((item) => item.producto.stock < item.cantidad);
        const rechazada = cuerpo.numeroTarjeta === "4000000000000002";
        let estado = "Pagada";
        let motivo = null;
        if (sinStock) {
          estado = "Rechazada";
          motivo = `Stock insuficiente para ${sinStock.nombre}.`;
        } else if (rechazada) {
          estado = "Rechazada";
          motivo = "Tarjeta rechazada por el emisor.";
        } else {
          items.forEach((item) => {
            item.producto.stock -= item.cantidad;
          });
        }
        const boleta = {
          numero: Math.max(0, ...db.boletas.map((b) => b.numero)) + 1,
          fecha: new Date().toISOString().slice(0, 19),
          estado,
          cliente: { ...cuerpo.cliente, correo: claims.sub },
          envio: cuerpo.envio,
          items: items.map(({ producto: _producto, ...item }) => item),
          total,
          pago: {
            medio: "Tarjeta",
            ultimosDigitos: cuerpo.numeroTarjeta.slice(-4),
            codigoAutorizacion: estado === "Pagada" ? "AUT-123456" : null,
            motivo
          }
        };
        db.boletas.push(boleta);
        return respuesta(201, boleta);
      }
      if (partes.length === 1 && metodo === "GET") {
        const rechazo = exigir("ADMIN", "VENDEDOR");
        if (rechazo) return rechazo;
        const correo = direccion.searchParams.get("correo");
        const lista = correo ? db.boletas.filter((b) => b.cliente.correo === correo) : db.boletas;
        return respuesta(200, [...lista].sort((a, b) => b.numero - a.numero));
      }
      if (partes[1] === "mias") {
        if (!autenticado()) return error(401, "No autenticado");
        return respuesta(200, db.boletas.filter((b) => b.cliente.correo === claims.sub).reverse());
      }
      const boleta = db.boletas.find((b) => b.numero === Number(partes[1]));
      if (metodo === "GET") {
        if (!autenticado()) return error(401, "No autenticado");
        if (!boleta) return error(404, `Boleta no encontrada: ${partes[1]}`);
        if (!["ADMIN", "VENDEDOR"].includes(rol) && boleta.cliente.correo !== claims.sub) {
          return error(403, "No puedes ver boletas de otros clientes");
        }
        return respuesta(200, boleta);
      }
      const rechazo = exigir("ADMIN");
      if (rechazo) return rechazo;
      if (!boleta) return error(404, "Boleta no encontrada");
      if (partes[2] === "estado" && metodo === "PUT") {
        if (!(TRANSICIONES[boleta.estado] || []).includes(cuerpo.estado)) {
          return error(409, `No se puede pasar de ${boleta.estado} a ${cuerpo.estado}`);
        }
        boleta.estado = cuerpo.estado;
        return respuesta(200, boleta);
      }
      if (metodo === "DELETE") {
        if (ESTADOS_VENTA.includes(boleta.estado)) {
          return error(409, "Solo se pueden eliminar boletas rechazadas o anuladas.");
        }
        db.boletas = db.boletas.filter((b) => b !== boleta);
        return respuesta(204);
      }
    }

    return error(404, "Ruta no encontrada");
  }

  return { fetch: fetchFalso, db, llamadas, emitirSesion };
}