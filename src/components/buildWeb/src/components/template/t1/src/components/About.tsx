import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import about from "../public/images/About/About.jpg";

import { useEffect, useState, useRef } from "react";

export default function About() {
  const useScrollAnimation = () => {
    const [ref, setRef] = useState<Element | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );

      observer.observe(ref);
      return () => observer.unobserve(ref);
    }, [ref]);

    return [setRef, isVisible] as const;
  };
  const [aboutRef, aboutVisible] = useScrollAnimation();
  return (
    <section
      id='about'
      ref={aboutRef}
      className='py-20 bg-[#edf2ff] scroll-mt-20'
    >
      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={aboutVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Badge className='bg-[#ffeb3b] text-gray-900 mb-4'>
              About Company
            </Badge>
            <h2 className='text-3xl font-bold text-gray-900 mb-6'>
              About Company
            </h2>

            <div className='space-y-4 text-gray-700'>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <strong>Company:</strong> Innovative Labs
                </div>
                <div>
                  <strong>Industry:</strong> Technology & Innovation
                </div>
                <div>
                  <strong>Established:</strong> 2015
                </div>
                <div>
                  <strong>Headquarters:</strong> Silicon Valley
                </div>
              </div>

              <p className='text-gray-600 leading-relaxed'>
                Our company offers innovative solutions designed to meet your
                unique business needs. With a team of experts, we ensure
                quality, reliability, and on-time delivery in every project.
                From planning to execution, we provide end-to-end services that
                drive sustainable growth.
              </p>

              <div className='space-y-2'>
                <p>
                  <strong>Mission:</strong> To create cutting-edge solutions
                  that empower businesses through innovation and technology.
                </p>
                <p>
                  <strong>Vision:</strong> To be a global leader in driving
                  innovation that shapes a smarter, sustainable future.
                </p>
              </div>
            </div>

            <Button className='bg-[#ffeb3b] text-gray-900 hover:bg-[#ffeb3b]/90 rounded-full mt-6'>
              Learn More
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={aboutVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src={about}
              alt='About Company'
              className='rounded-2xl shadow-2xl w-full'
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
