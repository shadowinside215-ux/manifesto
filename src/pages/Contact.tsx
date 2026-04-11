import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-burgundy font-medium uppercase tracking-[0.3em] text-sm mb-4 block">
              Get in Touch
            </span>
            <h1 className="text-5xl md:text-6xl font-serif text-brand-brown mb-10">
              Let's Create Your <br /> <span className="italic">Dream Space</span>
            </h1>
            
            <div className="space-y-10 mb-12">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-brand-brown/5 flex items-center justify-center shrink-0">
                  <MapPin className="text-brand-burgundy" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-serif text-brand-brown mb-1">Our Studio</h4>
                  <p className="text-gray-600">N° 15 Rue Tlemcen Résidence Ghita, V.N, Meknès</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-brand-brown/5 flex items-center justify-center shrink-0">
                  <Phone className="text-brand-burgundy" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-serif text-brand-brown mb-1">Call Us</h4>
                  <p className="text-gray-600">06 79 90 07 99</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-brand-brown/5 flex items-center justify-center shrink-0">
                  <Mail className="text-brand-burgundy" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-serif text-brand-brown mb-1">Email Us</h4>
                  <p className="text-gray-600">contact@manifestointeriors.ma</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full aspect-video bg-gray-100 overflow-hidden border border-gray-200">
              <iframe
                title="Manifesto Interiors Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.968600125869!2d-5.5387!3d33.8935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDUzJzM2LjYiTiA1wrAzMicyNy4zIlc!5e0!3m2!1sen!2sma!4v1620000000000!5m2!1sen!2sma"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gray-50 p-10 md:p-16 border border-gray-100"
          >
            <h3 className="text-3xl font-serif text-brand-brown mb-8">Send a Message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-medium text-gray-500">Full Name</label>
                  <Input placeholder="John Doe" className="rounded-none border-gray-200 focus:border-brand-burgundy focus:ring-0 h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-medium text-gray-500">Email Address</label>
                  <Input type="email" placeholder="john@example.com" className="rounded-none border-gray-200 focus:border-brand-burgundy focus:ring-0 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-medium text-gray-500">Subject</label>
                <Input placeholder="Inquiry about residential design" className="rounded-none border-gray-200 focus:border-brand-burgundy focus:ring-0 h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-medium text-gray-500">Message</label>
                <Textarea placeholder="Tell us about your project..." className="rounded-none border-gray-200 focus:border-brand-burgundy focus:ring-0 min-h-[150px]" />
              </div>
              <Button className="bg-brand-burgundy hover:bg-brand-burgundy-dark text-white rounded-none w-full py-7 text-lg uppercase tracking-widest">
                Send Message <Send className="ml-2" size={18} />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
