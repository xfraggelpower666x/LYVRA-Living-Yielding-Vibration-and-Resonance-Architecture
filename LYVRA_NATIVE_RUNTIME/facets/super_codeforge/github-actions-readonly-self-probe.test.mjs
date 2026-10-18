import assert from 'node:assert/strict';
import { runGitHubActionsSelfProbe } from './github-actions-readonly-self-probe.mjs';
const REPO = 'xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture';
let called = 0;
const failIfCalled = async () => { called++; throw Error('PROVIDER_MUST_NOT_RUN'); };

await assert.rejects(
  runGitHubActionsSelfProbe({ token: 'test-only', repository: 'foreign/repo', fetchImpl: failIfCalled }),
  /FOREIGN_REPOSITORY_DENIED/
);
await assert.rejects(
  runGitHubActionsSelfProbe({ token: '', repository: REPO, fetchImpl: failIfCalled }),
  /AUTHORIZED_TOKEN_MISSING/
);
await assert.rejects(
  runGitHubActionsSelfProbe({ token: 'test-only', repository: REPO, fetchImpl: null }),
  /FETCH_PROVIDER_MISSING/
);
assert.equal(called, 0);

const failedFetch = async (_url, opts) => {
  called++;
  assert.equal(opts.method, 'GET');
  return { ok: false, status: 403 };
};
await assert.rejects(
  runGitHubActionsSelfProbe({ token: 'test-only', repository: REPO, fetchImpl: failedFetch }),
  /PROBE_NOT_VERIFIED/
);
assert.equal(called, 1);

const forgedBlob = async (url, opts) => {
  called++;
  assert.match(url, /^https:\/\/api\.github\.com\/repos\/xfraggelpower666x\//);
  assert.equal(opts.method, 'GET');
  return {
    ok: true,
    json: async () => ({
      type: 'file',
      sha: 'e5ae05bed19bfef3612ada3e0ed533da0d23a28f',
      encoding: 'base64',
      content: Buffer.from('malicious fake content').toString('base64')
    })
  };
};
await assert.rejects(
  runGitHubActionsSelfProbe({ token: 'test-only', repository: REPO, fetchImpl: forgedBlob }),
  /PROBE_NOT_VERIFIED/
);
assert.equal(called, 2);
console.log('PASS: GitHub Actions adapter rejects foreign scope, absent token/provider, failed API and forged content');
