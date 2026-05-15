import React from 'react';
import { motion } from 'framer-motion';

const ImageCard = ({ src, alt, className = "", style = {}, imageClassName = "" }) => {
  return (
    <div className="relative group flex justify-center w-full">
      {/* Background Soft Glow (Ambient Reflection) */}
      <div 
        className="absolute inset-0 z-0 blur-3xl opacity-80 rounded-full transition-all duration-700 ease-out group-hover:scale-125 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 60%)'
        }}
      />
      
      {/* Floating Image (No Box) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.03, y: -8 }}
        className={`relative z-10 inline-flex justify-center items-center w-full ${className}`}
        style={style}
      >
        <img
          src={src}
          alt={alt}
          className={`relative z-10 max-w-full h-auto object-contain ${imageClassName}`}
          style={{ 
            /* 
              1. invert(1) turns pure white into pure black.
              2. contrast(1.1) ensures slight off-whites become pure black too.
              3. mix-blend-mode: "screen" makes pure black completely transparent!
              Removed brightness() as it turned black into dark grey, causing a visible box!
            */
            filter: "invert(1) hue-rotate(180deg) contrast(1.2)",
            mixBlendMode: "screen"
          }}
        />
      </motion.div>
    </div>
  );
};

export default ImageCard;
