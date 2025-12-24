"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GrowingPlant() {
  const [wordCount, setWordCount] = useState(0);

interface WordCountUpdateEvent extends CustomEvent {
  detail: {
    count: number;
  };
}

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as WordCountUpdateEvent;
      setWordCount(customEvent.detail?.count || 0);
    };
    window.addEventListener("wordCountUpdate", handleUpdate);
    return () => window.removeEventListener("wordCountUpdate", handleUpdate);
  }, []);
  // Continuous growth progress (0 to 1) - completes at 50 words
  const progress = useMemo(() => Math.min(wordCount / 50, 1), [wordCount]);
  const isGrowing = wordCount > 0;

  // Growth thresholds
  const stemProgress = Math.min(wordCount / 25, 1); // Stem complete by 25 words
  const branchProgress =
    wordCount > 15 ? Math.min((wordCount - 15) / 15, 1) : 0; // Branches 15-30
  const leafProgress = wordCount > 10 ? Math.min((wordCount - 10) / 20, 1) : 0; // Leaves 10-30
  const flowerProgress =
    wordCount > 35 ? Math.min((wordCount - 35) / 15, 1) : 0; // Flower 35-50

  return (
    <div className="relative w-72 h-[520px] flex flex-col items-center justify-end">
      <div className="relative w-full max-w-md">
        <svg
          viewBox="0 0 200 380"
          className={`w-full h-auto transition-all duration-1000 ${isGrowing ? "drop-shadow-[0_0_40px_rgba(16,185,129,0.3)]" : ""}`}
        >
          <defs>
            {/* Petal Gradients */}
            <linearGradient
              id="petalGradient1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ff6b9d" />
              <stop offset="50%" stopColor="#fda4af" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>

            <linearGradient
              id="petalGradient2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>

            <radialGradient id="centerGradient">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>

            <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <linearGradient id="potGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78716c" />
              <stop offset="30%" stopColor="#57534e" />
              <stop offset="70%" stopColor="#44403c" />
              <stop offset="100%" stopColor="#292524" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>

            <filter id="potShadow">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Pot */}
          <g transform="translate(100, 300)">
            {/* Pot Glow/Shadow Base */}
            <motion.ellipse
              cx="0"
              cy="25"
              rx="48"
              ry="8"
              fill="#000"
              opacity="0.2"
              animate={{ scale: isGrowing ? [1, 1.05, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />

            {/* Pot Body */}
            <path
              d="M -35 0 L -40 30 Q -40 38 0 38 Q 40 38 40 30 L 35 0 Z"
              fill="url(#potGrad)"
              filter="url(#potShadow)"
              stroke="#1c1917"
              strokeWidth="1"
            />

            {/* Pot Rim */}
            <ellipse
              cx="0"
              cy="0"
              rx="38"
              ry="6"
              fill="#78716c"
              stroke="#a8a29e"
              strokeWidth="0.5"
            />
            <ellipse
              cx="0"
              cy="0"
              rx="38"
              ry="6"
              fill="url(#potGrad)"
              opacity="0.6"
            />

            {/* Pot Decoration */}
            <ellipse
              cx="0"
              cy="15"
              rx="37"
              ry="2"
              fill="#a8a29e"
              opacity="0.3"
            />
            <ellipse
              cx="0"
              cy="25"
              rx="38"
              ry="2"
              fill="#a8a29e"
              opacity="0.3"
            />

            {/* Pot Highlights */}
            <path
              d="M -25 5 Q -20 20 -18 30"
              fill="none"
              stroke="#d6d3d1"
              strokeWidth="2"
              opacity="0.2"
            />

            {/* Soil */}
            <ellipse cx="0" cy="2" rx="32" ry="5" fill="#3e2723" />
            <ellipse cx="0" cy="2" rx="32" ry="4" fill="#2d1e14" />

            {/* Pot Glow Effect - Only visible when growing */}
            <motion.ellipse
              cx="0"
              cy="20"
              rx="42"
              ry="25"
              fill="#10b981"
              animate={{ opacity: isGrowing ? [0.05, 0.2, 0.05] : 0 }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
          </g>

          {/* Main Stem - Grows with typing */}
          <motion.path
            d="M100 302 Q98 260 100 220 Q102 180 100 140 Q100 100 100 70"
            fill="none"
            stroke="url(#stemGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            filter="url(#shadow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: stemProgress, opacity: isGrowing ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 30, damping: 15 }}
          />

          {/* Stem highlight */}
          <motion.path
            d="M97 302 Q96 260 97 220 Q98 180 97 140 Q97 100 97 70"
            fill="none"
            stroke="#34d399"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: stemProgress, opacity: isGrowing ? stemProgress * 0.4 : 0 }}
          />


          {/* Left Branch - Only render when growing */}
          {isGrowing && (
            <motion.path
              d="M100 240 Q85 230 65 215"
              fill="none"
              stroke="url(#stemGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ pathLength: branchProgress }}
            />
          )}

          {/* Right Branch - Only render when growing */}
          {isGrowing && (
            <motion.path
              d="M100 230 Q115 220 135 205"
              fill="none"
              stroke="url(#stemGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ pathLength: branchProgress }}
            />
          )}

          {/* Left Branch Leaves - Only render when branches start growing */}
          {branchProgress > 0 && (
            <motion.g
              animate={{
                scale: branchProgress,
                rotate: isGrowing ? [-2, 2, -2] : 0,
              }}
              transition={{ rotate: { repeat: Infinity, duration: 4 } }}
              style={{ transformOrigin: "65px 215px" }}
            >
              <ellipse
                cx="65"
                cy="215"
                rx="20"
                ry="32"
                fill="url(#leafGrad)"
                transform="rotate(-25 65 215)"
                filter="url(#shadow)"
              />
              <path
                d="M65 232 Q65 215 65 198"
                stroke="#047857"
                strokeWidth="2"
                fill="none"
                opacity="0.5"
                transform="rotate(-25 65 215)"
              />
            </motion.g>
          )}

          {/* Right Branch Leaves - Only render when branches start growing */}
          {branchProgress > 0 && (
            <motion.g
              animate={{
                scale: branchProgress,
                rotate: isGrowing ? [2, -2, 2] : 0,
              }}
              transition={{ rotate: { repeat: Infinity, duration: 4 } }}
              style={{ transformOrigin: "135px 205px" }}
            >
              <ellipse
                cx="135"
                cy="205"
                rx="20"
                ry="32"
                fill="url(#leafGrad)"
                transform="rotate(25 135 205)"
                filter="url(#shadow)"
              />
              <path
                d="M135 222 Q135 205 135 188"
                stroke="#047857"
                strokeWidth="2"
                fill="none"
                opacity="0.5"
                transform="rotate(25 135 205)"
              />
            </motion.g>
          )}

          {/* Stem Leaves (Left) - Only render when leaves start growing */}
          {leafProgress > 0 && (
            <motion.g
              animate={{
                scale: leafProgress,
                rotate: isGrowing ? [-3, 3, -3] : 0,
              }}
              transition={{ rotate: { repeat: Infinity, duration: 3 } }}
              style={{ transformOrigin: "85px 260px" }}
            >
              <ellipse
                cx="85"
                cy="260"
                rx="14"
                ry="24"
                fill="url(#leafGrad)"
                transform="rotate(-35 85 260)"
                filter="url(#shadow)"
              />
              <path
                d="M85 272 Q85 260 85 248"
                stroke="#047857"
                strokeWidth="1.5"
                fill="none"
                opacity="0.5"
                transform="rotate(-35 85 260)"
              />
            </motion.g>
          )}

          {/* Stem Leaves (Right) - Only render when leaves start growing */}
          {leafProgress > 0 && (
            <motion.g
              animate={{
                scale: leafProgress,
                rotate: isGrowing ? [3, -3, 3] : 0,
              }}
              transition={{ rotate: { repeat: Infinity, duration: 3 } }}
              style={{ transformOrigin: "115px 270px" }}
            >
              <ellipse
                cx="115"
                cy="270"
                rx="14"
                ry="24"
                fill="url(#leafGrad)"
                transform="rotate(35 115 270)"
                filter="url(#shadow)"
              />
              <path
                d="M115 282 Q115 270 115 258"
                stroke="#047857"
                strokeWidth="1.5"
                fill="none"
                opacity="0.5"
                transform="rotate(35 115 270)"
              />
            </motion.g>
          )}

          {/* Small leaves near top - Only render when stem is 70% grown */}
          {stemProgress > 0.7 && (
            <motion.g
              animate={{ scale: stemProgress > 0.7 ? 1 : 0 }}
              style={{ transformOrigin: "88px 105px" }}
            >
              <ellipse
                cx="88"
                cy="105"
                rx="10"
                ry="18"
                fill="url(#leafGrad)"
                transform="rotate(-40 88 105)"
                filter="url(#shadow)"
              />
            </motion.g>
          )}


          {stemProgress > 0.8 && (
            <motion.g
              animate={{ scale: stemProgress > 0.8 ? 1 : 0 }}
              style={{ transformOrigin: "112px 115px" }}
            >
              <ellipse
                cx="112"
                cy="115"
                rx="10"
                ry="18"
                fill="url(#leafGrad)"
                transform="rotate(40 112 115)"
                filter="url(#shadow)"
              />
            </motion.g>
          )}

          {/* Complete Flower Head - Connected to stem at y=70 */}
          <motion.g
            transform="translate(100, 70)"
            animate={{
              scale: flowerProgress,
              rotate: flowerProgress > 0 ? 0 : -30,
            }}
            transition={{ type: "spring", stiffness: 50, damping: 10 }}
          >
            {/* Outer Layer - 8 Large Petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <motion.g
                key={`outer-${angle}`}
                animate={{
                  scale: flowerProgress > 0.5 ? [1, 1.05, 1] : 1,
                  rotate: [0, 2, 0],
                }}
                transition={{ repeat: Infinity, duration: 3, delay: i * 0.15 }}
                style={{ transformOrigin: "0 0" }}
              >
                <ellipse
                  cx="0"
                  cy="-22"
                  rx="11"
                  ry="20"
                  fill="url(#petalGradient1)"
                  transform={`rotate(${angle})`}
                  filter="url(#glow)"
                  opacity="0.95"
                />
                <path
                  d="M0 -14 L0 -32"
                  stroke="#fb7185"
                  strokeWidth="0.5"
                  opacity="0.3"
                  transform={`rotate(${angle})`}
                />
              </motion.g>
            ))}

            {/* Middle Layer - 8 Medium Petals */}
            {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(
              (angle, i) => (
                <motion.g
                  key={`middle-${angle}`}
                  animate={{ scale: flowerProgress > 0.7 ? [1, 1.08, 1] : 1 }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    delay: i * 0.15 + 0.5,
                  }}
                  style={{ transformOrigin: "0 0" }}
                >
                  <ellipse
                    cx="0"
                    cy="-16"
                    rx="9"
                    ry="16"
                    fill="url(#petalGradient2)"
                    transform={`rotate(${angle})`}
                    filter="url(#glow)"
                    opacity="0.9"
                  />
                </motion.g>
              )
            )}

            {/* Inner Layer - Small Petals */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.ellipse
                key={`inner-${angle}`}
                cx="0"
                cy="-9"
                rx="6"
                ry="11"
                fill="#fda4af"
                transform={`rotate(${angle})`}
                animate={{ scale: flowerProgress === 1 ? [1, 1.1, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                style={{ transformOrigin: "0 0" }}
              />
            ))}

            {/* Flower Center */}
            <motion.circle
              cx="0"
              cy="0"
              r="12"
              fill="url(#centerGradient)"
              filter="url(#shadow)"
              animate={{ scale: flowerProgress === 1 ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
            />

            {/* Center Seeds */}
            {[...Array(16)].map((_, i) => {
              const angle = (i * 360) / 16;
              const rad = (angle * Math.PI) / 180;
              const x = Math.cos(rad) * 7;
              const y = Math.sin(rad) * 7;
              return (
                <motion.circle
                  key={`seed-${i}`}
                  cx={x}
                  cy={y}
                  r="1.5"
                  fill="#d97706"
                  animate={{ scale: flowerProgress === 1 ? [1, 1.3, 1] : 1 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    delay: i * 0.05,
                  }}
                />
              );
            })}

            {/* Center Highlight */}
            <circle cx="-3" cy="-3" r="4" fill="#fef3c7" opacity="0.6" />
            <circle cx="0" cy="0" r="3" fill="#78350f" opacity="0.2" />
          </motion.g>

          {/* Sparkles around flower - only when complete */}
          <AnimatePresence>
            {progress >= 1 && (
              <>
                {[...Array(10)].map((_, i) => {
                  const angle = (i * 360) / 10;
                  const rad = (angle * Math.PI) / 180;
                  const x = 100 + Math.cos(rad) * 45;
                  const y = 55 + Math.sin(rad) * 45;
                  return (
                    <motion.circle
                      key={`sparkle-${i}`}
                      cx={x}
                      cy={y}
                      r="2.5"
                      fill="#fbbf24"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        delay: i * 0.2,
                      }}
                    />
                  );
                })}
              </>
            )}
          </AnimatePresence>
        </svg>
      </div>
    </div>
  );
}
