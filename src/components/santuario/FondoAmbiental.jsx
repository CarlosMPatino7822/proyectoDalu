import { motion, useScroll, useTransform } from "framer-motion";

function FondoAmbiental() {
    const { scrollYProgress } = useScroll();
    const color = useTransform(
        scrollYProgress,
        [0, 0.22, 0.45, 0.7, 1],
        ["#000607", "#1a120c", "#0d1f1a", "#0a1622", "#160f1a"]
    );

    return <motion.div className="fondo-ambiental" style={{ background: color }} aria-hidden="true" />;
}

export default FondoAmbiental;

