"use client";

import Achievements from '@/components/achievement';
import Contact from '@/components/Contact';
import Experience from '@/components/Experience';
import Hero from '@/components/hero';
import Portfolio from '@/components/Portfolio';
import ProjectsSection from '@/components/Project';
import SkillsSection from '@/components/skills';


export default function Home() {
  // Remove the local state management
  // const [state, setState] = useState({
  //   web3: null,
  //   contract: null,
  // });
  
  // Remove saveState function
  // const saveState = (newState: any) => {
  //   setState(newState);
  // };


  return (
    <main>
   
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