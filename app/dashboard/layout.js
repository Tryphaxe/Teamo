import Header from "@/components/Header";

export default function DashboardLayout({ children }) {
  return (
    <div>
      <Header />
      <div className="w-full p-4 sm:p-6 bg-gray-50">
        {children}
      </div>
    </div>
  );
}