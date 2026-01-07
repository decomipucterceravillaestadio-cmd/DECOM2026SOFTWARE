import React from 'react';
import { motion } from 'framer-motion';

export function BackgroundBeams() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        {/* Beam 1 */}
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-decom-primary/20 to-transparent rounded-full blur-3xl"
        />
        {/* Beam 2 */}
        <motion.div
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 1,
          }}
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-l from-decom-secondary/20 to-transparent rounded-full blur-3xl"
        />
        {/* Beam 3 */}
        <motion.div
          animate={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 2,
          }}
          className="absolute -bottom-32 right-1/3 w-96 h-96 bg-gradient-to-b from-decom-primary/10 to-transparent rounded-full blur-3xl"
        />
      </motion.div>
    </div>
  );
}