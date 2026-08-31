import { useState } from "react";
import { motion } from "framer-motion";

function AmbientePolvo({ cantidad = 26 }) {
    const [puntos] = useState(() =>
        [...Array(cantidad)].map(() => ({
            left: Math.random() * 100,
            dur: 14 + Math.random() * 16,
            delay: Math.random() * 12,
            size: 2 + Math.random() * 2,
        }))
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

export default AmbientePolvo;
