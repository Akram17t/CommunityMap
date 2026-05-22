const { updateReportStatus } = require('./src/modules/reports/reports.service');
const { env } = require('./src/config/env');
async function run() {
  try {
    const report = await updateReportStatus('RPT-2026-0001', 'verified', '22222222-2222-4222-8222-222222222222', { note: 'test verify' });
    console.log("Success:", report.status);
    process.exit(0);
  } catch (err) {
    console.error("Failed:", err);
    process.exit(1);
  }
}
run();
