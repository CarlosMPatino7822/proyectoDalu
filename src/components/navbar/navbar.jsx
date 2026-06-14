import "./navbar.css";
import { useContext } from "react";
import { SecretContext } from "../../context/secretContext";

function Navbar() {
    const { desbloquearSecreto } = useContext(SecretContext);


    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <span
                    className="secret-letter"
                    onClick={() => desbloquearSecreto("logo")}
                >
                    D
                </span>

                alu
            </div>
            <ul className="nav-links">
                <li>
                    <a href="#home">Home</a>
                </li>
                <li>
                    <a href="#datos">Datos</a>
                </li>
                <li>
                    <a href="#redes">Redes</a>
                </li>
                <li>
                    <a href="#contacto">Contacto</a>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;