'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [msg, setMsg] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })
    if (error) setMsg(error.message)
    else router.push('/items')
  }

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    })
    if (error) setMsg(error.message)
    else setMsg('Conta criada! Confirme seu email.')
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login / Cadastro</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <div className="flex gap-2">
        <button onClick={handleLogin} className="bg-black text-white px-4 py-2 rounded">Login</button>
        <button onClick={handleSignup} className="bg-gray-700 text-white px-4 py-2 rounded">Cadastrar</button>
      </div>
      {msg && <p className="mt-2 text-red-500">{msg}</p>}
    </div>
  )
}
