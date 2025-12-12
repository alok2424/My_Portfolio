"use client";

import Achievements from '@/components/achievement';
import Contact from '@/components/Contact';
import Experience from '@/components/Experience';
import Hero from '@/components/hero';
import Portfolio from '@/components/Portfolio';
import ProjectsSection from '@/components/Project';
import SkillsSection from '@/components/skills';
import Wallet from '@/components/Wallet/WalletContext';
import { useState } from 'react';

export default function Home() {
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });

  const saveState = (newState: any) => {
    setState(newState);
  };

  return (
    <main>
      <Wallet saveState={saveState} />
      <Hero />
      <Achievements />
      <Experience />
      <ProjectsSection />
      <SkillsSection />
      <Contact />
      <Portfolio />
    </main>
  );
}
