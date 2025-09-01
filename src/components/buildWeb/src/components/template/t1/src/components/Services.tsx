import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import Service1 from "../public/images/ServicesImg/Service1.jpg";
import Service2 from "../public/images/ServicesImg/Service3.jpg";

const allServices = [
  {
    image: Service1,
    title: "Digital Innovation",
    description: "Transform your business with cutting-edge solutions.",
    category: "Innovation",
  },
  {
    image: Service2,
    title: "Strategic Consulting",
    description: "Expert guidance to unlock new opportunities.",
    category: "Consulting",
  },
  {
    image: Service1,
    title: "Technology Solutions",
    description: "Custom tech implementations to enhance productivity.",
    category: "Technology",
  },
  {
    image: Service2,
    title: "Business Strategy",
    description: "Comprehensive planning for growth and positioning.",
    category: "Strategy",
  },
  {
    image: Service1,
    title: "Extra Service 1",
    description: "Additional service.",
    category: "Extra",
  },
  {
    image: Service2,
    title: "Extra Service 2",
    description: "Another extra service.",
    category: "Extra",
  },
];

const serviceCategories = [
  "All",
  "Consulting",
  "Technology",
  "Innovation",
  "Strategy",
  "Extra",
];

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const filteredServices =
    selectedCategory === "All"
      ? allServices
      : allServices.filter((s) => s.category === selectedCategory);

  // Show first 4 services initially
  const displayedServices = showAll
    ? filteredServices
    : filteredServices.slice(0, 4);

  return (
    <section id='services' className='py-20 bg-white scroll-mt-20'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>Services</h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            We provide comprehensive services to help your business thrive.
          </p>
          <div className='flex flex-wrap justify-center gap-4 mt-6'>
            {serviceCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowAll(false);
                }}
                className={`px-6 py-2 rounded-full ${
                  selectedCategory === cat
                    ? "bg-[#ffeb3b] text-gray-900"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className='grid md:grid-cols-4 gap-8'>
          {displayedServices.map((service, i) => (
            <Card key={i} className='shadow-lg hover:shadow-2xl transition'>
              <div className='relative'>
                <img src={service.image} className='w-full h-48 object-cover' />
                <Badge className='absolute top-4 left-4 bg-[#ffeb3b] text-gray-900'>
                  {service.category}
                </Badge>
              </div>
              <CardContent className='p-6'>
                <h3 className='text-xl font-semibold'>{service.title}</h3>
                <p className='text-gray-600'>{service.description}</p>
                <Button variant='ghost' className='text-red-500'>
                  Learn More →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {!showAll && filteredServices.length > 4 && (
          <div className='text-center mt-8'>
            <Button onClick={() => setShowAll(true)} className='px-6 py-2'>
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
