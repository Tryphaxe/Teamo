"use client";

import React, { useState } from 'react'
import { Plus, Edit, Trash2, User, Mail, Briefcase, Bell } from 'lucide-react';

export default function Page() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Nouvel employé
          </h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poste
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Département
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner un département</option>
                  <option value="Technique">Technique</option>
                  <option value="Design">Design</option>
                  <option value="Management">Management</option>
                  <option value="Marketing">Marketing</option>
                  <option value="RH">Ressources Humaines</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget annuel (€)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jours de congé
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Ajouter
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex items-center gap-4 mb-4">
        <Bell className="w-6 h-6 text-teal-500" />
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-4">
        <div key="1" className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <span className="text-sm font-medium text-teal-700">
                {
                  ("Informatique").split(' ').map(n => n[0]).join('')
                }
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Il y 2 jours</p>
              <p className="text-lg text-gray-900 mt-1">L&apos;employé KONE Moussa demande 3 jours de congéspour cause maladie</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}