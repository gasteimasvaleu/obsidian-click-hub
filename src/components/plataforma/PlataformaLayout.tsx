import { FuturisticNavbar } from "@/components/FuturisticNavbar";

interface PlataformaLayoutProps {
  children: React.ReactNode;
}

export function PlataformaLayout({ children }: PlataformaLayoutProps) {
  return (
    <div className="min-h-screen pb-24 pt-16">
      <FuturisticNavbar />
      {children}
    </div>
  );
}
