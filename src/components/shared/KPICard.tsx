
import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Users, FolderOpen, FileText, UserCheck, Heart, Brain, Shield, BookOpen } from 'lucide-react';
import clsx from 'clsx';
import type { KPI } from '../../types';

const ICONS: Record<string, React.ReactNode> = {
  Users: <Users size={20} />,
  FolderOpen: <FolderOpen size={20} />,
  FileText: <FileText size={20} />,
  UserCheck: <UserCheck size={20} />,
  Heart: <Heart size={20} />,
  TrendingUp: <TrendingUp size={20} />,
  Brain: <Brain size={20} />,
  Shield: <Shield size={20} />,
  BookOpen: <BookOpen size={20} />,
};

const COLOR_MAP: Record<string, string> = {
  forest: 'from-forest-500/20 to-forest-600/10 text-forest-600 dark:text-forest-300',
  sky: 'from-sky-500/20 to-sky-600/10 text-sky-600 dark:text-sky-300',
  teal: 'from-teal-500/20 to-teal-600/10 text-teal-600 dark:text-teal-300',
  earth: 'from-earth-400/20 to-earth-500/10 text-earth-600 dark:text-earth-300',
};

function useCountUp(target: number, duration = 1400) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return count;
}

interface KPICardProps {
  kpi: KPI;
  delay?: number;
}

export default function KPICard({ kpi, delay = 0 }: KPICardProps) {
  const count = useCountUp(kpi.value);
  const colorClass = COLOR_MAP[kpi.color] ?? COLOR_MAP['forest'];

  return (
    <div
      className="glass-card rounded-2xl p-5 flex flex-col gap-3 animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-center justify-between">
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br', colorClass)}>
          {ICONS[kpi.icon] ?? <TrendingUp size={20} />}
        </div>
        <span className={clsx('stat-badge', kpi.changeDir === 'up' ? 'up' : 'down')}>
          {kpi.changeDir === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {kpi.change}%
        </span>
      </div>
      <div>
        <div className="text-2xl font-display font-bold text-gray-900 dark:text-white tabular-nums">
          {count.toLocaleString()}{kpi.unit}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{kpi.label}</div>
      </div>
    </div>
  );
}
