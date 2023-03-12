const { Client } = require('pg')

const client = new Client({
  connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres',
})

const run = async () => {
  await client.connect()

  const response = await client.query(`
        CREATE TABLE IF NOT EXISTS counter (
        myCounter SERIAL PRIMARY KEY,
        count INTEGER NOT NULL
        )
    `)
  console.log(response)
  await client.end()
}

run()
