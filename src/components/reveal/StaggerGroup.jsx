import { motion } from "framer-motion";

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.05,
        },
    },
};

export const itemVariants = {
    hidden: { opacity: 0, y: 36, scale: 0.97 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
};

/**
 * StaggerGroup
 * Contenedor para grids de cards. Cada hijo directo debe ser <StaggerItem>.
 */
export function StaggerGroup({ children, className = "", amount = 0.2, once = true }) {
    return (
        <motion.div
            className={className}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once, amount }}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, className = "" }) {
    return (
        <motion.div className={className} variants={itemVariants}>
            {children}
        </motion.div>
    );
}
