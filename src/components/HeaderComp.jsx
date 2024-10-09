'use client'

import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Cookies from 'js-cookie'
import { FiArrowUpRight } from "react-icons/fi"
import { Link as ScrollLink } from "react-scroll"
import { MdOutlineMenu, MdOutlineCancel } from "react-icons/md"
import Link from "next/link"

export default function Navbar() {
    const token = Cookies.get('login_access_token')
    const pathname = usePathname()
    const [menuOpen, setMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const menuItems = [
        { page: "Home", link: "home", href: "/" },
        { page: "Features", link: "websites", href: "/" },
        { page: "Plans & Pricing", link: "", href: "/" },
        { page: "Resources", href: "/", link: "" },
    ]

    return (
        <>
            <nav className={`sticky top-0 z-50 px-4 py-3 transition-all duration-300 ${isScrolled || pathname !== '/' ? "bg-white shadow-lg backdrop-blur-md" : "bg-transparent"
                } sm:px-6 md:px-8 lg:px-12 xl:px-50`}>
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <a className="text-2xl sm:text-3xl xl:text-[34px] font-semibold text-primary jost" href="/">
                            Analytixio
                        </a>
                    </div>

                    <div className="hidden lg:flex lg:space-x-4 xl:space-x-6">
                        {menuItems.map((item) => (
                            <div className="relative group" key={item.page}>
                                <ScrollLink
                                    activeClass="active"
                                    to={item.link}
                                    smooth={true}
                                    duration={500}
                                    className={`navLink text-black font-semibold ${pathname === `/${item.link}/` ? "active" : ""}`}
                                >
                                    <Link href={item.href}>
                                        {item.page}
                                    </Link>
                                </ScrollLink>
                                {item.submenu && (
                                    <div className="absolute hidden group-hover:block bg-white shadow-lg mt-1 rounded-lg w-64">
                                        {item.submenu.map((subItem) => (
                                            <Link
                                                href={`${subItem.link}`}
                                                key={subItem.page}
                                                target="_blank"
                                                className="block px-4 py-2 hover:bg-primary transition-all duration-100 ease-in-out hover:text-white text-black"
                                            >
                                                {subItem.page}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
                        {!token ? (
                            <>
                                <a href="/signin" className="btn-nav border-white border-2">Sign In</a>
                                <a href="/signup" className="btn-nav border-white border-2">Sign Up</a>
                            </>
                        ) : (
                            <a href="/dashboard" className="btn-nav border-white border-2">
                                Dashboard
                            </a>
                        )}
                    </div>

                    <button
                        className="lg:hidden flex items-center transition-all ease-in-out duration-300"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <MdOutlineCancel className="text-3xl text-black" /> : <MdOutlineMenu className="h-6 w-6 text-gray-700" />}
                    </button>
                </div>
            </nav>

            {menuOpen && (
                <div className="lg:hidden fixed inset-0 bg-white shadow-lg z-40 overflow-y-auto">
                    <div className="flex flex-col items-center justify-center mt-20 mx-4 sm:mx-6 md:mx-8">
                        {menuItems.map((item) => (
                            <div key={item.page} className="w-full shadow mb-2">
                                <ScrollLink
                                    to={item.link}
                                    smooth={true}
                                    duration={500}
                                    className={`text-gray-700 hover:text-blue-500 flex items-center justify-center py-3 rounded-lg ${pathname === `/${item.link}` ? "font-bold" : ""}`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <Link href={`/`}>
                                        {item.page}
                                    </Link>
                                </ScrollLink>
                                {item.submenu && (
                                    <div className="bg-gray-100 mt-2 rounded-lg w-full flex items-center justify-center flex-col">
                                        {item.submenu.map((subItem) => (
                                            <Link
                                                href={`${subItem.link}`}
                                                key={subItem.page}
                                                target="_blank"
                                                className="block px-4 py-2 hover:bg-gray-200 border-b w-full text-center"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                {subItem.page}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        <a href="/press-release" className="text-gray-700 py-4 w-full shadow items-center mb-2 justify-center flex rounded-lg">
                            Press Release
                        </a>
                        <a href="tel:+91-8949272273" className="text-gray-700 py-4 w-full shadow items-center mb-2 justify-center flex rounded-lg">
                            <span className="mr-2">📞</span>+91-8949272273
                        </a>
                        <a href="mailto:support@Vefogix.com" className="text-gray-700 py-4 w-full shadow items-center mb-2 justify-center flex rounded-lg">
                            <span className="mr-2">📧</span>support@Vefogix.com
                        </a>

                        <div className="flex items-center space-x-4 my-4">
                            {!token ? (
                                <>
                                    <a href="/signin" className="btn-nav">Sign In</a>
                                    <a href="/signup" className="btn-nav">Sign Up</a>
                                </>
                            ) : (
                                <a href="/dashboard" className="btn-nav">
                                    Dashboard
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        .btn-nav {
          background-color: #006BD7;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          border: 2px solid #fff;
          display: flex;
          align-items: center;
          font-weight: bold;
          transition: background-color 0.3s, color 0.3s;
        }
        .btn-nav:hover {
          background-color: white;
          color: #006BD7;
        }
        .btn-nav span {
          background-color: white;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          margin-left: 0.5rem;
          font-weight: bold;
          transition: background-color 0.3s, color 0.3s;
        }
        .btn-nav:hover span {
          background-color: #006BD7;
          color: white;
        }
      `}</style>
        </>
    )
}