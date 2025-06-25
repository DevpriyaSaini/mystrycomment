"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

function Navbar() {
    const { data: session } = useSession()
    const user: User = session?.user as User

    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Logo/Brand */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            True Feedback
                        </span>
                    </Link>

                    {/* Session controls */}
                    <div className="flex items-center space-x-4">
                        {session ? (
                            <>
                                <span className="hidden sm:inline-block text-sm md:text-base font-medium text-gray-300">
                                    Welcome, <span className="font-semibold text-white">{user?.username || user?.email}</span>
                                </span>
                                <Button 
                                    onClick={() => signOut()} 
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300"
                                    variant="outline"
                                >
                                    <span className="hidden sm:inline">Sign Out</span>
                                    <span className="sm:hidden">Logout</span>
                                </Button>
                            </>
                        ) : (
                            <Link href="/sign-in">
                                <Button 
                                    className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 shadow-lg"
                                    variant="default"
                                >
                                    <span className="hidden sm:inline">Sign In</span>
                                    <span className="sm:hidden">Login</span>
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar