import "./datos.css";
import { useContext, useRef } from "react";
import { SecretContext } from "../../context/secretContext";
import snoopy from "../../assets/images/snoopy.webp";
import LUDA1 from "../../assets/images/LUDA1.jpeg";
import LUDA2 from "../../assets/images/LUDA2.jpeg";
import LUDA3 from "../../assets/images/LUDA3.jpeg";
import LUDA4 from "../../assets/images/LUDA4.jpeg";
function Datos() {
    const { desbloquearSecreto } = useContext(SecretContext);
    const secretoTimeout = useRef(null);
    const iniciarSecreto = () => {
        secretoTimeout.current = setTimeout(() => {
            desbloquearSecreto("hover");
        }, 4000);
    };
    const cancelarSecreto = () => {
        clearTimeout(secretoTimeout.current);
    };
    return (
        <section className="datos" id="datos">
            <div className="section-title">
                <p>PERFIL</p>
                <h2>Datos</h2>
            </div>
            <div className="datos-grid">
                <div className="dato-card">
                    <img className="personalidad-img"
                        src={LUDA3}
                        alt="Personalidad"
                    />
                    <h3>Personalidad</h3>
                    <p>
                        Creativa, tranquila y con una forma
                        única de ver los pequeños detalles.
                    </p>
                </div>
                <div className="dato-card">
                    <img
                        src={LUDA2}
                        alt="Estilo"
                    />
                    <h3>Estilo</h3>
                    <p>
                        Una mezcla entre lo minimalista,
                        elegante y emocional.
                    </p>
                </div>
                <div className="dato-card">
                    <img className="intereses-img"
                        src={LUDA4}
                        alt="Intereses"
                    />
                    <h3>Intereses</h3>
                    <p>
                        Música, arte visual, diseño,
                        momentos tranquilos y conexiones reales.
                    </p>
                </div>
                <div className="dato-card">
                    <img className="detalles-img"
                        src={LUDA1}
                        alt="Detalles"
                        onMouseEnter={iniciarSecreto}
                        onMouseLeave={cancelarSecreto}
                    />
                    <h3>Detalles</h3>
                    <p>
                        Hay detalles que solo se revelan quedandose mas tiempo en el contenido.
                    </p>
                </div>
                <div
                    className="dato-card secret-date"
                    onClick={() => desbloquearSecreto("fecha")}
                >
                    <h3>Fecha de Nacimiento</h3>
                    <p>Ellas siempre recuerdan</p>
                    <p>
                        03 · 02 · 2007
                    </p>
                </div>
            </div>
        </section>
    )
}
export default Datos;