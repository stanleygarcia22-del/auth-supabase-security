'use client'

import { useState } from 'react'

interface ProfileFormProps {
  initialFullName: string
  updateProfile: (formData: FormData) => Promise<void>
}

export function ProfileForm({ initialFullName, updateProfile }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
            Nombre / Usuario:
          </p>
          <p className="text-sm font-medium text-gray-800">
            {initialFullName || 'Sin nombre registrado'}
          </p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Editar perfil
        </button>
      </div>
    )
  }

  return (
    <form
      action={async (formData) => {
        await updateProfile(formData)
        setIsEditing(false)
      }}
      className="flex flex-col gap-2 pt-2 border-t border-gray-200"
    >
      <label htmlFor="fullName" className="text-xs uppercase tracking-wider font-semibold text-gray-500">
        Editar Nombre / Usuario:
      </label>
      <div className="flex gap-2">
        <input
          id="fullName"
          name="fullName"
          type="text"
          defaultValue={initialFullName}
          placeholder="Ingresa tu nombre"
          className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:outline-none"
          autoFocus
        />
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 transition-colors whitespace-nowrap"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}