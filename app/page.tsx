import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default async function HomePage() {
  // Checar sessão do usuário
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    // Redireciona para login se não estiver logado
    redirect('/login')
  } else {
    // Redireciona para CRUD se já estiver logado
    redirect('/items')
  }
}
