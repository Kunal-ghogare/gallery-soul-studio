import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { PhotoGrid } from '@/components/PhotoGrid';
import { Footer } from '@/components/Footer';

const Portfolio = () => {
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
              Complete Collection
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground">
              Portfolio
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <PhotoGrid showFilters={true} />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;
