"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { EASE } from "@/lib/motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [step, setStep] = useState<"button" | "form" | "success">("button");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    // Simulate network submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setStep("success");
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", message: "" });
    setStep("button");
  };

  return (
    <section id="contact" className="pt-32 pb-10 relative bg-bg" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Massive Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center w-full"
        >
          <h2 className="text-6xl md:text-[8rem] leading-[0.85] font-black tracking-tighter text-text">
            INTERESTED IN<br/>WORKING <span className="text-accent">TOGETHER?</span>
          </h2>
        </motion.div>

        {/* Dynamic Interactive States */}
        <div className="w-full flex justify-center mt-12 min-h-[300px]">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Initial CTA Button */}
            {step === "button" && (
              <motion.div
                key="cta-button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex flex-col items-center"
              >
                <button 
                  onClick={() => setStep("form")}
                  className="px-8 py-4 rounded-full bg-text hover:bg-accent text-bg hover:text-white font-bold flex items-center gap-3 transition-all shadow-md group cursor-pointer"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-accent group-hover:bg-white transition-colors" />
                  Get in Touch
                </button>
              </motion.div>
            )}

            {/* Step 2: Details Input Form */}
            {step === "form" && (
              <motion.form
                key="contact-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="w-full max-w-[500px] bg-card border border-border/60 rounded-[32px] p-8 shadow-xl backdrop-blur-md flex flex-col gap-5"
              >
                <div>
                  <label htmlFor="form-name" className="text-[10px] font-extrabold text-secondary uppercase tracking-widest mb-2 block">
                    Your Name
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                    className="w-full bg-black/30 border border-border focus:border-accent text-text text-sm rounded-2xl px-5 py-3.5 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="form-email" className="text-[10px] font-extrabold text-secondary uppercase tracking-widest mb-2 block">
                    Your Email
                  </label>
                  <input
                    id="form-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    className="w-full bg-black/30 border border-border focus:border-accent text-text text-sm rounded-2xl px-5 py-3.5 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="form-message" className="text-[10px] font-extrabold text-secondary uppercase tracking-widest mb-2 block">
                    Message Details
                  </label>
                  <textarea
                    id="form-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell me about your project or inquiry..."
                    className="w-full bg-black/30 border border-border focus:border-accent text-text text-sm rounded-2xl px-5 py-3.5 focus:outline-none transition-colors h-32 resize-none"
                  />
                </div>

                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setStep("button")}
                    className="px-6 py-3.5 rounded-full border border-border text-text font-bold hover:bg-border/25 transition-all cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 rounded-full bg-text hover:bg-accent text-bg hover:text-white font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60 text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-bg border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 3: Success Animation View */}
            {step === "success" && (
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="w-full max-w-[450px] bg-card border border-border/60 rounded-[32px] p-8 text-center flex flex-col items-center justify-center shadow-xl backdrop-blur-md"
              >
                {/* Lottie Cat Success Animation */}
                <div className="w-32 h-32 pointer-events-none mb-4">
                  <DotLottieReact
                    src="https://lottie.host/59886aa3-c5f5-4fd2-806a-e69e8305f2bc/aPUYMe9DrL.lottie"
                    loop
                    autoplay
                  />
                </div>

                <h3 className="text-2xl font-black text-text uppercase tracking-tight">
                  Message Sent!
                </h3>
                
                <p className="text-secondary text-sm font-medium mt-3 max-w-[320px] leading-relaxed">
                  Thank you for reaching out, {formData.name}. Inderash will get back to you as soon as possible!
                </p>

                <button
                  onClick={handleReset}
                  className="mt-6 px-6 py-2.5 rounded-full border border-border hover:border-accent hover:text-accent font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Send another message
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Brand & Email info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          className="mt-20 flex flex-col items-center gap-6"
        >
          <div className="font-black text-4xl tracking-tight flex items-center text-text">
            Inderash<span className="text-accent text-5xl leading-none -ml-1 relative -top-1">.</span>
          </div>
          
          <a href="mailto:inderash18@gmail.com" className="flex items-center gap-2 text-text font-bold hover:text-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            inderash18@gmail.com
          </a>
        </motion.div>

        {/* Bottom Line & Footer links */}
        <div className="w-full mt-24 relative">
          <div className="w-full h-px bg-border" />
          
          {/* Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center py-6 gap-4">
            <p className="text-secondary text-sm font-medium">
              © Inderash. All rights reserved.
            </p>
            
            <div className="flex gap-6 text-sm font-semibold text-text">
              <a href="https://github.com/inderash18" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
              <a href="https://www.reddit.com/user/Conscious-Cake157/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Reddit</a>
              <a href="mailto:inderash18@gmail.com" className="hover:text-accent transition-colors">Email</a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
