import { Link } from "react-router-dom";
import { Linkedin, Mail, Phone, MapPin, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export default function Footer() {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="bg-brand-brown text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-start">
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
            {t.footer.brandDesc}
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-brand-burgundy transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-serif font-semibold mb-6">{t.footer.quickLinks}</h4>
          <ul className="space-y-4 text-sm text-gray-300">
            <li><Link to="/about" className="hover:text-white transition-colors">{t.nav.about}</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">{t.nav.services}</Link></li>
            <li><Link to="/portfolio" className="hover:text-white transition-colors">{t.nav.portfolio}</Link></li>
            <li><Link to="/reviews" className="hover:text-white transition-colors">{t.nav.reviews}</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">{t.nav.contact}</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-lg font-serif font-semibold mb-6">{t.footer.services}</h4>
          <ul className="space-y-4 text-sm text-gray-300">
            <li>{t.services.s1.title}</li>
            <li>{t.services.s2.title}</li>
            <li>{t.services.s3.title}</li>
            <li>{t.services.s4.title}</li>
            <li>{t.services.s5.title}</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-serif font-semibold mb-6">{t.footer.contactUs}</h4>
          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-brand-burgundy shrink-0" />
              <a 
                href="https://www.google.com/maps/search/?api=1&query=N°+15+Rue+Tlemcen+Résidence+Ghita.+V.N,+Meknès+50000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                N° 15 Rue Tlemcen Résidence Ghita. V.N, Meknès 50000
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-brand-burgundy shrink-0" />
              <a 
                href="https://wa.me/212679989008" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                +212 679-989008
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-brand-burgundy shrink-0" />
              <a href="mailto:contact@manifestointeriors.ma" className="hover:text-white transition-colors">
                contact@manifestointeriors.ma
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={cn(
        "max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 space-y-4 md:space-y-0",
        isRTL && "flex-row-reverse"
      )}>
        <p>© {new Date().getFullYear()} Manifesto Interiors. {t.footer.rights}</p>
        <div className={cn("flex items-center gap-6", isRTL && "flex-row-reverse")}>
          <a href="#" className="hover:text-white">{t.footer.privacy}</a>
          <a href="#" className="hover:text-white">{t.footer.terms}</a>
          <Link to="/admin" className="hover:text-white flex items-center gap-1">
            <Lock size={10} /> {t.footer.admin}
          </Link>
        </div>
      </div>
    </footer>
  );
}
