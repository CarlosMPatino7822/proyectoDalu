import { useEffect, useState } from "react";

function cargarSdkSpotify() {
    if (window.Spotify) return Promise.resolve();

    return new Promise((resolve) => {
        const scriptExistente = document.querySelector("script[src='https://sdk.scdn.co/spotify-player.js']");
        window.onSpotifyWebPlaybackSDKReady = () => resolve();

        if (scriptExistente) return;

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
    });
}

export function useSpotifyPlayer(token) {
    const [player, setPlayer] = useState(null);
    const [deviceId, setDeviceId] = useState("");
    const [estado, setEstado] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token?.accessToken) return undefined;

        let cancelado = false;
        let instancia = null;

        async function prepararPlayer() {
            await cargarSdkSpotify();
            if (cancelado) return;

            instancia = new window.Spotify.Player({
                name: "Santuario Dalu",
                volume: 0.72,
                getOAuthToken: (cb) => cb(token.accessToken),
            });

            instancia.addListener("ready", ({ device_id }) => {
                setDeviceId(device_id);
                setError("");
            });

            instancia.addListener("not_ready", () => {
                setDeviceId("");
            });

            instancia.addListener("player_state_changed", (nuevoEstado) => {
                if (nuevoEstado) setEstado(nuevoEstado);
            });

            instancia.addListener("initialization_error", ({ message }) => setError(message));
            instancia.addListener("authentication_error", ({ message }) => setError(message));
            instancia.addListener("account_error", () => {
                setError("Spotify Premium es necesario para reproducir desde el navegador.");
            });
            instancia.addListener("playback_error", ({ message }) => setError(message));

            await instancia.connect();
            setPlayer(instancia);
        }

        prepararPlayer();

        return () => {
            cancelado = true;
            if (instancia) instancia.disconnect();
            setPlayer(null);
            setDeviceId("");
            setEstado(null);
        };
    }, [token]);

    return { player, deviceId, estado, error };
}
