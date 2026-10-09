import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Si viene un parámetro 'next', redirige allí; de lo contrario, manda a la raíz /
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // Manejo de proxy si estás en Vercel/similar
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        // En entorno local, redirigimos a http://localhost:3000
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Si hubo un problema al validar el código, lo devolvemos al login con error
  return NextResponse.redirect(`${origin}/login?error=No%20se%20pudo%20validar%20el%20enlace%20de%20autenticación`)
}