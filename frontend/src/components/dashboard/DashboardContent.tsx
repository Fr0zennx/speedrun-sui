import { lazy, Suspense } from 'react';
import { contentData } from '../../data/dashboardContent';

// Lazy load TracingBeam with named export handling
const TracingBeam = lazy(() => import('../ui/tracing-beam').then(module => ({ default: module.TracingBeam })));

interface DashboardContentProps {
    uiReady: boolean;
}

// Extract first item for LCP optimization - always render immediately
const firstItem = contentData[0];
const remainingItems = contentData.slice(1);

export function DashboardContent({ uiReady }: DashboardContentProps) {
    return (
        <>
            {/* LCP IMAGE - Always in DOM on first render, NO Suspense, NO uiReady check */}
            <div className="content-wrapper lcp-section">
                <div className="content-item">
                    <h2 className="content-badge">{firstItem.badge}</h2>
                    <p className="content-title">{firstItem.title}</p>
                    <div className="content-description">
                        {firstItem.image && (
                            <img
                                src={firstItem.image}
                                alt={firstItem.title}
                                className="content-image"
                                loading="eager"
                                fetchPriority="high"
                                decoding="async"
                                width={800}
                                height={450}
                            />
                        )}
                        {firstItem.description}
                    </div>
                </div>
            </div>

            {/* Remaining content - can be lazy loaded */}
            {uiReady ? (
                <Suspense fallback={<div className="loading-placeholder"></div>}>
                    <TracingBeam className="tracing-beam-wrapper">
                        <div className="content-wrapper">
                            {remainingItems.map((item, index) => (
                                <div key={`content-${index + 1}`} className="content-item">
                                    <h2 className="content-badge">
                                        {item.badge}
                                    </h2>

                                    <p className="content-title">
                                        {item.title}
                                    </p>

                                    <div className="content-description">
                                        {item?.image && (
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="content-image"
                                                loading="lazy"
                                                decoding="async"
                                                width={800}
                                                height={450}
                                            />
                                        )}
                                        {item.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TracingBeam>
                </Suspense>
            ) : (
                <div className="content-wrapper static-wrapper">
                    {remainingItems.map((item, index) => (
                        <div key={`content-static-${index + 1}`} className="content-item">
                            <h2 className="content-badge">{item.badge}</h2>
                            <p className="content-title">{item.title}</p>
                            <div className="content-description">
                                {item?.image && <div className="skeleton-image"></div>}
                                {item.description}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

