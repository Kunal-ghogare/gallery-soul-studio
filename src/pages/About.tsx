import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Camera, Award, Users } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Camera, value: '500+', label: 'Projects Completed' },
    { icon: Award, value: '15+', label: 'Awards Won' },
    { icon: Users, value: '200+', label: 'Happy Clients' },
  ];

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
              The Story
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground">
              About Me
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[3/4] bg-muted overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop"
                  alt="Photographer at work"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-primary/20" />
              <div className="absolute -top-6 -left-6 w-24 h-24 border border-primary/20" />
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                  Hello, I'm Alex Morgan
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For over 15 years, I've been dedicated to the art of photography. 
                  What started as a childhood fascination with my grandfather's vintage 
                  Leica has evolved into a lifelong passion for visual storytelling.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  My work spans across fine art landscapes, architectural studies, and 
                  intimate portraits. I believe that every moment holds the potential 
                  for extraordinary beauty—it simply takes patience and the right 
                  perspective to capture it.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Based in New York City, I travel extensively for personal projects and 
                  commissions. My photographs have been featured in galleries worldwide 
                  and published in leading photography magazines.
                </p>
              </div>

              {/* Philosophy */}
              <div className="border-l-2 border-primary pl-6">
                <p className="font-display text-xl italic text-foreground">
                  "Photography is not about the camera. It's about seeing the world 
                  with intention and capturing the poetry of light."
                </p>
              </div>

              {/* Equipment */}
              <div>
                <h3 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
                  Equipment
                </h3>
                <p className="text-foreground">
                  Sony α7R V • Leica M11 • Phase One IQ4 150MP
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-3 gap-12 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                <p className="font-display text-5xl text-foreground mb-2">{stat.value}</p>
                <p className="text-sm tracking-widest uppercase text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services */}
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
              What I Do
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              Services
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Fine Art Prints',
                description: 'Museum-quality prints for collectors and galleries, using archival papers and inks.',
              },
              {
                title: 'Commercial',
                description: 'Brand campaigns, editorial work, and architectural photography for businesses.',
              },
              {
                title: 'Workshops',
                description: 'Intimate photography workshops focusing on composition, light, and artistic vision.',
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 bg-card border border-border"
              >
                <h3 className="font-display text-2xl text-foreground mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
