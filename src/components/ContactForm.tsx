import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Failed to send message. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
        <h3 className="font-display text-2xl mb-2">Message Sent</h3>
        <p className="text-muted-foreground">
          Thank you for reaching out. I'll get back to you soon.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm tracking-wide uppercase text-muted-foreground">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            required
            className="border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm tracking-wide uppercase text-muted-foreground">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm tracking-wide uppercase text-muted-foreground">
          Subject
        </Label>
        <Input
          id="subject"
          name="subject"
          required
          className="border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
          placeholder="How can I help?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm tracking-wide uppercase text-muted-foreground">
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          className="border-0 border-b border-border rounded-none bg-transparent px-0 resize-none focus-visible:ring-0 focus-visible:border-foreground transition-colors"
          placeholder="Tell me about your project..."
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="mt-8 px-8 py-6 text-sm tracking-widest uppercase"
      >
        {isLoading ? (
          'Sending...'
        ) : (
          <>
            Send Message
            <Send size={16} className="ml-3" />
          </>
        )}
      </Button>
    </form>
  );
}
