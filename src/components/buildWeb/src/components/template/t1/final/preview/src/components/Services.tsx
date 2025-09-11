import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Services({serviceData}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  // Get categories from services
  const filteredServices =
    activeCategory === "All"
      ? serviceData.services
      : serviceData.services.filter((s) => s.category === activeCategory);

  const visibleServices = filteredServices.slice(0, visibleCount);

  const openModal = (index: number) => {
    setSelectedServiceIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedServiceIndex(null);
  };

  return (
    <motion.section id="services" className="py-20 bg-blue-100 theme-transition relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">{serviceData.heading.head}</h2>
          <p className="text-muted-foreground">{serviceData.heading.desc}</p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {serviceData.categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(6); // reset load more
                }}
                className={
                  activeCategory === cat
                    ? "bg-primary cursor-pointer text-white"
                    : "bg-card text-card-foreground cursor-pointer"
                }
              >
                {cat}
              </Button>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleServices.map((service, index) => (
            <Card key={index} className="relative">
              <div className="h-40 overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
                <p className="text-xs mt-1 italic text-gray-500">
                  Category: {service.category}
                </p>

                <div className="mt-4 flex gap-2">
                  <Button className="cursor-pointer hover:scale-105" size="sm" onClick={() => openModal(index)}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More & Show Less */}
        <div className="flex justify-center mt-6">
          {visibleCount < filteredServices.length && (
            <Button onClick={() => setVisibleCount((prev) => prev + 6)}>
              Load More
            </Button>
          )}
          {visibleCount >= filteredServices.length && filteredServices.length > 3 && (
            <Button
              onClick={() => setVisibleCount(3)}
              variant="secondary"
              className="ml-4"
            >
              Show Less
            </Button>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedServiceIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <div
              className="bg-card rounded-xl w-full max-w-3xl p-6 relative top-11 h-[42rem]  z-100 overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-gray-500 rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold mb-4">{serviceData.services[selectedServiceIndex].title}</h2>
              <p className="text-muted-foreground mb-4">
                {serviceData.services[selectedServiceIndex].detailedDescription}
              </p>

              {/* Benefits */}
              <h3 className="font-semibold mb-2">Key Benefits</h3>
              <ul className="space-y-2 mb-4">
                {serviceData.services[selectedServiceIndex].benefits.map((b: string, bi: number) => (
                  <li key={bi} className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Process */}
              <h3 className="font-semibold mb-2">Our Process</h3>
              <ol className="space-y-2 mb-4">
                {serviceData.services[selectedServiceIndex].process.map((p: string, pi: number) => (
                  <li key={pi} className="flex gap-2">
                    <span className="font-semibold">{pi + 1}.</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>

              {/* Pricing & Timeline */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Pricing</h3>
                  <p>{serviceData.services[selectedServiceIndex].pricing}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Timeline</h3>
                  <p>{serviceData.services[selectedServiceIndex].timeline}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}