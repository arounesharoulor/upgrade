import { motion } from 'framer-motion';

export default function InfoCard({ icon, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#1f2330] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow"
    >
      {icon && <div className="mb-4 text-4xl text-cyan-400">{icon}</div>}
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-300 text-sm">{children}</p>
    </motion.div>
  );
}