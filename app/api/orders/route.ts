import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    console.log('🔍 GET orders - ID recherché:', id)
    
    if (id) {
      const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id])
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })
      }
      
      return NextResponse.json(result.rows[0])
    } else {
      const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC')
      console.log('📦 Commandes trouvées:', result.rows.length)
      return NextResponse.json(result.rows)
    }
  } catch (error: any) {
    console.error('❌ Erreur GET orders:', error)
    return NextResponse.json({ 
      error: 'Erreur lors de la récupération des commandes: ' + error.message 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { order_number, client_name, product, quantity, unit_price, total_price, status, order_date, product_images } = await request.json()
    
    console.log('➕ Création commande:', { order_number, client_name, product })
    
    const result = await pool.query(
      `INSERT INTO orders (order_number, client_name, product, quantity, unit_price, total_price, status, order_date, product_images) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [order_number, client_name, product, quantity, unit_price, total_price, status, order_date, JSON.stringify(product_images)]
    )
    
    console.log('✅ Commande créée:', result.rows[0])
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    console.error('❌ Erreur POST order:', error)
    return NextResponse.json({ error: 'Erreur lors de la création de la commande: ' + error.message }, { status: 500 })
  }
}

// FONCTION PUT POUR MODIFIER
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }
    
    console.log('✏️ Modification commande ID:', id)
    
    const { order_number, client_name, product, quantity, unit_price, total_price, status, order_date, product_images } = await request.json()
    
    const result = await pool.query(
      `UPDATE orders SET 
        order_number = $1, 
        client_name = $2, 
        product = $3, 
        quantity = $4, 
        unit_price = $5, 
        total_price = $6, 
        status = $7, 
        order_date = $8,
        product_images = $9,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 RETURNING *`,
      [order_number, client_name, product, quantity, unit_price, total_price, status, order_date, JSON.stringify(product_images), id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })
    }
    
    console.log('✅ Commande modifiée:', result.rows[0])
    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error('❌ Erreur PUT order:', error)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour de la commande: ' + error.message }, { status: 500 })
  }
}

// FONCTION DELETE POUR SUPPRIMER
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }
    
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Commande supprimée avec succès' })
  } catch (error: any) {
    console.error('❌ Erreur DELETE order:', error)
    return NextResponse.json({ error: 'Erreur lors de la suppression de la commande' }, { status: 500 })
  }
}
