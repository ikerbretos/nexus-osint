import React, { useMemo } from 'react';
import { Node } from './store/useGraphStore';
import { ENTITY_CONFIG } from './constants/entities';

interface TimelinePanelProps {
    nodes: Node[];
    onNodeClick: (id: string) => void;
    onClose: () => void;
}

export const TimelinePanel: React.FC<TimelinePanelProps> = ({ nodes, onNodeClick, onClose }) => {
    // Filter nodes with dates and valid dates
    const timedNodes = useMemo(() => {
        return nodes.filter(n => n.date && !isNaN(Date.parse(n.date)))
            .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());
    }, [nodes]);

    if (timedNodes.length === 0) {
        return (
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-[#0a0a0a] border-t border-[var(--color-border)] z-40 flex flex-col items-center justify-center text-neutral-500 animate-slide-up">
                <button onClick={onClose} className="absolute top-2 right-2 text-neutral-500 hover:text-white">✕</button>
                <p className="text-sm">No hay nodos con fecha asignada.</p>
                <p className="text-xs opacity-60">Añade una fecha en las propiedades del nodo para verlo aquí.</p>
            </div>
        );
    }

    // Calculate range
    const minDate = new Date(timedNodes[0].date!).getTime();
    const maxDate = new Date(timedNodes[timedNodes.length - 1].date!).getTime();
    const range = maxDate - minDate || 1; // Avoid divide by zero

    const getPosition = (dateStr: string) => {
        const t = new Date(dateStr).getTime();
        return ((t - minDate) / range) * 90 + 5; // 5% to 95% padding
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[var(--color-border)] z-40 flex flex-col animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Línea de Tiempo
                </h3>
                <button onClick={onClose} className="text-neutral-500 hover:text-white transition">✕</button>
            </div>

            <div className="flex-1 relative overflow-hidden px-8 py-6">
                {/* Axis Line */}
                <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-neutral-800 rounded-full" />

                {/* Nodes */}
                {timedNodes.map((n, i) => {
                    const left = `${getPosition(n.date!)}%`;
                    const isTop = i % 2 === 0;
                    const config = ENTITY_CONFIG[n.type];

                    return (
                        <div key={n.id}
                            className="absolute top-1/2 flex flex-col items-center group cursor-pointer transition-all duration-300 hover:z-50"
                            style={{ left, transform: 'translate(-50%, -50%)' }}
                            onClick={() => onNodeClick(n.id)}
                        >
                            {/* Connector Line */}
                            <div className={`absolute w-px h-8 bg-neutral-700 group-hover:bg-cyan-500 transition-colors ${isTop ? 'bottom-1/2 origin-bottom' : 'top-1/2 origin-top'} scale-y-0 group-hover:scale-y-100 duration-300`} />

                            {/* Dot */}
                            <div className={`w-3 h-3 rounded-full border-2 border-[#0a0a0a] bg-neutral-600 group-hover:bg-cyan-400 group-hover:scale-150 transition-all z-10 relative shadow-lg
                    ${isTop ? 'translate-y-4' : '-translate-y-4'} group-hover:translate-y-0`} />

                            {/* Card */}
                            <div className={`absolute w-32 bg-[#111] border border-neutral-700 rounded p-2 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none
                  ${isTop ? '-top-24' : 'top-16'} flex flex-col gap-1 items-center text-center z-20`}>
                                <span className="text-[9px] font-mono text-cyan-500">{n.date}</span>
                                <div className="flex items-center gap-1 text-white">
                                    {React.createElement(config.icon, { size: 10 })}
                                    <span className="text-[10px] font-bold truncate max-w-full">{config.label}</span>
                                </div>
                                <span className="text-[9px] text-neutral-400 truncate w-full">{n.data.label || n.data.ip || n.data.email || n.id}</span>
                            </div>

                            {/* Simple Label (Default visible) */}
                            <span className={`absolute text-[9px] font-mono text-neutral-500 whitespace-nowrap opacity-60 group-hover:opacity-0 transition-opacity
                 ${isTop ? '-top-6' : 'bottom-6'}`}>
                                {n.date}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
