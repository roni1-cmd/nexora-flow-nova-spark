
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FadeInTextProps {
  text: string;
  className?: string;
}

export const FadeInText: React.FC<FadeInTextProps> = ({ text, className = '' }) => {
  const [displayedSentences, setDisplayedSentences] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Split text into sentences
  const sentences = text.split(/(?<=[.!?])\s+/).filter(sentence => sentence.trim().length > 0);

  useEffect(() => {
    setDisplayedSentences([]);
    setCurrentIndex(0);

    if (sentences.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev < sentences.length - 1) {
          setDisplayedSentences(current => [...current, sentences[prev]]);
          return prev + 1;
        } else {
          setDisplayedSentences(current => [...current, sentences[prev]]);
          clearInterval(timer);
          return prev;
        }
      });
    }, 200); // Delay between sentences

    return () => clearInterval(timer);
  }, [text]);

  return (
    <div className={className}>
      <AnimatePresence>
        {displayedSentences.map((sentence, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="inline"
          >
            {sentence}{index < displayedSentences.length - 1 ? ' ' : ''}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};
