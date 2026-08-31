import { motion } from "framer-motion";

/**
 * PageTransition
 * Envuelve el contenido de cada página (una por <Route>).
 * Usado junto con <AnimatePresence mode="wait"> en App.jsx.
 */
function PageTransition({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.div>
    );
}

export default PageTransition;
