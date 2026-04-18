import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Music, LayoutGrid, Gamepad2, Settings, Github, Twitter } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden selection:bg-neon-pink/30">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[30%] right-[10%] w-[150px] h-[150px] border border-neon-cyan/20 rounded-full"></div>
        <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] border border-neon-pink/10 rounded-full"></div>
      </div>

      {/* Header / Sidebar Navigation */}
      <nav className="fixed left-0 top-0 h-full w-20 border-r border-white/5 flex flex-col items-center py-8 gap-8 glass z-50">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-pink flex items-center justify-center p-[1px] shadow-neon-cyan/20 mb-4">
            <div className="w-full h-full rounded-[11px] bg-black flex items-center justify-center">
                <span className="text-xl font-black text-white italic">NB</span>
            </div>
        </div>
        
        <div className="space-y-6 flex-1">
            <NavItem icon={<LayoutGrid size={22} />} active />
            <NavItem icon={<Music size={22} />} />
            <NavItem icon={<Gamepad2 size={22} />} />
            <NavItem icon={<Settings size={22} />} />
        </div>

        <div className="space-y-4 pt-8 border-t border-white/5">
            <a href="#" className="p-2 text-white/30 hover:text-white transition-colors"><Github size={20} /></a>
            <a href="#" className="p-2 text-white/30 hover:text-white transition-colors"><Twitter size={20} /></a>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pl-20 min-h-screen flex flex-col xl:flex-row items-center justify-center gap-12 p-8 lg:p-16">
        
        {/* Left Section: Info & Stats */}
        <div className="hidden 2xl:flex flex-col gap-8 w-[300px] animate-in fade-in slide-in-from-left duration-1000">
            <div className="glass p-6 rounded-3xl border-l-4 border-l-neon-cyan">
                <h3 className="text-[10px] uppercase tracking-widest text-neon-cyan font-bold mb-2">System Status</h3>
                <p className="text-sm text-white/60 leading-relaxed font-mono">
                    All neural networks operating at maximum efficiency. Syncing beats with spatial grid...
                </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="glass p-4 rounded-2xl flex flex-col items-center">
                    <span className="text-[10px] uppercase text-white/40 mb-1">Latency</span>
                    <span className="text-lg font-bold font-mono text-neon-lime">14ms</span>
                </div>
                <div className="glass p-4 rounded-2xl flex flex-col items-center">
                    <span className="text-[10px] uppercase text-white/40 mb-1">FPS</span>
                    <span className="text-lg font-bold font-mono text-neon-pink">60</span>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold px-2">Top Performers</h4>
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4 p-3 glass rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-neon-cyan font-mono group-hover:bg-neon-cyan group-hover:text-black transition-all">0{i}</div>
                        <div>
                            <div className="text-xs font-bold">CYBER_RUNNER_{i}</div>
                            <div className="text-[10px] text-white/30 font-mono">2,440 PTS</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Center Section: The Game */}
        <section className="flex-1 flex flex-col items-center gap-8">
            <header className="text-center space-y-4 mb-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex px-5 py-1.5 rounded-full border border-neon-cyan/50 bg-neon-cyan/5 text-neon-cyan text-[9px] uppercase tracking-[0.4em] font-black"
              >
                Experimental Alpha v.1.0
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.8]">
                NEON <span className="neon-text-pink drop-shadow-[0_0_15px_rgba(255,0,255,0.8)]">BEATS</span>
              </h1>
              <p className="text-white/40 max-w-md mx-auto text-[11px] uppercase tracking-widest font-mono">
                Retro velocity • Modern rhythm • Zero lag
              </p>
            </header>
            
            <SnakeGame />
        </section>

        {/* Right Section: Music Player */}
        <section className="flex flex-col items-center xl:items-end gap-8">
            <MusicPlayer />
            
            {/* Visualizer Placeholder */}
            <div className="glass rounded-2xl p-4 w-full max-w-[350px] flex items-end justify-between h-20 gap-1 px-6">
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div 
                        key={i}
                        animate={{ height: ["20px", "40px", "15px", "30px", "20px"] }}
                        transition={{ duration: 0.5 + Math.random(), repeat: Infinity, ease: 'easeInOut' }}
                        className="w-2 bg-gradient-to-t from-neon-pink to-neon-cyan rounded-t-sm"
                    />
                ))}
            </div>
        </section>

      </main>

      {/* Footer / Meta Info */}
      <footer className="pl-20 py-8 border-t border-white/5 glass flex flex-col md:flex-row justify-between items-center px-8 gap-4">
        <div className="flex gap-8 text-[10px] uppercase tracking-widest text-white/20 font-mono">
            <span>&copy; 2026 DIGITAL ENTROPY LOGIC</span>
            <a href="#" className="hover:text-white transition-colors">Internal Ops</a>
            <a href="#" className="hover:text-white transition-colors">Memory Core</a>
        </div>
        <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-neon-lime shadow-neon-lime"></div>
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">GRID_CONNECTION_STABLE</span>
        </div>
      </footer>
    </div>
  );
}

function NavItem({ icon, active = false }: { icon: React.ReactNode; active?: boolean }) {
    return (
        <button className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group
            ${active ? 'bg-white/10 text-neon-cyan' : 'text-white/30 hover:text-white hover:bg-white/5'}`}>
            {active && (
                <motion.div 
                    layoutId="nav-glow"
                    className="absolute -inset-1 bg-neon-cyan/20 blur-md rounded-2xl -z-10"
                />
            )}
            {icon}
            <div className={`absolute left-full ml-4 px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50`}>
                Menu Item
            </div>
        </button>
    );
}
