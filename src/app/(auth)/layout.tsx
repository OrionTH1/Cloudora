function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <section className="flex flex-1 flex-col items-center justify-center bg-white p-4 py-10">
        {children}
      </section>
    </div>
  );
}

export default Layout;
