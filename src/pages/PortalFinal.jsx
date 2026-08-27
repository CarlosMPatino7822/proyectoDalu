import "./PortalFinal.css";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const easeCine = [0.16, 1, 0.3, 1];

function PortalFinal() {
    const navigate = useNavigate();
    const mensajes = [
        "Inicializando...",
        "Comprobando acceso...",
        "Verificando identidad...",
        "Acceso parcial concedido."
    ];
    const [indice, setIndice] = useState(0);
    const [preguntaActual, setPreguntaActual] = useState(0);
    const [mostrarPortal, setMostrarPortal] = useState(false);
    const [ocultarSistema, setOcultarSistema] = useState(false);
    const [mostrarTitulo, setMostrarTitulo] = useState(false);
    const [mostrarTexto, setMostrarTexto] = useState(false);
    const [mostrarBoton, setMostrarBoton] = useState(false);
    const [modoQuiz, setModoQuiz] = useState(false);
    const [opcionError, setOpcionError] = useState(null);
    const [opcionCorrecta, setOpcionCorrecta] = useState(null);
    const [destelloId, setDestelloId] = useState(0); // burst de luz independiente de los anillos
    const [destello, setDestello] = useState(false);
    // null -> "negro" (todo se apagó, pantalla en negro) -> "saliendo" (a punto de navegar)
    const [faseFinal, setFaseFinal] = useState(null);

    const preguntas = [
        { pregunta: "¿Cómo se llama el creador de esta página?", opciones: ["Camilo", "Caleb", "Cameron", "Carlos"], correcta: 3 },
        { pregunta: "¿Cuál es nuestro spot favorito en Filandia?", opciones: ["El mirador", "El balcón", "La plaza", "Los locales de comida"], correcta: 0 },
        { pregunta: "¿Qué canción abre nuestra playlist?", opciones: ["The Red Means I Love You", "Happy Together", "Cherry Waves", "When I'm Gone"], correcta: 1 },
        { pregunta: "¿Cuál fue el primer apodo que te puse?", opciones: ["Dalu", "Mona", "Luda", "Amor"], correcta: 2 }
    ];

    // Nivel de oscuridad real: 0 -> 1, llega exactamente a 1 (negro total) en la última pregunta
    const nivelOscuridad = preguntaActual / preguntas.length +
        (opcionCorrecta !== null ? 1 / preguntas.length : 0);

    const responder = (indiceSeleccionado) => {
        if (opcionCorrecta !== null) return; // evita doble click mientras avanza
        if (indiceSeleccionado === preguntas[preguntaActual].correcta) {
            setOpcionCorrecta(indiceSeleccionado);
            setDestelloId(id => id + 1);
            setDestello(true);
            setTimeout(() => setDestello(false), 500);

            const esUltima = preguntaActual === preguntas.length - 1;

            setTimeout(() => {
                if (!esUltima) {
                    setOpcionCorrecta(null);
                    setPreguntaActual(prev => prev + 1);
                } else {
                    // secuencia de cierre: la pantalla ya está prácticamente negra
                    setFaseFinal("negro");
                    setTimeout(() => {
                        setFaseFinal("saliendo");
                    }, 1500);
                    setTimeout(() => {
                        navigate("/santuario", { state: { entrada: true } });
                    }, 2600);
                }
            }, 900);
        } else {
            setOpcionError(indiceSeleccionado);
            setTimeout(() => setOpcionError(null), 600);
        }
    };

    useEffect(() => {
        if (mostrarPortal) return;
        const timer = setTimeout(() => {
            if (indice < mensajes.length - 1) {
                setIndice(prev => prev + 1);
            } else {
                setOcultarSistema(true);
                setTimeout(() => setMostrarPortal(true), 1000);
            }
        }, 1400);
        return () => clearTimeout(timer);
    }, [indice, mostrarPortal]);

    useEffect(() => {
        if (!mostrarPortal) return;
        const t1 = setTimeout(() => setMostrarTitulo(true), 300);
        const t2 = setTimeout(() => setMostrarTexto(true), 900);
        const t3 = setTimeout(() => setMostrarBoton(true), 1500);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [mostrarPortal]);

    return (
        <section className={`portal ${faseFinal === "saliendo" ? "saliendo" : ""}`}>
            {!mostrarPortal && (
                <div className={`system ${ocultarSistema ? "hide" : ""}`}>
                    {mensajes.slice(0, indice).map((mensaje, i) => (
                        <p key={i} className="system-history">✓ {mensaje}</p>
                    ))}
                    <h1 className="system-current">{mensajes[indice]}</h1>
                </div>
            )}

            {/* Los anillos rotan de forma continua e ininterrumpida — nunca se les
                cambia la clase/animation, así que jamás "saltan" al responder. */}
            <div className="portal-background">
                <div className="dark-layer" style={{ opacity: Math.min(nivelOscuridad, 1) * 0.95 }} />
                <motion.div
                    className="ring ring1"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="ring ring2"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="ring ring3"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
                <RafagaDestello id={destelloId} />
            </div>

            <div className="particles">
                {[...Array(20)].map((_, i) => (
                    <span key={i} className="particle" style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 10}s`,
                        animationDuration: `${18 + Math.random() * 10}s`
                    }} />
                ))}
            </div>

            <div className={`destello ${destello ? "activo" : ""}`} />
            <div className={`negro-total ${faseFinal ? "activo" : ""}`} />

            <AnimatePresence mode="wait">
                {!modoQuiz && mostrarPortal && !faseFinal && (
                    <motion.div key="portal" className="portal-center"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95, y: -30 }} transition={{ duration: 0.7 }}>
                        <h1 className={`portal-title ${mostrarTitulo ? "show" : ""}`}>Acceso Restringido</h1>
                        <p className={`portal-description ${mostrarTexto ? "show" : ""}`}>Solo una persona puede continuar.</p>
                        <button className={`portal-button ${mostrarBoton ? "show" : ""}`} onClick={() => setModoQuiz(true)}>
                            ✦ Verificar identidad
                        </button>
                    </motion.div>
                )}

                {modoQuiz && !faseFinal && (
                    <motion.div key="quiz" className="quiz"
                        initial={{ opacity: 0, y: 60, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(14px)", y: -20 }}
                        transition={{ duration: 0.7, ease: easeCine }}>
                        <div className="quiz-progreso">
                            {preguntas.map((_, i) => (
                                <span key={i} className={`quiz-dot ${i < preguntaActual ? "hecha" : ""} ${i === preguntaActual ? "activa" : ""}`} />
                            ))}
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div key={preguntaActual}
                                initial={{ opacity: 0, x: 40, filter: "blur(6px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, x: -40, filter: "blur(6px)" }}
                                transition={{ duration: 0.5, ease: easeCine }}>
                                <p className="quiz-contador">Prueba {preguntaActual + 1} / {preguntas.length}</p>
                                <h2>{preguntas[preguntaActual].pregunta}</h2>
                                <div className="quiz-options">
                                    {preguntas[preguntaActual].opciones.map((opcion, index) => (
                                        <motion.button key={index}
                                            className={`quiz-option ${opcionCorrecta === index ? "correcta" : ""} ${opcionError === index ? "incorrecta" : ""}`}
                                            onClick={() => responder(index)}
                                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                            animate={
                                                opcionError === index ? { x: [0, -10, 10, -10, 10, 0], rotate: [0, -1.5, 1.5, -1.5, 0] }
                                                : opcionCorrecta === index ? { scale: [1, 1.08, 1] } : {}
                                            }
                                            transition={{ duration: 0.4 }}>
                                            {opcion}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

/** Ráfaga de luz al responder bien — nunca toca los anillos, solo se superpone. */
function RafagaDestello({ id }) {
    if (!id) return null;
    return (
        <motion.div
            key={id}
            className="rafaga"
            initial={{ opacity: 0.9, scale: 0.3 }}
            animate={{ opacity: 0, scale: 2.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        />
    );
}

export default PortalFinal;