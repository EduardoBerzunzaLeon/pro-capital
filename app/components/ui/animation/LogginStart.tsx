import { motion } from 'framer-motion';

export const LogginStart = () => {
  return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 0 }}
            exit={{ 
                scale: 100, 
                transition: { 
                    duration: .7, 
                    ease: "circIn" 
                },
                opacity: 1,
            }}
            className="privacy-screen"
        />
    )
}

export default LogginStart;