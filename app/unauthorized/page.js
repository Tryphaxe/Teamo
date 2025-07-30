"use client"

import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <Lock className="text-red-500 w-8 h-8" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Accès refusé</h1>
        <p className="text-gray-600 mb-6">
          Vous n&apos;avez pas les autorisations nécessaires pour accéder à cette page.
        </p>
        <button
          onClick={() => router.replace("/auth/login")}
          className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
        >
          Retour à la connexion
        </button>
      </div>
    </div>
  )
}