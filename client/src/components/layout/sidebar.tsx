import { useSidebarState } from "./main-layout";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  Layers,
  Heart,
  TrendingUp,
  Factory,
  Wind,
  Truck,
  Route,
  QrCode,
  Menu,
  ChevronLeft,
  BrainCircuit,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  { icon: Home, label: "Panel de Control", href: "/" },
  { icon: Layers, label: "Gestión de Lotes", href: "/lotes" },
  { icon: Heart, label: "Fase de Cría", href: "/cria" },
  { icon: TrendingUp, label: "Alimentación y Engorde", href: "/engorde" },
  { icon: Factory, label: "Proceso Matadero", href: "/matadero" },
  { icon: Wind, label: "Curación (Secadero)", href: "/secadero" },
  { icon: Truck, label: "Logística y Distribución", href: "/distribucion" },
  { icon: Route, label: "Blockchain Tracker", href: "/seguimiento" },
  { icon: QrCode, label: "Generador QR", href: "/trazabilidad" },
  { icon: BrainCircuit, label: "IA y Analítica", href: "/ia-analitica" },
];

export function Sidebar({ className }: SidebarProps) {
  const { collapsed, setCollapsed } = useSidebarState();
  const [location] = useLocation();

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-50 h-full bg-card border-r border-border transition-all duration-300",
        "hidden md:block", // Hide on mobile
        collapsed ? "w-16" : "w-64",
        className,
      )}
      data-testid="sidebar"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-lg flex items-center justify-center shadow-md">
          {/* Tech/IoT Node SVG Icon */}
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </div>
        <div>
          <h2 className="font-bold tracking-tight text-foreground text-sm">
            Sistema de Trazabilidad Ganadera | Plataforma IoT y Blockchain
          </h2>
          <p className="text-[10px] uppercase font-medium text-emerald-600 dark:text-emerald-400">
            Resolut
          </p>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-2">
        <nav className="space-y-1">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location === item.href;

              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "w-full justify-start gap-3 h-10",
                          collapsed ? "px-0 justify-center" : "px-3", // Centramos el icono al colapsar
                          isActive && "bg-primary text-primary-foreground",
                        )}
                        data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {/* Solo mostramos el tooltip flotante si la barra está colapsada */}
                  {collapsed && (
                    <TooltipContent side="right" className="font-medium">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>
        </nav>
      </ScrollArea>
    </div>
  );
}
