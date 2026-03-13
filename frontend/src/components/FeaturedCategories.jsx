import React from 'react';

const FeaturedCategories = () => {
  return (
    <section className="py-20 bg-white" data-purpose="job-categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore by Category</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Browse thousands of jobs organized by industry to find the perfect fit for your expertise.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group p-10 rounded-2xl border border-slate-200 text-center text-slate-500 col-span-1 sm:col-span-2 lg:col-span-4">
            No categories to display. Categories will appear here once loaded from the API.
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
