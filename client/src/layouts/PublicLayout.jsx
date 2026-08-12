import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import portfolioService from '../services/portfolioService';

const PublicLayout = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let isActive = true;

    const fetchProfile = async () => {
      try {
        const data = await portfolioService.getProfile();
        if (isActive) {
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to load developer profile details:", err);
      }
    };

    fetchProfile();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={profile} />
      
      {/* Main Content Area */}
      <main className="flex-grow pt-16">
        <Outlet context={{ profile }} />
      </main>

      <Footer profile={profile} />
    </div>
  );
};

export default PublicLayout;
