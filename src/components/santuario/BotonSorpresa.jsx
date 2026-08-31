import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { easeCine } from "./santuarioConfig";

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

export default BotonSorpresa;

