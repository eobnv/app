import { Heart, Code2, Shield, Zap, Users, Flame, Github, Twitter, Mail } from 'lucide-react';
import type { PageId } from '@/components/Sidebar';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const values = [
    { icon: Code2, title: 'Quality First', desc: 'Every script is reviewed for quality and safety before being shared.' },
    { icon: Heart, title: 'Community Driven', desc: 'Hearts determine what rises to the top. The community decides what matters.' },
    { icon: Shield, title: 'Safe & Secure', desc: 'We screen scripts for malicious code so you can use them with confidence.' },
    { icon: Zap, title: 'Always Updated', desc: 'Scripts are updated regularly to keep up with Roblox changes.' },
  ];

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 float" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
          <Flame className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-black mb-4">
          About <span className="gradient-text glow-text">ScriptHub</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto shimmer-text">
          The premier destination for discovering, sharing, and celebrating Roblox scripts. Built by the community, for the community.
        </p>
      </div>

      {/* Mission */}
      <div className="p-8 rounded-2xl border mb-12" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-400" />
          Our Mission
        </h2>
        <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          ScriptHub was created to bring order to the chaos of Roblox script sharing. We believe that great scripts
          should be easy to find, safe to use, and celebrated by the community. Our hearting system lets you voice
          your appreciation, pushing the best scripts to the top where everyone can find them.
        </p>
      </div>

      {/* Values */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">What We <span className="gradient-text-static">Stand For</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="card-glow rounded-2xl border p-6 fade-in-up"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', animationDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How it works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">How It <span className="gradient-text-static">Works</span></h2>
        <div className="space-y-4">
          {[
            { step: '01', title: 'Browse Scripts', desc: 'Explore our library of scripts across all popular Roblox games.' },
            { step: '02', title: 'Copy & Use', desc: 'Found a script you like? Copy the code and paste it into your executor.' },
            { step: '03', title: 'Heart Your Favorites', desc: 'Give a heart to scripts that work well. Help others discover them.' },
            { step: '04', title: 'Share Your Own', desc: 'Created something awesome? Upload it and let the community heart it.' },
          ].map((item, i) => (
            <div
              key={item.step}
              className="flex items-center gap-4 p-5 rounded-xl border fade-in-up"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', animationDelay: `${i * 60}ms` }}
            >
              <span className="text-3xl font-black gradient-text-static w-12">{item.step}</span>
              <div>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center p-8 rounded-2xl border relative overflow-hidden" style={{ borderColor: 'rgba(59, 130, 246, 0.2)', background: 'var(--bg-card)' }}>
        <div className="absolute inset-0 opacity-5 dot-field" />
        <div className="relative">
          <Heart className="w-10 h-10 mx-auto mb-4 float" style={{ fill: '#3b82f6', color: '#3b82f6' }} />
          <h2 className="text-2xl font-bold mb-3">Ready to Dive In?</h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Start exploring scripts or share your own with the community.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => onNavigate('popular')} className="btn-primary px-6 py-3 rounded-xl font-semibold">
              Browse Scripts
            </button>
            <button onClick={() => onNavigate('your-scripts')} className="btn-secondary px-6 py-3 rounded-xl font-semibold">
              Share a Script
            </button>
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="flex justify-center gap-4 mt-12">
        {[Github, Twitter, Mail].map((Icon, i) => (
          <button
            key={i}
            className="w-12 h-12 rounded-xl border flex items-center justify-center transition-all hover:scale-110"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
          >
            <Icon className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
        ))}
      </div>
    </div>
  );
}
