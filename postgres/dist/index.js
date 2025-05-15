"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// const client = new Client({
//   host: "localhost",
//   port: 5432,
//   database: "postgres",
//   user: "postgres",
//   password: "postgres",
// });
const client = new pg_1.Client({
    connectionString: "postgresql://postgres:postgres@localhost/postgres",
});
function createUsersTable() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const result = yield client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `);
        console.log(result);
    });
}
function insertData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const insertQuery = "INSERT INTO users (username, email, password) VALUES ('username2', 'user3@example.com', 'user_password');";
            const res = yield client.query(insertQuery);
            console.log("Insertion success:", res);
        }
        catch (err) {
            console.error("Error during the insertion:", err);
        }
        finally {
            yield client.end();
        }
    });
}
function insertData2(username, email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const insertQuery = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *; ";
            const values = [username, email, password];
            let res = yield client.query(insertQuery, values);
            console.log("Insertion success:", res);
            console.log(res.rows);
        }
        catch (err) {
            console.error("Error during the insertion:", err);
        }
        finally {
            yield client.end();
        }
    });
}
function getUser(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const query = "SELECT * FROM users WHERE email = $1";
            const values = [email];
            const result = yield client.query(query, values);
            if (result.rows.length > 0) {
                console.log("User found:", result.rows[0]);
                return result.rows[0];
            }
            else {
                console.log("No user found with the given email.");
                return null;
            }
        }
        catch (err) {
            console.error("Error during fetching user:", err);
            throw err;
        }
        finally {
            yield client.end();
        }
    });
}
// Creating the addresses table
function createAddressesTable() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const result = yield client.query(`
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
    });
}
// Inserting the Address to a specific user
function insertAddress(user_id, city, country, street, pincode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const insertQuery = "INSERT INTO addresses (user_id, city, country, street, pincode) VALUES ($1, $2, $3, $4, $5)";
            const values = [user_id, city, country, street, pincode];
            const res = yield client.query(insertQuery, values);
            console.log("Insertion success:", res);
        }
        catch (err) {
            console.error("Error during the insertion:", err);
        }
        finally {
            yield client.end();
        }
    });
}
function getUserDetailsWithAddress(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const query = `
            SELECT *
            FROM users u
            JOIN addresses a ON u.id = a.user_id
            WHERE u.id = $1
        `;
            const result = yield client.query(query, [userId]);
            if (result.rows.length > 0) {
                console.log("User and address found:", result.rows);
                return result.rows[0];
            }
            else {
                console.log("No user or address found with the given ID.");
                return null;
            }
        }
        catch (err) {
            console.error("Error during fetching user and address:", err);
            throw err;
        }
        finally {
            yield client.end();
        }
    });
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
