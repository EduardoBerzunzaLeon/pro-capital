import { motion } from 'framer-motion';
import { FC } from 'react';

interface Props {
    text: string
}

export const LogginEnd: FC<Props> = ({ text }) => {
  return (
    <> 
        <motion.div
        initial={{ scale: 100 }}
        animate={{ 
            opacity: 0,
            scale: [ 100, 100, 100, 0 ],
            transition: {
                duration: 2.2, delay: 1.8
            }
        }}
        className="privacy-screen"
        >
        </motion.div> 
        <motion.h2
            className='text-lg text-center privacy-text'
            initial={{ opacity: 0 }}
            animate={{ 
                opacity: [ 0, 0, 1, 1, 0],
                transition: {
                    duration: 2
                }
            }}
        >{ text }</motion.h2> 
    </>
  )
}

export default LogginEnd;