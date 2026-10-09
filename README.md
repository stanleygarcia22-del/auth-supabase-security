# Sistema de Autenticación Segura - Next.js 16 & Supabase SSR

Este proyecto es un sistema de autenticación de usuarios y gestión de perfiles desarrollado con **Next.js 16 (App Router)**, **Supabase Auth/Database/Storage**, **TypeScript** y **Tailwind CSS v4**.

Está diseñado siguiendo las mejores prácticas de seguridad web, incluyendo la gestión de sesiones en el servidor mediante cookies `httpOnly`, protección CSRF/XSS, Row Level Security (RLS) en PostgreSQL y control de acceso mediante Middleware.

---

## 🚀 Características Principales

- **Registro e Inicio de Sesión**: Autenticación segura mediante Server Actions.
- **Gestión Segura de Sesiones**: Implementada con `@supabase/ssr` y cookies `httpOnly` inaccesibles desde JavaScript en el cliente.
- **Middleware Protegido**: Redirección automática de rutas privadas (`/`) y públicas (`/login`). Refresco automático de tokens.
- **Route Handler Callback**: Intercambio de tokens vía `auth/callback` para confirmación por correo y OAuth.
- **Gestión de Perfil y Avatar**: Edición de nombre de usuario y subida de imágenes a Supabase Storage con límite de peso (2 MB).
- **Seguridad en Base de Datos**: Políticas de Row Level Security (RLS) activadas en las tablas `profiles` y el bucket `avatars`.

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16.4 (App Router, Turbopack, React 19)
- **Backend & Auth**: Supabase Auth, PostgreSQL Database, Supabase Storage
- **Librería SSR**: `@supabase/ssr`
- **Estilos**: Tailwind CSS v4 con `@tailwindcss/postcss`
- **Lenguaje**: TypeScript

---

## 📋 Requisitos Previos

- Node.js 18.x o superior
- Cuenta activa en [Supabase](https://supabase.com/)
- Cuenta activa en [Vercel](https://vercel.com/) (para despliegue)

---

## ⚙️ Configuración del Proyecto

### 1. Clonar el repositorio
```bash
git clone [https://github.com/stanleygarcia22-del/auth-supabase-security.git]
-----------------------------------------------------------------------

1. Instalar dependencias: npm install

2. Variables de Entorno - Crea un archivo .env.local en la raíz del proyecto con tus credenciales de Supabase:  

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

3. Configurar Supabase 

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone
);

alter table profiles enable row level security;

create policy "Los usuarios pueden leer su propio perfil"
  on profiles for select using (auth.uid() = id);

create policy "Los usuarios pueden actualizar su propio perfil"
  on profiles for insert with check (auth.uid() = id);

create policy "Los usuarios pueden modificar su propio perfil"
  on profiles for update using (auth.uid() = id);

4. Bucket de Storage (avatars):

Crear un bucket público llamado avatars.

Asignar políticas de lectura pública e inserción/actualización restringida por auth.uid() = owner.

5. Ejecución en Desarrollo : npm run dev