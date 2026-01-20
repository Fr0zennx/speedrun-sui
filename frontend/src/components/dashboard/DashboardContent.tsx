import { lazy, Suspense } from 'react';
import { contentData } from '../../data/dashboardContent';

// Lazy load TracingBeam with named export handling
const TracingBeam = lazy(() => import('../ui/tracing-beam').then(module => ({ default: module.TracingBeam })));

interface DashboardContentProps {
    uiReady: boolean;
}

export function DashboardContent({ uiReady }: DashboardContentProps) {
    if (uiReady) {
        return (
            <Suspense fallback={<div className="loading-placeholder"></div>}>
                <TracingBeam className="tracing-beam-wrapper">
                    <div className="content-wrapper">
                        {contentData.map((item, index) => (
                            <div key={`content-${index}`} className="content-item">
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
                                        />
                                    )}
                                    {item.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </TracingBeam>
            </Suspense>
        );
    }

    // Skeleton / Static Content Layout for Stage 1
    return (
        <div className="content-wrapper static-wrapper">
            {contentData.map((item, index) => (
                <div key={`content-static-${index}`} className="content-item">
                    <h2 className="content-badge">{item.badge}</h2>
                    <p className="content-title">{item.title}</p>
                    <div className="content-description">
                        {/* Placeholder for image */}
                        {item?.image && <div className="skeleton-image"></div>}
                        {item.description}
                    </div>
                </div>
            ))}
        </div>
    );
}
