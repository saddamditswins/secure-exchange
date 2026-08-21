/**
 * Self-check for the behaviours fixed in the audit pass.
 *
 * Deliberately dependency-free: transpiles the few modules it needs with the
 * esbuild that already ships inside Vite, then asserts against real behaviour.
 * Run with `npm run check`.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

/** Bundle a TS module to ESM and import it. */
async function load(entry, outName) {
  const outfile = path.join(root, 'node_modules', '.cache', 'selfcheck', outName);
  await build({
    entryPoints: [path.join(root, entry)],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    logLevel: 'silent',
  });
  return import(`file://${outfile}?t=${Date.now()}`);
}

let failures = 0;
const check = (name, fn) => {
  try {
    fn();
    console.log(`  ok   ${name}`);
  } catch (err) {
    failures++;
    // Several assertions match against whole source files; printing the actual
    // value would dump the file and bury the failure.
    const [summary] = String(err.message).split('\n');
    console.error(`  FAIL ${name}\n       ${summary}`);
  }
};

console.log('\nexchange status colours');
{
  const { getExchangeStatusColor } = await load(
    'src/app/utils/exchangeStatus.ts',
    'exchangeStatus.mjs',
  );

  // The bug: the badge fell through to red for every ordinary status, so an
  // Active exchange looked like a failure.
  for (const status of ['Draft', 'Active', 'Approved', 'Completed', 'Sent', 'Viewed']) {
    check(`${status} is not styled as an error`, () => {
      assert.doesNotMatch(getExchangeStatusColor(status), /red/);
    });
  }

  check('Revoked is styled as an error', () => {
    assert.match(getExchangeStatusColor('Revoked'), /red/);
  });

  check('unknown status falls back to neutral, not red', () => {
    assert.match(getExchangeStatusColor('Something New'), /neutral/);
  });
}

console.log('\nlanguage switcher');
{
  const i18n = read('src/i18n.ts');
  const dropdown = read('src/app/components/LanguageDropdown.tsx');

  const registered = new Set(
    [...i18n.matchAll(/^\s{6}(\w+):\s*\{/gm)].map((m) => m[1]),
  );
  const offered = [...dropdown.matchAll(/code:\s*"(\w+)"/g)].map((m) => m[1]);

  check('at least one language is registered', () => {
    assert.ok(registered.size > 0, 'parsed no languages out of src/i18n.ts');
  });

  // The bug: the picker offered Spanish and German with no bundle registered,
  // so choosing them silently fell back to English.
  check('every offered language has a translation bundle', () => {
    const missing = offered.filter((code) => !registered.has(code));
    assert.deepEqual(missing, [], `offered without translations: ${missing.join(', ')}`);
  });

  // The bug: the old LanguageSwitcher set React state but never told i18next.
  check('the mounted picker calls i18n.changeLanguage', () => {
    assert.match(dropdown, /i18n\.changeLanguage\(/);
  });

  check('TopBar mounts the picker that actually switches language', () => {
    assert.match(read('src/app/components/TopBar.tsx'), /<LanguageDropdown/);
  });

  check('i18next is initialised from the entrypoint', () => {
    assert.match(read('src/main.tsx'), /import ["']\.\/i18n["']/);
  });
}

console.log('\ntheme');
{
  const theme = read('src/contexts/ThemeContext.tsx');

  // The bug: theme.css defines `.dark` and a dark variant, but nothing ever
  // put the class on an element, so all of it was inert.
  check('the dark class is applied to the document element', () => {
    assert.match(theme, /classList\.toggle\(\s*['"]dark['"]/);
  });

  check('a corrupt stored theme cannot be cast straight into state', () => {
    assert.doesNotMatch(theme, /\(saved as ThemeMode\)\s*\|\|/);
  });
}

console.log('\notp entry');
{
  const otp = read('src/app/components/OtpInput.tsx');

  // The bug: the secure-share copy took value.slice(-1) with no paste handler,
  // so pasting a 6-digit code from an email filled a single box.
  check('pasting a full code is handled', () => {
    assert.match(otp, /onPaste=/);
    assert.match(otp, /clipboardData\.getData/);
  });

  check('one-time-code autofill is offered', () => {
    assert.match(otp, /one-time-code/);
  });

  check('each digit box has an accessible name', () => {
    assert.match(otp, /aria-label=\{`Digit \$\{index \+ 1\}/);
  });

  // Both external flows must use the shared input, or they drift again.
  for (const f of [
    'src/app/components/external-v2/OTPAuthScreen.tsx',
    'src/app/components/external-ceremony/CeremonyOTPAuth.tsx',
  ]) {
    check(`${path.basename(f)} uses the shared OtpInput`, () => {
      const src = read(f);
      assert.match(src, /<OtpInput/);
      assert.doesNotMatch(src, /value\.slice\(-1\)/);
    });
  }

  check('secure-share flow rejects a code after it expires', () => {
    const src = read('src/app/components/external-v2/OTPAuthScreen.tsx');
    assert.match(src, /timeLeft <= 0/);
  });
}

console.log('\ndemo feedback');
{
  // The bug: 50 toast() calls across 12 files and no <Toaster /> anywhere,
  // so every confirmation message in the app silently did nothing.
  check('a Toaster is mounted at the app root', () => {
    assert.match(read('src/app/App.tsx'), /<Toaster\s*\/>/);
  });

  check('the Toaster reads the app theme, not an unmounted next-themes', () => {
    const src = read('src/app/components/ui/sonner.tsx');
    // Import, not any mention -- the file's comment explains the old behaviour.
    assert.doesNotMatch(src, /^import .* from ["']next-themes["']/m);
    assert.match(src, /contexts\/ThemeContext/);
  });

  // The bug: these actions only wrote to the console, so in a demo you could
  // confirm a delete and watch the row stay exactly where it was.
  for (const f of [
    'src/app/components/SuperAdminOrganizations.tsx',
    'src/app/components/SuperAdminUsers.tsx',
  ]) {
    check(`${path.basename(f)} actions change state instead of logging`, () => {
      const src = read(f);
      assert.doesNotMatch(src, /console\.log/);
      assert.match(src, /toast\.(success|info)\(/);
    });
  }

  check('document Preview and Download do something', () => {
    const src = read('src/app/components/DocumentsView.tsx');
    assert.doesNotMatch(src, /onClick=\{\(\) => console\.log\('(Preview|Download)'/);
    assert.match(src, /<PDFPreviewModal/);
    assert.match(src, /downloadDummyPDF\(/);
  });
}

console.log('\ndomain types');
{
  // The bug: SuperAdminOrganizations produced `name` while the detail screen
  // read `orgName`, behind an `as any`, so the page title rendered blank.
  check('App does not cast an organization to any', () => {
    assert.doesNotMatch(read('src/app/App.tsx'), /selectedOrganization as any/);
  });

  check('organizations are produced with orgName', () => {
    const src = read('src/app/components/SuperAdminOrganizations.tsx');
    assert.match(src, /orgName:/);
    assert.doesNotMatch(src, /\{ id: 'ORG-\d+', name:/);
  });

  check('the misspelled role name is gone', () => {
    const files = ['src/app/components/ExchangeDetailView.tsx', 'src/app/components/AuditLogView.tsx'];
    for (const f of files) assert.doesNotMatch(read(f), /Primary Operational User/);
  });
}

console.log(
  failures === 0
    ? '\nAll checks passed.\n'
    : `\n${failures} check(s) failed.\n`,
);
process.exit(failures === 0 ? 0 : 1);
