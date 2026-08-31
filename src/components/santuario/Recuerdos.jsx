import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { easeCine, FOTOS } from "./santuarioConfig";
import SeccionTitulo from "./SeccionTitulo";
import VisorFoto from "./VisorFoto";

function Recuerdos() {
    const trackRef = useRef(null);
    const [fotoAbierta, setFotoAbierta] = useState(null);

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

export default Recuerdos;

