import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/lib/translations";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();
  const { t, language, setLanguage, isRTL } = useLanguage();

  const navLinks = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.about, href: "/about" },
    { name: t.nav.services, href: "/services" },
    { name: t.nav.portfolio, href: "/portfolio" },
    { name: t.nav.reviews, href: "/reviews" },
    { name: t.nav.contact, href: "/contact" },
    { name: t.nav.admin, href: "/admin" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsLangOpen(false);
  }, [location]);

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "ar", label: "العربية" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex flex-col items-start">
          <span className={cn(
            "text-2xl font-serif font-bold tracking-tighter transition-colors",
            isScrolled ? "text-brand-brown" : "text-brand-brown"
          )}>
            MANIFESTO
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium -mt-1 opacity-80">
            Interiors
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-medium uppercase tracking-widest hover:text-brand-burgundy transition-colors relative group",
                location.pathname === link.href ? "text-brand-burgundy" : "text-brand-brown"
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-burgundy transition-all duration-300 group-hover:w-full",
                location.pathname === link.href ? "w-full" : ""
              )} />
            </Link>
          ))}

          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-brand-brown hover:text-brand-burgundy transition-colors"
            >
              <Globe size={16} />
              {language}
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 bg-white shadow-xl border border-gray-100 py-2 min-w-[120px]"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                        language === lang.code ? "text-brand-burgundy font-bold" : "text-brand-brown"
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button asChild className="bg-brand-burgundy hover:bg-brand-burgundy-dark text-white rounded-none px-6">
            <Link to="/contact">{t.nav.book}</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-brand-brown"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-lg font-medium uppercase tracking-widest",
                    location.pathname === link.href ? "text-brand-burgundy" : "text-brand-brown"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="flex gap-4 py-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                      "text-sm font-bold uppercase tracking-widest",
                      language === lang.code ? "text-brand-burgundy" : "text-gray-400"
                    )}
                  >
                    {lang.code}
                  </button>
                ))}
              </div>

              <Button asChild className="bg-brand-burgundy hover:bg-brand-burgundy-dark text-white rounded-none w-full py-6">
                <Link to="/contact">{t.nav.book}</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
