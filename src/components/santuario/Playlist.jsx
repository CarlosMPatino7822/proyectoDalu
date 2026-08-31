import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { easeCine } from "./santuarioConfig";
import SeccionTitulo from "./SeccionTitulo";
import { useSpotifyPlayer } from "./useSpotifyPlayer";
import {
    cerrarSesionSpotify,
    iniciarSesionSpotify,
    obtenerTokenSpotify,
    spotifyConfigurado,
    spotifyFetch,
} from "./spotifyAuth";

const NOTAS_KEY = "dalu_notas_playlist";

// "frase" es el texto fijo y artístico de cada canción (no se edita nunca).
// La nota personal (editable) es un campo aparte que vive en localStorage.
const CANCIONES_BASE = [
    { titulo: "Happy Together", artista: "The Turtles", frase: "La de siempre", spotifyUri: "" },
    { titulo: "The Red Means I Love You", artista: "Wolf Alice", frase: "La que abre todo", spotifyUri: "" },
    { titulo: "Cherry Waves", artista: "Joji", frase: "La de los viajes", spotifyUri: "" },
    { titulo: "When I'm Gone", artista: "Joji", frase: "La de extrañarte", spotifyUri: "" },
];

const ICONOS = {
    play: <path d="M8 5v14l11-7z" />,
    pause: <path d="M7 5h4v14H7zM13 5h4v14h-4z" />,
    next: <path d="M5 5l9 7-9 7zM16 5h3v14h-3z" />,
    previous: <path d="M19 5l-9 7 9 7zM5 5h3v14H5z" />,
    shuffle: <path d="M16 4h4v4M4 7h3c2.5 0 4 10 6.5 10H20M20 16v4h-4M4 17h3c.9 0 1.7-.8 2.4-2M13.6 9c.7-1.2 1.5-2 2.4-2h4" />,
    close: <path d="M6 6l12 12M18 6L6 18" />,
    spotify: <path d="M5 9.5c4.7-1.7 9.2-1.4 14 1M6.5 13c3.5-1 6.8-.8 10.5.8M8 16.2c2.4-.6 4.8-.4 7.2.6M12 22a10 10 0 100-20 10 10 0 000 20z" />,
    nota: <path d="M6 4h9l4 4v12H6zM15 4v4h4M9 12h6M9 15.5h6M9 8.5h3" />,
    flechaIzq: <path d="M15 5l-7 7 7 7" />,
    flechaDer: <path d="M9 5l7 7-7 7" />,
};

function Icono({ tipo }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {ICONOS[tipo]}
        </svg>
    );
}

function mezclarCanciones(canciones, indiceInicial) {
    const inicio = canciones[indiceInicial];
    const restantes = canciones.filter((_, indice) => indice !== indiceInicial);

    for (let i = restantes.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [restantes[i], restantes[j]] = [restantes[j], restantes[i]];
    }

    return [inicio, ...restantes];
}

function cargarNotas() {
    try {
        return JSON.parse(localStorage.getItem(NOTAS_KEY)) || {};
    } catch {
        return {};
    }
}

function idCancion(cancion) {
    return cancion.spotifyUri || `${cancion.titulo}-${cancion.artista}`;
}

function transformarTrack(entrada, indice) {
    const track = entrada.item;
    return {
        titulo: track.name,
        artista: track.artists.map((artista) => artista.name).join(", "),
        frase: CANCIONES_BASE[indice]?.frase || "Un recuerdo para escribir aquí",
        spotifyUri: track.uri,
        imagen: track.album?.images?.[1]?.url || track.album?.images?.[0]?.url || "",
    };
}

