import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../AppIcon';

const FloatingDisclaimerButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                aria-label="Open disclaimer"
            >
                <Icon name="Info" size={18} />
                Disclaimer
            </button>

            {open &&
                createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                        <div className="w-full max-w-lg rounded-3xl bg-background p-6 shadow-2xl">
                            <div className="mb-4 flex items-start justify-between gap-4">
                                <h2 className="font-heading text-2xl font-semibold text-foreground">
                                    Disclaimer
                                </h2>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    aria-label="Close disclaimer"
                                >
                                    <Icon name="X" size={18} />
                                </button>
                            </div>

                            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                                <p>
                                    This web application is intended for  
                                    <strong > educational and informational purposes only</strong> and is not designed to serve as a diagnostic tool.
                                </p>
                                <p>
                                    If you are experiencing symptoms or have concerns about your health, we strongly encourage you to consult your obstetrician-gynecologist (OB-GYN) or seek care from the nearest healthcare facility.
                                </p>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                                >
                                    Got it
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default FloatingDisclaimerButton;