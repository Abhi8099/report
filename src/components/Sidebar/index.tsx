"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { RxDashboard } from "react-icons/rx";
import { TbLogout2 } from "react-icons/tb";
import { BsBarChartFill } from "react-icons/bs";
import Cookies from 'js-cookie';

import { SiGoogletagmanager } from "react-icons/si";
import { BASE_URL } from "@/utils/api";
import axios from "axios";
import toast from "react-hot-toast";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "HOME",
    menuItems: [
      {
        icon: (<RxDashboard  className="text-2xl" />),
        label: "Dashboard",
        route: "/dashboard",
      },
    ],
  },
  {
    name: "REPORT",
    menuItems: [
      {
        icon: (
<BsBarChartFill className="text-2xl" />
        ),
        label: "Analytics",
        route: "/analytics",

      },
      {
        icon: (
<SiGoogletagmanager  className="text-2xl"/>
        ),
        label: "Google Console",
        route: "/google-console",

      },

    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter()
  const handleLogout = async () => {
    const token = Cookies.get("login_access_token");
    const refresh_token = Cookies.get("login_refresh_token");
    try {
      await axios.post(`${BASE_URL}logout/`, {"refresh_token":refresh_token}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
      },
      });
      localStorage.clear();
      sessionStorage.clear();
      Cookies.remove('login_access_token');
      localStorage.removeItem("login_access_token");
      localStorage.removeItem("login_refresh_token");
      localStorage.removeItem("login_user");
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", () => {
          window.history.pushState(null, "", window.location.href);
      });
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("An error occurred during logout");
    }
    finally{

        window.location.reload();

    }
  }

  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  useEffect(() => {
    // Normalize pathname by removing trailing slashes
    const normalizedPathname = pathname.replace(/\/+$/, "");
  
    // console.log("Normalized pathname:", normalizedPathname); 
    const activeMenu = menuGroups.flatMap(group => group.menuItems)
      .find(item => item.route === normalizedPathname);
  
    // console.log(activeMenu);
    
    if (activeMenu) {
      localStorage.setItem("selectedMenu", `"${activeMenu.label.toLowerCase()}"`);
      // console.log(activeMenu.label);
      setPageName(activeMenu.label.toLowerCase());
    } else {
      console.log("No active menu found."); 
    }
  }, [pathname, setPageName]);
  

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0 duration-300 ease-linear"
            : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
<div className='flex'>
<div className="flex items-center justify-center w-full gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
          <Link href="/">
            <Image
              width={176}
              height={32}
              src={"/images/new/Analytixio.svg"}
              alt="Logo"
              priority
              className="dark:hidden"
              style={{ width: "auto", height: "auto" }}
            />
            <Image
              width={176}
              height={32}
              src={"/images/new/Analytixio.svg"}
              alt="Logo"
              priority
              className="hidden dark:block"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
</div> 
<div className='flex items-center justify-center w-fit lg:p-0 p-6'>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>

</div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear h-[90vh]">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-1 px-4 lg:px-6 flex flex-col justify-between h-full ">
<div className=''>
{menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-5 text-sm font-bold text-black  dark:text-dark-6">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>

              </div>
            ))}
</div>
            <Link
            onClick={handleLogout}
            href={"/"} className={ "text-primary hover:bg-gray-2 hover:text-dark dark:text-gray-5 dark:hover:bg-white/10 dark:hover:text-white group relative flex items-center gap-3 rounded-[7px] px-3.5 py-3 font-medium duration-300 ease-in-out "}
        ><TbLogout2 className="text-2xl" />
              Logout
            </Link>
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
