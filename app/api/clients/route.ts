import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id])
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 })
      }
      
      return NextResponse.json(result.rows[0])
    } else {
      const result = await pool.query('SELECT * FROM clients ORDER BY created_at DESC')
      return NextResponse.json(result.rows)
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Erreur lors de la récupération des clients' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, address, city, zip } = await request.json()
    
    const result = await pool.query(
      'INSERT INTO clients (name, email, phone, address, city, zip) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone, address, city, zip]
    )
    
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    console.error('❌ Erreur POST client:', error)
    if (error.code === '23505') {
      const { email } = await request.json()
      
      const existingClient = await pool.query(
        'SELECT name FROM clients WHERE email = $1', 
        [email]
      )
      const existingName = existingClient.rows[0]?.name || 'inconnu'
      return NextResponse.json({ 
        error: `Un client nommé "${existingName}" utilise déjà cet email. Veuillez utiliser un email différent ou modifier le client existant.` 
      }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur lors de la création du client' }, { status: 500 })
  }
}

// AJOUTEZ CETTE FONCTION DELETE
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }
    
    const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      message: 'Client supprimé avec succès',
      deletedClient: result.rows[0]
    })
  } catch (error: any) {
    console.error('❌ Erreur DELETE client:', error)
    return NextResponse.json({ error: 'Erreur lors de la suppression du client' }, { status: 500 })
  }
}
