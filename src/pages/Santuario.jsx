import "./Santuario.css";
import { createPortal } from "react-dom";
import { useRef, useState, useMemo, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import LUDA1 from "../assets/images/LUDA1.jpeg";
import LUDA2 from "../assets/images/LUDA2.jpeg";
import LUDA3 from "../assets/images/LUDA3.jpeg";
import LUDA4 from "../assets/images/LUDA4.jpeg";
import FotosLu from "../assets/images/FotosLu.jpeg";
import FrascoReal from "../assets/images/frasco-real.webp";

const easeCine = [0.16, 1, 0.3, 1];

/* -------------------------------------------------------------- */
/* TEXTURA — grano de película + viñeta, para el tono nostálgico   */
/* -------------------------------------------------------------- */
function Textura() {
    return (
        <div className="textura" aria-hidden="true">
            <svg className="grano">
                <filter id="ruido">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#ruido)" />
            </svg>
            <div className="vineta" />
        </div>
    );
}

/* -------------------------------------------------------------- */
/* INTRO — "Bienvenida" -> "Dalu" en el centro -> sube a la marca   */
/* del navbar -> la página real se enciende lentamente              */
/* -------------------------------------------------------------- */
function IntroBienvenida({ onTerminar }) {
    // negro -> bienvenida (sola) -> dalu (sola) -> subiendo -> encendiendo -> desmontar
    const [fase, setFase] = useState("negro");

    useEffect(() => {
        const secuencia = [
            ["bienvenida", 600],
            ["dalu", 2000],
            ["subiendo", 3300],
            ["encendiendo", 4200],
        ];
        const timers = secuencia.map(([f, ms]) => setTimeout(() => setFase(f), ms));
        const fin = setTimeout(() => onTerminar(), 6000);
        return () => {
            timers.forEach(clearTimeout);
            clearTimeout(fin);
        };
    }, [onTerminar]);

    const subiendo = fase === "subiendo" || fase === "encendiendo";
    const mostrarDalu = fase === "dalu" || subiendo;

    return createPortal(
        <motion.div className="intro" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <motion.div
                className="intro-negro"
                initial={{ opacity: 1 }}
                animate={{ opacity: fase === "encendiendo" ? 0 : 1 }}
                transition={{ duration: 1.8, ease: easeCine }}
            />

            <motion.div
                className="intro-marca"
                initial={{ top: "50%", left: "50%", x: "-50%", y: "-50%", scale: 1 }}
                animate={
                    subiendo
                        ? { top: "34px", left: "6.5%", x: 0, y: 0, scale: 0.34 }
                        : { top: "50%", left: "50%", x: "-50%", y: "-50%", scale: 1 }
                }
                transition={{ duration: 0.9, ease: easeCine }}
            >
                {/* mode="wait": "Bienvenida" se va del todo antes de que entre "Dalu",
                    nunca coexisten — así se ve la secuencia primero-luego pedida. */}
                <AnimatePresence mode="wait">
                    {fase === "bienvenida" && (
                        <motion.span
                            key="bienvenida"
                            className="intro-bienvenida"
                            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                            transition={{ duration: 0.6, ease: easeCine }}
                        >
                            Bienvenida
                        </motion.span>
                    )}
                    {mostrarDalu && (
                        <motion.span
                            key="dalu"
                            className="intro-dalu"
                            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.7, ease: easeCine }}
                        >
                            Dalu <i>♡</i>
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>,
        document.body
    );
}

/* -------------------------------------------------------------- */
/* VIDA AMBIENTAL — luciérnaga que sigue el curs + polvo flotante */
/* que vive en toda la página, no solo en el hero                   */
/* -------------------------------------------------------------- */
function CursorLuciernaga() {
    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const sx = useSpring(x, { stiffness: 140, damping: 20, mass: 0.4 });
    const sy = useSpring(y, { stiffness: 140, damping: 20, mass: 0.4 });

    useEffect(() => {
        const mover = (e) => {
            x.set(e.clientX);
            y.set(e.clientY);
        };
        window.addEventListener("mousemove", mover, { passive: true });
        return () => window.removeEventListener("mousemove", mover);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Portal a document.body: así el elemento no es descendiente de NINGÚN
    // contenedor de React que pueda tener transform/filter, que es lo que
    // rompía el position:fixed y hacía que se quedara pegado al hacer scroll.
    return createPortal(
        <motion.div
            className="cursor-luciernaga"
            style={{ x: sx, y: sy }}
            aria-hidden="true"
        />,
        document.body
    );
}

function AmbientePolvo({ cantidad = 26 }) {
    const puntos = useMemo(
        () =>
            [...Array(cantidad)].map(() => ({
                left: Math.random() * 100,
                dur: 14 + Math.random() * 16,
                delay: Math.random() * 12,
                size: 2 + Math.random() * 2,
            })),
        [cantidad]
    );
    return (
        <div className="ambiente-polvo" aria-hidden="true">
            {puntos.map((p, i) => (
                <motion.span
                    key={i}
                    className="mota"
                    style={{ left: `${p.left}%`, width: p.size, height: p.size }}
                    animate={{ y: ["100vh", "-10vh"], opacity: [0, 0.5, 0.5, 0] }}
                    transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "linear" }}
                />
            ))}
        </div>
    );
}

/* -------------------------------------------------------------- */
/* NAVBAR — barra vertical de íconos, fija a la izquierda           */
/* -------------------------------------------------------------- */
const ICONOS = {
    inicio: (
        <path d="M4 11.5 12 4l8 7.5M6 10v9h5v-5h2v5h5v-9" />
    ),
    recuerdos: (
        <path d="M4 7h4l2-2h4l2 2h4v12H4z M12 17a4 4 0 100-8 4 4 0 000 8z" />
    ),
    cartas: (
        <path d="M4 6h16v12H4z M4 6l8 7 8-7" />
    ),
    playlist: (
        <path d="M9 18V6l10-2v12M9 18a3 3 0 100-6 3 3 0 000 6zM19 16a3 3 0 100-6 3 3 0 000 6z" />
    ),
    momentos: (
        <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" />
    ),
    sobreti: (
        <path d="M12 21s-7-4.6-9.8-9C.6 8.4 2 5 5.3 5c2 0 3.4 1.2 4.2 2.4C10.3 6.2 11.7 5 13.7 5 17 5 18.4 8.4 16.8 12 14 16.4 12 21 12 21z" />
    ),
};

function IconoSVG({ tipo }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            {ICONOS[tipo]}
        </svg>
    );
}

