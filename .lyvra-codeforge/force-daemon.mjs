#!/usr/bin/env node
import { appendFileSync, existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const frameworkDir = '.lyvra-codeforge';
const corePath = join(root, frameworkDir, 'codeforge.config.json');
const profilePath = join(root, frameworkDir, 'project-profile.json');
const violations = [];
const findings = [];
const recommendations = [];
const unique = (a) => [...new Set(a.filter(Boolean))];

function git(args, fallback='') {
  try { return execFileSync('git', args, {cwd: root, encoding:'utf8', stdio:['ignore','pipe','ignore']}).trim(); }
  catch { return fallback; }
}
function loadJson(path, label) {
  if (!existsSync(path)) { violations.push(`missing ${label}: ${path}`); return {}; }
  try { return JSON.parse(readFileSync(path,'utf8')); }
  catch (e) { violations.push(`invalid JSON in ${label}: ${e.message}`); return {}; }
}
function startsWithPath(file, prefix) {
  const f = normalize(file).replaceAll('\\','/');
  const p = normalize(prefix).replaceAll('\\','/').replace(/\/$/,'');
  return f === p || f.startsWith(`${p}/`);
}

const core = loadJson(corePath,'core config');
const profile = loadJson(profilePath,'project profile');

for (const [key, expected] of Object.entries({
  runtimeIntegration:false,
  autonomousSourceMutationAuthority:false,
  deploymentMutationAuthority:false,
  secretAuthority:false,
  nativeIdentityOverride:false
})) if (core[key] !== expected) violations.push(`${key} must be ${expected}`);

for (const field of ['projectId','projectName','repository','defaultBranch']) {
  if (!profile[field]) violations.push(`project profile missing ${field}`);
}
for (const requiredFile of profile.requiredFiles ?? []) {
  if (!existsSync(join(root, requiredFile))) violations.push(`required LYVRA file missing: ${requiredFile}`);
}

const tracked = git(['ls-files']).split('\n').filter(Boolean);
const textExt = new Set(['.js','.mjs','.cjs','.ts','.tsx','.jsx','.json','.html','.css','.scss','.md','.yml','.yaml','.toml','.py','.php','.rb','.rs','.go','.java','.kt','.sh','.ps1','.xml']);

for (const runtimeRoot of profile.frameworkRuntimeForbiddenRoots ?? []) {
  for (const file of tracked) {
    if (!startsWithPath(file,runtimeRoot)) continue;
    const full=join(root,file);
    if (!existsSync(full) || !statSync(full).isFile() || !textExt.has(extname(file).toLowerCase())) continue;
    let content=''; try { content=readFileSync(full,'utf8'); } catch { continue; }
    for (const pattern of profile.forbiddenRuntimeReferencePatterns ?? []) {
      if (content.includes(pattern)) violations.push(`${file} references development-only LYVRA CodeForge path: ${pattern}`);
    }
  }
}

const branch = git(['branch','--show-current'], process.env.GITHUB_REF_NAME ?? 'UNKNOWN');
const commit = git(['rev-parse','HEAD'], process.env.GITHUB_SHA ?? 'UNKNOWN');
const baseRef = process.env.GITHUB_BASE_REF || '';
const baseCandidate = baseRef && git(['rev-parse','--verify',`origin/${baseRef}`]);
const parentCandidate = git(['rev-parse','--verify','HEAD^']);
const diffRange = baseCandidate ? `origin/${baseRef}...HEAD` : parentCandidate ? 'HEAD^...HEAD' : '';
const changed = diffRange ? git(['diff','--name-only',diffRange]).split('\n').filter(Boolean) : [];

const touchedDomains=[];
for (const [domain,prefixes] of Object.entries(profile.domains ?? {})) {
  if (changed.some(file => (prefixes ?? []).some(prefix => startsWithPath(file,prefix)))) touchedDomains.push(domain);
}
const protectedChanges = changed.filter(file => (profile.protectedRoots ?? []).some(p => startsWithPath(file,p)));
const deploymentChanges = changed.filter(file => (profile.deploymentRoots ?? []).some(p => startsWithPath(file,p)));

if (protectedChanges.length) recommendations.push('Protected LYVRA current-state scope changed: require explicit readback before promotion.');
if (deploymentChanges.length) recommendations.push('Deployment topology changed: verify routing, permissions, bindings/secrets and post-deploy state.');

console.log(`LYVRA_CODEFORGE_SYSTEM=${core.systemId ?? 'LYVRA-CODEFORGE-001'}`);
console.log(`LYVRA_CODEFORGE_REPOSITORY=${profile.repository ?? 'UNRESOLVED'}`);
console.log(`LYVRA_CODEFORGE_BRANCH=${branch || 'DETACHED'}`);
console.log(`LYVRA_CODEFORGE_COMMIT=${commit}`);
console.log(`LYVRA_CODEFORGE_CHANGED_FILES=${changed.length}`);
console.log(`LYVRA_CODEFORGE_DOMAINS=${touchedDomains.join(',') || 'NONE'}`);
for (const x of unique(findings)) console.log(`LYVRA_CODEFORGE_FINDING=${x}`);
for (const x of unique(recommendations)) console.log(`LYVRA_CODEFORGE_RECOMMENDATION=${x}`);

if (process.env.GITHUB_STEP_SUMMARY) {
  const summary=[
    '# LYVRA CODEFORGE — Repository Audit','',
    `- Project: **${profile.projectName ?? profile.projectId ?? 'unresolved'}**`,
    `- Repository: \`${profile.repository ?? 'unresolved'}\``,
    `- Commit: \`${commit}\``,
    `- Branch: \`${branch || 'DETACHED'}\``,
    `- Changed files: **${changed.length}**`,
    `- Touched domains: **${touchedDomains.join(', ') || 'none'}**`,'',
    '## Recommendations',
    ...(unique(recommendations).length ? unique(recommendations).map(x=>`- ${x}`) : ['- No additional recommendations.']),'',
    '## Isolation',
    violations.length ? `- FAIL: ${violations.length} violation(s)` : '- PASS: LYVRA CodeForge remains development-only and LYVRA-native.',''
  ].join('\n');
  appendFileSync(process.env.GITHUB_STEP_SUMMARY,summary,'utf8');
}

if (violations.length) {
  for (const v of unique(violations)) console.error(`LYVRA_CODEFORGE_VIOLATION=${v}`);
  console.error(`LYVRA_CODEFORGE_FORCE=FAIL ${unique(violations).length} contract violation(s)`);
  process.exitCode=1;
} else {
  console.log('LYVRA_CODEFORGE_NATIVE_IDENTITY=PASS');
  console.log('LYVRA_CODEFORGE_ISOLATION=PASS');
  console.log('LYVRA_CODEFORGE_FORCE=PASS');
}
