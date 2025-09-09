'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Item = {
  id: number
  descricao: string
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [descricao, setDescricao] = useState('')

  // Carregar itens do Supabase
  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('id', { ascending: true })
    if (error) alert(error.message)
    else setItems(data)
  }

  async function addItem() {
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

  async function deleteItem(id: number) {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id)
    if (error) alert(error.message)
    else fetchItems()
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">CRUD com Supabase</h1>

      {/* Formulário */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição"
          className="border rounded p-2 flex-1"
        />
        <button
          onClick={addItem}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Adicionar
        </button>
      </div>

      {/* Lista */}
      <ul className="space-y-2">
        {items.map(item => (
          <li
            key={item.id}
            className="flex justify-between items-center border rounded p-2"
          >
            <span>{item.id} - {item.descricao}</span>
            <button
              onClick={() => deleteItem(item.id)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
