import React from 'react';
import { TrendingUp, PhoneCall, PackageCheck, Zap, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

const METRICS_DETAILS = [
  {
    id: 'm1',
    metric: '58%',
    label: 'Increase in pick up point use',
    title: 'Autonomous Hub Dispatch',
    category: 'Fleet Utilization',
    color: '#def54f',
    textColor: '#111111',
    icon: <PackageCheck className="w-5 h-5 text-black" />,
    summary:
      'Deployment of 24/7 automated pickup stations and vehicle dispatch hubs accelerated self-service package retrievals by 58% across metropolitan corridors.',
    kpis: [
      { name: 'Monthly Retrievals', val: '1.4M+' },
      { name: 'Average Dwell Time', val: '42s' },
      { name: 'Peak Throughput', val: '320 pk/hr' }
    ]
  },
  {
    id: 'm2',
    metric: '27%',
    label: 'Increase in pick up point use',
    title: 'Network Transit Routing',
    category: 'Secondary Hub Growth',
    color: '#27272a',
    borderColor: '#52525b',
    textColor: '#ffffff',
    icon: <Zap className="w-5 h-5 text-emerald-400" />,
    summary:
      'Sub-second route pairing between active transport fleets and high-density pickup nodes boosted secondary hub utilization by 27% year-over-year.',
    kpis: [
      { name: 'Hub Retention', val: '94.2%' },
      { name: 'Node Proximity', val: '< 400m' },
      { name: 'Fleet Sync', val: '99.8%' }
    ]
  },
  {
    id: 'm3',
    metric: '23%',
    label: 'Decreased in customer phone calls',
    title: 'Live Telemetry Visibility',
    category: 'Customer Experience',
    color: '#56b4f7',
    textColor: '#111111',
    icon: <PhoneCall className="w-5 h-5 text-black" />,
    summary:
      'Real-time vehicle GPS telemetry feeds and push countdown notifications eliminated inbound customer status inquiry calls by 23%.',
    kpis: [
      { name: 'Query Drop', val: '-23.4%' },
      { name: 'CSAT Rating', val: '4.92 / 5' },
      { name: 'First Contact Res', val: '96.1%' }
    ]
  },
  {
    id: 'm4',
    metric: '40%',
    label: 'Decreased in customer phone calls',
    title: 'Predictive Dispatch & Escalations',
    category: 'Support Deflection',
    color: '#fa7328',
    textColor: '#111111',
    icon: <TrendingUp className="w-5 h-5 text-black" />,
    summary:
      'Predictive dynamic routing and automated vehicle load balancing slashed delivery delays and customer complaint escalations by 40%.',
    kpis: [
      { name: 'Escalation Drop', val: '-40.1%' },
      { name: 'On-Time Rate', val: '99.4%' },
      { name: 'Transit Variance', val: '±1.2 min' }
    ]
  }
];

export default function MetricsShowcase({ currentTheme }) {
  return (
    <section id="metrics" className="relative py-24 px-6 md:px-12 bg-[#0b0d11] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70 mb-4">
              <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.trailColor }} />
              <span>ITZFIZZ PERFORMANCE BENCHMARK</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Verified Kinetic{' '}
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300"
              >
                Impact Metrics
              </span>
            </h2>
            <p className="text-sm md:text-base text-white/50 max-w-2xl mt-3 font-normal">
              Direct architectural analysis of the four kinetic milestones highlighted along the McLaren 720S travel trajectory.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Audited Telemetry Dataset</span>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {METRICS_DETAILS.map((item) => (
            <div
              key={item.id}
              className="p-8 rounded-2xl border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:border-white/20 shadow-2xl relative overflow-hidden group"
              style={{
                backgroundColor: item.id === 'm2' ? '#14171f' : '#10131a'
              }}
            >
              {/* Corner Ambient Glow */}
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-15 pointer-events-none group-hover:opacity-25 transition-opacity"
                style={{ backgroundColor: item.color }}
              />

              {/* Card Header with Metric Pill */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <span className="text-[11px] font-mono tracking-widest uppercase text-white/50 block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                </div>

                <div
                  className="px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg"
                  style={{
                    backgroundColor: item.color,
                    color: item.textColor
                  }}
                >
                  <span className="text-2xl md:text-3xl font-black font-mono leading-none">
                    {item.metric}
                  </span>
                  {item.icon}
                </div>
              </div>

              {/* Main Summary */}
              <p className="text-sm text-white/70 leading-relaxed mb-6 font-normal">
                {item.summary}
              </p>

              {/* KPI Strip */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
                {item.kpis.map((kpi, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] font-mono text-white/40 block mb-0.5 truncate">
                      {kpi.name}
                    </span>
                    <span className="text-xs md:text-sm font-bold font-mono text-white">
                      {kpi.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Label Tag */}
              <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-white/40">
                <span>{item.label}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
