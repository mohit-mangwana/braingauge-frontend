import { useState } from "react";
import { Outlet } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import { useAuth } from "../../context/AuthContext";

export default function TeacherLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0] || "Teacher";

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-bg)" }}>
      <TeacherSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-[240px]">
        {/* Topbar */}
        <header className="sticky top-0 z-[50] flex items-center justify-between px-7 py-4 border-b border-[var(--color-border)]"
          style={{ background: "var(--color-surface)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-[38px] h-[38px] flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-transparent cursor-pointer text-[18px]"
              style={{ color: "var(--color-text)" }}>
              <i className="ti ti-menu-2" />
            </button>
            <div>
              <h1 className="text-[20px] font-bold leading-none"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
                {greeting}, {firstName} 👋
              </h1>
              <p className="text-[13px] mt-[3px]" style={{ color: "var(--color-muted)" }}>
                Teacher Portal · {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Teacher badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)]"
            style={{ background: "var(--color-primary-bg)" }}>
            <i className="ti ti-chalkboard text-[16px]" style={{ color: "var(--color-primary)" }} />
            <span className="text-[12px] font-semibold" style={{ color: "var(--color-primary)" }}>
              Teacher
            </span>
          </div>
        </header>

        <main className="flex-1 p-7 max-sm:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 