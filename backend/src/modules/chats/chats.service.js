const { query, withTransaction } = require("../../lib/db");
const { assert } = require("../../lib/http");

async function getOrCreateChatId(client, reportId) {
  const existing = await client.query("SELECT id FROM report_chats WHERE report_id = $1", [reportId]);
  if (existing.rowCount > 0) return existing.rows[0].id;

  const created = await client.query(
    "INSERT INTO report_chats (report_id, created_at) VALUES ($1, NOW()) RETURNING id",
    [reportId]
  );
  return created.rows[0].id;
}

async function getChatMessages(referenceCode, user) {
  const reportResult = await query("SELECT id, reporter_id FROM reports WHERE reference_code = $1", [referenceCode]);
  assert(reportResult.rowCount > 0, 404, "Laporan tidak ditemukan.");
  const report = reportResult.rows[0];

  // Only the reporter or an admin can access the chat
  if (user.role !== "admin" && user.id !== report.reporter_id) {
    assert(false, 403, "Anda tidak memiliki akses ke percakapan laporan ini.");
  }

  const chatResult = await query("SELECT id FROM report_chats WHERE report_id = $1", [report.id]);
  if (chatResult.rowCount === 0) return [];

  const chatId = chatResult.rows[0].id;
  const messagesResult = await query(`
    SELECT 
      m.id, 
      m.sender_id, 
      COALESCE(u.full_name, 'Unknown') as sender_name,
      u.role as sender_role,
      u.avatar_url as sender_avatar_url,
      u.username as sender_username,
      m.body, 
      m.created_at
    FROM report_chat_messages m
    JOIN users u ON u.id = m.sender_id
    WHERE m.chat_id = $1
    ORDER BY m.created_at ASC
  `, [chatId]);

  return messagesResult.rows.map(row => ({
    id: row.id,
    senderId: row.sender_id,
    senderName: row.sender_name,
    senderRole: row.sender_role,
    senderAvatarUrl: row.sender_avatar_url,
    senderUsername: row.sender_username,
    body: row.body,
    createdAt: row.created_at,
  }));
}

async function sendChatMessage(referenceCode, user, body) {
  assert(body?.trim(), 400, "Pesan tidak boleh kosong.");

  return await withTransaction(async (client) => {
    const reportResult = await client.query("SELECT id, reporter_id FROM reports WHERE reference_code = $1", [referenceCode]);
    assert(reportResult.rowCount > 0, 404, "Laporan tidak ditemukan.");
    const report = reportResult.rows[0];

    // Only the reporter or an admin can access the chat
    if (user.role !== "admin" && user.id !== report.reporter_id) {
      assert(false, 403, "Anda tidak memiliki akses ke percakapan laporan ini.");
    }

    const chatId = await getOrCreateChatId(client, report.id);

    const insertResult = await client.query(`
      INSERT INTO report_chat_messages (chat_id, sender_id, body, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, sender_id, body, created_at
    `, [chatId, user.id, body.trim()]);

    const m = insertResult.rows[0];
    const uResult = await client.query("SELECT full_name, username, role, avatar_url FROM users WHERE id = $1", [user.id]);
    const u = uResult.rows[0];

    return {
      id: m.id,
      senderId: m.sender_id,
      senderName: u.full_name,
      senderRole: u.role,
      senderAvatarUrl: u.avatar_url,
      senderUsername: u.username,
      body: m.body,
      createdAt: m.created_at,
    };
  });
}

module.exports = {
  getChatMessages,
  sendChatMessage
};
