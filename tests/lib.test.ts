import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STATUS_META, STATUSES, compareByStatusThenOrder, LAUNCHED_STATUSES } from '../src/lib/status.ts';
import { isCurrentPath } from '../src/lib/site.ts';
import { getInitials } from '../src/lib/people.ts';
import { excerptAppearsInBody, listNames, plainText } from '../src/lib/notes.ts';

test('note excerpts must appear verbatim in the note body', () => {
  const body = 'First paragraph.\n\n## A heading\n\nWe *build* [technology](https://example.com) that’s\nuseful.\n\n> Quoted line.';
  assert.equal(plainText('We *build* [technology](https://x.y) that’s'), "We build technology that's");
  assert.equal(excerptAppearsInBody("We build technology that's useful.", body), true);
  assert.equal(excerptAppearsInBody('Quoted line.', body), true);
  assert.equal(excerptAppearsInBody('We build products that are useful.', body), false);
  assert.equal(excerptAppearsInBody('   ', body), false);
});

test('listNames joins names in en-GB style', () => {
  assert.equal(listNames(['A']), 'A');
  assert.equal(listNames(['A', 'B', 'C']), 'A, B and C');
});

test('status vocabulary matches the approved labels', () => {
  assert.deepEqual(
    STATUSES.map((s) => STATUS_META[s].label),
    ['Available Now', 'Early Access', 'In Development', 'Planned'],
  );
  assert.deepEqual([...LAUNCHED_STATUSES], ['available-now', 'early-access']);
});

test('lists sort by status first, then order', () => {
  const items = [
    { status: 'planned' as const, order: 1 },
    { status: 'available-now' as const, order: 2 },
    { status: undefined, order: 9 },
    { status: 'in-development' as const, order: 0 },
  ];
  assert.deepEqual(
    [...items].sort(compareByStatusThenOrder).map((i) => i.status ?? 'none'),
    ['none', 'available-now', 'in-development', 'planned'],
  );
});

test('isCurrentPath matches pages and their children, "/" only itself', () => {
  assert.equal(isCurrentPath('/', '/'), true);
  assert.equal(isCurrentPath('/about', '/'), false);
  assert.equal(isCurrentPath('/businesses/education', '/businesses'), true);
  assert.equal(isCurrentPath('/businesses/', '/businesses'), true);
  assert.equal(isCurrentPath('/businessesx', '/businesses'), false);
});

test('founder initials', () => {
  assert.equal(getInitials('Rajeev Kumar'), 'RK');
  assert.equal(getInitials('Abhinav'), 'A');
  assert.equal(getInitials('  Anuj   Shahi '), 'AS');
  assert.equal(getInitials(''), '');
});
