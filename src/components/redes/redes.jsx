import { Link } from "react-router-dom";
import "./redes.css";

function Redes() {

    const redes = [
        {
            nombre: "Instagram",
            usuario: "@lufda03",
            descripcion: "Momentos, fotografías y recuerdos.",
            link: "https://www.instagram.com/lufda03?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
        },
        {
            nombre: "Spotify",
            usuario: "lu",
            descripcion: "La banda sonora detrás de cada etapa.",
            link: "https://open.spotify.com/user/lg39jcds5e8l6z5lx3mc9o47w"
        },
        {
            nombre: "TikTok",
            usuario: "@luisa_fda3",
            descripcion: "Pequeños fragmentos de creatividad.",
            link: "https://www.tiktok.com/@luisa_fda3"
        },
        {
            nombre: "Whatsapp",
            usuario: "...",
            descripcion: "Solo no lo hagas.",
            link: "/whatsapp"
        }
    ];

    return (
        <section className="redes" id="redes">

            <div className="section-title">
                <p>PRESENCIA DIGITAL</p>
                <h2>Redes</h2>
            </div>

            <div className="redes-grid">

                {redes.map((red, index) => (

                    red.nombre === "Whatsapp"

                        ?

                        <Link
                            to={red.link}
                            className="red-card"
                            key={index}
                        >

                            <div className="red-card-top">

                                <h3>{red.nombre}</h3>

                                <span>→</span>

                            </div>

                            <h4>{red.usuario}</h4>

                            <p>{red.descripcion}</p>

                        </Link>

                        :

                        <a
                            href={red.link}
                            target="_blank"
                            rel="noreferrer"
                            className="red-card"
                            key={index}
                        >

                            <div className="red-card-top">

                                <h3>{red.nombre}</h3>

                                <span>→</span>

                            </div>

                            <h4>{red.usuario}</h4>

                            <p>{red.descripcion}</p>

                        </a>

                ))}
            </div>

        </section>
    )
}

export default Redes;