function NavSantuario({ visible }) {
    const secciones = [
        { id: "inicio", icono: "inicio", etiqueta: "Inicio" },
        { id: "recuerdos", icono: "recuerdos", etiqueta: "Recuerdos" },
        { id: "cartas", icono: "cartas", etiqueta: "Cartas" },
        { id: "playlist", icono: "playlist", etiqueta: "Playlist" },
        { id: "momentos", icono: "momentos", etiqueta: "Momentos" },
        { id: "sobre-ti", icono: "sobreti", etiqueta: "Sobre ti" },
    ];
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

/* -------------------------------------------------------------- */
/* HERO — el frasco de luces (foto real)                            */
/* -------------------------------------------------------------- */
/** Cuenta los días desde el "Primer día" (misma fecha que ya usa Momentos:
 *  12/02/2023) — cámbiala aquí si la fecha real es otra. */
function ContadorDias() {
    const INICIO = useMemo(() => new Date(2023, 1, 12), []); // mes 1 = febrero
    const [dias, setDias] = useState(0);

    useEffect(() => {
        const calcular = () => {
            const ms = Date.now() - INICIO.getTime();
            setDias(Math.floor(ms / (1000 * 60 * 60 * 24)));
        };
        calcular();
        const intervalo = setInterval(calcular, 60 * 60 * 1000); // se refresca cada hora
        return () => clearInterval(intervalo);
    }, [INICIO]);

    return (
        <motion.div
            className="s-contador-dias"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: easeCine }}
        >
            <span className="s-contador-numero">{dias}</span>
            <span className="s-contador-texto">días juntos ♡</span>
        </motion.div>
    );
}

