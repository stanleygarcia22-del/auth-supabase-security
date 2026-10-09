import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Importante: No uses getSession(), usa getUser() por razones de seguridad
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // Redirigir a /login si no hay usuario y se intenta acceder a la raíz o rutas privadas
  if (!user && url.pathname === '/') {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirigir al dashboard (/) si ya hay usuario e intenta ir a /login
  if (user && url.pathname.startsWith('/login')) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}