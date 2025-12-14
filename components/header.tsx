'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X, Moon, Sun, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import Web3 from 'web3';
import ABI from '@/components/Wallet/ABI.json';

// Add Ethereum type declaration
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Wallet Component
const WalletComponent = ({ saveState }: { saveState: (state: any) => void }) => {
  const [connected, setConnected] = useState(true);
  
  const init = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const contract = new web3.eth.Contract(
        ABI,
        "0xD76852B784ec1Ec11Db89dABeE7a0DAC2FDEB466"
      );
      setConnected(false);
      saveState({ web3: web3, contract: contract });
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert("Please install MetaMask and try again!");
    }
  };

  const isAndroid = typeof window !== 'undefined' && /android/i.test(navigator.userAgent);

  return (
    <div className="flex items-center gap-2">
      {isAndroid && !window.ethereum && (
        <Button
          className="px-3 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs"
          asChild
        >
          <a 
            href="https://metamask.app.link/dapp/sriche.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mobile
          </a>
        </Button>
      )}
      
      <Button
        onClick={init}
        disabled={!connected}
        className={cn(
          'px-4 py-2 rounded-full transition-all duration-300',
          connected
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
          'text-white font-medium text-sm',
          'flex items-center gap-2'
        )}
      >
        <Wallet className="h-4 w-4" />
        {connected ? "Connect Wallet" : "Connected"}
      </Button>
    </div>
  );
};

const Header = () => {
  const { setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Add wallet state and saveState function
  const [state, setState] = useState({
    web3: null,
    contract: null
  });

  const saveState = (state: any) => {
    console.log(state);
    setState(state);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Add smooth scrolling
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.slice(1);
        const element = document.getElementById(id || '');
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          setIsOpen(false);
        }
      }
    };
    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Fixed Header */}
      <header
        className={cn(
          'fixed w-full top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/60 dark:bg-black/60 backdrop-blur-lg shadow-lg'
            : 'bg-white/30 dark:bg-black/30 backdrop-blur-md',
          isOpen && 'bg-transparent backdrop-blur-none shadow-none'
        )}
      >
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-[60]"
            >
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={180}
                  height={40}
                  className="hidden lg:block"
                />
                <Image
                  src="/logo-2.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="block lg:hidden"
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLinks />
              {/* Add Wallet Component here */}
              <WalletComponent saveState={saveState} />
              <ThemeToggle theme={theme} setTheme={setTheme} />
              <Link href="https://github.com/awesome-pro/pro-portfolio" target="_blank" className="relative z-[60]">
                <FaGithub className="h-5 w-5 text-gray-800 dark:text-gray-200" />
              </Link>
            </div>

            {/* Mobile Navigation Toggle */}
            <div className="flex items-center space-x-4 md:hidden">
              {/* Mobile Wallet Button */}
              <MobileWallet saveState={saveState} />
              <div className="relative z-[60]">
                <ThemeToggle theme={theme} setTheme={setTheme} />
              </div>
              <Link href="https://github.com/awesome-pro/pro-portfolio" target="_blank" className="relative z-[60]">
                <FaGithub className="h-5 w-5 text-gray-800 dark:text-gray-200" />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="relative z-[60] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Menu - Separate from header */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white dark:bg-gray-900"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center justify-center min-h-screen px-4 pt-16"
            >
              <NavLinks mobile onClick={() => setIsOpen(false)} />
              {/* Mobile Full Wallet Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <MobileFullWallet saveState={saveState} />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Mobile Wallet Component (Icon only)
const MobileWallet = ({ saveState }: { saveState: (state: any) => void }) => {
  const [connected, setConnected] = useState(true);
  
  const init = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const contract = new web3.eth.Contract(
        ABI,
        "0xD76852B784ec1Ec11Db89dABeE7a0DAC2FDEB466"
      );
      setConnected(false);
      saveState({ web3: web3, contract: contract });
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert("Please install MetaMask and try again!");
    }
  };

  return (
    <Button
      onClick={init}
      disabled={!connected}
      size="icon"
      className={cn(
        'relative z-[60] rounded-full',
        connected
          ? 'bg-blue-500 hover:bg-blue-600'
          : 'bg-green-500 hover:bg-green-600'
      )}
    >
      <Wallet className="h-4 w-4 text-white" />
    </Button>
  );
};

// Mobile Full Wallet Component
const MobileFullWallet = ({ saveState }: { saveState: (state: any) => void }) => {
  const [connected, setConnected] = useState(true);
  const isAndroid = typeof window !== 'undefined' && /android/i.test(navigator.userAgent);
  
  const init = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const contract = new web3.eth.Contract(
        ABI,
        "0xD76852B784ec1Ec11Db89dABeE7a0DAC2FDEB466"
      );
      setConnected(false);
      saveState({ web3: web3, contract: contract });
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert("Please install MetaMask and try again!");
    }
  };

  return (
    <>
      <Button
        onClick={init}
        disabled={!connected}
        className={cn(
          'px-6 py-3 rounded-full transition-all duration-300 text-lg',
          connected
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
          'text-white font-medium',
          'flex items-center gap-3'
        )}
      >
        <Wallet className="h-5 w-5" />
        {connected ? "Connect Wallet" : "Connected"}
      </Button>
      
      {isAndroid && !window.ethereum && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Metamask not installed?</p>
          <a 
            href="https://metamask.app.link/dapp/sriche.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            Click here for mobile
          </a>
        </div>
      )}
    </>
  );
};

const NavLinks = ({ mobile, onClick }: { mobile?: boolean; onClick?: () => void }) => {
  const links = [
    { href: '#hero', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <>
      {links.map(({ href, label }, index) => (
        <motion.div
          key={href}
          initial={{ opacity: 0, y: mobile ? 20 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: mobile ? index * 0.1 : 0 }}
          className={mobile ? 'my-4' : ''}
        >
          <Link
            href={href}
            onClick={onClick}
            className={cn(
              'text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400',
              'transition-colors duration-200',
              'font-medium relative group',
              mobile ? 'text-3xl py-3' : 'text-sm'
            )}
          >
            {label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all group-hover:w-full" />
          </Link>
        </motion.div>
      ))}
    </>
  );
};

const ThemeToggle = ({
  theme,
  setTheme,
}: {
  theme: string | undefined;
  setTheme: (theme: string) => void;
}) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
  >
    <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    <span className="sr-only">Toggle theme</span>
  </Button>
);

export default Header;