import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { updateProfile } from './login/actions'

async function uploadAvatar(formData: FormData) {
  'use server'

  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  const file = formData.get('avatar')

  if (!(file instanceof File) || file.size === 0) {
    return
  }

  const fileExt = file.name.split('.').pop() || 'png'
  const fileName = `${user.id}-${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    })

  if (uploadError) {
    throw uploadError
  }

  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrlData.publicUrl })
    .eq('id', user.id)

  if (updateError) {
    throw updateError
  }

  redirect('/')
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Obtener datos del perfil desde la tabla 'profiles'
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Panel de Control (Dashboard)</h1>
        <p className="text-sm text-gray-500 mb-6">Ruta privada protegida por Middleware</p>

        {/* Sección de Avatar y Correo */}
        <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Avatar del usuario"
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-indigo-600">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {profile?.full_name || 'Usuario sin nombre'}
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Formulario para cambiar Avatar */}
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-700 mb-2">Actualizar foto de perfil</h3>
          <form action={uploadAvatar} className="flex items-center gap-3">
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              Subir Imagen
            </button>
          </form>
        </div>

        {/* Formulario para cambiar Nombre */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-md font-medium text-gray-700 mb-2">Información del Perfil</h3>
          <form action={updateProfile} className="flex gap-3">
            <input
              type="text"
              name="fullName"
              defaultValue={profile?.full_name || ''}
              placeholder="Tu nombre completo"
              className="block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition-colors whitespace-nowrap"
            >
              Guardar Nombre
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}