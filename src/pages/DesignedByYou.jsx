import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Clock } from 'lucide-react';

// Mini 3D Preview Component (simplified representation)
function DesignPreview({ customization }) {
    return (
        <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Simple controller visualization */}
            <div className="relative w-32 h-20">
                {/* Body */}
                <div
                    className="absolute inset-0 rounded-3xl"
                    style={{ backgroundColor: customization.body }}
                />

                {/* Face overlay */}
                <div
                    className="absolute inset-x-2 inset-y-1 rounded-3xl opacity-80"
                    style={{ backgroundColor: customization.face }}
                />

                {/* D-pad */}
                <div
                    className="absolute left-4 top-6 w-4 h-4 rounded-full"
                    style={{ backgroundColor: customization.dpads }}
                />

                {/* ABXY buttons */}
                <div
                    className="absolute right-4 top-6 w-4 h-4 rounded-full"
                    style={{ backgroundColor: customization.abxy }}
                />

                {/* Thumbsticks */}
                <div
                    className="absolute left-6 bottom-3 w-3 h-3 rounded-full"
                    style={{ backgroundColor: customization.thumbsticks }}
                />
                <div
                    className="absolute right-6 bottom-3 w-3 h-3 rounded-full"
                    style={{ backgroundColor: customization.thumbsticks }}
                />

                {/* Bumpers */}
                <div
                    className="absolute top-0 left-8 right-8 h-1 rounded-full"
                    style={{ backgroundColor: customization.bumpers }}
                />
            </div>
        </div>
    );
}

export default function DesignedByYou() {
    const [designs, setDesigns] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [designToDelete, setDesignToDelete] = useState(null);

    useEffect(() => {
        // Load designs from localStorage
        const savedDesigns = JSON.parse(localStorage.getItem('orbitDesigns') || '[]');
        setDesigns(savedDesigns);
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleDelete = (id) => {
        const updatedDesigns = designs.filter(design => design.id !== id);
        localStorage.setItem('orbitDesigns', JSON.stringify(updatedDesigns));
        setDesigns(updatedDesigns);
        setShowDeleteModal(false);
        setDesignToDelete(null);
    };

    const confirmDelete = (design) => {
        setDesignToDelete(design);
        setShowDeleteModal(true);
    };

    const handleLoadDesign = (design) => {
        // Store selected design in sessionStorage to pass to Lab page
        sessionStorage.setItem('selectedDesign', JSON.stringify(design));
        // In a real app, you'd navigate to /lab here
        alert(`Loading "${design.name}" to Lab page...
In your actual app, navigate to the Lab page with this design.`);
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">
                                O
                            </div>
                            <span className="text-white text-xl font-semibold">Orbit Design Lab</span>
                        </div>
                        <nav className="flex items-center gap-6 text-sm">
                            <button className="text-gray-400 hover:text-white">Shop</button>
                            <button className="text-white font-semibold border-b-2 border-green-500 pb-1">
                                Designed by you
                            </button>
                            <button className="text-gray-400 hover:text-white">Community Gallery</button>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="pt-24 px-8 pb-12">
                <div className="max-w-7xl mx-auto">
                    {/* Title Section */}
                    <div className="mb-12">
                        <h1 className="text-white text-5xl font-bold mb-2">Your Designs</h1>
                        <div className="w-16 h-1 bg-green-500 mb-4"></div>
                        <p className="text-gray-400 text-lg">
                            {designs.length} {designs.length === 1 ? 'design' : 'designs'} saved
                        </p>
                    </div>

                    {/* Empty State */}
                    {designs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                <span className="text-5xl">🎮</span>
                            </div>
                            <h2 className="text-white text-2xl font-bold mb-2">No designs yet</h2>
                            <p className="text-gray-400 mb-6">Start creating your custom controller!</p>
                            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
                                Go to Design Lab
                            </button>
                        </div>
                    ) : (
                        /* Designs Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {designs.map((design) => (
                                <div
                                    key={design.id}
                                    className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all group"
                                >
                                    {/* Preview */}
                                    <div className="cursor-pointer" onClick={() => handleLoadDesign(design)}>
                                        <DesignPreview customization={design.customization} />
                                    </div>

                                    {/* Info Section */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-white text-xl font-bold mb-1">{design.name}</h3>
                                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                    <Clock size={14} />
                                                    <span>{formatDate(design.createdAt)}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-green-500 text-2xl font-bold">${design.price}</p>
                                            </div>
                                        </div>

                                        {/* Color Swatches */}
                                        <div className="flex gap-2 mb-4">
                                            <div
                                                className="w-6 h-6 rounded-full border-2 border-gray-700"
                                                style={{ backgroundColor: design.customization.face }}
                                                title="Face"
                                            />
                                            <div
                                                className="w-6 h-6 rounded-full border-2 border-gray-700"
                                                style={{ backgroundColor: design.customization.body }}
                                                title="Body"
                                            />
                                            <div
                                                className="w-6 h-6 rounded-full border-2 border-gray-700"
                                                style={{ backgroundColor: design.customization.dpads }}
                                                title="D-Pads"
                                            />
                                            <div
                                                className="w-6 h-6 rounded-full border-2 border-gray-700"
                                                style={{ backgroundColor: design.customization.abxy }}
                                                title="ABXY"
                                            />
                                            <div
                                                className="w-6 h-6 rounded-full border-2 border-gray-700"
                                                style={{ backgroundColor: design.customization.thumbsticks }}
                                                title="Thumbsticks"
                                            />
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleLoadDesign(design)}
                                                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                                            >
                                                Load Design
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(design)}
                                                className="w-12 h-12 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && designToDelete && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-2xl max-w-md w-full p-6 border border-gray-800">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center">
                                <Trash2 size={32} className="text-red-500" />
                            </div>
                        </div>

                        <h3 className="text-white text-xl font-bold text-center mb-2">Delete Design?</h3>
                        <p className="text-gray-400 text-center mb-6">
                            Are you sure you want to delete "<span className="text-white font-semibold">{designToDelete.name}</span>"? This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(designToDelete.id)}
                                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}