function Playlist() {
    const playlistId = import.meta.env.VITE_SPOTIFY_PLAYLIST_ID;
    const [token, setToken] = useState(null);
    const [cancionesSpotify, setCancionesSpotify] = useState([]);
    const [indiceActivo, setIndiceActivo] = useState(null);
    const [reproductorVisible, setReproductorVisible] = useState(false);
    const [aleatorio, setAleatorio] = useState(false);
    const [notas, setNotas] = useState(cargarNotas);
    const [notaAbierta, setNotaAbierta] = useState(null);
    const [estadoConexion, setEstadoConexion] = useState("Conecta Spotify para escuchar desde aquí.");
    const { player, deviceId, estado, error } = useSpotifyPlayer(token);
    const carruselRef = useRef(null);

    const canciones = cancionesSpotify.length ? cancionesSpotify : CANCIONES_BASE;
    const urisDisponibles = useMemo(() => canciones.map((cancion) => cancion.spotifyUri).filter(Boolean), [canciones]);
    const cancionActiva = indiceActivo === null ? null : canciones[indiceActivo];
    const pausado = estado?.paused ?? true;
    const spotifyListo = Boolean(token && deviceId && player);

    useEffect(() => {
        let cancelado = false;

        obtenerTokenSpotify()
            .then((nuevoToken) => {
                if (!cancelado) setToken(nuevoToken);
            })
            .catch((err) => {
                if (!cancelado) setEstadoConexion(err.message);
            });

        return () => {
            cancelado = true;
        };
    }, []);

    useEffect(() => {
        if (!token) return;
        setEstadoConexion(deviceId ? "Spotify listo en este navegador." : "Preparando el reproductor de Spotify...");
    }, [deviceId, token]);

    useEffect(() => {
        if (error) setEstadoConexion(error);
    }, [error]);

    useEffect(() => {
        if (!token || !playlistId) return;

        let cancelado = false;

        spotifyFetch(`/playlists/${playlistId}/items?limit=100&fields=items(item(name,uri,artists(name),album(images)))`, token)
            .then((datos) => {
                if (cancelado) return;

                if (!datos?.items) {
                    setEstadoConexion("Esta playlist no es tuya ni colaborativa; Spotify ya no permite leer sus canciones. Usa una playlist propia.");
                    return;
                }

                const tracks = datos.items.filter((entrada) => entrada.item?.uri).map(transformarTrack);
                setCancionesSpotify(tracks);
            })
            .catch(() => setEstadoConexion("No pude cargar la playlist; revisaré las canciones escritas aquí."));

        return () => {
            cancelado = true;
        };
    }, [playlistId, token]);

    useEffect(() => {
        localStorage.setItem(NOTAS_KEY, JSON.stringify(notas));
    }, [notas]);

    useEffect(() => {
        const uriActual = estado?.track_window?.current_track?.uri;
        if (!uriActual) return;

        const nuevoIndice = canciones.findIndex((cancion) => cancion.spotifyUri === uriActual);
        if (nuevoIndice >= 0) setIndiceActivo(nuevoIndice);
    }, [canciones, estado]);

    async function reproducirCancion(indice) {
        const cancion = canciones[indice];
        if (!cancion.spotifyUri) {
            setEstadoConexion("Agrega el spotifyUri de esta canción o configura VITE_SPOTIFY_PLAYLIST_ID.");
            return;
        }

        if (!spotifyListo) {
            setEstadoConexion(token ? "Spotify todavía está preparando el dispositivo." : "Primero conecta Spotify.");
            return;
        }

        await player.activateElement();

        const cola = aleatorio ? mezclarCanciones(canciones, indice).map((item) => item.spotifyUri).filter(Boolean) : urisDisponibles;
        const offset = aleatorio ? 0 : cola.findIndex((uri) => uri === cancion.spotifyUri);

        await spotifyFetch(`/me/player/play?device_id=${deviceId}`, token, {
            method: "PUT",
            body: JSON.stringify({
                uris: cola,
                offset: { position: Math.max(offset, 0) },
                position_ms: 0,
            }),
        });

        setIndiceActivo(indice);
        setReproductorVisible(true);
        setEstadoConexion("Sonando desde el santuario.");
    }

    async function alternarPlay() {
        if (!player) return;
        await player.togglePlay();
    }

    async function cerrarReproductor() {
        if (player) await player.pause();
        setReproductorVisible(false);
    }

    function alternarNota(cancion) {
        const id = idCancion(cancion);
        setNotaAbierta((actual) => (actual === id ? null : id));
    }

    function actualizarNota(cancion, valor) {
        setNotas((actuales) => ({ ...actuales, [idCancion(cancion)]: valor }));
    }

    function desconectar() {
        cerrarSesionSpotify();
        setToken(null);
        setEstadoConexion("Conecta Spotify para escuchar desde aquí.");
    }

    function desplazarCarrusel(direccion) {
        const contenedor = carruselRef.current;
        if (!contenedor) return;
        const distancia = contenedor.clientWidth * 0.7;
        contenedor.scrollBy({ left: direccion * distancia, behavior: "smooth" });
    }

    return (
        <section className="s-section" id="playlist">
            <SeccionTitulo eyebrow="NUESTRO SONIDO" titulo="Playlist" />

            <div className="playlist-panel">
                <div className="playlist-toolbar">
                    <p>{estadoConexion}</p>
                    <div className="playlist-acciones">
                        <button type="button" className={`playlist-icon-btn ${aleatorio ? "activo" : ""}`} onClick={() => setAleatorio((valor) => !valor)} title="Aleatorio">
                            <Icono tipo="shuffle" />
                        </button>
                        {token ? (
                            <button type="button" className="playlist-conectar" onClick={desconectar}>
                                Desconectar
                            </button>
                        ) : (
                            <button type="button" className="playlist-conectar" onClick={iniciarSesionSpotify} disabled={!spotifyConfigurado()}>
                                <Icono tipo="spotify" />
                                Conectar Spotify
                            </button>
                        )}
                    </div>
                </div>

                <div className="playlist-carrusel-envoltura">
                    <button type="button" className="playlist-flecha playlist-flecha-izq" onClick={() => desplazarCarrusel(-1)} title="Ver anteriores">
                        <Icono tipo="flechaIzq" />
                    </button>

                    <div className="playlist-lista" ref={carruselRef}>
                        {canciones.map((c, i) => {
                            const activa = indiceActivo === i;
                            const id = idCancion(c);
                            const notaPersonal = notas[id] ?? "";
                            const notaVisible = notaAbierta === id;
                            const tieneNota = notaPersonal.trim().length > 0;

                            return (
                                <motion.article
                                    key={id}
                                    className={`playlist-card ${activa ? "activa" : ""}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.55, delay: i * 0.06, ease: easeCine }}
                                >
                                    <div className="playlist-card-cover">
                                        {c.imagen ? (
                                            <img src={c.imagen} alt="" />
                                        ) : (
                                            <div className="playlist-cover-fallback">
                                                <Icono tipo="spotify" />
                                            </div>
                                        )}
                                        <button type="button" className="playlist-card-play" onClick={() => reproducirCancion(i)} title={`Escuchar ${c.titulo}`}>
                                            {activa && !pausado ? (
                                                <span className="ecualizador">
                                                    <i /><i /><i />
                                                </span>
                                            ) : (
                                                <Icono tipo="play" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="playlist-card-info">
                                        <span className="playlist-titulo">{c.titulo}</span>
                                        <span className="playlist-artista">{c.artista}</span>
                                        <span className="playlist-frase">{c.frase}</span>
                                    </div>

                                    <div className="playlist-card-footer">
                                        <button
                                            type="button"
                                            className={`playlist-icon-btn playlist-nota-btn ${notaVisible ? "activo" : ""}`}
                                            onClick={() => alternarNota(c)}
                                            title="Dejar una nota"
                                        >
                                            <Icono tipo="nota" />
                                            {tieneNota && <span className="playlist-nota-punto" aria-hidden="true" />}
                                        </button>
                                    </div>

                                    <AnimatePresence initial={false}>
                                        {notaVisible && (
                                            <motion.div
                                                className="playlist-nota-panel"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: easeCine }}
                                            >
                                                <textarea
                                                    className="playlist-nota-textarea"
                                                    value={notaPersonal}
                                                    onChange={(event) => actualizarNota(c, event.target.value)}
                                                    placeholder="Escribe aquí un recuerdo, una fecha, algo que sentiste con esta canción..."
                                                    rows="3"
                                                    autoFocus
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.article>
                            );
                        })}
                    </div>

                    <button type="button" className="playlist-flecha playlist-flecha-der" onClick={() => desplazarCarrusel(1)} title="Ver siguientes">
                        <Icono tipo="flechaDer" />
                    </button>
                </div>
                <p className="playlist-hint">Desliza o usa las flechas para ver más canciones →</p>
            </div>

            {createPortal(
                <AnimatePresence>
                    {reproductorVisible && cancionActiva && (
                        <motion.div
                            className="spotify-mini-player"
                            initial={{ opacity: 0, y: 60, scale: 0.94 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.94 }}
                            transition={{ type: "spring", stiffness: 210, damping: 26, mass: 0.9 }}
                        >
                            <div className="spotify-mini-info">
                                <span className={`spotify-mini-disco ${!pausado ? "girando" : ""}`}>
                                    {cancionActiva.imagen ? (
                                        <img src={cancionActiva.imagen} alt="" />
                                    ) : (
                                        <Icono tipo="spotify" />
                                    )}
                                </span>
                                <div>
                                    <span>{cancionActiva.titulo}</span>
                                    <small>{cancionActiva.artista}</small>
                                </div>
                            </div>

                            <div className="spotify-mini-controles">
                                <button type="button" className={`playlist-icon-btn ${aleatorio ? "activo" : ""}`} onClick={() => setAleatorio((valor) => !valor)} title="Aleatorio">
                                    <Icono tipo="shuffle" />
                                </button>
                                <button type="button" className="playlist-icon-btn" onClick={() => player?.previousTrack()} title="Anterior">
                                    <Icono tipo="previous" />
                                </button>
                                <button type="button" className="playlist-icon-btn spotify-play-pausa" onClick={alternarPlay} title={pausado ? "Reproducir" : "Pausar"}>
                                    <Icono tipo={pausado ? "play" : "pause"} />
                                </button>
                                <button type="button" className="playlist-icon-btn" onClick={() => player?.nextTrack()} title="Siguiente">
                                    <Icono tipo="next" />
                                </button>
                            </div>

                            <button type="button" className="playlist-icon-btn spotify-mini-cerrar" onClick={cerrarReproductor} title="Cerrar reproductor">
                                <Icono tipo="close" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    );
}

export default Playlist;