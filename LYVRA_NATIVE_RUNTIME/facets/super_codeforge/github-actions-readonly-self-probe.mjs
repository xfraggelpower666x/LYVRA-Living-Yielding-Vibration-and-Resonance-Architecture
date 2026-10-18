// Manually invoked GitHub Actions integration proof, never a ChatGPT Plugin host acceptance.
// Reuses the original LYVRA SuperCodeForge executor without changing its authority.
import { createHash } from 'node:crypto';
import { executeAuthorizedReadOnlyCapability } from './authorized-host-executor.mjs';

const REPOSITORY = 'xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture';
const COMMIT = '49ef14775d23a4aa63d9dcb132fd55148ceb539e';
const PATH = 'LYVRA_NATIVE_RUNTIME/current/thinking/CODEFORGE_TECHNICAL_SELF_UNDERSTANDING.md';
const BLOB = 'e5ae05bed19bfef3612ada3e0ed533da0d23a28f';
const request = Object.freeze({
  capability_id: 'LYVRA_GITHUB_COMMIT_FILE_READBACK_V1',
  origin_system: 'LYVRA', native_authority: 'WHOLE_LYVRA',
  caller: 'LYVRA_SUPERCODEFORGE', permission: 'READ_ONLY_SELF_REPOSITORY',
  operation: 'READ_FILE', repository: REPOSITORY,
  source_commit: COMMIT, path: PATH, expected_blob_sha: BLOB
});

export async function runGitHubActionsSelfProbe({ token, repository = REPOSITORY, fetchImpl = fetch } = {}) {
  if (repository !== REPOSITORY) throw Error('FOREIGN_REPOSITORY_DENIED');
  if (typeof token !== 'string' || token.length === 0) throw Error('AUTHORIZED_TOKEN_MISSING');
  if (typeof fetchImpl !== 'function') throw Error('FETCH_PROVIDER_MISSING');
  let callCount = 0;
  const authorizedGitHubFetchFile = async ({ repository_full_name, path, ref, encoding }) => {
    if (repository_full_name !== REPOSITORY || path !== PATH || ref !== COMMIT || encoding !== 'utf-8')
      throw Error('READ_SCOPE_DENIED');
    callCount++;
    const [owner, name] = REPOSITORY.split('/');
    const safePath = path.split('/').map(encodeURIComponent).join('/');
    const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/contents/${safePath}?ref=${COMMIT}`;
    const response = await fetchImpl(url, {
      method: 'GET',
      headers: { 'Accept': 'application/vnd.github+json', 'Authorization': `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28' }
    });
    if (!response.ok) throw Error(`GITHUB_READ_FAILED_${response.status}`);
    const file = await response.json();
    if (file.type !== 'file' || file.sha !== BLOB || file.encoding !== 'base64' || typeof file.content !== 'string')
      throw Error('GITHUB_BLOB_RESPONSE_INVALID');
    const bytes = Buffer.from(file.content.replace(/\s/g, ''), 'base64');
    const blobHash = createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
    if (blobHash !== BLOB) throw Error('GITHUB_RAW_BYTES_HASH_MISMATCH');
    return { result: { sha: blobHash, content: bytes.toString('utf8'), encoding: 'utf-8' } };
  };
  const result = await executeAuthorizedReadOnlyCapability({ request, authorizedGitHubFetchFile });
  const safeResult = {
    status: result.status, source_blob: result.source_blob || null, source_commit: COMMIT,
    capability_id: request.capability_id, provider_calls: callCount,
    original_repository_executor_invoked: result.original_repository_adapter_invoked === true,
    plugin_host_verified: false, plugin_native_verified: false, plugin_alive_verified: false,
    mutation: false, foreign_activation: false
  };
  if (safeResult.status !== 'SOURCE_READBACK_MATCH' || safeResult.provider_calls !== 1 ||
      safeResult.original_repository_executor_invoked !== true) throw Error('PROBE_NOT_VERIFIED');
  return Object.freeze(safeResult);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  runGitHubActionsSelfProbe({ token: process.env.GITHUB_TOKEN, repository: process.env.GITHUB_REPOSITORY })
    .then(result => { process.stdout.write(JSON.stringify(result) + '\n'); })
    .catch(error => { process.stderr.write(`SUPER_CODEFORGE_ACTIONS_PROBE_BLOCKED: ${error.message}\n`); process.exitCode = 1; });
}
