import Hero from "@/components/hero";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="lg:h-screen flex divide-x p-6">
      <Hero />
      <div className="px-4 w-full h-full">{children}</div>
    </main>
  );
}
