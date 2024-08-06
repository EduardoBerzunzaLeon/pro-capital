import { motion } from 'framer-motion';
import { FC } from 'react';

interface Props {
    text: string
}

export const LogginStart: FC<Props> = ({ text }) => {
  return (
    <>
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 0 }}
            exit={{ 
                scale: 100, 
                transition: { 
                    duration: 2, 
                    ease: "easeInOut" 
                },
                opacity: 1,
            }}
            className="privacy-screen"
        />
        <motion.h2
            className='text-lg text-center privacy-text'
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 1 }}
            transition={{ ease: "easeOut", duration: 2, delay: 1 }}
        >
            { text }
        </motion.h2> 
    </>
  )
}

export default LogginStart;