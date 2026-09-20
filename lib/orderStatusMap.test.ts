import test from 'node:test';
import assert from 'node:assert/strict';
import { mapUiOrderStatusToBackend } from './orderStatusMap';

test('maps approved status to the backend confirmed status', () => {
  assert.equal(mapUiOrderStatusToBackend('APPROVED'), 'CONFIRMED');
});

test('maps shipping states to backend shipping statuses', () => {
  assert.equal(mapUiOrderStatusToBackend('READY_FOR_SHIPPING'), 'READY_TO_SHIP');
  assert.equal(mapUiOrderStatusToBackend('PACKING'), 'PACKED');
  assert.equal(mapUiOrderStatusToBackend('SHIPPED'), 'SHIPPED');
});

test('keeps supported status values unchanged', () => {
  assert.equal(mapUiOrderStatusToBackend('DELIVERED'), 'DELIVERED');
  assert.equal(mapUiOrderStatusToBackend('PENDING'), 'PENDING');
});
