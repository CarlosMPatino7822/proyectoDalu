import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { easeCine } from "./santuarioConfig";

function IntroBienvenida({ onTerminar }) {
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

export default IntroBienvenida;

