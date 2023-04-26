import { Client } from 'pg'

const test = async () => {
  await resetTable()
  const client1 = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres',
  })
  await client1.connect()

  const client2 = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres',
  })
  await client2.connect()

  await client1.query(`Begin`)
  await client2.query(`Begin`)
  const user1Val = (
    await client1.query(`
        SELECT value from counters where id = '1'
        FOR UPDATE
          `)
  ).rows[0].value

  const user2Val = (
    await client2.query(`
          SELECT value from counters where id = '1'
          `)
  ).rows[0].value

  setTimeout(async () => {
    await client1.query(`
              UPDATE counters SET value = ${user1Val + 1} where id = '1'
              `)
  }, 1000)

  await client2.query(`
              UPDATE counters SET value = ${user2Val + 1} where id = '1'
              `)
  await client1.query(`Commit`)
  await client2.query(`Commit`)

  const finalVal = await client2.query(`
            SELECT value from counters where id = '1'
            `)
  console.log('🚀 ~ file: index.ts:54 ~ test ~ user2Counter:', finalVal.rows[0])
}

const resetTable = async () => {
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres',
  })
  await client.connect()
  await client.query(`
  CREATE TABLE IF NOT EXISTS counters (
  id SERIAL PRIMARY KEY,
  value INTEGER NOT NULL
  )
`)

  await client.query(`
          DELETE from counters 
      `)

  await client.query(`
INSERT INTO counters (id, value) VALUES (1, 0)        
`)

  await client.end()
}

test()
