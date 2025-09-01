import { motion } from "motion/react";
import BusinessInsider from "../public/images/logos/BusinessInsider.png";
import Forbes from "../public/images/logos/Forbes.png";
import TechCrunch from "../public/images/logos/TechCrunch.png";
import TheNewYorkTimes from "../public/images/logos/TheNewYorkTimes.png";
import USAToday from "../public/images/logos/USAToday.png";

const companies = [
  { image: BusinessInsider, name: "Business Insider" },
  { image: Forbes, name: "Forbes" },
  { image: TechCrunch, name: "TechCrunch" },
  { image: TheNewYorkTimes, name: "NY Times" },
  { image: USAToday, name: "USA Today" },
];

export default function UsedBy() {
  return (
    <section className='py-16 bg-white'>
      <div className='max-w-7xl mx-auto px-4'>
        <p className='text-center text-gray-400 text-lg mb-8'>USED BY</p>
        <div className='flex flex-wrap justify-around items-center gap-8'>
          {companies.map((c, i) => (
            <motion.div key={i} className='flex-shrink-0  '>
              <img
                src={c.image}
                alt={c.name}
                className='h-8 opacity-60 hover:opacity-100 grayscale hover:grayscale-0'
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
