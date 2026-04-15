/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { DatasetManager } from "./components/DatasetManager";
import { ModelManager } from "./components/ModelManager";
import { Playground } from "./components/Playground";
import { Toaster } from "@/components/ui/sonner";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="flex h-screen bg-background font-sans text-foreground">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "datasets" && <DatasetManager />}
            {activeTab === "models" && <ModelManager />}
            {activeTab === "playground" && <Playground />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Toaster position="top-right" />
    </div>
  );
}
