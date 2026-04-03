"use client";
import React from "react";
import { motion } from "motion/react";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: { text: string; image?: string; name: string; role: string; initials?: string; color?: string; companyLogo?: string }[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role, initials, color, companyLogo }, i) => (
                <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-lg shadow-zinc-200/50 max-w-sm w-full" key={i}>
                  <div className="text-[15px] font-medium text-zinc-700 leading-relaxed">&ldquo;{text}&rdquo;</div>
                  <div className="flex items-center gap-3 mt-6">
                    {image ? (
                      <img
                        width={40}
                        height={40}
                        src={image}
                        alt={name}
                        className="h-10 w-10 rounded-full object-cover border border-zinc-200 bg-zinc-100 shadow-sm"
                      />
                    ) : initials ? (
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ backgroundColor: color || "#3b82f6" }}
                      >
                        {initials}
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 text-sm font-bold shrink-0">
                        {name.split(" ").map(n => n[0]).join("")}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div className="font-bold tracking-tight text-[14px] leading-snug text-zinc-900">{name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="text-[12px] text-zinc-500 font-medium leading-snug">{role}</div>
                        {companyLogo && (
                            <>
                                <span className="text-zinc-300 text-xs">•</span>
                                <img src={companyLogo} alt="Company logo" className="h-3.5 object-contain opacity-75" />
                            </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
