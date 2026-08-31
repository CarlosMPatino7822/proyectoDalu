const TOKEN_KEY = "dalu_spotify_token";
const VERIFIER_KEY = "dalu_spotify_code_verifier";
const STATE_KEY = "dalu_spotify_auth_state";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

const SCOPES = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-modify-playback-state",
    "playlist-read-private",
    "playlist-read-collaborative",
];

const spotifyClientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

function getRedirectUri() {
    return `${window.location.origin}${window.location.pathname}`;
}

function generarTextoAleatorio(longitud) {
    const posibles = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const valores = crypto.getRandomValues(new Uint8Array(longitud));

    return Array.from(valores, (valor) => posibles[valor % posibles.length]).join("");
}

async function sha256(texto) {
    const datos = new TextEncoder().encode(texto);
    return crypto.subtle.digest("SHA-256", datos);
}

function base64UrlEncode(buffer) {
    const bytes = new Uint8Array(buffer);
    const texto = String.fromCharCode(...bytes);

    return btoa(texto).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function guardarToken(datos) {
    const token = {
        accessToken: datos.access_token,
        refreshToken: datos.refresh_token,
        expiresAt: Date.now() + datos.expires_in * 1000 - 60000,
    };

    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    return token;
}

export function spotifyConfigurado() {
    return Boolean(spotifyClientId);
}

export function leerTokenGuardado() {
    const guardado = localStorage.getItem(TOKEN_KEY);
    if (!guardado) return null;

    try {
        return JSON.parse(guardado);
    } catch {
        localStorage.removeItem(TOKEN_KEY);
        return null;
    }
}

export function cerrarSesionSpotify() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(VERIFIER_KEY);
    sessionStorage.removeItem(STATE_KEY);
}

export async function iniciarSesionSpotify() {
    if (!spotifyClientId) return;

    const verifier = generarTextoAleatorio(96);
    const challenge = base64UrlEncode(await sha256(verifier));
    const state = generarTextoAleatorio(24);

    sessionStorage.setItem(VERIFIER_KEY, verifier);
    sessionStorage.setItem(STATE_KEY, state);

    const params = new URLSearchParams({
        client_id: spotifyClientId,
        response_type: "code",
        redirect_uri: getRedirectUri(),
        scope: SCOPES.join(" "),
        code_challenge_method: "S256",
        code_challenge: challenge,
        state,
    });

    window.location.assign(`${SPOTIFY_AUTH_URL}?${params.toString()}`);
}

async function intercambiarCodigoPorToken(code) {
    const verifier = sessionStorage.getItem(VERIFIER_KEY);
    if (!verifier) throw new Error("No se encontró el verificador de Spotify.");

    const respuesta = await fetch(SPOTIFY_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: spotifyClientId,
            grant_type: "authorization_code",
            code,
            redirect_uri: getRedirectUri(),
            code_verifier: verifier,
        }),
    });

    if (!respuesta.ok) throw new Error("Spotify no pudo completar el inicio de sesión.");

    sessionStorage.removeItem(VERIFIER_KEY);
    sessionStorage.removeItem(STATE_KEY);

    return guardarToken(await respuesta.json());
}

async function refrescarToken(refreshToken) {
    const respuesta = await fetch(SPOTIFY_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: spotifyClientId,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
    });

    if (!respuesta.ok) {
        cerrarSesionSpotify();
        throw new Error("La sesión de Spotify expiró.");
    }

    const datos = await respuesta.json();
    return guardarToken({ ...datos, refresh_token: datos.refresh_token || refreshToken });
}

export async function obtenerTokenSpotify() {
    if (!spotifyClientId) return null;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");

    if (error) {
        window.history.replaceState({}, "", getRedirectUri());
        throw new Error("Spotify canceló el inicio de sesión.");
    }

    if (code) {
        if (state !== sessionStorage.getItem(STATE_KEY)) {
            window.history.replaceState({}, "", getRedirectUri());
            throw new Error("La respuesta de Spotify no coincide con esta sesión.");
        }

        const token = await intercambiarCodigoPorToken(code);
        window.history.replaceState({}, "", getRedirectUri());
        return token;
    }

    const token = leerTokenGuardado();
    if (!token) return null;
    if (Date.now() < token.expiresAt) return token;
    if (!token.refreshToken) return null;

    return refrescarToken(token.refreshToken);
}

export async function spotifyFetch(path, token, opciones = {}) {
    const respuesta = await fetch(`https://api.spotify.com/v1${path}`, {
        ...opciones,
        headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
            ...opciones.headers,
        },
    });

    if (respuesta.status === 204) return null;
    if (!respuesta.ok) throw new Error("Spotify no respondió como esperábamos.");

    return respuesta.json();
}
