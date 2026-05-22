const { newDb, DataType } = require("pg-mem");
const { randomUUID } = require("crypto");
const memoryDb = newDb();
memoryDb.public.registerFunction({
  name: "gen_random_uuid",
  returns: DataType.uuid,
  implementation: () => randomUUID(),
  impure: true,
});
const pgAdapter = memoryDb.adapters.createPg();
const memoryPool = new pgAdapter.Pool();

async function run() {
  await memoryPool.query("CREATE TABLE reports (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), val TEXT)");
  await memoryPool.query("INSERT INTO reports (val) VALUES ('test')");
  const res = await memoryPool.query("SELECT id, id::text AS id_text FROM reports");
  console.log("type of id:", typeof res.rows[0].id, "value:", res.rows[0].id);
  console.log("type of id_text:", typeof res.rows[0].id_text, "value:", res.rows[0].id_text);
  process.exit(0);
}
run();
