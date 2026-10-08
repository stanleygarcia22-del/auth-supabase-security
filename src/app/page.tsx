import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { logout, updateProfile } from './login/actions'
import { ProfileForm } from './ProfileForm'

async function UserProfile() {
  await connection()

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  return (
    <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        ¡Bienvenido de nuevo!
      </h1>
      <p className="text-gray-500 mb-6 text-sm">
        Perfil sincronizado desde la base de datos
      </p>

      <div className="mb-6 rounded-lg bg-gray-50 p-4 border text-left flex flex-col gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
            Correo electrónico:
          </p>
          <p className="text-sm font-medium text-gray-800">{user.email}</p>
        </div>

        {/* Componente interactivo para ver/editar nombre */}
        <ProfileForm
          initialFullName={profile?.full_name || ''}
          updateProfile={updateProfile}
        />
      </div>

      <form>
        <button
          formAction={logout}
          className="w-full rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 transition-colors"
        >
          Cerrar Sesión
        </button>
      </form>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <Suspense fallback={<div className="text-gray-500">Cargando perfil...</div>}>
        <UserProfile />
      </Suspense>
    </main>
  )
}