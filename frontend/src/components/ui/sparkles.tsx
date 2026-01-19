"use client";
import { useId, useMemo, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

type SparklesCoreProps = {
    id?: string;
    className?: string;
    background?: string;
    minSize?: number;
    maxSize?: number;
    speed?: number;
    particleColor?: string;
    particleDensity?: number;
};

export const SparklesCore = (props: SparklesCoreProps) => {
    const {
        id,
        className,
        background = "transparent",
        minSize = 0.6,
        maxSize = 1.4,
        speed = 1,
        particleColor = "#FFFFFF",
        particleDensity = 100,
    } = props;

    const [init, setInit] = useState(false);
    const generatedId = useId();

    useEffect(() => {
        let cancelled = false;

        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            if (!cancelled) {
                setInit(true);
            }
        }).catch((err) => {
            console.error("Failed to init particles engine:", err);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    const particlesLoaded = async (container?: Container) => {
        console.log("Sparkles loaded", container);
    };

    const options = useMemo(
        () => ({
            background: {
                color: {
                    value: background,
                },
            },
            fullScreen: {
                enable: false,
                zIndex: 1,
            },
            fpsLimit: 120,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "push" as const,
                    },
                    onHover: {
                        enable: false,
                        mode: "repulse" as const,
                    },
                    resize: {
                        enable: true,
                    },
                },
                modes: {
                    push: {
                        quantity: 4,
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4,
                    },
                },
            },
            particles: {
                color: {
                    value: particleColor,
                },
                links: {
                    color: particleColor,
                    distance: 150,
                    enable: false,
                    opacity: 0.5,
                    width: 1,
                },
                move: {
                    enable: true,
                    outModes: {
                        default: "out" as const,
                    },
                    random: true,
                    speed: speed,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        area: 800,
                    },
                    value: particleDensity,
                },
                opacity: {
                    value: {
                        min: 0.1,
                        max: 1,
                    },
                    animation: {
                        enable: true,
                        speed: speed,
                        startValue: "random" as const,
                        destroy: "none" as const,
                    },
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: {
                        min: minSize,
                        max: maxSize,
                    },
                },
            },
            detectRetina: true,
        }),
        [background, minSize, maxSize, speed, particleColor, particleDensity]
    );

    if (!init) {
        return null;
    }

    return (
        <Particles
            id={id || generatedId}
            className={className}
            style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
            particlesLoaded={particlesLoaded}
            options={options}
        />
    );
};

export default SparklesCore;
