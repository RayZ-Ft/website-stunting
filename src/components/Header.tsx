"use client"

import { usePathname } from 'next/navigation'
import Link from "next/link";

export default function Header() {
  const pathname = usePathname()

  return(
      <header className="header-template">
        <nav className="navbar-template">
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link href="/" className={pathname === "/" ? "anchor-style-in-page" : "anchor-style"} aria-current="page">
                  Dataset
                </Link>
              </li>
              <li>
                <Link href="/pelatihan" className={pathname === "/pelatihan" ? "anchor-style-in-page" : "anchor-style"} aria-current="page">
                    Pelatihan
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>
  )
}