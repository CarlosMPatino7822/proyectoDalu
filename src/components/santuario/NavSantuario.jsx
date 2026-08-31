import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { easeCine } from "./santuarioConfig";

const ICONOS = {
    inicio: <path d="M4 11.5 12 4l8 7.5M6 10v9h5v-5h2v5h5v-9" />,
    recuerdos: <path d="M4 7h4l2-2h4l2 2h4v12H4z M12 17a4 4 0 100-8 4 4 0 000 8z" />,
    cartas: <path d="M4 6h16v12H4z M4 6l8 7 8-7" />,
    playlist: <path d="M9 18V6l10-2v12M9 18a3 3 0 100-6 3 3 0 000 6zM19 16a3 3 0 100-6 3 3 0 000 6z" />,
    momentos: <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" />,
    sobreti: <path d="M12 21s-7-4.6-9.8-9C.6 8.4 2 5 5.3 5c2 0 3.4 1.2 4.2 2.4C10.3 6.2 11.7 5 13.7 5 17 5 18.4 8.4 16.8 12 14 16.4 12 21 12 21z" />,
};

const secciones = [
    { id: "inicio", icono: "inicio", etiqueta: "Inicio" },
    { id: "recuerdos", icono: "recuerdos", etiqueta: "Recuerdos" },
    { id: "cartas", icono: "cartas", etiqueta: "Cartas" },
    { id: "playlist", icono: "playlist", etiqueta: "Playlist" },
    { id: "momentos", icono: "momentos", etiqueta: "Momentos" },
    { id: "sobre-ti", icono: "sobreti", etiqueta: "Sobre ti" },
];

function IconoSVG({ tipo }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            {ICONOS[tipo]}
        </svg>
    );
}

function NavSantuario({ visible }) {
    const [activa, setActiva] = useState("inicio");

    useEffect(() => {
        const observador = new IntersectionObserver(
            (entradas) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting) setActiva(entrada.target.id);
                });
            },
            { threshold: 0.5 }
        );

        secciones.forEach((s) => {
            const el = document.getElementById(s.id);
            if (el) observador.observe(el);
        });

        return () => observador.disconnect();
    }, []);

    return createPortal(
        <>
            <motion.div
                className="s-logo-fijo"
                initial={{ opacity: 0 }}
                animate={{ opacity: visible ? 1 : 0 }}
                transition={{ duration: 1, delay: visible ? 0.2 : 0 }}
            >
                Dalu. <span className="s-logo-heart">♡</span>
            </motion.div>

            <motion.nav
                className="s-nav-vertical"
                initial={{ opacity: 0 }}
                animate={{ opacity: visible ? 1 : 0 }}
                transition={{ duration: 0.9, ease: easeCine, delay: visible ? 0.4 : 0 }}
            >
                {secciones.map((s) => (
                    <a
                        key={s.id}
                        href={`#${s.id}`}
                        className={`s-nav-icono ${activa === s.id ? "activo" : ""}`}
                        title={s.etiqueta}
                    >
                        <IconoSVG tipo={s.icono} />
                    </a>
                ))}
                <span className="s-nav-sep" />
                <span className="s-nav-icono s-nav-brillo" title="Detalles">
                    ✦
                </span>
            </motion.nav>
        </>,
        document.body
    );
}

export default NavSantuario;

