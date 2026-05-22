const { initializeDatabase } = require('./src/lib/bootstrap.js');
const { getReportByReferenceCode, addComment } = require('./src/modules/reports/reports.service.js');

async function test() {
  await initializeDatabase();
  
  // Add comment
  await addComment('RPT-2026-0001', { id: '11111111-1111-4111-8111-111111111111', role: 'citizen', fullName: 'Budi' }, 'Test comment');
  
  // Get report
  const report = await getReportByReferenceCode('RPT-2026-0001', { id: '11111111-1111-4111-8111-111111111111', role: 'citizen' });
  console.log("Report comments length:", report.comments.length);
}
test().catch(console.error);
