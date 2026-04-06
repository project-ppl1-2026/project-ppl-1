"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BookText,
  ChevronDown,
  FileText,
  Home,
  LayoutGrid,
  List,
  LogOut,
  Menu,
  Shield,
  Sparkles,
  UserCircle,
  Users,
  X,
  Zap,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

type Role = "guest" | "user" | "admin";

type Session = {
  role: Role;
  name: string;
  email: string;
  image?: string | null;
};

type HomeSection = {
  label: string;
  sectionId: string | null;
  href: string;
  desc: string;
};

type MenuItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const guestSession: Session = {
  role: "guest",
  name: "Guest",
  email: "",
  image: null,
};

const homeSections: HomeSection[] = [
  {
    label: "Hero",
    sectionId: "hero",
    href: "/#hero",
    desc: "Kembali ke atas halaman",
  },
  {
    label: "Fitur",
    sectionId: "features",
    href: "/#features",
    desc: "Semua fitur platform",
  },
  {
    label: "Tentang Kami",
    sectionId: "purpose",
    href: "/#purpose",
    desc: "Tujuan & segmentasi usia",
  },
  {
    label: "Cara Kerja",
    sectionId: "how",
    href: "/#how",
    desc: "Bagaimana platform bekerja",
  },
  {
    label: "Testimoni",
    sectionId: "testi",
    href: "/#testi",
    desc: "Kata pengguna kami",
  },
];

const userMenuItems: MenuItem[] = [
  { label: "Profile", href: "/profile", icon: <UserCircle size={15} /> },
  { label: "Dashboard", href: "/dashboard", icon: <LayoutGrid size={15} /> },
  { label: "Diary", href: "/diary", icon: <BookText size={15} /> },
  {
    label: "Recommendation",
    href: "/recommendation",
    icon: <Sparkles size={15} />,
  },
  { label: "Insight", href: "/insight", icon: <BarChart3 size={15} /> },
];

const adminMenuItems: MenuItem[] = [
  { label: "Admins", href: "/admin", icon: <Shield size={15} /> },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart3 size={15} />,
  },
  { label: "Audit Log", href: "/admin/audit-log", icon: <List size={15} /> },
  { label: "Reports", href: "/admin/reports", icon: <FileText size={15} /> },
  { label: "Users", href: "/admin/users", icon: <Users size={15} /> },
  { label: "Simulator", href: "/admin/simulator", icon: <Zap size={15} /> },
];

function useOutsideClick(cb: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        cb();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [cb]);

  return ref;
}

function useSmoothScroll() {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (sectionId: string | null, href: string) => {
      if (sectionId === null) {
        if (pathname === "/") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          router.push("/");
        }
        return;
      }

      if (pathname === "/") {
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", `/#${sectionId}`);
          return;
        }
      }

      router.push(href);
    },
    [pathname, router],
  );
}

