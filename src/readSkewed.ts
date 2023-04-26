import { Client } from 'pg'

const test = async () => {
  await resetTable()
  const alice = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres',
  })
  await alice.connect()

  const transfer = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres',
  })
  await transfer.connect()
  const balance = 500

  const account1Val = (
    await alice.query(`
        SELECT value from balance where id = '1'
          `)
  ).rows[0].value
  console.log('🚀 ~ file: readSkew.ts:20 ~ test ~ account1Val:', account1Val)

  await transfer.query(`
              UPDATE balance SET value = ${balance + 100} where id = '1'
              `)

  await transfer.query(`
              UPDATE balance SET value = ${balance - 100} where id = '2'
              `)
  const account2Val = (
    await alice.query(`
        SELECT value from balance where id = '2'
          `)
  ).rows[0].value
  console.log('🚀 ~ file: readSkew.ts:34 ~ test ~ account2Val:', account2Val)

  console.log(
    '🚀 ~ file: index.ts:54 ~ test ~ user2Counter:',
    account2Val + account1Val
  )
}

const resetTable = async () => {
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres',
  })
  await client.connect()
  await client.query(`
  CREATE TABLE IF NOT EXISTS balance (
  id SERIAL PRIMARY KEY,
  value INTEGER NOT NULL
  )
`)

  await client.query(`
          DELETE from balance 
      `)

  await client.query(`
INSERT INTO balance (id, value) VALUES (1, 500), (2, 500)        
`)

  await client.end()
}

test()
