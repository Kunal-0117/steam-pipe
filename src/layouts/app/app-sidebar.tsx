import {
  IconDashboard,
  IconDatabaseExport,
  IconDeviceIpad,
  IconFileStack,
  IconHelp,
  IconInnerShadowTop,
  IconRouter,
  IconSettings,
  IconShieldCheck,
} from "@tabler/icons-react";
import * as React from "react";
import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "@/layouts/app/nav-main";
import { NavSecondary } from "@/layouts/app/nav-secondary";
import { NavUser } from "@/layouts/app/nav-user";
import { useLocation } from "react-router-dom";

const data = {
  user: {
    name: "Admin",
    email: "admin@steampipe.io",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Gateways",
      url: "/gateways",
      icon: IconRouter,
    },
    {
      title: "Profiles",
      url: "/profiles",
      icon: IconFileStack,
    },
    {
      title: "Devices",
      url: "/devices",
      icon: IconDeviceIpad,
    },
    {
      title: "Destinations",
      url: "/destinations",
      icon: IconDatabaseExport,
    },
    {
      title: "Rules",
      url: "/rules",
      icon: IconShieldCheck,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpenMobile } = useSidebar();
  const location = useLocation();

  // Close sidebar on mobile when navigating
  React.useEffect(() => {
    setOpenMobile(false);
  }, [location.pathname, setOpenMobile]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Steam Pipe</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
