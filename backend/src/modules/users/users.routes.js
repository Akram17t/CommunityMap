const express = require("express");
const { query } = require("../../lib/db");
const { assert } = require("../../lib/http");

const router = express.Router();

router.get("/:username", async (req, res, next) => {
  try {
    const { username } = req.params;
    
    const result = await query(
      `
        SELECT id, username, full_name, role, avatar_url, created_at
        FROM users
        WHERE lower(username) = lower($1)
      `,
      [username]
    );

    assert(result.rowCount > 0, 404, "User tidak ditemukan.");

    res.json({
      data: {
        user: {
          id: result.rows[0].id,
          username: result.rows[0].username,
          fullName: result.rows[0].full_name,
          role: result.rows[0].role,
          avatarUrl: result.rows[0].avatar_url,
          createdAt: result.rows[0].created_at,
        }
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { usersRouter: router };
