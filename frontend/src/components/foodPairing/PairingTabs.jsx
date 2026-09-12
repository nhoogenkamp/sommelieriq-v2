import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import images from "../../assets/images/images.js";

// https://www.freecodecamp.org/news/build-a-high-performance-tab-component/#heading-how-to-build-the-tab-component

const pairingSteps = [
  {
    label: "Choose",
    title: "Choose your dishes",
    description:
      "Select one dish or several dishes being served at your table."
  },
  {
    label: "Refine",
    title: "Add the sauce",
    description:
      "Select the sauce served with certain meals so the pairing better reflects your meal."
  },
  {
    label: "Discover",
    title: "Discover your wine",
    description:
      "SommelierIQ compares your meal with wines available in this restaurant and recommends suitable matches."
  }
];

const contentVariants = {
  initial: { y: "100%", opacity: 0 },
  animate: { y: "0", opacity: 1 },
  exit: { y: "100%", opacity: 0 }
};

export default function PairingTabs() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <section className="pairing-hero">
    <AnimatePresence mode="wait">
      <motion.div className="pairing-tab-container" key={activeTab}>
        <h1>How it works</h1>
        <div className="pairing-tab-header">
          {pairingSteps.map((step, index) => (
            <li
              className={`${index === activeTab ? "active" : ""} pairing-tab-button`}
              key={step.label}
              onClick={() => setActiveTab(index)}>
              <span>
                0{index + 1}
              </span>
              {step.label}
            </li>
          ))}
        </div>

        <div className="pairing-tab-content">
          <motion.div
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}>
            <h2>{pairingSteps[activeTab].title}</h2>
            <p>{pairingSteps[activeTab].description}</p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
        <div className="pair-hero-visual">
          <img
            src={images.winePairing}
            alt="Sommelier selecting wine from a restaurant collection"
          />
        </div>
    </section>
  );
}