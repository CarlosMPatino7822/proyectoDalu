import { motion } from "framer-motion";
import { easeCine } from "./santuarioConfig";

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

export default SeccionTitulo;

