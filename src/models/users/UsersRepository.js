import db from "../../database/index.js"

export default class UsersRepository {
  constructor() {
    this.db = db;
  }

  async getUsers() {
    try {
      const allUsers =  await this.db.manyOrNone("SELECT * FROM users");
    //console.log(allUsers);
    return allUsers;
    } catch (error) {
      console.log("Failed to get users:",  error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await this.db.oneOrNone("SELECT * FROM users WHERE id = $1", id);
    return user;
    } catch (error) {
      console.log(`Failed to get user by id ${id}: `, error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await this.db.oneOrNone("SELECT * FROM users WHERE email = $1", email);
    return user;
    } catch (error) {
      console.log(`Failed to get user by email ${email}: `, error);
      throw error;
    }
  }

  async createUser(user) {
    try {
      await this.db.none("INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)",
    [user.id, user.name, user.email, user.password]
    );
    return user;
    } catch (error) {
      console.log(`Failed to create user ${user}: `, error);
      throw error;
    }
  }

  async updateUser(id, name, email, password) {
    try {
      const user = this.getUserById(id);

    if (!user) {
      return null;
    }

    const updateUser = await this.db.one("UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
    [name, email, password, id]
    );

    return updateUser;
    } catch (error) {
      console.log(`Failed to update user ${id, name}: `, error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      await this.db.none("DELETE FROM users WHERE id = $1", id);
    } catch (error) {
      console.log(`Failed to delete user ${id}: `, error);
      throw error;
    }
  }
}
