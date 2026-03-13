import React from 'react';
import { useNavigate } from 'react-router-dom';

const ForEmployers = () => {
  const navigate = useNavigate();

  const handlePostJob = () => {
    // Temporary front-end gate for testing: require employer role
    const role = localStorage.getItem('role');
    if (role === 'employer') {
      navigate('/employer/dashboard');
    } else {
      // Redirect to login (could also show a toast/alert). Backend auth will enforce on real flow.
      navigate('/login');
    }
  };

  return (
    <section className="py-20" data-purpose="employer-cta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cta-gradient rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
          <div className="relative z-10 md:w-2/3">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Are You Hiring?</h2>
            <p className="text-brand-100 text-lg md:text-xl mb-10 max-w-xl">
              Join 10,000+ companies using Online Job Searching to find the best talent. Post your job and get quality applicants within hours.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={handlePostJob} className="bg-white text-brand-700 px-8 py-4 rounded-2xl font-bold hover:bg-brand-50 transition-colors shadow-lg">
                Post a Job Now
              </button>
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/3 relative z-10 hidden md:block">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl">
              <div className="space-y-4">
                <div className="h-2 w-full bg-white/30 rounded-full"></div>
                <div className="h-2 w-3/4 bg-white/30 rounded-full"></div>
                <div className="h-10 w-1/2 bg-white rounded-xl"></div>
              </div>
            </div>
          </div>
          {/* Decoration */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-400 opacity-20 blur-3xl rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default ForEmployers;
