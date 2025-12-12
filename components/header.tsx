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
// REMOVE THESE IMPORTS
// import Web3 from 'web3';
// import ABI from '@/components/Wallet/ABI.json';
// Add at the top
import { useWallet } from '@/components/Wallet/WalletContext';
// Add Ethereum type declaration
declare global {
  interface Window {
    ethereum?: any;
  }
}

const Header = () => {
  const { setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // REMOVE THESE STATE VARIABLES
  // const [isConnected, setIsConnected] = useState(false);
  // const [isConnecting, setIsConnecting] = useState(false);
  // const [walletState, setWalletState] = useState<{ web3: any; contract: any } | null>(null);

  // REPLACE WITH CONTEXT HOOK
  const { isConnected, isConnecting, connectWallet } = useWallet();
  
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

  // REMOVE THIS useEffect - It should be handled in WalletContext
  // // Check if user is already connected on mount
  // useEffect(() => {
  //   const checkIfWalletIsConnected = async () => {
  //     try {
  //       if (window.ethereum) {
  //         const accounts = await window.ethereum.request({
  //           method: 'eth_accounts',
  //         });
  //         if (accounts.length > 0) {
  //           await initWallet();
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error checking wallet connection:', error);
  //     }
  //   };
  // 
  //   checkIfWalletIsConnected();
  // }, []);

  // REMOVE THIS FUNCTION - It's handled in WalletContext
  // const initWallet = async () => {
  //   try {
  //     if (!window.ethereum) {
  //       alert("Please install MetaMask.");
  //       return;
  //     }
  // 
  //     setIsConnecting(true);
  //     const web3 = new Web3(window.ethereum);
  // 
  //     // Request accounts first
  //     const accounts = await window.ethereum.request({
  //       method: "eth_requestAccounts",
  //     });
  // 
  //     if (!accounts || accounts.length === 0) {
  //       throw new Error("No accounts found");
  //     }
  // 
  //     const contract = new web3.eth.Contract(
  //       ABI as any,
  //       "0x8E15156424e1BB232F8D891Cab7110AdF16BE5e1" // your contract address
  //     );
  // 
  //     // Save state (you can use this for transactions later)
  //     const state = { web3, contract };
  //     setWalletState(state);
  //     setIsConnected(true);
  //     
  //     // You can also pass this state to parent or context if needed
  //     console.log('Wallet connected:', accounts[0]);
  //     
  //     return state;
  //   } catch (error) {
  //     console.error("Connection error:", error);
  //     alert("MetaMask connection failed. Please try again.");
  //     throw error;
  //   } finally {
  //     setIsConnecting(false);
  //   }
  // };

  // REMOVE THIS FUNCTION - Use connectWallet from context instead
  // // Main connect wallet function
  // const connectWallet = async () => {
  //   try {
  //     const isAndroid = /android/i.test(navigator.userAgent);
  //     
  //     // Check if on Android mobile and MetaMask is not installed
  //     if (isAndroid && !window.ethereum) {
  //       window.open('https://metamask.app.link/dapp/sriche.netlify.app/', '_blank');
  //       return;
  //     }
  // 
  //     // Regular connection flow
  //     await initWallet();
  //     
  //   } catch (error) {
  //     console.error('Error connecting wallet:', error);
  //     // Error is already handled in initWallet
  //   }
  // };

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
              
              {/* Connect Wallet Button */}
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className={cn(
                  'px-4 py-2 rounded-full transition-all duration-300',
                  isConnected
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
                  'text-white font-medium text-sm',
                  'flex items-center gap-2'
                )}
              >
                <Wallet className="h-4 w-4" />
                {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Connect Wallet'}
              </Button>
              
              <ThemeToggle theme={theme} setTheme={setTheme} />
              <Link href="https://github.com/awesome-pro/pro-portfolio" target="_blank" className="relative z-[60]">
                <FaGithub className="h-5 w-5 text-gray-800 dark:text-gray-200" />
              </Link>
            </div>

            {/* Mobile Navigation Toggle */}
            <div className="flex items-center space-x-4 md:hidden">
              {/* Mobile Connect Wallet Button (Icon only) */}
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                size="icon"
                className={cn(
                  'relative z-[60] rounded-full',
                  isConnected
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                )}
              >
                <Wallet className="h-4 w-4 text-white" />
                {isConnecting && (
                  <span className="absolute -top-1 -right-1 h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                )}
              </Button>
              
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
              
              {/* Mobile Full Connect Wallet Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <Button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className={cn(
                    'px-6 py-3 rounded-full transition-all duration-300 text-lg',
                    isConnected
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
                    'text-white font-medium',
                    'flex items-center gap-3'
                  )}
                >
                  <Wallet className="h-5 w-5" />
                  {isConnecting ? 'Connecting...' : isConnected ? 'Wallet Connected' : 'Connect Wallet'}
                </Button>
                
                {/* Android mobile link - You may want to move this logic to WalletContext */}
                {typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent) && !window.ethereum && (
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
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Rest of the code remains the same...
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