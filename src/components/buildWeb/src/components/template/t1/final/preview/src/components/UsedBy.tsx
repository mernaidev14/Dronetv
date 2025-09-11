import { motion } from "framer-motion";

export default function UsedBy({ usedByData }) {
  return (
    <section className='py-16 bg-white relative'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* Title Section */}
        <p className='text-center text-gray-400 text-lg mb-8'>
          {usedByData.title}
        </p>

        {/* Companies Section */}
        <div className='flex flex-wrap justify-around items-center gap-8'>
          {usedByData.companies.map((company, i) => (
            <motion.div
              key={company.id || i}
              className='flex-shrink-0'
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={company.image}
                alt={company.name}
                className='h-8 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300'
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}