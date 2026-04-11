import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const projects = [
  {
    title: "Modern Villa",
    location: "Meknès",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Luxury Penthouse",
    location: "Casablanca",
    image: "https://images.unsplash.com/photo-1600607687940-477a63bd39d8?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Minimalist Office",
    location: "Rabat",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
  },
];

const testimonials = [
  {
    name: "Sarah L.",
    text: "Kind, patient, and very professional. They truly understood my vision.",
  },
  {
    name: "Ahmed K.",
    text: "Transformed our space into something inspiring. The attention to detail is unmatched.",
  },
  {
    name: "Yasmine M.",
    text: "Exceeded expectations with creativity and high-end finishes.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920"
            alt="Luxury Interior"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight"
          >
            Designing Spaces That <br /> <span className="italic">Inspire Life</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-gray-200 mb-10 font-light tracking-wide"
          >
            Premium interior architecture and design services in Morocco
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button asChild className="bg-brand-burgundy hover:bg-brand-burgundy-dark text-white rounded-none px-10 py-7 text-lg uppercase tracking-widest">
              <Link to="/contact">Book a Consultation</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white opacity-50"
        >
          <div className="w-px h-12 bg-white mx-auto" />
        </motion.div>
      </section>

      {/* About Preview */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-burgundy font-medium uppercase tracking-[0.3em] text-sm mb-4 block">
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-brown mb-8 leading-tight">
              Elegance in Every Detail, <br /> Crafted for You.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              Based in the heart of Meknès, Manifesto Interiors is more than just an interior architecture firm. We are creators of atmospheres, blending Moroccan heritage with contemporary luxury.
            </p>
            <p className="text-gray-600 leading-relaxed mb-10">
              Our philosophy revolves around creativity, professionalism, and an unwavering attention to detail. We believe that a well-designed space has the power to transform your daily life.
            </p>
            <Button asChild variant="outline" className="border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white rounded-none px-8 py-6">
              <Link to="/about" className="flex items-center">
                Learn More <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1616486341351-7925b15894ca?auto=format&fit=crop&q=80&w=800"
                alt="Interior Design"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-brand-brown p-10 hidden md:block">
              <p className="text-white text-4xl font-serif mb-2">10+</p>
              <p className="text-gray-300 text-xs uppercase tracking-widest">Years of Excellence</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-brand-burgundy font-medium uppercase tracking-[0.3em] text-sm mb-4 block">
                Portfolio
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-brown">
                Featured Masterpieces
              </h2>
            </div>
            <Button asChild variant="link" className="text-brand-brown hover:text-brand-burgundy p-0 h-auto text-lg">
              <Link to="/portfolio" className="flex items-center">
                View All Projects <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-6">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-burgundy/0 group-hover:bg-brand-burgundy/20 transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-serif text-brand-brown mb-1 group-hover:text-brand-burgundy transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-sm uppercase tracking-widest">
                  {project.location}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-brand-brown text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
          <Quote size={400} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="text-brand-burgundy fill-brand-burgundy mx-0.5" />
              ))}
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-4">What Our Clients Say</h2>
            <p className="text-gray-400 uppercase tracking-widest text-sm">5.0 Rating Based on Excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm p-10 border border-white/10"
              >
                <Quote className="text-brand-burgundy mb-6" size={32} />
                <p className="text-lg italic text-gray-200 mb-8 leading-relaxed">
                  "{t.text}"
                </p>
                <div className="h-px w-12 bg-brand-burgundy mb-4" />
                <p className="font-medium uppercase tracking-widest text-sm">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gray-50 p-16 md:p-24 border border-gray-100"
          >
            <h2 className="text-4xl md:text-6xl font-serif text-brand-brown mb-8 leading-tight">
              Ready to Transform <br /> Your Space?
            </h2>
            <p className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
              Let's collaborate to create an environment that reflects your personality and elevates your lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button asChild className="bg-brand-burgundy hover:bg-brand-burgundy-dark text-white rounded-none px-10 py-7 text-lg uppercase tracking-widest w-full sm:w-auto">
                <Link to="/contact">Book a Consultation</Link>
              </Button>
              <Button asChild variant="outline" className="border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white rounded-none px-10 py-7 text-lg uppercase tracking-widest w-full sm:w-auto">
                <Link to="/portfolio">View Portfolio</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
