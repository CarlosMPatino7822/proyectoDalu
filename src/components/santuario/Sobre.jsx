import { useState } from "react";
import { motion } from "framer-motion";
import { easeCine } from "./santuarioConfig";

function Sobre({ indice, onAbrir }) {
    const [abriendo, setAbriendo] = useState(false);

    const manejarClick = () => {
        setAbriendo(true);
        onAbrir();
        setTimeout(() => setAbriendo(false), 500);
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

export default Sobre;

