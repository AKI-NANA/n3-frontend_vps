"use client";
import React, { useState } from 'react';
import commandsData from './commands.json';

export default function CommandCenterPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const sections = [
    { data: (commandsData as any).n3_master_controls, color: "border-amber-500", bg: "bg-slate-900/80" },
    { data: (commandsData as any).deployment_steps, color: "border-blue-500", bg: "bg-slate-800/50" },
    { data: (commandsData as any).utility_tools, color: "border-emerald-500", bg: "bg-slate-800/50" }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <h1 className="text-4xl font-bold border-b-2 border-amber-500 pb-2 mb-8 text-amber-500">
        N3 BATTLESHIP BRIDGE v7
      </h1>
      
      {sections.map((sec, idx) => sec.data && (
        <section key={idx} className={`mb-8 border-2 ${sec.color} rounded-lg p-6 ${sec.bg} shadow-[0_0_15px_rgba(245,158,11,0.1)]`}>
          <h2 className="text-xl font-bold mb-6 text-slate-200">{sec.data.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sec.data.commands.map((cmd: any) => (
              <button
                key={cmd.id}
                onClick={() => copyToClipboard(cmd.command, cmd.id)}
                className={`flex flex-col p-4 border transition-all rounded text-left ${
                  copiedId === cmd.id ? "border-green-500 bg-green-900/20" : "border-slate-700 hover:border-amber-500/50 hover:bg-slate-800"
                }`}
              >
                <span className={`font-bold ${copiedId === cmd.id ? "text-green-400" : "text-amber-100"}`}>
                  {copiedId === cmd.id ? "✓ COPIED" : cmd.label}
                </span>
                <span className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter">{cmd.description}</span>
              </button>
            ))}
          </div>
        </section>
      ))}

      <footer className="mt-12 pt-4 border-t border-slate-800 text-slate-600 text-[10px] flex justify-between">
        <span>Commander: AKI-NANA • N3 Battleship Bridge v7</span>
        <span>ROOT: ~/n3-frontend_new</span>
      </footer>
    </div>
  );
}
