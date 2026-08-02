import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import portfolioService from '../services/portfolioService';

const PublicLayout = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await portfolioService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load developer profile details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={profile} />
      
      {/* Main Content Area */}
      <main className="flex-grow pt-16">
        {loading ? (
          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <Outlet context={{ profile }} />
        )}
      </main>

      <Footer profile={profile} />
    </div>
  );
};

export default PublicLayout;
