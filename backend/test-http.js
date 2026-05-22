async function run() {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTExMTExMS0xMTExLTQxMTEtODExMS0xMTExMTExMTExMTEiLCJyb2xlIjoiY2l0aXplbiIsImVtYWlsIjoid2FyZ2FAZW1haWwuY29tIiwiZnVsbE5hbWUiOiJCdWRpIFNhbnRvc28iLCJhdmF0YXJVcmwiOm51bGwsImlhdCI6MTc3OTQyODg3OCwiZXhwIjoxNzgwMDMzNjc4fQ.u9OP5lT-ohhar5Oneqia0R7dlNn6NMZQKvZzBEKCDXI";
  
  // POST comment
  await fetch("http://127.0.0.1:4000/api/reports/RPT-2026-0001/comments", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ body: "Test from node fetch" })
  });
  
  // GET DB
  const dbRes = await fetch("http://127.0.0.1:4000/api/reports/debug/comments");
  const dbData = await dbRes.json();
  console.log("DB Comments count:", dbData.length);
  if (dbData.length > 0) {
    console.log("First comment:", dbData[0]);
  }
}
run().catch(console.error);
