import { Client } from 'pg'

const test = async () => {
  await resetTable()
  const alice = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres',
  })
  await alice.connect()

  const bob = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres',
  })
  await bob.connect()
  await alice.query(`Begin`)

  await alice.query(`
  UPDATE listings SET buyer = 'Alice' where id = '1234'
  `)

  await bob.query(`Begin`)
  await bob.query(`
  UPDATE listings SET buyer = 'Bob' where id = '1234'
              `)

  await bob.query(`
              UPDATE invoices SET recipient = 'Bob' where listing_id = '1234'
              `)
  await bob.query(`Commit`)

  await alice.query(`
    UPDATE invoices SET recipient = 'Alice' where listing_id = '1234'
    `)

  await alice.query(`Commit`)
  await alice.end()
  await bob.end()
  const system = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres',
  })
  await system.connect()

  const buyer = await system.query(`
    SELECT buyer from listings where id = '1234'
    `)
  console.log('🚀 ~ file: dirtyWrite.ts:43 ~ test ~ buyer:', buyer.rows[0])
  const invoice = await system.query(`
    SELECT recipient from invoices where listing_id = '1234'
    `)
  console.log('🚀 ~ file: dirtyWrite.ts:43 ~ test ~ invoice:', invoice.rows[0])
}

const resetTable = async () => {
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres',
  })
  await client.connect()
  await client.query(`
  CREATE TABLE IF NOT EXISTS listings (
  id SERIAL PRIMARY KEY,
  buyer TEXT 
  );
  CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    recipient TEXT,
    listing_id INTEGER NOT NULL    
  );
`)

  await client.query(`
          DELETE from listings;
          DELETE from invoices;
      `)

  await client.query(`
INSERT INTO listings (id) VALUES (1234);
INSERT INTO invoices (id,  listing_id) VALUES (1, 1234);        
`)

  await client.end()
}

test()
