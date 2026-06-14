import "./hero.css";
import LudaHero from "../../assets/images/LudaHero.jpg"
import FotosLu from "../../assets/images/FotosLu.jpeg"
import { useContext, useState } from "react";
import { SecretContext } from "../../context/secretContext";

function Hero() {
  const { desbloquearSecreto, secretosEncontrados } = useContext(SecretContext);
  const [mostrarRecuerdo, setMostrarRecuerdo] = useState(false);
  const descubrirSecretoInvisible = () => {

    setMostrarRecuerdo(true);

    desbloquearSecreto("scroll");

    setTimeout(() => {

      setMostrarRecuerdo(false);

    }, 800);

  };
  return (

    <section className="hero" id="home">

      <div className="hero-glow"></div>

      <div className="hero-left">

        <p className="hero-tag">
          ACERCA DE
        </p>

        <h1>
          Luisa
          <span>Fernanda</span>
        </h1>

        <p className="hero-description">

          Una interfaz construida alrededor
          de detalles, recuerdos y conexiones
          escondidas entre capas digitales.

        </p>

        <button>
          Explorar
        </button>

      </div>

      <div className="hero-right">

        <div className="hero-card">

          <img
            src={LudaHero}
            alt="Foto para el hero la saque del ig perdon :3"
          />

        </div>

      </div>
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