'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

type Item = {
  id: number
  descricao: string
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [descricao, setDescricao] = useState('')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingDesc, setEditingDesc] = useState('')
  const router = useRouter()

  // Checar login
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) router.push('/login')
    }
    checkAuth()
    fetchItems()
  }, [])

  // Buscar itens
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('id', { ascending: true })
    if (error) alert(error.message)
    else setItems(data)
  }

  // Adicionar item
  const addItem = async () => {
    if (!descricao) return
    const { error } = await supabase
      .from('items')
      .insert([{ descricao }])
    if (error) alert(error.message)
    else {
      setDescricao('')
      fetchItems()
    }
  }

  // Excluir item
  const deleteItem = async (id: number) => {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id)
    if (error) alert(error.message)
    else fetchItems()
  }

  // Logout
  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">CRUD Protegido</h1>
      <button onClick={logout} className="mb-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>

      {/* Formulário adicionar */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          placeholder="Descrição"
          className="border rounded p-2 flex-1"
        />
        <button onClick={addItem} className="px-4 py-2 bg-black text-white rounded">Adicionar</button>
      </div>

      {/* Busca */}
      <input
        type="text"
        placeholder="Buscar..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />

      {/* Lista de itens */}
      <ul className="space-y-2">
        {items.filter(i => i.descricao.toLowerCase().includes(search.toLowerCase())).map(item => (
          <li key={item.id} className="flex justify-between items-center border rounded p-2">
            {editingId === item.id ? (
              <>
                <input
                  value={editingDesc}
                  onChange={e => setEditingDesc(e.target.value)}
                  className="border p-1 rounded flex-1"
                />
                <button onClick={async () => {
                  await supabase.from('items').update({ descricao: editingDesc }).eq('id', item.id)
                  setEditingId(null)
                  fetchItems()
                }} className="px-2 py-1 bg-green-500 text-white rounded">Salvar</button>
              </>
            ) : (
              <>
                <span>{item.id} - {item.descricao}</span>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingId(item.id); setEditingDesc(item.descricao) }} className="px-2 py-1 bg-yellow-500 text-white rounded">Editar</button>
                  <button onClick={() => deleteItem(item.id)} className="px-2 py-1 bg-red-500 text-white rounded">X</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
