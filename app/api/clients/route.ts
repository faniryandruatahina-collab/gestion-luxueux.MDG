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
    const { name, phone, address, city } = await request.json()
    
    const result = await pool.query(
      'INSERT INTO clients (name, phone, address, city) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, phone, address, city]
    )
    
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    console.error('❌ Erreur POST client:', error)
    return NextResponse.json({ error: 'Erreur lors de la création du client' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }
    
    const { name, phone, address, city } = await request.json()
    
    const result = await pool.query(
      'UPDATE clients SET name = $1, phone = $2, address = $3, city = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [name, phone, address, city, id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du client' }, { status: 500 })
  }
}

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
    return NextResponse.json({ error: 'Erreur lors de la suppression du client' }, { status: 500 })
  }
}
