import { Navbar } from "@/components/layout/Navbar";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ fontFamily: "var(--font-plus-jakarta )" }}
    >
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
