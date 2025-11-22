import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { order_number, client_name, product, quantity, unit_price, total_price, status, order_date } = await request.json()
    
    const result = await pool.query(
      `UPDATE orders SET order_number = $1, client_name = $2, product = $3, quantity = $4, unit_price = $5, 
       total_price = $6, status = $7, order_date = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *`,
      [order_number, client_name, product, quantity, unit_price, total_price, status, order_date, params.id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour de la commande' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [params.id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Commande supprimée avec succès' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression de la commande' }, { status: 500 })
  }
}