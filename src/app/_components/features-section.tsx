import { motion } from "framer-motion";
import React from "react";

export default function FeaturesSection({
  reversed,
  image,
  title,
  text,
}: {
  reversed: boolean;
  image: string;
  title: string;
  text: string;
}) {
  return (
    <div className={`flex flex-row ${reversed ? "flex-row-reverse" : ""}`}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-1/2 p-8"
      >
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        <p className="leading-7 text-sm xl:text-xl mt-6">{text}</p>
      </motion.div>
      <div className="w-1/2 p-8">
        <motion.img
          src={image}
          alt="Section Image"
          className="w-full min-h-80"
          initial={{ opacity: 0, x: reversed ? 150 : -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );
}
