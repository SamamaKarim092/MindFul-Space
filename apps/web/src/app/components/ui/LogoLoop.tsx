"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoItem {
  node?: React.ReactNode;
  src?: string;
  alt?: string;
  title?: string;
  href?: string;
}

interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number;
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  ariaLabel?: string;
}

export default function LogoLoop({
  logos,
  speed = 100,
  direction = "left",
  logoHeight = 48,
  gap = 40,
  hoverSpeed = 0,
  scaleOnHover = false,
  fadeOut = false,
  fadeOutColor = "transparent",
  ariaLabel = "Logo loop",
}: LogoLoopProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isVertical = direction === "up" || direction === "down";
  const isReverse = direction === "right" || direction === "down";

  const currentSpeed = isHovered ? hoverSpeed : speed;
  const isPaused = currentSpeed === 0;

  // Repeat logos enough times to ensure smooth scrolling
  const repeatCount = 6;
  const displayLogos = Array(repeatCount).fill(logos).flat();

  return (
    <div
      className={`relative overflow-hidden ${isVertical ? "h-full" : "w-full"}`}
      style={{
        height: isVertical ? "100%" : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={ariaLabel}
    >
      {fadeOut && (
        <>
          <div
            className={`absolute z-10 pointer-events-none ${isVertical ? "top-0 left-0 right-0 h-20" : "top-0 left-0 bottom-0 w-20"}`}
            style={{
              background: `linear-gradient(${isVertical ? "to bottom" : "to right"}, ${fadeOutColor}, transparent)`,
            }}
          />
          <div
            className={`absolute z-10 pointer-events-none ${isVertical ? "bottom-0 left-0 right-0 h-20" : "top-0 right-0 bottom-0 w-20"}`}
            style={{
              background: `linear-gradient(${isVertical ? "to top" : "to left"}, ${fadeOutColor}, transparent)`,
            }}
          />
        </>
      )}

      <div
        className={`flex ${isVertical ? "flex-col" : "flex-row"} w-max`}
        style={{
          gap: `${gap}px`,
          transform: isVertical ? `translateY(0)` : `translateX(0)`,
          animation: `scroll-${isVertical ? "y" : "x"} ${5000 / (currentSpeed || 1)}s linear infinite`,
          animationDirection: isReverse ? "reverse" : "normal",
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {displayLogos.map((logo, index) => (
          <div
            key={index}
            className={`flex items-center justify-center transition-transform duration-300 ${scaleOnHover && isHovered ? "scale-110" : ""}`}
            style={{ height: isVertical ? "auto" : "100%" }}
          >
            {logo.href ? (
              <Link
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                title={logo.title}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <LogoContent logo={logo} height={logoHeight} />
              </Link>
            ) : (
              <div title={logo.title} className="text-gray-400">
                <LogoContent logo={logo} height={logoHeight} />
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll-x {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${100 / repeatCount}%);
          }
        }
        @keyframes scroll-y {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-${100 / repeatCount}%);
          }
        }
      `}</style>
    </div>
  );
}

function LogoContent({ logo, height }: { logo: LogoItem; height: number }) {
  if (logo.node) {
    return <div style={{ fontSize: height }}>{logo.node}</div>;
  }
  if (logo.src) {
    return (
      <Image
        src={logo.src}
        alt={logo.alt || ""}
        height={height}
        width={height * 2}
        className="object-contain w-auto"
        style={{ height: `${height}px` }}
      />
    );
  }
  return null;
}
