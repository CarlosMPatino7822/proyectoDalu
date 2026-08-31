import { createPortal } from "react-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { easeCine, FOTOS } from "./santuarioConfig";

function VisorFoto({ indice, onCerrar, onCambiar }) {
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onCerrar();
            if (e.key === "ArrowRight") onCambiar((indice + 1) % FOTOS.length);
            if (e.key === "ArrowLeft") onCambiar((indice - 1 + FOTOS.length) % FOTOS.length);
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [indice, onCerrar, onCambiar]);

    const foto = FOTOS[indice];

    return createPortal(
        <motion.div
            className="visor-fondo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onCerrar}
        >
            <button className="visor-cerrar" onClick={onCerrar} aria-label="Cerrar">✕</button>

            <button
                className="visor-flecha visor-flecha-izq"
                onClick={(e) => {
                    e.stopPropagation();
                    onCambiar((indice - 1 + FOTOS.length) % FOTOS.length);
                }}
                aria-label="Anterior"
            >
                ‹
            </button>

            <motion.figure
                key={indice}
                className="visor-polaroid"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: easeCine }}
                onClick={(e) => e.stopPropagation()}
            >
                <img src={foto.src} alt="" />
                <figcaption>{foto.nota}</figcaption>
            </motion.figure>

            <button
                className="visor-flecha visor-flecha-der"
                onClick={(e) => {
                    e.stopPropagation();
                    onCambiar((indice + 1) % FOTOS.length);
                }}
                aria-label="Siguiente"
            >
                ›
            </button>

            <p className="visor-contador">{indice + 1} / {FOTOS.length}</p>
        </motion.div>,
        document.body
    );
}

export default VisorFoto;

