import React, { useEffect, useRef } from 'react';

const MatrixRain = ({ onClose }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // Use a more diverse set of characters including some Japanese-like ones for the authentic feel
        const characters = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ2345789ZXVBCNMK<>:+-*";
        const charArray = characters.split("");

        // Increased font size as requested
        const fontSize = 24;
        let columns = Math.ceil(width / fontSize);
        let drops = new Array(columns).fill(1).map(() => Math.floor(Math.random() * -100));

        const draw = () => {
            // Draw a semi-transparent black rectangle to create the trail effect
            ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
            ctx.fillRect(0, 0, width, height);

            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                // Random character
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                
                // Color gradient effect: the lead character is brighter
                if (Math.random() > 0.95) {
                    ctx.fillStyle = "#fff";
                } else {
                    ctx.fillStyle = "#0f0";
                }
                
                // Draw the character
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Reset drop to top if it goes off screen
                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                // Move drop down
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.ceil(width / fontSize);
            if (columns > drops.length) {
                const newDrops = new Array(columns - drops.length).fill(1).map(() => Math.floor(Math.random() * -100));
                drops = [...drops, ...newDrops];
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="relative w-full h-full bg-black overflow-hidden cursor-none group">
            <canvas ref={canvasRef} className="block" />
            <button 
                className="absolute top-5 right-5 bg-black/50 text-[#0f0] border border-[#0f0] text-3xl cursor-pointer w-12 h-12 flex items-center justify-center transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 font-mono hover:bg-[#0f0] hover:text-black hover:shadow-[0_0_15px_#0f0]" 
                onClick={onClose}
                title="Exit"
            >
                ×
            </button>
        </div>
    );
};

export default MatrixRain;
