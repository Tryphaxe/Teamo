import Headertwo from "@/components/Headertwo";

export default function DashboardLayout({ children }) {
  return (
    <div>
      <Headertwo />
      <div className="w-full p-4 sm:p-6 bg-gray-50">
        {children}
      </div>
    </div>
  );
}