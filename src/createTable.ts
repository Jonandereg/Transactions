const { Client } = require('pg')

const client = new Client({
  connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres',
})

const run = async () => {
  await client.connect()

  const createTable = await client.query(`
        CREATE TABLE IF NOT EXISTS counters (
        id SERIAL PRIMARY KEY,
        value INTEGER NOT NULL
        )
    `)
  console.log('🚀 ~ file: createTable.ts:16 ~ run ~ createTable:', createTable)

  // add myCounter as Id
  const addCounter = await client.query(`
        INSERT INTO counters (id, value) VALUES (1, 0)        
    `)

  console.log('🚀 ~ file: createTable.ts:23 ~ run ~ addCounter:', addCounter)
  await client.end()
}

run()
