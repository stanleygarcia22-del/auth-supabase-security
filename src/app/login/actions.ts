'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// 1. Iniciar sesión
export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

// 2. Registrarse
export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/login?message=Revisa tu correo para confirmar tu registro')
}

// 3. Cerrar sesión
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

// 4. Actualizar Nombre / Perfil
export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const fullName = formData.get('fullName') as string

  // Usamos upsert para insertar la fila si no existe o actualizarla si existe
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      full_name: fullName,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Error al actualizar perfil:', error.message)
    return
  }

  revalidatePath('/')
}

// 5. Subir Avatar / Imagen de Perfil
export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const file = formData.get('avatar') as File
  if (!file || file.size === 0) return

  // Validación para limitar el peso a máximo 2 MB
  if (file.size > 2 * 1024 * 1024) {
    console.error('El archivo excede el tamaño máximo permitido de 2MB')
    return
  }

  const fileExt = file.name.split('.').pop()
  const filePath = `${user.id}/avatar.${fileExt}`

  // Subir o sobrescribir la imagen en el Bucket 'avatars'
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    console.error('Error subiendo imagen:', uploadError.message)
    return
  }

  // Obtener la URL pública de la imagen
  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(filePath)

  // Guardar/Actualizar la URL en la tabla 'profiles'
  await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      avatar_url: `${publicUrl}?t=${Date.now()}`, // Timestamp para evitar la caché del navegador
      updated_at: new Date().toISOString(),
    })

  revalidatePath('/')
}