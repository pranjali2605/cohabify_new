import React from 'react';

const team = [
  { name: 'Harshita', role: 'Co-founder', bio: 'Product thinker and community builder focused on meaningful, habit-forming experiences.', initials: 'HA', photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=400&auto=format&fit=crop' },
  { name: 'Nishita', role: 'Design Lead', bio: 'Designs accessible, delightful interfaces with empathy and clarity.', initials: 'NI', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop' },
  { name: 'Pranjali', role: 'Engineering Lead', bio: 'Full-stack engineer who loves shipping fast, robust features.', initials: 'PR', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop' },
  { name: 'Priyanshi', role: 'Growth & Ops', bio: 'Storyteller and strategist scaling Cohabify to new communities.', initials: 'PY', photo: 'https://images.unsplash.com/photo-1541534401786-2077eed87a96?q=80&w=400&auto=format&fit=crop' },
];

const values = [
  { icon: '🤝', title: 'Togetherness', desc: 'We believe good habits stick when built with supportive people.' },
  { icon: '🔒', title: 'Trust', desc: 'Privacy-first experiences so you can express yourself safely.' },
  { icon: '⚡', title: 'Momentum', desc: 'Small wins, daily streaks, and friendly accountability.' },
  { icon: '🌈', title: 'Well‑being', desc: 'Tools that normalize check-ins and emotional awareness.' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <span className="inline-block mb-4 text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">Our Mission</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Helping people live better, together
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Cohabify blends habits, household harmony, and mental well‑being into one simple, caring app.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">What we stand for</h2>
            <p className="text-gray-600 mt-2">Principles that guide our product and community</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <div key={v.title} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-4">{v.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{v.title}</h3>
                <p className="text-sm text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-6">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our story</h2>
            <p className="text-gray-700 leading-7">
              Cohabify began with four friends in a shared apartment who wanted living together to be joyful, organized, and emotionally supportive. Today, Cohabify brings habit tracking, roommate coordination, and safe emotional expression into one experience.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Meet the team</h2>
            <p className="text-gray-600 mt-2">Four builders. One vision.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member.name} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-full object-cover mb-4" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-base font-bold mb-4">
                    {member.initials}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-blue-700 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