function HeroFrasco() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const yTexto = useTransform(scrollYProgress, [0, 1], [0, -60]);
    const opacidad = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const escalaImg = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

    return (
        <section className="s-hero" id="inicio" ref={ref}>
            <div className="s-hero-frame">
                <motion.img
                    src={FrascoReal}
                    alt="Frasco de recuerdos con luces y polaroids"
                    className="s-hero-img"
                    style={{ scale: escalaImg }}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.6, ease: easeCine }}
                />
                {/* degradado sacado del propio color de la foto — por eso no se ve
                    "pegada", se funde con el fondo de la página */}
                <div className="s-hero-degradado" />
                <div className="s-hero-vineta-inferior" />

                <motion.div className="s-hero-text" style={{ y: yTexto, opacity: opacidad }}>
                    <ContadorDias />
                    <motion.p
                        className="s-eyebrow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: easeCine }}
                    >
                        Hecho con cariño, para alguien especial.
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ delay: 0.5, duration: 1, ease: easeCine }}
                    >
                        Proyecto
                        <span>Dalu <i>♡</i></span>
                    </motion.h1>
                    <motion.p
                        className="s-sub"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.9, ease: easeCine }}
                    >
                        Cada recuerdo, cada sonrisa, cada momento... guardados aquí.
                    </motion.p>
                    <motion.div
                        className="s-cta-row"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.9, ease: easeCine }}
                    >
                        <a href="#recuerdos" className="s-btn s-btn-primary">
                            ✦ Comenzar
                        </a>
                        <a href="#momentos" className="s-btn s-btn-ghost">
                            ▷ Ver recuerdos
                        </a>
                    </motion.div>
                </motion.div>

                <Mariposas cantidad={7} />

                <motion.div
                    className="s-scroll-hint"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    ⌄
                </motion.div>
            </div>
        </section>
    );
}

/** Círculos de luz cálida desenfocados detrás del frasco — profundidad de campo. */
function BokehFondo() {
    const circulos = useMemo(
        () =>
            [...Array(10)].map(() => ({
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: 40 + Math.random() * 90,
                delay: Math.random() * 6,
                dur: 10 + Math.random() * 10,
            })),
        []
    );
    return (
        <div className="bokeh-fondo" aria-hidden="true">
            {circulos.map((c, i) => (
                <motion.span
                    key={i}
                    className="bokeh"
                    style={{ left: `${c.left}%`, top: `${c.top}%`, width: c.size, height: c.size }}
                    animate={{ y: [0, -30, 0], opacity: [0.15, 0.4, 0.15] }}
                    transition={{ duration: c.dur, repeat: Infinity, delay: c.delay, ease: "easeInOut" }}
                />
            ))}
        </div>
    );
}

