import "./hero.css";
import LudaHero from "../../assets/images/LudaHero.jpg"
import FotosLu from "../../assets/images/FotosLu.jpeg"
import { useContext, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SecretContext } from "../../context/secretContext";

const textoVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const lineaVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

function Hero() {
  const {
    secretosEncontrados,
    desbloquearSecreto,
    setMensaje: setNotificacion
} = useContext(SecretContext);
  const [mostrarRecuerdo, setMostrarRecuerdo] = useState(false);

  // --- Parallax sutil de la tarjeta según la posición del cursor ---
  const cardRef = useRef(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 120, damping: 18 });
  const springY = useSpring(mvY, { stiffness: 120, damping: 18 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  const manejarMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const resetearTarjeta = () => {
    mvX.set(0);
    mvY.set(0);
  };
  const descubrirSecretoInvisible = () => {
    setMostrarRecuerdo(true);
    desbloquearSecreto("scroll");
    setTimeout(() => {
      setMostrarRecuerdo(false);
    }, 800);
  };
  const activarSecretoFinal = () => {
    if (secretosEncontrados.length < 7) {
        setNotificacion(
            "✦ Aún falta una pieza."
        );
        setTimeout(() => {
            setNotificacion("");
        }, 3000);
        return;
    }
    desbloquearSecreto("secreto8");
};
  return (
    <section className="hero" id="home">
      <div className="hero-glow"></div>
      <motion.div
        className="hero-left"
        variants={textoVariants}
        initial="hidden"
        animate="show"
      >
        <motion.p className="hero-tag" variants={lineaVariants}>
          ACERCA DE
        </motion.p>
        <h1>
          <motion.span className="linea-nombre" variants={lineaVariants} style={{ display: "block" }}>
            Luisa
          </motion.span>
          <motion.span variants={lineaVariants} style={{ display: "block" }}>
            Fernanda
          </motion.span>
        </h1>
        <motion.p className="hero-description" variants={lineaVariants}>
          Una interfaz construida alrededor
          de detalles, recuerdos y conexiones
          escondidas entre capas digitales.
        </motion.p>
        <motion.button
          variants={lineaVariants}
          whileHover={{ y: -5, boxShadow: "0 0 25px rgba(138,176,171,0.25)" }}
          whileTap={{ scale: 0.96 }}
          onClick={activarSecretoFinal}
        >
          Explorar
        </motion.button>
      </motion.div>
      <motion.div
        className="hero-right"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        <motion.div
          ref={cardRef}
          className="hero-card"
          onMouseMove={manejarMouseMove}
          onMouseLeave={resetearTarjeta}
          style={{
            rotateX,
            rotateY,
            transformPerspective: 900,
          }}
        >
          <img
            src={LudaHero}
            alt="Foto para el hero la saque del ig perdon :3"
          />
        </motion.div>
      </motion.div>
      <div
        className={`secret-zone ${secretosEncontrados.length >= 3
          ? "active"
          : ""
          }`}
        onClick={descubrirSecretoInvisible}
      >
        {mostrarRecuerdo && (
          <img
            src={FotosLu}
            alt=""
            className="secret-memory"
          />
        )}
      </div>
      <div
        className={`secret-zone glow-${secretosEncontrados.length}`}
        onClick={descubrirSecretoInvisible}
      ></div>
    </section>
  )
}
export default Hero;