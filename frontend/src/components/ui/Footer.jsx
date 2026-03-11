import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';

const Footer = ({ className = '' }) => {
  const navigate = useNavigate();

  const navigationLinks = [
    { name: 'Dashboard', path: '/pcos-care-dashboard' },
    { name: 'Clinics Near Me', path: '/clinics-near-me' },
    { name: 'About Us', path: '/about' },
    { name: 'Resources', path: '/resources' },
    { name: 'Research', path: '/research' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: 'Facebook', url: 'https://facebook.com' },
    { name: 'Instagram', icon: 'Instagram', url: 'https://instagram.com' },
    { name: 'Twitter', icon: 'Twitter', url: 'https://twitter.com' }
  ];

  return (
    <footer className={cn('bg-gradient-to-r from-coral-500 to-pink-500 border-t border-primary/20 mt-20', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-gray-800 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {navigationLinks?.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link?.path)}
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {link?.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-gray-800 mb-4">
              Contact Us
            </h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-2">
                <Icon name="MapPin" size={18} className="mt-1 flex-shrink-0" />
                <p className="text-sm">
                  123 Health Street<br />
                  Medical District<br />
                  City, State 12345
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Phone" size={18} className="flex-shrink-0" />
                <p className="text-sm">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Mail" size={18} className="flex-shrink-0" />
                <p className="text-sm">support@pcoscare.com</p>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg text-gray-800 mb-4">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {socialLinks?.map((social, index) => (
                <a
                  key={index}
                  href={social?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white hover:text-coral-500 text-gray-800 flex items-center justify-center transition-all hover:shadow-lg"
                  aria-label={social?.name}
                >
                  <Icon name={social?.icon} size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-sm text-gray-700">
            © {new Date()?.getFullYear()} PCOS Care. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;