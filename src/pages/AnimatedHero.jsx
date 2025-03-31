import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const AnimatedHero = () => {
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  // Recursos do sistema
  const recursos = [
    {
      icon: "💻",
      titulo: "Doação Simplificada",
      descricao: "Processo fácil e rápido para doar equipamentos"
    },
    {
      icon: "🔄",
      titulo: "Reciclagem Consciente",
      descricao: "Destinação adequada para equipamentos não aproveitáveis"
    },
    {
      icon: "🤝",
      titulo: "Impacto Social",
      descricao: "Conectando doadores a estudantes que precisam"
    }
  ];

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        position: "relative",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        overflow: "hidden",
        padding: "2rem"
      }}
    >
      {/* Grid de fundo animado */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(90deg, rgba(76,175,80,0.05) 1px, transparent 1px),
          linear-gradient(0deg, rgba(76,175,80,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
        transform: 'perspective(500px) rotateX(30deg)',
        transformOrigin: 'center 0',
        opacity: 0.2
      }} />

      {/* Partículas brilhantes */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100],
            x: [0, Math.random() * 50 - 25],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: Math.random() * 2 + 3,
            repeat: Infinity,
            repeatDelay: Math.random() * 2
          }}
          style={{
            position: "absolute",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "#4CAF50",
            boxShadow: "0 0 10px #4CAF50",
            left: `${Math.random() * 100}%`,
            bottom: "0"
          }}
        />
      ))}

      <motion.div 
        className="hero-content"
        variants={containerVariants}
        style={{
          textAlign: "center",
          maxWidth: "900px",
          position: "relative",
          zIndex: 1
        }}
      >
        {/* Círculo de luz de fundo */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0) 70%)",
            zIndex: -1
          }}
        />

        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: "4rem",
            marginBottom: "1.5rem",
            color: "#ffffff",
            fontWeight: "bold",
            textShadow: "0 0 20px rgba(76,175,80,0.3)",
            lineHeight: 1.2
          }}
        >
          Transformando a 
          <motion.span
            animate={{
              background: ["linear-gradient(45deg, #4CAF50, #45a049)", "linear-gradient(45deg, #45a049, #4CAF50)"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              display: "block",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Educação através da Tecnologia
          </motion.span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          style={{
            fontSize: "1.3rem",
            color: "#cccccc",
            marginBottom: "3rem",
            lineHeight: 1.6,
            maxWidth: "800px",
            margin: "0 auto 3rem"
          }}
        >
          Conectamos empresas doadoras a escolas públicas, democratizando o acesso à tecnologia na educação.
        </motion.p>

        <motion.div
          variants={itemVariants}
          style={{
            display: "flex",
            gap: "1.5rem",
            justifyContent: "center",
            flexWrap: "wrap"
          }}
        >
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 25px rgba(76,175,80,0.5)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/login"
              style={{
                padding: "1.2rem 2.5rem",
                fontSize: "1.1rem",
                border: "none",
                borderRadius: "30px",
                background: "linear-gradient(45deg, #4CAF50, #45a049)",
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
                display: "inline-block",
                letterSpacing: "1px"
              }}
            >
              Quero Doar
            </Link>
          </motion.div>

          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 25px rgba(76,175,80,0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/login"
              style={{
                padding: "1.2rem 2.5rem",
                fontSize: "1.1rem",
                border: "2px solid #4CAF50",
                borderRadius: "30px",
                background: "transparent",
                color: "#4CAF50",
                textDecoration: "none",
                fontWeight: "bold",
                display: "inline-block",
                letterSpacing: "1px"
              }}
            >
              Sou uma Instituição de Ensino
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default AnimatedHero;