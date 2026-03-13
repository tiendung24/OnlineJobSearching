import React from 'react';
import HeroSection from '../components/HeroSection.jsx';
import FeaturedCategories from '../components/FeaturedCategories.jsx';
import RecentJobs from '../components/RecentJobs.jsx';
import ForEmployers from '../components/ForEmployers.jsx';

const Home = () => {
  return (
    <main>
      <HeroSection />
      <FeaturedCategories />
      <RecentJobs />
      <ForEmployers />
    </main>
  );
};

export default Home;
