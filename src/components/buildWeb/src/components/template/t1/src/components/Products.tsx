import { useState, useEffect } from "react";
import { motion, useMotionValue } from "motion/react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import Product1 from "../public/images/Product/Product1.jpg";
import Product2 from "../public/images/Product/Product2.jpg";
import Product3 from "../public/images/Product/Product3.jpg";
import Product4 from "../public/images/Product/Product1.jpg";
import Product5 from "../public/images/Product/Product2.jpg";
import Product6 from "../public/images/Product/Product3.jpg";
import Product7 from "../public/images/Product/Product3.jpg";

const allProducts = [
  {
    image: Product1,
    title: "Innovation Platform",
    description: "Comprehensive platform for managing workflows",
    category: "Platform",
  },
  {
    image: Product2,
    title: "Analytics Suite",
    description: "Advanced analytics tools for data-driven decisions",
    category: "Analytics",
  },
  {
    image: Product3,
    title: "Collaboration Hub",
    description: "Seamless collaboration tools for modern teams",
    category: "Collaboration",
  },
  {
    image: Product3,
    title: "Workflow Engine",
    description: "Automated workflow management",
    category: "Automation",
  },
  {
    image: Product4,
    title: "Innovation Platform",
    description: "Comprehensive platform for managing workflows",
    category: "Platform",
  },
  {
    image: Product5,
    title: "Analytics Suite",
    description: "Advanced analytics tools for data-driven decisions",
    category: "Analytics",
  },
  {
    image: Product6,
    title: "Collaboration Hub",
    description: "Seamless collaboration tools for modern teams",
    category: "Collaboration",
  },
  {
    image: Product7,
    title: "Workflow Engine",
    description: "Automated workflow management",
    category: "Automation",
  },
];

const categories = [
  "All",
  "Platform",
  "Analytics",
  "Collaboration",
  "Automation",
];

export default function Products() {
  const [selected, setSelected] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const filtered =
    selected === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === selected);

  const duplicated = showAll ? filtered : [...filtered, ...filtered];

  const x = useMotionValue(0); // horizontal position
  const speed = 0.5; // pixels per frame

  useEffect(() => {
    if (showAll) return; // stop animation if showing all in grid
    let animationFrame;

    const animate = () => {
      if (!isHovered) {
        x.set(x.get() - speed);
        // Reset to 0 if fully scrolled (duplicate loop)
        if (Math.abs(x.get()) >= (duplicated.length / 2) * 320) x.set(0);
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isHovered, x, duplicated.length, showAll]);

  return (
    <section id='product' className='py-20 bg-gray-50 scroll-mt-20'>
      <div className='max-w-7xl mx-auto px-6'>
        {/* Heading */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold text-gray-900'>Products</h2>
          <p className='text-gray-600'>
            Discover our suite of innovative products.
          </p>
          <div className='flex gap-4 justify-center mt-6 flex-wrap'>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setSelected(c);
                  setShowAll(false);
                }}
                className={`px-6 py-2 rounded-full ${
                  selected === c
                    ? "bg-[#ffeb3b]"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Products Display */}
        {!showAll ? (
          <div
            className='overflow-x-hidden'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div className='flex gap-6' style={{ x }}>
              {duplicated.map((p, i) => (
                <Card
                  key={i}
                  className='group flex-none w-80 overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl'
                >
                  <div className='relative'>
                    <img
                      src={p.image}
                      alt={p.title}
                      className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500'
                    />
                    <Badge className='absolute top-4 left-4 bg-[#ffeb3b] text-gray-900'>
                      {p.category}
                    </Badge>
                  </div>
                  <CardContent className='p-6 bg-white'>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                      {p.title}
                    </h3>
                    <p className='text-gray-600 mb-4'>{p.description}</p>
                    <button className='text-red-500 font-medium hover:text-red-600'>
                      Learn More →
                    </button>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className='grid md:grid-cols-3 lg:grid-cols-4 gap-8'>
            {filtered.map((p, i) => (
              <Card
                key={i}
                className='group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl'
              >
                <div className='relative'>
                  <img
                    src={p.image}
                    alt={p.title}
                    className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                  <Badge className='absolute top-4 left-4 bg-[#ffeb3b] text-gray-900'>
                    {p.category}
                  </Badge>
                </div>
                <CardContent className='p-6 bg-white'>
                  <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                    {p.title}
                  </h3>
                  <p className='text-gray-600 mb-4'>{p.description}</p>
                  <button className='text-red-500 font-medium hover:text-red-600'>
                    Learn More →
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!showAll && (
          <div className='text-center mt-8'>
            <button
              onClick={() => setShowAll(true)}
              className='px-6 py-2 bg-[#ffeb3b] rounded-full text-gray-900 font-medium hover:bg-yellow-400 transition'
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
