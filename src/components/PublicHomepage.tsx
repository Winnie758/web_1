
import React, { useState, useEffect, useRef } from 'react';
import {
  Leaf, Brain, Users, Globe, BarChart2, Shield, ArrowRight, MapPin,
  Phone, Mail, ExternalLink, Activity, Lock, Sun, Moon, Menu, X, ChevronDown
} from 'lucide-react';
import logo from '../assets/accrcc-logo.jpg';
import clsx from 'clsx';
import { useAuthStore } from '../store/authStore';

interface PublicHomepageProps {
  onLoginClick: () => void;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function AnimatedStat({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const { ref, inView } = useInView();
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1600;
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-display font-bold text-white tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-white/70 text-sm mt-1 font-medium">{label}</div>
    </div>
  );
}

interface FocusArea {
  num: string;
  title: string;
  desc: string;
}

const FOCUS_AREAS: FocusArea[] = [
  {
    num: '01',
    title: 'Mental Health and Psychosocial Support',
    desc: 'Addressing the psychological damage brought on by climate-related calamities like droughts and floods is a top priority. Programs for climate resilience should incorporate mental health care, according to ACCRCC.',
  },
  {
    num: '02',
    title: 'Climate Adaptation and Resilience',
    desc: 'The coalition supports local communities in adopting strategies to adapt to changing environments, focusing on food security, water management, and sustainable livelihoods.',
  },
  {
    num: '03',
    title: 'Policy Advocacy and Engagement',
    desc: 'ACCRCC influences governments and stakeholders to create inclusive, \u201ccommunity-driven\u201d climate policies at local, national, and regional levels. This includes advocacy for climate justice and ensuring resources reach those most in need.',
  },
  {
    num: '04',
    title: 'Gender Equality and Inclusion',
    desc: 'In order to ensure that women and marginalised groups are included in efforts to create resilience, the organization highlights the importance of gender equality in climate action.',
  },
  {
    num: '05',
    title: 'Research and Knowledge Sharing',
    desc: 'ACCRCC gathers information about the relationship between food insecurity, mental health, and climate change and turns it into practical solutions.',
  },
  {
    num: '06',
    title: 'Children and Climate Action',
    desc: 'They promote child-centered climate awareness in collaboration with partner organisations like ACOPPHE to guarantee that kids take an active role in conservation.',
  },
];

export default function PublicHomepage({ onLoginClick }: PublicHomepageProps) {
  const { darkMode, toggleDarkMode } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const programs = [
    {
      icon: <Leaf size={22} className="text-forest-500" />,
      title: 'Green Corridor Restoration',
      desc: 'Restoring degraded ecosystems across Ghana through community-led reforestation and wetland conservation programs.',
      img: 'https://images.pexels.com/photos/6647027/pexels-photo-6647027.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      tag: 'Climate Action',
    },
    {
      icon: <Brain size={22} className="text-teal-500" />,
      title: 'Community Resilience Hubs',
      desc: 'Establishing mental health support centers in climate-vulnerable communities, providing trauma-informed care and resilience training.',
      img: 'https://images.pexels.com/photos/6647064/pexels-photo-6647064.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      tag: 'Mental Health',
    },
    {
      icon: <Users size={22} className="text-sky-500" />,
      title: 'Climate Literacy Campaign',
      desc: 'Educating 50,000+ community members on climate adaptation strategies, environmental rights, and sustainable livelihoods.',
      img: 'https://images.pexels.com/photos/6646967/pexels-photo-6646967.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      tag: 'Community',
    },
    {
      icon: <Shield size={22} className="text-earth-500" />,
      title: 'Trauma Response Network',
      desc: 'A rapid-response network of trained counselors deployed to communities affected by climate disasters and environmental displacement.',
      img: 'https://images.pexels.com/photos/6646878/pexels-photo-6646878.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      tag: 'Resilience',
    },
  ];

  const partners = [
    { name: 'ACOPPHE', url: 'https://acopphe.org' },
    { name: 'IGAD', url: 'https://igad.int' },
    { name: 'UNFCCC', url: 'https://unfccc.int' },
    { name: 'Climate Action Africa', url: 'https://climateactionafrica.ca' },
  ];

  return (
    <div className={clsx('min-h-screen', darkMode ? 'dark' : '')}>
      <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">

        {/* Navbar */}
        <nav className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800' : 'bg-transparent'
        )}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest-500 to-teal-600 flex items-center justify-center">
                <img src={logo} alt="ACCRCC logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-display font-bold text-gray-900 dark:text-white text-sm">ACCRCC</span>
                <span className="text-forest-600 dark:text-forest-400 font-bold text-sm"> ResilienceIQ</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {['About', 'Programs', 'Impact', 'Partners', 'Contact'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle dark mode">
                {darkMode ? <Sun size={16} className="text-gray-400" /> : <Moon size={16} className="text-gray-600" />}
              </button>
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-forest-600 to-teal-600 text-white text-sm font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                aria-label="Staff login"
              >
                <Lock size={13} /> Staff Login
              </button>
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(v => !v)}>
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 py-3 flex flex-col gap-2 animate-fade-in">
              {['About', 'Programs', 'Impact', 'Partners', 'Contact'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-gray-700 dark:text-gray-300 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  {item}
                </a>
              ))}
            </div>
          )}
        </nav>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.pexels.com/photos/12431912/pexels-photo-12431912.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="A group of people exploring a vibrant green wetland with coconut trees under a cloudy sky."
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/70 to-gray-950/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-500/20 border border-forest-400/30 text-forest-300 text-xs font-semibold mb-6 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse" />
                Climate Action &amp; Mental Health &middot; Kenya
              </div>

              <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-6">
                Building Resilience<br />
                <span className="text-gradient-forest">at the Intersection</span><br />
                of Climate &amp; Mind
              </h1>

              <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-xl">
                ACCRCC advances community resilience through integrated climate action and mental health programs &mdash; monitoring, measuring, and amplifying impact across Ghana and West Africa.
              </p>

              <div className="flex flex-wrap gap-3">
                <a href="#programs" className="btn-primary text-sm py-3 px-6">
                  Explore Programs <ArrowRight size={14} />
                </a>
                <a href="#impact" className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-all duration-200">
                  <BarChart2 size={14} /> Our Impact
                </a>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown size={24} className="text-white/50" />
          </div>
        </section>

        {/* Stats */}
        <section id="impact" className="py-20 bg-gradient-to-br from-forest-700 via-forest-800 to-teal-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-teal-300 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="text-forest-300 text-xs font-semibold uppercase tracking-widest mb-3">Measured Impact</div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Real Change, Verified Data</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <AnimatedStat value={247} label="Communities Reached" />
              <AnimatedStat value={58400} label="Direct Beneficiaries" />
              <AnimatedStat value={34} label="Active Projects" />
              <AnimatedStat value={128} label="Staff &amp; Volunteers" />
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-forest-600 dark:text-forest-400 text-xs font-semibold uppercase tracking-widest mb-3">Who We Are</div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  Africa&apos;s Climate &amp; Community Resilience Centre
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  ACCRCC (Africa Climate and Community Resilience Centre) is a Ghana-based NGO operating at the intersection of environmental sustainability and mental health. We believe that climate resilience and psychological wellbeing are inseparable &mdash; communities cannot adapt to a changing climate without the mental and emotional resources to do so.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  Our ResilienceIQ platform powers our operational intelligence &mdash; enabling real-time monitoring, evidence-based decision making, and transparent reporting across all programs and field operations.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Climate Action', 'Mental Health', 'Community Engagement', 'GIS Monitoring', 'Capacity Building'].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-forest-50 dark:bg-forest-900/20 text-forest-700 dark:text-forest-300 border border-forest-100 dark:border-forest-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/9544454/pexels-photo-9544454.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="Three scientists in protective suits study environmental conditions in a forest."
                  className="rounded-3xl w-full h-80 object-cover shadow-2xl"
                />
                <div className="absolute -bottom-4 -left-4 glass-card rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-500 to-teal-600 flex items-center justify-center">
                      <Activity size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">ResilienceIQ</div>
                      <div className="text-xs text-gray-500">Live M&amp;E Platform</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs */}
        <section id="programs" className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="text-forest-600 dark:text-forest-400 text-xs font-semibold uppercase tracking-widest mb-3">Our Work</div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">Programs &amp; Initiatives</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                Four integrated program areas working in concert to build lasting resilience across communities.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programs.map((prog, i) => (
                <div key={i} className="group rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-52 overflow-hidden">
                    <img src={prog.img} alt={prog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/20">
                      {prog.tag}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {prog.icon}
                      <h3 className="text-base font-display font-bold text-gray-900 dark:text-white">{prog.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{prog.desc}</p>
                    <button className="mt-3 flex items-center gap-1 text-xs font-semibold text-forest-600 dark:text-forest-400 hover:gap-2 transition-all">
                      Learn more <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Focus Areas */}
        <section id="focus-areas" className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="text-forest-600 dark:text-forest-400 text-xs font-semibold uppercase tracking-widest mb-3">
                Nairobi, Kenya &mdash; ACCRCC
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Focus Areas
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                Six strategic pillars guiding ACCRCC&apos;s integrated approach to climate resilience and community wellbeing.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FOCUS_AREAS.map((area) => (
                <div
                  key={area.num}
                  className="group rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-500 to-teal-600 flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-display font-bold tabular-nums leading-none">
                        {area.num}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-display font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                        {area.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {area.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Field work section */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.pexels.com/photos/30351777/pexels-photo-30351777.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Surveyor using theodolite for measurements in outdoor forested area."
                  className="rounded-2xl w-full h-48 object-cover shadow-lg"
                />
                <img
                  src="https://images.pexels.com/photos/34247810/pexels-photo-34247810.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Engineers performing land survey in dry grasslands."
                  className="rounded-2xl w-full h-48 object-cover shadow-lg mt-8"
                />
                <img
                  src="https://images.pexels.com/photos/12370347/pexels-photo-12370347.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="Four individuals walking on a rural plowed field under a cloudy sky."
                  className="rounded-2xl w-full h-48 object-cover shadow-lg col-span-2"
                />
              </div>
              <div>
                <div className="text-teal-600 dark:text-teal-400 text-xs font-semibold uppercase tracking-widest mb-3">Field Operations</div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  Evidence Gathered<br />Where It Matters Most
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Our field officers and volunteers operate across Ghana, collecting GPS-tagged environmental data, conducting community assessments, and delivering direct support to vulnerable populations.
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: <Globe size={16} className="text-forest-500" />, text: 'GPS-tagged field submissions across 7 regions' },
                    { icon: <BarChart2 size={16} className="text-teal-500" />, text: 'Real-time data feeding into executive dashboards' },
                    { icon: <Shield size={16} className="text-sky-500" />, text: 'Trauma-informed community engagement protocols' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                      {item.icon}
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section id="partners" className="py-16 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <div className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">Regional & International Networks</div>
              <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white">Engagements in Climate Action, Mental Health & Community Resilience</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {partners.map(p => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 shadow-sm hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
                >
                  {p.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-forest-800 via-teal-800 to-forest-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal-300 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Join the Resilience Movement
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Partner with ACCRCC to build climate-resilient, mentally healthy communities across Africa.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="#contact" className="btn-primary py-3 px-8 text-sm">
                Get In Touch <ArrowRight size={14} />
              </a>
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 px-8 py-3 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-all"
              >
                <Lock size={14} /> Staff Portal
              </button>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="text-forest-600 dark:text-forest-400 text-xs font-semibold uppercase tracking-widest mb-3">Contact</div>
                <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-6">Get In Touch</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin size={16} className="text-forest-500" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Address</div>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=Ntashart+Plaza,+4th+Floor,+Nairobi"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-gray-800 dark:text-gray-200 hover:text-forest-600 transition-colors"
                      >
                        Ntashart Plaza, 4th Floor, Nairobi.
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone size={16} className="text-teal-500" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Phone</div>
                      <div className="text-sm text-gray-800 dark:text-gray-200 flex flex-wrap items-center gap-2">
                        <a href="tel:+254202051330" className="underline hover:text-forest-600">+254202051330</a>
                        <span className="text-gray-500 dark:text-gray-400">/</span>
                        <a href="tel:+254720439194" className="underline hover:text-forest-600">+254720439194</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                      <Mail size={16} className="text-sky-500" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Email</div>
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=info@accrcc.org"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-gray-800 dark:text-gray-200 underline hover:text-forest-600 transition-colors"
                      >
                        info@accrcc.org
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass-card rounded-3xl p-6">
                <h3 className="text-base font-display font-bold text-gray-900 dark:text-white mb-4">Send a Message</h3>
                <div className="flex flex-col gap-3">
                  <input className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-forest-400" placeholder="Your name" />
                  <input type="email" className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-forest-400" placeholder="Your email" />
                  <textarea rows={4} className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-forest-400 resize-none" placeholder="Your message..." />
                  <button className="btn-primary w-full justify-center">Send Message <ArrowRight size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-950 text-gray-400 py-10 px-4 md:px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-forest-500 to-teal-600 flex items-center justify-center">
                <img src={logo} alt="ACCRCC logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-display font-bold text-white">ACCRCC ResilienceIQ</span>
            </div>
            <div className="text-xs text-center">
              &copy; 2026 Africa Climate and Community Resilience Centre. All rights reserved.
            </div>
            <button onClick={onLoginClick} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-forest-400 transition-colors">
              <Lock size={11} /> Staff Portal <ExternalLink size={10} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
  