import Header from "@/components/Header";

export default function DashboardLayout({ children }) {
  return (
    <div>
      <Header />
      <div className="w-full px-4 sm:px-10 py-6 bg-gray-50">
        {children}
      </div>
    </div>
  );
}