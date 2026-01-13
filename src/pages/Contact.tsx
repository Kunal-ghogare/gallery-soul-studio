import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';
import { Mail, MapPin, Instagram } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Get in Touch
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground">
              Contact
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24 md:pb-32 flex-1">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8">
                Let's Create Something Beautiful Together
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-12">
                Whether you're looking for fine art prints, commercial photography, 
                or a collaborative project, I'd love to hear from you. Send me a 
                message and I'll get back to you within 24 hours.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary rounded-sm">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm tracking-widest uppercase text-muted-foreground mb-1">
                      Email
                    </p>
                    <a 
                      href="mailto:kungho09@gmail.com" 
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      kungho09@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary rounded-sm">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm tracking-widest uppercase text-muted-foreground mb-1">
                      Location
                    </p>
                    <p className="text-foreground">
                      Orlando, Florida, USA
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary rounded-sm">
                    <Instagram className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm tracking-widest uppercase text-muted-foreground mb-1">
                      Social
                    </p>
                    <a 
                      href="https://instagram.com/kunal_ghogare" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      @kunal_ghogare
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