/** Mariposas flotantes ambientales — puro adorno atmosférico, no interactivo. */
function Mariposas({ cantidad = 6 }) {
    return (
        <div className="mariposas" aria-hidden="true">
            {[...Array(cantidad)].map((_, i) => (
                <motion.svg
                    key={i}
                    className="mariposa"
                    viewBox="0 0 24 24"
                    style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 85}%` }}
                    animate={{
                        x: [0, 30, -20, 0],
                        y: [0, -40, -10, 0],
                        opacity: [0, 1, 1, 0],
                        rotate: [-8, 8, -8],
                    }}
                    transition={{
                        duration: 10 + Math.random() * 8,
                        repeat: Infinity,
                        delay: Math.random() * 6,
                        ease: "easeInOut",
                    }}
                >
                    <path
                        d="M12 12 C8 4 2 4 2 10 C2 14 7 15 12 12 C17 15 22 14 22 10 C22 4 16 4 12 12Z"
                        fill="rgba(138,176,171,0.55)"
                    />
                </motion.svg>
            ))}
        </div>
    );
}

/* -------------------------------------------------------------- */
/* RECUERDOS — carrusel arrastrable de polaroids                   */
/* -------------------------------------------------------------- */
const FOTOS = [
    { src: LUDA1, nota: "12/02/2023" },
    { src: LUDA2, nota: "24/03/2023" },
    { src: LUDA3, nota: "18/06/2023" },
    { src: LUDA4, nota: "..." },
    { src: FotosLu, nota: "♡" },
];

function Recuerdos() {
    const trackRef = useRef(null);
    const [fotoAbierta, setFotoAbierta] = useState(null); // índice o null

    return (
        <section className="s-section" id="recuerdos">
            <SeccionTitulo eyebrow="GALERÍA" titulo="Recuerdos" />
            <motion.div
                className="carrusel"
                ref={trackRef}
                drag="x"
                dragConstraints={{ left: -(FOTOS.length * 220), right: 0 }}
                dragElastic={0.08}
            >
                {FOTOS.map((f, i) => (
                    <motion.figure
                        key={i}
                        className="polaroid"
                        initial={{ opacity: 0, y: 50, rotate: i % 2 ? 6 : -6 }}
                        whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 4 : -4 }}
                        whileHover={{ rotate: 0, scale: 1.04, y: -8 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.7, delay: i * 0.08, ease: easeCine }}
                        onClick={() => setFotoAbierta(i)}
                    >
                        <img src={f.src} alt="" draggable={false} />
                        <figcaption>{f.nota}</figcaption>
                    </motion.figure>
                ))}
            </motion.div>
            <p className="carrusel-hint">← Arrastra para ver más · toca una foto para ampliarla →</p>

            <AnimatePresence>
                {fotoAbierta !== null && (
                    <VisorFoto
                        indice={fotoAbierta}
                        onCerrar={() => setFotoAbierta(null)}
                        onCambiar={setFotoAbierta}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}

/** Visor de foto a pantalla completa, con navegación anterior/siguiente. */
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
                onClick={(e) => { e.stopPropagation(); onCambiar((indice - 1 + FOTOS.length) % FOTOS.length); }}
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
                onClick={(e) => { e.stopPropagation(); onCambiar((indice + 1) % FOTOS.length); }}
                aria-label="Siguiente"
            >
                ›
            </button>

            <p className="visor-contador">{indice + 1} / {FOTOS.length}</p>
        </motion.div>,
        document.body
    );
}

/* -------------------------------------------------------------- */
/* CARTAS — sobre que se abre                                      */
/* -------------------------------------------------------------- */
const CARTAS = [
    {
        titulo: "La primera vez",
        texto: "Hay cosas que no se dicen todos los días, pero que merecen un lugar especial. Este es ese lugar.",
    },
    {
        titulo: "Un día cualquiera",
        texto: "No hacía falta una fecha especial. Cualquier día contigo ya se sentía como uno que valía la pena recordar.",
    },
    {
        titulo: "Para cuando dudes",
        texto: "Si alguna vez lo olvidas: esto siempre fue real, y sigue siéndolo cada vez que abres este frasco.",
    },
    {
        titulo: "Lo que no te dije",
        texto: "Algunas palabras se guardan mejor aquí, escritas, que dichas a la mitad de una conversación cualquiera.",
    },
];

function Cartas({ cartaAbierta, setCartaAbierta }) {
    useEffect(() => {
        if (cartaAbierta === null) return;
        const onKey = (e) => { if (e.key === "Escape") setCartaAbierta(null); };
        window.addEventListener("keydown", onKey);

        // Bloquea el scroll de fondo SIN saltar a otra posición: si solo
        // usábamos overflow:hidden, la página "brincaba" al abrir/cerrar la
        // carta porque perdía el punto de scroll en el que ibas.
        const scrollActual = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollActual}px`;
        document.body.style.width = "100%";

        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            window.scrollTo(0, scrollActual);
        };
    }, [cartaAbierta]);

    return (
        <section className="s-section" id="cartas">
            <SeccionTitulo eyebrow="PALABRAS" titulo="Cartas" />
            <div className="sobres-grid">
                {CARTAS.map((c, i) => (
                    <Sobre
                        key={i}
                        titulo={c.titulo}
                        texto={c.texto}
                        indice={i}
                        onAbrir={() => setCartaAbierta(i)}
                    />
                ))}
            </div>

            <AnimatePresence>
                {cartaAbierta !== null && (
                    <CartaModal
                        carta={CARTAS[cartaAbierta]}
                        onCerrar={() => setCartaAbierta(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}

/** El sobre en el grid: solo reproduce el gesto de "abrirse" (la solapa se
 *  despliega) y de inmediato avisa al padre para mostrar la carta en grande. */
function Sobre({ titulo, indice, onAbrir }) {
    const [abriendo, setAbriendo] = useState(false);

    const manejarClick = () => {
        setAbriendo(true);
        onAbrir();
        setTimeout(() => setAbriendo(false), 500); // se resetea para la próxima vez
    };

    return (
        <motion.div
            className="sobre-item"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: indice * 0.1, ease: easeCine }}
        >
            <motion.div
                className={`sobre ${abriendo ? "abierto" : ""}`}
                onClick={manejarClick}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
            >
                <motion.div
                    className="sobre-solapa"
                    animate={{ rotateX: abriendo ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: easeCine }}
                />
                <div className="sobre-sello">✦</div>
            </motion.div>
            <p className="sobre-hint">Toca para abrir</p>
        </motion.div>
    );
}

/** La carta a pantalla completa. Se puede cerrar con el botón, con Escape,
 *  o tocando fuera del papel. */
function CartaModal({ carta, onCerrar }) {
    return createPortal(
        <motion.div
            className="carta-modal-fondo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onCerrar}
        >
            <motion.div
                className="carta-modal-papel"
                initial={{ opacity: 0, scale: 0.4, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 6 }}
                transition={{ duration: 0.55, ease: easeCine }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className="carta-modal-cerrar" onClick={onCerrar} aria-label="Cerrar carta">
                    ✕
                </button>
                <p className="carta-titulo">{carta.titulo}</p>
                <p className="carta-modal-texto">“{carta.texto}”</p>
                <span className="carta-firma">♡</span>
                <button className="carta-modal-salir" onClick={onCerrar}>
                    Cerrar carta
                </button>
            </motion.div>
        </motion.div>,
        document.body
    );
}

/* -------------------------------------------------------------- */
/* PLAYLIST — nuestras canciones                                    */
/* -------------------------------------------------------------- */
const CANCIONES = [
    { titulo: "Happy Together", artista: "The Turtles", nota: "La de siempre" },
    { titulo: "The Red Means I Love You", artista: "Wolf Alice", nota: "La que abre todo" },
    
    { titulo: "Cherry Waves", artista: "Joji", nota: "La de los viajes" },
    { titulo: "When I'm Gone", artista: "Joji", nota: "La de extrañarte" },
];

function Playlist() {
    const [sonando, setSonando] = useState(0);

    return (
        <section className="s-section" id="playlist">
            <SeccionTitulo eyebrow="NUESTRO SONIDO" titulo="Playlist" />
            <div className="playlist-lista">
                {CANCIONES.map((c, i) => (
                    <motion.button
                        key={i}
                        className={`playlist-item ${sonando === i ? "activa" : ""}`}
                        onClick={() => setSonando(i)}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.6, delay: i * 0.08, ease: easeCine }}
                        whileHover={{ x: 6 }}
                    >
                        <span className="playlist-numero">
                            {sonando === i ? (
                                <span className="ecualizador">
                                    <i /><i /><i />
                                </span>
                            ) : (
                                String(i + 1).padStart(2, "0")
                            )}
                        </span>
                        <span className="playlist-info">
                            <span className="playlist-titulo">{c.titulo}</span>
                            <span className="playlist-artista">{c.artista}</span>
                        </span>
                        <span className="playlist-nota">{c.nota}</span>
                    </motion.button>
                ))}
            </div>
        </section>
    );
}

/* -------------------------------------------------------------- */
/* MOMENTOS — línea de tiempo animada                               */
/* -------------------------------------------------------------- */
function Momentos() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 80%", "end 60%"],
    });
    const anchoLinea = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    const hitos = [
        { icono: "♡", titulo: "Primer día", fecha: "12/02/2023" },
        { icono: "📷", titulo: "Recuerdos", fecha: "24/03/2023" },
        { icono: "✈", titulo: "Viajes", fecha: "18/06/2023" },
        { icono: "🎁", titulo: "Pequeños detalles", fecha: "..." },
    ];

    return (
        <section className="s-section" id="momentos" ref={ref}>
            <SeccionTitulo eyebrow="LÍNEA DE TIEMPO" titulo="Momentos" />
            <div className="timeline">
                <div className="timeline-base" />
                <motion.div className="timeline-progreso" style={{ width: anchoLinea }} />
                {hitos.map((h, i) => (
                    <motion.div
                        key={i}
                        className="timeline-hito"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.6, delay: i * 0.15, ease: easeCine }}
                    >
                        <span className="timeline-icono">{h.icono}</span>
                        <h4>{h.titulo}</h4>
                        <p>{h.fecha}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

/* -------------------------------------------------------------- */
/* SOBRE TI — cierre                                                */
/* -------------------------------------------------------------- */
function SobreTi() {
    return (
        <section className="s-section s-cierre" id="sobre-ti">
            <SeccionTitulo eyebrow="PARA TI" titulo="Sobre ti" />
            <motion.p
                className="cierre-texto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.9, ease: easeCine }}
            >
                Llegaste hasta el final. Este espacio existe porque tú existes en él.
            </motion.p>
        </section>
    );
}

function SeccionTitulo({ eyebrow, titulo }) {
    return (
        <motion.div
            className="s-titulo"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: easeCine }}
        >
            <p>{eyebrow}</p>
            <h2>{titulo}</h2>
        </motion.div>
    );
}

