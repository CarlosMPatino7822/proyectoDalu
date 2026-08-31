import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { easeCine } from "./santuarioConfig";
import SeccionTitulo from "./SeccionTitulo";

const hitos = [
    { icono: "♡", titulo: "Primer día", fecha: "12/02/2023" },
    { icono: "📷", titulo: "Recuerdos", fecha: "24/03/2023" },
    { icono: "✈", titulo: "Viajes", fecha: "18/06/2023" },
    { icono: "🎁", titulo: "Pequeños detalles", fecha: "..." },
];

function Momentos() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 80%", "end 60%"],
    });
    const anchoLinea = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

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

export default Momentos;

