import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

import photographer from '@/assets/about.jpeg';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Main Content */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 flex-1">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left: Bio */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-lg"
            >
              <h1 className="font-display text-3xl md:text-4xl text-foreground mb-8">
                Hi there!
              </h1>

              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  I've been part of the photography world for over 10 years, a journey that
                  began with pure curiosity and naturally evolved into a profession.
                </p>

                <p>
                  What truly excites me is capturing candid moments — the raw, unfiltered
                  expressions that tell real stories. Candid photography challenges you to
                  observe, anticipate, and react, and that challenge is what drives my creative passion.
                </p>

                <p>
                  Over the years, I've had the opportunity to cover a wide range of events,
                  each with its own unique energy. From weddings and club events to fashion shows,
                  art theatre, and classical dance performances — every frame adds to my story.
                </p>

                <p>
                  Based in <span className="text-foreground font-medium">Orlando</span>, Florida. Open to work.
                </p>
              </div>

              {/* Philosophy Quote */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-12 border-l-2 border-primary/50 pl-6"
              >
                <p className="font-display text-lg italic text-foreground/80">
                  "Every photograph is a story waiting to be told."
                </p>
              </motion.div>
            </motion.div>

            {/* Right: Photo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                <img
                  src={photographer}
                  alt="Photographer"
                  className="w-full max-w-xl grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
