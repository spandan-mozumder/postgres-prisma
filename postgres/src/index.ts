import { Client } from "pg";

// const client = new Client({
//   host: "localhost",
//   port: 5432,
//   database: "postgres",
//   user: "postgres",
//   password: "postgres",
// });

const client = new Client({
  connectionString: "postgresql://postgres:postgres@localhost/postgres",
});

async function createUsersTable() {
  await client.connect();
  const result = await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `);
  console.log(result);
}

async function insertData() {
  try {
    await client.connect();
    const insertQuery =
      "INSERT INTO users (username, email, password) VALUES ('username2', 'user3@example.com', 'user_password');";
    const res = await client.query(insertQuery);
    console.log("Insertion success:", res);
  } catch (err) {
    console.error("Error during the insertion:", err);
  } finally {
    await client.end();
  }
}

async function insertData2(username: string, email: string, password: string) {
  try {
    await client.connect();
    const insertQuery =
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *; ";
    const values = [username, email, password];
    let res = await client.query(insertQuery, values);
    console.log("Insertion success:", res);
    console.log(res.rows);
  } catch (err) {
    console.error("Error during the insertion:", err);
  } finally {
    await client.end();
  }
}

async function getUser(email: string) {
  try {
    await client.connect();
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      console.log("User found:", result.rows[0]);
      return result.rows[0];
    } else {
      console.log("No user found with the given email.");
      return null;
    }
  } catch (err) {
    console.error("Error during fetching user:", err);
    throw err;
  } finally {
    await client.end();
  }
}

// Creating the addresses table
async function createAddressesTable() {
  await client.connect();

  const result = await client.query(`
      CREATE TABLE addresses (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          city VARCHAR(100) NOT NULL,
          country VARCHAR(100) NOT NULL,
          street VARCHAR(255) NOT NULL,
          pincode VARCHAR(20),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
        `);
  console.log(result);
}

// Inserting the Address to a specific user
async function insertAddress(
  user_id: number,
  city: string,
  country: string,
  street: string,
  pincode: string
) {
  try {
    await client.connect();
    const insertQuery =
      "INSERT INTO addresses (user_id, city, country, street, pincode) VALUES ($1, $2, $3, $4, $5)";
    const values = [user_id, city, country, street, pincode];
    const res = await client.query(insertQuery, values);
    console.log("Insertion success:", res);
  } catch (err) {
    console.error("Error during the insertion:", err);
  } finally {
    await client.end();
  }
}

async function getUserDetailsWithAddress(userId: string) {
  try {
    await client.connect();
    const query = `
            SELECT *
            FROM users u
            JOIN addresses a ON u.id = a.user_id
            WHERE u.id = $1
        `;
    const result = await client.query(query, [userId]);

    if (result.rows.length > 0) {
      console.log("User and address found:", result.rows);
      return result.rows[0];
    } else {
      console.log("No user or address found with the given ID.");
      return null;
    }
  } catch (err) {
    console.error("Error during fetching user and address:", err);
    throw err;
  } finally {
    await client.end();
  }
}

// createUsersTable();
insertData();
// insertData2("username10", "user10@example.com", "user_password").catch(
//   console.error
// );
// getUser("user5@example.com").catch(console.error);
// createAddressesTable();
// insertAddress(1, "New York", "USA", "123 Bronderry St", "10003");
// getUserDetailsWithAddress("1");
