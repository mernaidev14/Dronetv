import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { Button } from "./ui/button";

export default function Clients({ clientData }) {
  const [isEditing, setIsEditing] = useState(false);

  // Merged all state into a single object
  const [clientsSection, setClientsSection] = useState(clientData);

  // Handlers for clients
  const updateClient = (idx, field, value) => {
    setClientsSection((prev) => ({
      ...prev,
      clients: prev.clients.map((c, i) =>
        i === idx ? { ...c, [field]: value } : c
      ),
    }));
  };

  const removeClient = (idx) => {
    setClientsSection((prev) => ({
      ...prev,
      clients: prev.clients.filter((_, i) => i !== idx),
    }));
  };

  const addClient = () => {
    setClientsSection((prev) => ({
      ...prev,
      clients: [...prev.clients, { name: "New Client", image: "" }],
    }));
  };

  // Handlers for stats
  const updateStat = (idx, field, value) => {
    setClientsSection((prev) => ({
      ...prev,
      stats: prev.stats.map((s, i) =>
        i === idx ? { ...s, [field]: value } : s
      ),
    }));
  };

  const removeStat = (idx) => {
    setClientsSection((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== idx),
    }));
  };

  const addStat = () => {
    setClientsSection((prev) => ({
      ...prev,
      stats: [...prev.stats, { value: "New", label: "New Stat" }],
    }));
  };

  // Duplicate clients for marquee loop
  const duplicatedClients = [
    ...clientsSection.clients,
    ...clientsSection.clients,
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const logoVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      className='py-20 bg-background theme-transition'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className='max-w-6xl mx-auto px-6'>
        {/* Edit/Save Buttons */}
        <div className='flex justify-end mt-6'>
          {isEditing ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -1, scaleX: 1.1 }}
              onClick={() => setIsEditing(false)}
              className='bg-green-600 cursor-pointer hover:font-semibold hover:shadow-2xl shadow-xl text-white px-4 py-2 rounded'
            >
              Save
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -1, scaleX: 1.1 }}
              onClick={() => setIsEditing(true)}
              className='bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer  hover:shadow-2xl shadow-xl hover:font-semibold'
            >
              Edit
            </motion.button>
          )}
        </div>

        {/* Section Header */}
        <motion.div
          className='text-center mb-16'
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {isEditing ? (
            <>
              <input
                value={clientsSection.headline.title}
                onChange={(e) =>
                  setClientsSection((prev) => ({
                    ...prev,
                    headline: { ...prev.headline, title: e.target.value },
                  }))
                }
                className='text-3xl md:text-4xl font-bold text-foreground mb-4 w-full text-center border-b bg-transparent'
              />
              <textarea
                value={clientsSection.headline.description}
                onChange={(e) =>
                  setClientsSection((prev) => ({
                    ...prev,
                    headline: { ...prev.headline, description: e.target.value },
                  }))
                }
                className='text-lg text-muted-foreground w-full text-center border-b bg-transparent'
                rows={2}
              />
            </>
          ) : (
            <>
              <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
                {clientsSection.headline.title}
              </h2>
              <p className='text-muted-foreground text-lg'>
                {clientsSection.headline.description}
              </p>
            </>
          )}
        </motion.div>

        {/* Marquee Container */}
        <div className='group w-full overflow-hidden'>
          <style>
            {`
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                animation: marquee 40s linear infinite;
              }
              .group:hover .animate-marquee {
                animation-play-state: paused;
              }
            `}
          </style>
          {isEditing && (
            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className='flex items-center justify-center w-32'
            >
              <Button
                onClick={addClient}
                className='cursor-pointer text-green-600'
              >
                + Add Client
              </Button>
            </motion.div>
          )}
          <motion.div
            className='flex gap-10 items-start text-center animate-marquee'
            variants={containerVariants}
            whileInView={{ opacity: [0, 1], y: [-50, 0] }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            {duplicatedClients.map((client, index) => (
              <motion.div
                key={index}
                className='flex flex-col items-center flex-shrink-0 w-32 cursor-pointer'
                variants={logoVariants}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className='w-20 h-20 rounded-full overflow-hidden shadow-md border border-border'
                  whileHover={{
                    borderColor: "var(--color-primary)",
                    boxShadow: "0 10px 25px rgba(250, 204, 21, 0.3)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isEditing ? (
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            updateClient(
                              index % clientsSection.clients.length,
                              "image",
                              reader.result as string
                            );
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className='w-full h-full'
                    />
                  ) : (
                    <ImageWithFallback
                      src={client.image}
                      alt={`${client.name} logo`}
                      className='w-full h-full object-cover'
                    />
                  )}
                </motion.div>
                <motion.div
                  className='mt-3'
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  {isEditing ? (
                    <>
                      <input
                        value={client.name}
                        onChange={(e) =>
                          updateClient(
                            index % clientsSection.clients.length,
                            "name",
                            e.target.value
                          )
                        }
                        className='text-sm font-medium text-card-foreground border-b bg-transparent w-full'
                      />
                      <Button
                        size='sm'
                        variant='destructive'
                        className='mt-2 hover:scale-105 cursor-pointer'
                        onClick={() =>
                          removeClient(index % clientsSection.clients.length)
                        }
                      >
                        Remove
                      </Button>
                    </>
                  ) : (
                    <p className='text-sm font-medium text-card-foreground group-hover:text-primary transition-colors'>
                      {client.name}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Client Stats */}
        <motion.div
          className='mt-16 text-center'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {clientsSection.stats.map((stat, index) => (
              <motion.div
                key={index}
                className='group cursor-pointer'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isEditing ? (
                    <input
                      value={stat.value}
                      onChange={(e) =>
                        updateStat(index, "value", e.target.value)
                      }
                      className='text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors border-b bg-transparent w-full text-center'
                    />
                  ) : (
                    <div className='text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors'>
                      {stat.value}
                    </div>
                  )}
                </motion.div>
                {isEditing ? (
                  <>
                    <input
                      value={stat.label}
                      onChange={(e) =>
                        updateStat(index, "label", e.target.value)
                      }
                      className='text-muted-foreground text-sm border-b bg-transparent w-full text-center'
                    />
                    <Button
                      size='sm'
                      variant='destructive'
                      className='mt-2 hover:scale-105 cursor-pointer'
                      onClick={() => removeStat(index)}
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <div className='text-muted-foreground text-sm'>
                    {stat.label}
                  </div>
                )}
                <motion.div
                  className='w-6 h-1 bg-primary/30 group-hover:bg-primary transition-colors mt-2 mx-auto rounded-full'
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
            {isEditing && (
              <motion.div
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className='flex items-center justify-center'
              >
                <Button onClick={addStat} className='text-green-600'>
                  + Add Stat
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
