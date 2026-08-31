import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { easeCine } from "./santuarioConfig";

function ContadorDias() {
    const INICIO = useMemo(() => new Date(2023, 1, 12), []);
    const [dias, setDias] = useState(0);

    useEffect(() => {
        const calcular = () => {
            const ms = Date.now() - INICIO.getTime();
            setDias(Math.floor(ms / (1000 * 60 * 60 * 24)));
        };

        calcular();
        const intervalo = setInterval(calcular, 60 * 60 * 1000);
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

export default ContadorDias;

