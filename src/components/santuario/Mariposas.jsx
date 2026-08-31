import { useState } from "react";
import { motion } from "framer-motion";

function Mariposas({ cantidad = 6 }) {
    const [mariposas] = useState(() =>
        [...Array(cantidad)].map(() => ({
            left: Math.random() * 100,
            top: Math.random() * 85,
            duration: 10 + Math.random() * 8,
            delay: Math.random() * 6,
        }))
    );

    return (
        <div className="mariposas" aria-hidden="true">
            {mariposas.map((mariposa, i) => (
                <motion.svg
                    key={i}
                    className="mariposa"
                    viewBox="0 0 24 24"
                    style={{ left: `${mariposa.left}%`, top: `${mariposa.top}%` }}
                    animate={{
                        x: [0, 30, -20, 0],
                        y: [0, -40, -10, 0],
                        opacity: [0, 1, 1, 0],
                        rotate: [-8, 8, -8],
                    }}
                    transition={{
                        duration: mariposa.duration,
                        repeat: Infinity,
                        delay: mariposa.delay,
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

export default Mariposas;
