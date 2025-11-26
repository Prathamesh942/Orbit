import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Html } from '@react-three/drei';
import { RotateCcw, Image } from 'lucide-react';
import { Model } from '../model/Model';

// PLACEHOLDER: Replace this with your actual controller model
function ControllerModel({ customization }) {
  return (
    <group>
      <Model rotation={[0, -Math.PI / 2, 0]} customization={customization} />
    </group>
  );
}

// Scene with placeholder lighting and camera setup
function Scene({ customization }) {
  return (
    <>
      {/* CAMERA SETUP - Adjust as needed */}
      <PerspectiveCamera makeDefault position={[0, 1, 4]} fov={50} />

      {/* ORBIT CONTROLS */}
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={8}
      />

      {/* LIGHTING SETUP - Adjust as needed */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* ENVIRONMENT - Adjust preset as needed */}
      <Suspense
        fallback={
          <Html center>
            <div className="text-white animate-pulse">Loading…</div>
          </Html>
        }
      >
        <ControllerModel customization={customization} />
        <Environment preset="city" />
      </Suspense>

    </>
  );
}

// Xbox Design Lab color palette
const colorPalette = [
  //skinrow
  { color: "spiderman", img: "/spidermanf.jpg", name: "Spiderman" },
  { color: "venom", img: "/venomf.png", name: "Venom" },
  { color: "ghost", img: "/ghostf.png", name: "Ghost" },
  { color: "panda", img: "/pandaf.png", name: "Panda" },

  // Row 1
  { color: '#1a1a1a', name: 'Carbon Black' },
  { color: '#6b6b6b', name: 'Storm Grey' },
  { color: '#c0c0c0', name: 'Robot White' },
  { color: '#ffffff', name: 'Pulse Red' },
  { color: '#6b4e9a', name: 'Velocity Green' },
  { color: '#d4b5e8', name: 'Daystrike Camo' },
  { color: '#f5d7d7', name: 'Soft Pink' },

  // Row 2
  { color: '#ffb3d9', name: 'Soft Pink' },
  { color: '#e84c7e', name: 'Pink' },
  { color: '#d32f2f', name: 'Pulse Red' },
  { color: '#ff6b35', name: 'Shock Blue' },
  { color: '#ffb347', name: 'Deep Pink' },
  { color: '#ffd93d', name: 'Lightning Yellow' },
  { color: '#d4ff00', name: 'Electric Volt' },

  // Row 3
  { color: '#4caf50', name: 'Velocity Green' },
  { color: '#a8e6a1', name: 'Mint' },
  { color: '#8dd9cc', name: 'Aqua Shift' },
  { color: '#00bcd4', name: 'Sky Blue' },
  { color: '#1e5f74', name: 'Ocean Shadow' },
  { color: '#2962ff', name: 'Shock Blue' },
  { color: '#1a237e', name: 'Navy' },

  // Row 4
  { color: '#6b5d4f', name: 'Desert Tan' },
  { color: '#a89080', name: 'Sand' }
];


// Part icons (vertical nav)
const partIcons = [
  { id: 'face', label: 'Face', icon: '/face.png' },
  { id: 'body', label: 'Body', icon: '/body.png' },
  { id: 'dpads', label: 'D-pad', icon: '/dpad.png' },
  { id: 'bumpers', label: 'Bumpers', icon: '/bumper.png' },
  { id: 'thumbsticks', label: 'Thumbsticks', icon: '/thumbstick.png' },
  { id: 'triggers', label: 'Triggers', icon: '/trigger.png' },
  { id: 'grips', label: 'Back', icon: 'grip.png' },
];

