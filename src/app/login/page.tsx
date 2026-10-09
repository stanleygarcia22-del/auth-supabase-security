import { login, signup } from './actions'
import { SubmitButton } from './SubmitButton'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Iniciar Sesión
        </h1>

        {/* Alerta de Error */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {/* Alerta de Mensaje Informativo */}
        {message && (
          <div className="mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-700 border border-blue-200">
            {message}
          </div>
        )}

        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="off"
              suppressHydrationWarning
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <SubmitButton
              formAction={login}
              pendingText="Ingresando..."
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Iniciar Sesión
            </SubmitButton>

            <SubmitButton
              formAction={signup}
              pendingText="Registrando..."
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Registrarse
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}