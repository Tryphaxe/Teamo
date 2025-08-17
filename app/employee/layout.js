"use client"

import Headertwo from "@/components/Headertwo";
import { useSessionCheck } from "@/lib/checkAuth";

export default function DashboardLayout({ children }) {
  const { expired } = useSessionCheck();
  return (
    <div>
      <Headertwo />
      <div className="w-full p-4 sm:p-6 bg-gray-50">
        {expired && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
              <h2 className="text-lg font-bold">Session expirée</h2>
              <p className="mt-2">Vous avez mis trop de temps. Vous allez être redirigé vers la connexion.</p>
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}