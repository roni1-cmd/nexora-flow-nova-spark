
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const cards = [
  { id: 1, color: 'from-blue-400/20 to-purple-400/20' },
  { id: 2, color: 'from-purple-400/20 to-pink-400/20' },
  { id: 3, color: 'from-pink-400/20 to-blue-400/20' },
];

const WikipediaLoader = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative w-32 h-20">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{
              x: index * 2,
              y: index * 2,
              rotate: index * 1.5,
              scale: 1,
            }}
            animate={{
              x: [index * 2, index * 15, index * 2],
              y: [index * 2, 0, index * 2],
              rotate: [index * 1.5, index * 8, index * 1.5],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
            className={cn(
              "absolute inset-0 rounded-lg",
              "bg-gradient-to-br",
              card.color,
              "border border-white/10",
              "backdrop-blur-sm",
              "shadow-lg"
            )}
            style={{
              zIndex: cards.length - index,
            }}
          >
            <div className="absolute inset-1 rounded-md bg-black/20 backdrop-blur-sm border border-white/5" />
            <div className="relative z-10 p-3 flex items-center justify-center h-full">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="ml-4 text-sm text-gray-400">
        Searching Wikipedia...
      </div>
    </div>
  );
};

export default WikipediaLoader;
