import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./LoadingScreen.css";

// ================================================
// ANIMATION VARIANTS
// ================================================

const overlayV = {
  enter: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.5, ease: [0.4, 0, 1, 1] } },
};

const panelV = {
  enter: { opacity: 0, scale: 0.97, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.985,
    y: -6,
    transition: { duration: 0.45, ease: [0.4, 0, 1, 1] },
  },
};

const orbV = {
  enter: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const badgeV = {
  enter: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.3 },
  },
};

const wordV = {
  enter: { opacity: 0, y: 10, filter: "blur(3px)" },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.38,
      delay: i * 0.09,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: {
    opacity: 0,
    y: -6,
    filter: "blur(2px)",
    transition: { duration: 0.22, ease: "easeIn" },
  },
};

const subV = {
  enter: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: 0.15, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.18 },
  },
};

const microV = {
  enter: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, delay: 0.5, ease: "easeOut" },
  },
};

// ================================================
// PHASE DATA
// ================================================

const PHASES = [
  {
    words: [
      { t: "Welcome", style: "" },
      { t: "to", style: "" },
      { t: "Wave", style: "accent" },
    ],
    sub: "Establishing secure connection",
    showDots: false,
  },
  {
    words: [
      { t: "Wave", style: "ai" },
      { t: "AI", style: "ai" },
      { t: "analyzing", style: "" },
      { t: "market", style: "accent" },
      { t: "trends", style: "accent" },
    ],
    sub: "Syncing live market data",
    showDots: true,
  },
  {
    words: [
      { t: "Optimizing", style: "" },
      { t: "your", style: "" },
      { t: "dashboard", style: "accent" },
    ],
    sub: "Loading portfolio & insights",
    showDots: true,
  },
];

// Timing (ms)
const PHASE_TIMES = [1000, 1200, 1000]; // Phase 1: 1s, Phase 2: 1.2s, Phase 3: 1s
const EXIT_BUFFER = 450;

// ================================================
// SUB-COMPONENTS
// ================================================

const WaveGlyph = React.memo(() => (
  <svg viewBox="0 0 18 18" fill="none">
    <defs>
      <linearGradient id="wlg" x1="0" y1="0" x2="18" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
    <path d="M2,11 Q5.5,4 9,11 Q12.5,18 16,11" stroke="url(#wlg)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M2,8 Q5.5,1 9,8 Q12.5,15 16,8" stroke="url(#wlg)" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.3" />
  </svg>
));

const Waveform = React.memo(({ phase }) => (
  <div className={`wl-waveform phase-${phase}`}>
    <svg viewBox="0 0 1800 250" preserveAspectRatio="none">
      <path
        className="wl-wave-path"
        d="M0,180 C30,175 60,185 100,160 C140,135 170,155 210,130 C250,105 280,125 320,105 C360,85 390,100 430,82 C470,64 500,80 540,65 C580,50 610,68 650,52 C690,36 720,55 760,42 C800,29 830,48 870,38 C910,28 940,42 980,34 C1020,26 1050,38 1090,30 C1130,22 1160,33 1200,26 C1240,19 1270,28 1310,22 C1350,16 1380,24 1420,19 C1460,14 1500,20 1540,16 L1800,10"
        stroke="rgba(34, 197, 94, 0.4)"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        className="wl-wave-path-2"
        d="M0,200 C50,195 90,180 140,170 C190,160 230,175 280,150 C330,125 370,145 420,125 C470,105 510,120 560,100 C610,80 650,95 700,78 C750,61 790,78 840,65 C890,52 930,68 980,55 C1030,42 1070,58 1120,48 C1170,38 1210,52 1260,42 C1310,32 1350,45 1400,36 C1450,27 1500,38 1550,30 C1600,22 1650,32 1700,25 L1800,18"
        stroke="rgba(34, 197, 94, 0.2)"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  </div>
));

const Dots = React.memo(() => (
  <span className="wl-dots">
    <span /><span /><span />
  </span>
));

// ================================================
// MAIN COMPONENT
// ================================================

const LoadingScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);

  const phaseClass = `phase-${phase + 1}`;

  const totalTime = useMemo(
    () => PHASE_TIMES.reduce((a, b) => a + b, 0),
    []
  );

  const exit = useCallback(() => {
    setExiting(true);
    setTimeout(() => onComplete?.(), EXIT_BUFFER);
  }, [onComplete]);

  useEffect(() => {
    const timers = [];
    let elapsed = 0;

    // Schedule phase transitions
    PHASE_TIMES.forEach((duration, i) => {
      if (i > 0) {
        timers.push(
          setTimeout(() => setPhase(i), elapsed)
        );
      }
      elapsed += duration;
    });

    // Schedule exit
    timers.push(setTimeout(exit, totalTime));

    return () => timers.forEach(clearTimeout);
  }, [exit, totalTime]);

  const current = PHASES[phase];

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="wave-loader"
          variants={overlayV}
          initial="enter"
          animate="visible"
          exit="exit"
        >
          {/* ── Background ── */}
          <div className="wl-bg-base" />
          <div className="wl-bg-far">
            <div className={`wl-bloom ${phaseClass}`} />
            <Waveform phase={phase + 1} />
          </div>

          {/* ── Particles ── */}
          <div className="wl-particle wl-p1" />
          <div className="wl-particle wl-p2" />
          <div className="wl-particle wl-p3" />
          <div className="wl-particle wl-p4" />

          {/* ── Glass Panel ── */}
          <motion.div
            className={`wl-panel ${phaseClass}`}
            variants={panelV}
            initial="enter"
            animate="visible"
            exit="exit"
          >
            {/* Energy Orb */}
            <motion.div className={`wl-orb ${phaseClass}`} variants={orbV}>
              <div className="wl-ring" />
              <div className="wl-ring" />
              <div className="wl-ring" />
              <div className="wl-orb-outer" />
              <div className="wl-orb-core">
                <WaveGlyph />
              </div>
            </motion.div>

            {/* AI Badge */}
            <motion.div className="wl-ai-badge" variants={badgeV}>
              WAVE AI
            </motion.div>

            {/* Text */}
            <div className="wl-text">
              {/* Primary — word-by-word */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  className="wl-primary"
                  initial="enter"
                  animate="visible"
                  exit="exit"
                >
                  {current.words.map((w, i) => {
                    let cls = "wl-word";
                    if (w.style === "accent") cls += " wl-word-accent";
                    if (w.style === "ai") cls += " wl-word-ai";

                    return (
                      <motion.span
                        key={`${phase}-${i}`}
                        className={cls}
                        variants={wordV}
                        custom={i}
                      >
                        {w.t}
                      </motion.span>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Secondary */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`s-${phase}`}
                  className="wl-secondary"
                  variants={subV}
                  initial="enter"
                  animate="visible"
                  exit="exit"
                >
                  {current.sub}
                  {current.showDots && <Dots />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stock Progress */}
            <div className={`wl-progress ${phaseClass}`}>
              <div className="wl-progress-track" />
              <div className="wl-progress-glow" />
              <div className="wl-progress-spike" />
              <div className="wl-progress-spike" />
            </div>

            {/* Micro-text */}
            <motion.div className="wl-micro" variants={microV}>
              Real-time insights powered by intelligent systems
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
