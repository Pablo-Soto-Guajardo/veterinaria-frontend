import { crearToken } from "../test/apiFalsa";
import {
  CLAVE_TOKEN,
  guardarSesion,
  leerExpiracion,
  leerRefreshToken,
  leerToken,
  leerUsuarioSesion,
  limpiarSesion,
  tokenVencido
} from "./sesion";

const usuario = { correo: "cliente@gmail.com", nombre: "Javiera", rol: "CLIENTE" };

describe("gestión de la sesión en sessionStorage", () => {
  it("guarda token, refresh token y usuario, y los recupera tras una recarga", () => {
    guardarSesion({ token: "jwt", refreshToken: "refresh", usuario });
    expect(leerToken()).toBe("jwt");
    expect(leerRefreshToken()).toBe("refresh");
    expect(leerUsuarioSesion()).toEqual(usuario);
    // No usa localStorage: al cerrar la pestaña la sesión desaparece.
    expect(localStorage.getItem(CLAVE_TOKEN)).toBeNull();
  });

  it("sin token no hay sesión, aunque quede el usuario guardado", () => {
    guardarSesion({ token: "jwt", refreshToken: "refresh", usuario });
    sessionStorage.removeItem(CLAVE_TOKEN);
    expect(leerUsuarioSesion()).toBeNull();
  });

  it("limpiarSesion borra los tres datos", () => {
    guardarSesion({ token: "jwt", refreshToken: "refresh", usuario });
    limpiarSesion();
    expect(leerToken()).toBeNull();
    expect(leerRefreshToken()).toBeNull();
    expect(leerUsuarioSesion()).toBeNull();
  });

  it("lee la expiración del JWT y detecta si ya venció", () => {
    const ahora = Date.now();
    const vigente = crearToken(usuario, ahora + 10 * 60 * 1000);
    const vencido = crearToken(usuario, ahora - 1000);
    expect(leerExpiracion(vigente)).toBeGreaterThan(ahora);
    expect(tokenVencido(vigente, ahora)).toBe(false);
    expect(tokenVencido(vencido, ahora)).toBe(true);
    expect(leerExpiracion("no-es-un-jwt")).toBeNull();
  });
});