export default function OrbitLab() {

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [designName, setDesignName] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const canvasRef = useRef();


  const [customization, setCustomization] = useState({
    face: '#ffb3d9',
    body: '#e84c7e',
    dpads: '#e84c7e',
    thumbsticks: '#c0c0c0',
    abxy: '#d32f2f',
    bumpers: '#e84c7e',
    triggers: '#f5d7d7',
    grips: false
  });

  const [activePart, setActivePart] = useState('bumpers');

  const getAddon = () => {
    let count = 0, price = 0
    if (customization.face[0] != '#') {
      count++;
      price += 18.99;
    }
    if (customization.grips) {
      count++;
      price += 8.99;
    }
    return { count, price };
  }

  const updatePart = (part, value) => {
    setCustomization(prev => ({
      ...prev,
      [part]: value
    }));
  };

  const resetCustomization = () => {
    setCustomization({
      face: '#ffb3d9',
      body: '#e84c7e',
      dpads: '#e84c7e',
      thumbsticks: '#c0c0c0',
      abxy: '#d32f2f',
      bumpers: '#e84c7e',
      triggers: '#f5d7d7',
      grips: false
    });
  };

  const getPartLabel = () => {
    const labels = {
      face: 'Face',
      body: 'Body',
      dpads: 'D-pad',
      bumpers: 'Bumpers',
      abxy: 'ABXY Buttons',
      thumbsticks: 'Thumbsticks',
      grips: 'Back Grips',
      triggers: 'Triggers'
    };
    return labels[activePart] || 'Part';
  };

  const getPartColor = () => {
    if (activePart === 'grips') return null;
    return customization[activePart];
  };

  const captureScreenshot = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (canvas) {
      console.log("Canvas exist")
      return canvas.toDataURL('image/png');
    }
    return null;
  };

  const saveDesign = () => {
    // const screenshot = captureScreenshot();


    const design = {
      id: `design_${Date.now()}`,
      name: designName.trim() || 'Untitled Design',
      customization: { ...customization },
      createdAt: new Date().toISOString(),
      price: (79.99 + getAddon().price).toFixed(2)
    };

    // Get existing designs from localStorage
    const existingDesigns = JSON.parse(localStorage.getItem('orbitDesigns') || '[]');

    // Add new design
    existingDesigns.push(design);

    // Save back to localStorage
    localStorage.setItem('orbitDesigns', JSON.stringify(existingDesigns));

    // Close modal and show success
    setShowSaveModal(false);
    setDesignName('');
    setShowSuccessToast(true);

    // Hide success toast after 3 seconds
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleSaveClick = () => {
    setShowSaveModal(true);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center gap-3 lg:gap-8">
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-sm lg:text-base">
                O
              </div>
              <span className="text-white text-base lg:text-xl font-semibold">Orbit Design Lab</span>
            </div>
            <nav className="hidden lg:flex items-center gap-6 text-sm">
              <button className="text-gray-400 hover:text-white">Shop</button>
              <button className="text-gray-400 hover:text-white">Designed by you</button>
              <button className="text-gray-400 hover:text-white">Community Gallery</button>
            </nav>
          </div>
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden bg-gray-900 border-t border-gray-800 px-4 py-3 flex flex-col gap-3">
            <button className="text-gray-400 hover:text-white text-left">Shop</button>
            <button className="text-gray-400 hover:text-white text-left">Designed by you</button>
            <button className="text-gray-400 hover:text-white text-left">Community Gallery</button>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row w-full pt-14 lg:pt-20 h-full">
        {/* Canvas - takes full width on mobile, 60% on desktop */}
        <div className="relative w-full lg:flex-[3] h-[50vh] lg:h-full">
          {/* Title */}
          <div className="absolute top-4 lg:top-8 left-4 lg:left-8 z-10">
            <h1 className="text-white text-2xl lg:text-5xl font-bold mb-1 lg:mb-2">Make it yours</h1>
            <div className="w-12 lg:w-16 h-0.5 lg:h-1 bg-green-500"></div>
          </div>

          {/* 3D Canvas */}
          <Canvas ref={canvasRef} shadows className="bg-gradient-to-br from-gray-900 to-black">
            <Scene customization={customization} />
          </Canvas>

          {/* Bottom Info */}
          <div className="absolute bottom-2 lg:bottom-8 left-4 lg:left-8 right-4 lg:right-8">
            <p className="text-xs text-gray-500">© 2025 Orbit Design Lab</p>
          </div>
        </div>

        {/* Mobile Part Selector - Horizontal scroll */}
        <div className="lg:hidden w-full bg-black border-t border-b border-gray-800 overflow-x-auto min-h-[80px]">
          <div className="flex items-center px-4 py-3 gap-2">
            {partIcons.map(part => (
              <button
                key={part.id}
                onClick={() => setActivePart(part.id)}
                className={`flex-shrink-0 w-12 h-12 rounded flex items-center justify-center transition-colors ${activePart === part.id
                  ? 'bg-gray-700 border-2 border-gray-500'
                  : 'bg-gray-900 border-2 border-transparent'
                  }`}
                title={part.label}
              >
                <img src={part.icon} className="object-cover w-6" alt={part.label} />
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Part Selector - Vertical */}
        <div className="hidden lg:flex w-20 bg-black border-l border-r border-gray-800 flex-col items-center py-8 gap-2">
          {partIcons.map(part => (
            <button
              key={part.id}
              onClick={() => setActivePart(part.id)}
              className={`w-12 h-12 rounded flex items-center justify-center text-2xl transition-colors ${activePart === part.id
                ? 'bg-gray-700 border-2 border-gray-500'
                : 'bg-gray-900 hover:bg-gray-800 border-2 border-transparent'
                }`}
              title={part.label}
            >
              <img src={part.icon} className="object-cover w-[25px]" alt={part.label} />
            </button>
          ))}
        </div>

        {/* Customization Panel */}
        <div className="w-full lg:flex-[2] bg-black p-4 lg:p-8 overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-800 max-h-[40vh] lg:max-h-none">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div>
              <h2 className="text-white text-xl lg:text-2xl font-bold mb-1">{getPartLabel()}</h2>
              {getPartColor() && (
                <p className="text-gray-400 text-xs lg:text-sm">
                  {colorPalette.find(c => c.color === getPartColor())?.name}
                </p>
              )}
            </div>
            <button
              onClick={resetCustomization}
              className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded flex items-center justify-center"
            >
              <RotateCcw size={18} className="text-white" />
            </button>
          </div>

          {/* Color Grid or Grip Toggle */}
          {activePart === 'grips' ? (
            <div>
              <h3 className="text-white text-xs lg:text-sm font-semibold mb-3 lg:mb-4 uppercase tracking-wider">
                OPTIONS
                <p className="text-green-500 font-semibold">+$8.99</p>
              </h3>
              <div className="flex gap-2 lg:gap-3">
                <button
                  onClick={() => updatePart('grips', false)}
                  className={`flex-1 py-2 lg:py-3 rounded text-sm lg:text-base font-medium transition-colors ${!customization.grips
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  No Grips
                </button>
                <button
                  onClick={() => updatePart('grips', true)}
                  className={`flex-1 py-2 lg:py-3 rounded text-sm lg:text-base font-medium transition-colors ${customization.grips
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  With Grips
                </button>
              </div>
            </div>
          ) : (
            <>
              {activePart === 'face' && (
                <>
                  <h3 className="text-white text-xs lg:text-sm font-semibold mb-3 lg:mb-4 uppercase tracking-wider">
                    SKINS
                    <p className="text-green-500 font-semibold">+$18.99</p>
                  </h3>
                  <div className="grid grid-cols-4 gap-2 lg:gap-3 mb-4 lg:mb-6">
                    {colorPalette.slice(0, 4).map((item, index) => (
                      <img
                        key={index}
                        onClick={() => updatePart(activePart, item.color)}
                        src={item.img}
                        alt={item.name}
                        className={`w-full aspect-square object-cover rounded-lg lg:rounded-2xl transition-all cursor-pointer ${customization[activePart] === item.color
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-105 lg:scale-110'
                          : 'hover:scale-105'
                          }`}
                      />
                    ))}
                  </div>
                </>
              )}
              <h3 className="text-white text-xs lg:text-sm font-semibold mb-3 lg:mb-4 uppercase tracking-wider">COLORS</h3>
              <div className="grid grid-cols-5 lg:grid-cols-7 gap-3 lg:gap-4">
                {colorPalette.slice(4).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => updatePart(activePart, item.color)}
                    className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full transition-all ${customization[activePart] === item.color
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-105 lg:scale-110'
                      : 'hover:scale-105'
                      }`}
                    style={{ backgroundColor: item.color }}
                    title={item.name}
                  />
                ))}
              </div>
            </>
          )}

          {/* Bottom Section */}
          <div className="mt-6 lg:mt-8 pt-6 lg:pt-8">
            {/* Price Summary */}
            <div className="bg-gray-900 rounded-lg p-4 lg:p-6 mb-3 lg:mb-4">
              <div className="flex items-center justify-between text-xs lg:text-sm mb-2">
                <span className="text-gray-400">BASE</span>
                <span className="text-white font-semibold">$79.99</span>
              </div>
              <div className="flex items-center justify-center my-2">
                <span className="text-xl lg:text-2xl text-gray-600">+</span>
              </div>
              <div className="flex items-center justify-between text-xs lg:text-sm mb-2">
                <span className="text-gray-400">ADD-ONS ({getAddon().count})</span>
                <span className="text-green-500 font-semibold">${getAddon().price.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-center my-2">
                <span className="text-xl lg:text-2xl text-gray-600">=</span>
              </div>
              <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-gray-800">
                <span className="text-gray-400 text-xs lg:text-sm">SUBTOTAL</span>
                <span className="text-white text-xl lg:text-2xl font-bold">
                  ${(79.99 + getAddon().price).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 lg:gap-3">
              <button className="flex-1 py-3 lg:py-4 bg-green-600 hover:bg-green-700 text-white text-sm lg:text-base font-bold rounded transition-colors">
                BUY
              </button>
              <button className="w-12 h-12 lg:w-14 lg:h-14 bg-gray-800 hover:bg-gray-700 rounded flex items-center justify-center">
                <Image size={18} strokeWidth={2} className="text-white lg:w-5 lg:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}