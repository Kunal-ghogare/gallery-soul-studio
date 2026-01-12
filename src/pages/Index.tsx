import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { HeroSlider } from '@/components/HeroSlider';
import { PhotoGrid } from '@/components/PhotoGrid';
import { Footer } from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSlider />

      {/* Featured Work Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Selected Works
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground">
              Portfolio
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <PhotoGrid showFilters={false} limit={6} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-3 text-sm tracking-widest uppercase text-foreground hover:text-primary transition-colors group"
            >
              View All Work
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-24 md:py-32 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
                The Artist
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
                Capturing Moments, Creating Art
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                With over a decade of experience in fine art photography, I specialize in 
                capturing the extraordinary within the ordinary. My work explores the 
                interplay of light, shadow, and human emotion across landscapes, 
                architecture, and intimate portraits.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-3 text-sm tracking-widest uppercase text-foreground hover:text-primary transition-colors group"
              >
                Learn More
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-muted overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop"
                  alt="Photographer portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 border border-primary/20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Let's Work Together
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-8">
              Have a Project in Mind?
            </h2>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-primary transition-colors"
            >
              Get in Touch
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
