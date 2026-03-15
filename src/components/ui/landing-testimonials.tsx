"use client";

import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "CV Optimizer AI transformed my job search. The AI-tailored suggestions for my professional summary were spot on, and I landed an interview at a top tech firm within a week!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    name: "Emma Thompson",
    role: "Product Manager",
  },
  {
    text: "I was skeptical about AI writers, but the quality of the bullet points generated for my roles was top-tier. It's like having a career coach in your pocket.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "James Wilson",
    role: "Senior Engineer",
  },
  {
    text: "Finally, a tool that understands the nuances of different industries. The executive template helped me highlight my leadership experience effectively. Highly recommended!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    name: "Sofia Rodriguez",
    role: "Sales Director",
  },
  {
    text: "The precision and speed are unmatched. Integrating my LinkedIn profile was seamless, and the resulting CV looks more professional than anything I could have designed myself.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "David Park",
    role: "UX Designer",
  },
  {
    text: "After 3 months of rejection emails, I used CV Optimizer AI to rewrite my bullets using the CAR method. I got 4 interviews in the next two weeks.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Sarah Jenkins",
    role: "Marketing Specialist",
  },
  {
    text: "The ATS Scanner is brilliant. It showed me exactly why my beautifully designed PDF was failing in the corporate portal. Fixed the issues and got a callback the next day.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    name: "Michael Chen",
    role: "Data Scientist",
  },
  {
    text: "I love the Copy Link feature! I send the shareable letter link directly in my LinkedIn outreach notes and it immediately separates me from other applicants.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
    name: "Aisha Patel",
    role: "Business Developer",
  },
  {
    text: "Writing cover letters used to take me hours. Now I generate a personalized Presentation Letter targeted to the company in literally seconds.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    name: "Thomas Wright",
    role: "Operations Manager",
  },
  {
    text: "I've tried multiple resume builders, but the formatting here is pristine. No weird spacing issues, it exports perfectly, and the AI suggestions are actually helpful.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    name: "Elena Rostova",
    role: "Financial Analyst",
  },
];


const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);


export const LandingTestimonials = () => {
  return (
    <section className="w-full relative overflow-hidden py-24 md:py-32 bg-[#fafafa]">
      
      {/* Top Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-zinc-200" />

      <div className="container z-10 mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[600px] mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 text-blue-600 rounded-full text-[12px] font-black tracking-widest uppercase mb-6">
            <span className="text-yellow-500">✦</span>
            What our users say
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-zinc-900 mb-6 leading-tight">
            See it to believe it.
          </h2>
          <p className="text-lg md:text-xl text-zinc-500 font-medium">
            Join thousands of professionals who are already landing interviews at top companies with CV Optimizer AI.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={35} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={45} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={40} />
        </div>
      </div>
    </section>
  );
};
