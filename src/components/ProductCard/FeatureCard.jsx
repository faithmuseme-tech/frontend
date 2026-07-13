import React from "react";
import { motion } from "framer-motion";

const FeatureCard = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="card p-6 flex flex-col items-center text-center gap-4 hover:border-primary-200 group"
  >
    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm ${feature.iconColor}`}>
      {feature.icon}
    </div>
    <div>
      <h3 className="font-bold text-gray-900 text-base">{feature.title}</h3>
      <p className="text-gray-500 text-sm mt-1 leading-relaxed">{feature.description}</p>
    </div>
  </motion.div>
);

export default FeatureCard;
