function Textura() {
    return (
        <div className="textura" aria-hidden="true">
            <svg className="grano">
                <filter id="ruido">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#ruido)" />
            </svg>
            <div className="vineta" />
        </div>
    );
}

export default Textura;

