"use client";

import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "Went from a 42 to a 91 ATS score. Got my first callback in 3 days after months of silence.",
    name: "Emma T.",
    role: "Product Manager",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
  },
  {
    text: "The AI rewrote my bullet points better than I could in an hour. Exported a clean PDF and applied the same day.",
    name: "James W.",
    role: "Senior Engineer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=face",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
  },
  {
    text: "I had no idea my formatting was breaking the ATS. Fixed the issues in one scan and got two interview calls that week.",
    name: "Sofia R.",
    role: "Sales Director",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=face",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
  },
  {
    text: "Imported my LinkedIn, got a polished CV in seconds. The shareable letter link impressed every recruiter I sent it to.",
    name: "David P.",
    role: "UX Designer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
  },
  {
    text: "After 3 months of rejections, I used the CAR method rewrite and got 4 interviews in two weeks.",
    name: "Sarah J.",
    role: "Marketing",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=face",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
  },
  {
    text: "The ATS Scanner showed me exactly why my PDF kept failing corporate portals. Fixed it and got a callback next day.",
    name: "Michael C.",
    role: "Data Scientist",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  },
  {
    text: "I send the shareable letter link in my LinkedIn outreach. It immediately separates me from other candidates.",
    name: "Aisha P.",
    role: "Business Dev",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=128&fit=crop&crop=face",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  },
  {
    text: "Cover letters used to take me hours. Now I generate a targeted one in literally seconds.",
    name: "Thomas W.",
    role: "Operations",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&h=128&fit=crop&crop=face",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    text: "Tried multiple resume builders. This one exports perfectly, no weird spacing, and the AI suggestions are actually useful.",
    name: "Elena R.",
    role: "Financial Analyst",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&fit=crop&crop=face",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
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
            Trusted by professionals who
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"> landed interviews.</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-500 font-medium">
            See what users say after their first ATS scan.
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