/* -------------------------------------------------------------- */
/* PÁGINA                                                          */
/* -------------------------------------------------------------- */
function FondoAmbiental() {
    const { scrollYProgress } = useScroll();
    const color = useTransform(
        scrollYProgress,
        [0, 0.22, 0.45, 0.7, 1],
        ["#000607", "#1a120c", "#0d1f1a", "#0a1622", "#160f1a"]
    );
    return <motion.div className="fondo-ambiental" style={{ background: color }} aria-hidden="true" />;
}

/* -------------------------------------------------------------- */
/* BOTÓN SORPRÉNDEME — salta a una carta al azar y la abre           */
/* -------------------------------------------------------------- */
function BotonSorpresa({ onSorpresa }) {
    return createPortal(
        <motion.button
            className="boton-sorpresa"
            onClick={onSorpresa}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6, ease: easeCine }}
            whileHover={{ scale: 1.08, rotate: -4 }}
            whileTap={{ scale: 0.94 }}
            title="Sorpréndeme"
        >
            ✦
        </motion.button>,
        document.body
    );
}

function Santuario() {
    const location = useLocation();
    const vieneDelPortal = location.state?.entrada === true;

    const [mostrarIntro, setMostrarIntro] = useState(vieneDelPortal);
    const [paginaVisible, setPaginaVisible] = useState(!vieneDelPortal);
    const [cartaAbierta, setCartaAbierta] = useState(null);

    const sorprender = () => {
        const indiceAleatorio = Math.floor(Math.random() * CARTAS.length);
        document.getElementById("cartas")?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => setCartaAbierta(indiceAleatorio), 500);
    };

    return (
        <div className="santuario">
            <FondoAmbiental />
            <Textura />
            <CursorLuciernaga />
            <AmbientePolvo />
            <BotonSorpresa onSorpresa={sorprender} />

            <AnimatePresence>
                {mostrarIntro && (
                    <IntroBienvenida
                        onTerminar={() => {
                            setPaginaVisible(true);
                            setMostrarIntro(false);
                        }}
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: vieneDelPortal ? 0 : 1 }}
                animate={{ opacity: paginaVisible ? 1 : 0 }}
                transition={{ duration: 1.6, ease: easeCine }}
            >
                <NavSantuario visible={paginaVisible} />
                <HeroFrasco />
                <Recuerdos />
                <Cartas cartaAbierta={cartaAbierta} setCartaAbierta={setCartaAbierta} />
                <Playlist />
                <Momentos />
                <SobreTi />
            </motion.div>
        </div>
    );
}

export default Santuario;