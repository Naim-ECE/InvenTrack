import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: 10000, suffix: '+', label: 'Products Available' },
  { value: 1500, suffix: '+', label: 'Verified Vendors' },
  { value: 50000, suffix: '+', label: 'Orders Delivered' },
  { value: 99.9, suffix: '%', label: 'Inventory Accuracy', isDecimal: true },
];

function AnimatedCounter({ value, suffix, isDecimal }: { value: number; suffix: string; isDecimal?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1500;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated, isDecimal]);

  return (
    <span ref={ref}>
      {isDecimal ? count.toFixed(1) : count.toLocaleString()}{suffix}
    </span>
  );
}

export default function TrustStatistics() {
  return (
    <section className="bg-[#0B1220] py-20 lg:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`text-center ${i < stats.length - 1 ? 'lg:border-r lg:border-[#1F2937]' : ''}`}
            >
              <p className="text-3xl lg:text-4xl font-bold text-[#F9FAFB] font-[Montserrat] mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} isDecimal={stat.isDecimal} />
              </p>
              <p className="text-sm text-[#9CA3AF]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
