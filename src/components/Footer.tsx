import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-brown text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="flex flex-col items-start">
            <span className="text-3xl font-serif font-bold tracking-tighter">
              MANIFESTO
            </span>
            <span className="text-xs uppercase tracking-[0.3em] font-medium -mt-1 opacity-80">
              Interiors
            </span>
          </Link>
          <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
            Premium interior architecture and design services based in Meknès, Morocco. We create spaces that inspire life.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-brand-burgundy transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-brand-burgundy transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-brand-burgundy transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-serif font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm text-gray-300">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Our Services</Link></li>
            <li><Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
            <li><Link to="/reviews" className="hover:text-white transition-colors">Client Reviews</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-lg font-serif font-semibold mb-6">Services</h4>
          <ul className="space-y-4 text-sm text-gray-300">
            <li>Interior Design</li>
            <li>Space Planning</li>
            <li>Home Renovation</li>
            <li>Commercial Design</li>
            <li>Custom Furniture</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-serif font-semibold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="text-brand-burgundy shrink-0" />
              <span>N° 15 Rue Tlemcen Résidence Ghita, V.N, Meknès</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={18} className="text-brand-burgundy shrink-0" />
              <span>06 79 90 07 99</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={18} className="text-brand-burgundy shrink-0" />
              <span>contact@manifestointeriors.ma</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:row items-center justify-between text-xs text-gray-400 space-y-4 md:space-y-0">
        <p>© {new Date().getFullYear()} Manifesto Interiors. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