function Avatar({
  name,
  image,
  size = 32,
}: {
  name: string;
  image?: string | null;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold"
      style={{
        width: size,
        height: size,
        fontSize: size < 30 ? 11 : 12,
        background:
          "linear-gradient(135deg, var(--brand-primary-dark), var(--brand-primary))",
        color: "#fff",
      }}
    >
      {image ? (
        <Image
          src={image}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}

function NavLink({
  label,
  isActive,
  href,
  onClick,
}: {
  label: string;
  isActive: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const textStyle: CSSProperties = {
    color: isActive ? "var(--brand-primary)" : "var(--brand-text-secondary)",
  };

  const underlineStyle: CSSProperties = {
    background: "var(--brand-primary)",
    transform: `scaleX(${isActive ? 1 : 0})`,
    opacity: isActive ? 1 : 0,
  };

  const content = (
    <>
      <span
        className="text-sm font-medium transition-colors duration-150 group-hover:text-(--brand-primary)"
        style={textStyle}
      >
        {label}
      </span>
      <span
        className="absolute -bottom-0.5 left-0 right-0 h-0.5 origin-center rounded-full transition-all duration-150 group-hover:scale-x-100 group-hover:opacity-100"
        style={underlineStyle}
      />
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="group relative flex cursor-pointer flex-col items-center pb-0.5 outline-none"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href ?? "#"}
      className="group relative flex cursor-pointer flex-col items-center pb-0.5"
    >
      {content}
    </Link>
  );
}

function HomeDropdown({ isActive }: { isActive: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const smoothScroll = useSmoothScroll();
  const ref = useOutsideClick(() => setOpen(false));

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="group relative flex cursor-pointer items-center gap-1.5 pb-0.5 text-sm font-medium outline-none"
        style={{
          color:
            isActive || open
              ? "var(--brand-primary)"
              : "var(--brand-text-secondary)",
        }}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Home
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
        />
        <span
          className="absolute -bottom-0.5 left-0 right-0 h-0.5 origin-center rounded-full transition-all duration-150 group-hover:scale-x-100 group-hover:opacity-100"
          style={{
            background: "var(--brand-primary)",
            transform: `scaleX(${isActive || open ? 1 : 0})`,
            opacity: isActive || open ? 1 : 0,
          }}
        />
      </button>

      <div
        className={`absolute left-1/2 z-50 mt-4 w-64 -translate-x-1/2 overflow-hidden rounded-2xl transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-2 scale-95 opacity-0"
        }`}
        style={{
          background: "rgba(255,255,255,0.99)",
          border: "1.5px solid var(--brand-border)",
          boxShadow:
            "0 20px 64px rgba(26,40,64,0.16), 0 4px 16px rgba(26,40,64,0.08)",
        }}
      >
        <div className="p-2.5">
          {homeSections.map((item, index) => (
            <button
              key={item.label}
              onClick={() => {
                setOpen(false);
                smoothScroll(item.sectionId, item.href);
              }}
              className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150"
              onMouseEnter={(event) => {
                event.currentTarget.style.background =
                  "var(--brand-primary-ghost)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = "transparent";
              }}
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: "var(--brand-primary-ghost)",
                  color: "var(--brand-primary)",
                }}
              >
                {index === 0 ? <Home size={13} /> : <List size={13} />}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-(--brand-text-primary)">
                  {item.label}
                </p>
                <p className="truncate text-[11px] text-(--brand-text-muted)">
                  {item.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileDropdown({ session }: { session: Session }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useOutsideClick(() => setOpen(false));
  const items = session.role === "admin" ? adminMenuItems : userMenuItems;

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 outline-none transition-all duration-150 active:scale-[0.98]"
        style={{
          background: open ? "var(--brand-primary-ghost)" : "transparent",
          border: `1.5px solid ${open ? "var(--brand-primary-pale)" : "var(--brand-border)"}`,
        }}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Avatar name={session.name} image={session.image} size={26} />
        <span className="hidden max-w-25 truncate text-sm font-semibold text-(--brand-text-primary) sm:block">
          {session.name}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      <div
        className={`absolute right-0 z-50 mt-3 w-52 overflow-hidden rounded-2xl transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-2 scale-95 opacity-0"
        }`}
        style={{
          background: "var(--brand-drop-dark)",
          border: "1px solid var(--brand-drop-dark-border)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2)",
        }}
      >
        <div
          className="flex items-center gap-3 px-4 py-3.5"
          style={{ borderBottom: "1px solid var(--brand-drop-dark-border)" }}
        >
          <Avatar name={session.name} image={session.image} size={34} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-(--brand-drop-text)">
              {session.name}
            </p>
            <p className="truncate text-[11px] text-(--brand-drop-text-muted)">
              {session.role === "admin" ? "Administrator" : "Pengguna"}
            </p>
          </div>
        </div>

        <div className="p-2">
          {items.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150"
                style={{
                  color: isActive
                    ? "var(--brand-primary-light)"
                    : "var(--brand-drop-text)",
                  background: isActive
                    ? "rgba(78,207,195,0.12)"
                    : "transparent",
                }}
                onMouseEnter={(event) => {
                  if (!isActive) {
                    event.currentTarget.style.background =
                      "var(--brand-drop-dark-hover)";
                  }
                }}
                onMouseLeave={(event) => {
                  if (!isActive) {
                    event.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <span
                  className="shrink-0"
                  style={{
                    color: isActive
                      ? "var(--brand-primary-light)"
                      : "var(--brand-drop-text-muted)",
                  }}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div
          className="p-2"
          style={{ borderTop: "1px solid var(--brand-drop-dark-border)" }}
        >
          <button
            onClick={async () => {
              setOpen(false);
              await authClient.signOut();
              window.location.href = "/login";
            }}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150"
            style={{ color: "#F87171" }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = "rgba(248,113,113,0.1)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "transparent";
            }}
          >
            <LogOut size={15} /> Keluar
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({
  open,
  session,
  onClose,
}: {
  open: boolean;
  session: Session;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const smoothScroll = useSmoothScroll();
  const isLoggedIn = session.role !== "guest";
  const items = session.role === "admin" ? adminMenuItems : userMenuItems;

  const handleSectionClick = (sectionId: string | null, href: string) => {
    onClose();
    setTimeout(() => smoothScroll(sectionId, href), 140);
  };

  return (
    <div
      className={`overflow-hidden border-t transition-all duration-300 md:hidden ${
        open ? "opacity-100" : "opacity-0"
      }`}
      style={{ borderColor: "var(--brand-border)", maxHeight: open ? 840 : 0 }}
    >
      <div className="flex flex-col gap-1 px-5 py-4">
        <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-(--brand-text-muted)">
          Halaman
        </p>

        {homeSections.map((item, index) => (
          <button
            key={item.label}
            onClick={() => handleSectionClick(item.sectionId, item.href)}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-(--brand-text-secondary) transition-colors duration-150"
            onMouseEnter={(event) => {
              event.currentTarget.style.background =
                "var(--brand-primary-ghost)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "transparent";
            }}
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: "var(--brand-primary-ghost)",
                color: "var(--brand-primary)",
              }}
            >
              {index === 0 ? <Home size={12} /> : <List size={12} />}
            </span>
            {item.label}
          </button>
        ))}

        <div className="my-2 h-px bg-(--brand-border)" />

        <Link
          href="/about"
          onClick={onClose}
          className="flex cursor-pointer items-center rounded-xl px-3 py-2.5 text-sm font-medium"
          style={{
            color: pathname.startsWith("/about")
              ? "var(--brand-primary)"
              : "var(--brand-text-secondary)",
            background: pathname.startsWith("/about")
              ? "var(--brand-primary-ghost)"
              : "transparent",
          }}
        >
          About Us
        </Link>

        <Link
          href="/features"
          onClick={onClose}
          className="flex cursor-pointer items-center rounded-xl px-3 py-2.5 text-sm font-medium"
          style={{
            color: pathname.startsWith("/features")
              ? "var(--brand-primary)"
              : "var(--brand-text-secondary)",
            background: pathname.startsWith("/features")
              ? "var(--brand-primary-ghost)"
              : "transparent",
          }}
        >
          Fitur
        </Link>

        <Link
          href="/pricing"
          onClick={onClose}
          className="flex cursor-pointer items-center rounded-xl px-3 py-2.5 text-sm font-medium"
          style={{
            color: pathname.startsWith("/pricing")
              ? "var(--brand-primary)"
              : "var(--brand-text-secondary)",
            background: pathname.startsWith("/pricing")
              ? "var(--brand-primary-ghost)"
              : "transparent",
          }}
        >
          Harga
        </Link>

        <div className="my-2 h-px bg-(--brand-border)" />

        {!isLoggedIn ? (
          <>
            <Link
              href="/login"
              onClick={onClose}
              className="flex h-11 cursor-pointer items-center justify-center rounded-xl text-sm font-semibold"
              style={{
                border: "1.5px solid var(--brand-border)",
                color: "var(--brand-primary)",
              }}
            >
              Masuk
            </Link>

            <Link
              href="/register"
              onClick={onClose}
              className="flex h-11 cursor-pointer items-center justify-center rounded-xl text-sm font-semibold text-white"
              style={{
                background: "var(--brand-primary)",
                boxShadow: "0 2px 12px rgba(26,150,136,0.28)",
              }}
            >
              Daftar Gratis
            </Link>
          </>
        ) : (
          <>
            <div className="mb-1 flex items-center gap-3 px-3 py-2">
              <Avatar name={session.name} image={session.image} size={32} />
              <div>
                <p className="text-[13px] font-semibold text-(--brand-text-primary)">
                  {session.name}
                </p>
                <p className="text-[11px] text-(--brand-text-muted)">
                  {session.role === "admin" ? "Administrator" : "Pengguna"}
                </p>
              </div>
            </div>

            {items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium"
                  style={{
                    color: active
                      ? "var(--brand-primary)"
                      : "var(--brand-text-secondary)",
                    background: active
                      ? "var(--brand-primary-ghost)"
                      : "transparent",
                  }}
                >
                  <span
                    style={{
                      color: active
                        ? "var(--brand-primary)"
                        : "var(--brand-text-muted)",
                    }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}

            <button
              onClick={async () => {
                onClose();
                await authClient.signOut();
                window.location.href = "/login";
              }}
              className="mt-1 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium"
              style={{ color: "#EF4444" }}
            >
              <LogOut size={15} /> Keluar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<Session>(guestSession);
  const isLoggedIn = session.role !== "guest";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    let mounted = true;

    const syncSession = async () => {
      try {
        const { data } = await authClient.getSession();

        if (!mounted) {
          return;
        }

        if (!data?.user) {
          setSession(guestSession);
          return;
        }

        const role = (data.user as { role?: string }).role;
        setSession({
          role: role === "admin" ? "admin" : "user",
          name: data.user.name,
          email: data.user.email,
          image: data.user.image,
        });
      } catch {
        if (mounted) {
          setSession(guestSession);
        }
      }
    };

    void syncSession();

    return () => {
      mounted = false;
    };
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(250,251,255,0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--brand-border)",
        fontFamily: "var(--font-plus-jakarta, sans-serif)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <Link href="/" className="flex cursor-pointer items-center gap-2.5">
          <Image
            src="/img/LOGO_TEMANTUMBUH.svg"
            alt="TemanTumbuh"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-sm font-bold text-(--brand-text-primary)">
            TemanTumbuh
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-7 md:flex">
          <HomeDropdown isActive={pathname === "/"} />
          <NavLink
            label="About Us"
            isActive={pathname.startsWith("/about")}
            href="/about"
          />
          <NavLink
            label="Fitur"
            isActive={pathname.startsWith("/features")}
            href="/features"
          />
          <NavLink
            label="Harga"
            isActive={pathname.startsWith("/pricing")}
            href="/pricing"
          />
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="relative inline-flex cursor-pointer overflow-hidden rounded-xl px-4 py-2 text-sm font-semibold"
                style={{ color: "var(--brand-primary)" }}
              >
                <span
                  className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-150 hover:opacity-100"
                  style={{ background: "var(--brand-primary-ghost)" }}
                />
                <span className="relative">Masuk</span>
              </Link>

              <Link
                href="/register"
                className="relative inline-flex cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-transform active:scale-[0.97]"
                style={{
                  background:
                    "linear-gradient(135deg, var(--brand-primary-dark) 0%, var(--brand-primary) 60%, var(--brand-primary-mid) 100%)",
                  boxShadow: "0 2px 14px rgba(26,150,136,0.32)",
                }}
              >
                <span className="absolute inset-0 rounded-xl bg-white/0 transition-colors duration-150 hover:bg-white/10" />
                <span className="relative">Daftar Gratis</span>
              </Link>
            </>
          ) : (
            <ProfileDropdown session={session} />
          )}
        </div>

        <button
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X size={20} className="text-(--brand-text-primary)" />
          ) : (
            <Menu size={20} className="text-(--brand-text-primary)" />
          )}
        </button>
      </div>

      <MobileMenu
        open={mobileOpen}
        session={session}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}

export default Navbar;
