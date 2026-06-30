import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, Outlet } from 'react-router-dom';
import { pageTransition } from '@/utils/motion';

export function PageTransition() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex min-h-0 flex-1 flex-col"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
