import { motion } from "motion/react";
import { Paintbrush, Layout, Home, Building2, Sofa, Ruler } from "lucide-react";

const services = [
  {
    title: "Interior Design",
    desc: "Comprehensive design concepts tailored to your lifestyle and aesthetic preferences.",
    icon: Paintbrush,
  },
  {
    title: "Space Planning",
    desc: "Optimizing the flow and functionality of your environment for maximum comfort.",
    icon: Layout,
  },
  {
    title: "Home Renovation",
    desc: "Transforming existing spaces into modern masterpieces with high-end finishes.",
    icon: Home,
  },
  {
    title: "Commercial Design",
    desc: "Creating inspiring workspaces and retail environments that reflect your brand.",
    icon: Building2,
  },
  {
    title: "Custom Furniture",
    desc: "Bespoke furniture pieces designed and crafted to fit your space perfectly.",
    icon: Sofa,
  },
  {
    title: "Technical Consulting",
    desc: "Expert advice on materials, lighting, and architectural integration.",
    icon: Ruler,
  },
];

export default function Services() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-brand-burgundy font-medium uppercase tracking-[0.3em] text-sm mb-4 block">
            Our Expertise
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-brand-brown mb-6">
            Design Services
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We offer a full spectrum of interior architecture and design services, delivering excellence from initial concept to final installation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-12 bg-white border border-gray-100 hover:border-brand-brown transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-brand-brown/5 flex items-center justify-center mb-8 group-hover:bg-brand-burgundy transition-colors duration-500">
                <service.icon className="text-brand-brown group-hover:text-white transition-colors duration-500" size={32} />
              </div>
              <h3 className="text-2xl font-serif text-brand-brown mb-4 group-hover:text-brand-burgundy transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
