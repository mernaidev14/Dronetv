import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import Cust1 from "../public/images/customers/customer-1.jpg";
import Cust2 from "../public/images/customers/customer-3.jpg";
import Cust3 from "../public/images/customers/customer-4.jpg";
import Cust4 from "../public/images/customers/customer-5.jpg";

const testimonials = [
  {
    id: 1,
    company: "BrightWave",
    testimonial: "Working with them was a game-changer.",
    author: "Aarav Mehta",
    position: "CEO",
    logo: Cust4,
  },
  {
    id: 2,
    company: "TechForward",
    testimonial: "They helped us 3x growth in 18 months.",
    author: "Sarah Chen",
    position: "CTO",
    logo: Cust2,
  },
  {
    id: 3,
    company: "InnovateLab",
    testimonial: "Their expertise transformed our entire business strategy.",
    author: "Michael Rodriguez",
    position: "Founder",
    logo: Cust3,
  },
  {
    id: 4,
    company: "CloudSync",
    testimonial: "The results exceeded all our expectations.",
    author: "Emily Watson",
    position: "COO",
    logo: Cust1,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((c) => (c + 1) % testimonials.length),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <section id='testimonials' className=' bg-gray-50 py-16 scroll-mt-20'>
      <div className='max-w-4xl mx-auto px-6'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>
            What Our Clients Say
          </h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Don't just take our word for it. Here's what our clients have to say
            about working with us.
          </p>
        </div>

        <div className='relative overflow-hidden'>
          <div
            className='flex transition-transform duration-500 ease-in-out'
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className='w-full flex-shrink-0'>
                <Card className='mx-4 bg-white shadow-lg border-0'>
                  <CardContent className='p-8 text-center'>
                    <div className='mb-6'>
                      <div className='w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <img
                          src={testimonial.logo} // 👈 make sure your testimonial object has this field
                          alt={testimonial.company}
                          className='w-full h-full object-cover rounded-full'
                        />
                      </div>
                      <h3 className='font-semibold text-xl text-gray-900 mb-2'>
                        {testimonial.company}
                      </h3>
                    </div>

                    <blockquote className='text-lg text-gray-700 mb-6 italic'>
                      "{testimonial.testimonial}"
                    </blockquote>

                    <div className='border-t pt-6'>
                      <p className='font-medium text-gray-900'>
                        {testimonial.author}
                      </p>
                      <p className='text-gray-600 text-sm'>
                        {testimonial.position}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className='flex justify-center mt-8 space-x-2'>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === current
                  ? "bg-[#ffeb3b]"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
