import "./highlights.css";
import { useContext } from "react";
import { SecretContext } from "../../context/secretContext";

function Highlights() {
    const { secretosEncontrados, palabraOculta } = useContext(SecretContext);
    return (
        <section className="highlights">

            <div className="highlight-card">
                <h3>12</h3>
                <p>Experiencias</p>
            </div>

            <div className="highlight-card">
                <h3>24</h3>
                <p>Momentos</p>
            </div>

            <div className="highlight-card">
                <h3>∞</h3>
                <p>Detalles</p>
            </div>

            <div
                className={`highlight-card secret-card ${secretosEncontrados.length > 0 ? "discovered" : ""
                    }`}
            >

                <h3>
                    {
                        secretosEncontrados.length === 0
                            ? "?"
                            : `${secretosEncontrados.length}/?`
                    }
                </h3>

                <p>Secretos</p>
                <div className="secret-word">
                {palabraOculta.join("")}
            </div>
            </div>

        </section>
    );
}

export default Highlights;