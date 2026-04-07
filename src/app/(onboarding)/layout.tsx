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
      <main className="flex-1">{children}</main>
    </div>
  );
}
