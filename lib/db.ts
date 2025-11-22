import { Pool } from 'pg'

const pool = new Pool({
  user: 'luxueux_mdg',
  host: 'localhost',
  database: 'gestion_luxueux',
  password: '15Mars2004',
  port: 5433,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export default pool