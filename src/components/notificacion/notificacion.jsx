import "./notificacion.css";
import { useContext } from "react";
import { createPortal } from "react-dom";
import { SecretContext } from "../../context/secretContext";
function SecretNotification(){
    const { mensaje } = useContext(SecretContext);
    if(!mensaje) return null;
    return createPortal(
        <div className="secret-notification">
            {mensaje}
        </div>,
        document.body
    );
}
export default SecretNotification;