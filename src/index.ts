import { Client } from 'pg'

const runUser1 = async () => {
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres',
  })
  await client.connect()

  await client.query(`
  UPDATE counters SET value = value + 1 where id = '1'
  `)

  setTimeout(async () => {
    await client.query(`Commit`)
    await client.end()
  }, 2000)
}

const runUser2 = async () => {
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres',
  })
  await client.connect()

  const user2Counter = await client.query(`
  SELECT value from counters where id = '1'
    `)
  console.log(
    '🚀 ~ file: index.ts:24 ~ runUser2 ~ user2Counter:',
    user2Counter.rows[0]
  )
}

const test = async () => {
  runUser1()
  runUser2()
}

test()
