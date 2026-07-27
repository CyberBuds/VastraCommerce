import { mockStats, mockNotifications, mockTemplates } from '../services/notificationApi';

describe('Notification Module Unit & Integration Tests', () => {
  test('mockStats should contain valid non-negative metrics', () => {
    expect(mockStats.totalNotifications).toBeGreaterThan(0);
    expect(mockStats.deliverySuccessRate).toBeGreaterThan(90);
    expect(mockStats.queueSize).toBeGreaterThanOrEqual(0);
  });

  test('mockNotifications should contain valid channel types and status', () => {
    expect(mockNotifications.length).toBeGreaterThan(0);
    mockNotifications.forEach((n) => {
      expect(['email', 'sms', 'whatsapp', 'push', 'in-app']).toContain(n.channel);
      expect(['delivered', 'sent', 'pending', 'failed', 'queued', 'retrying', 'read']).toContain(n.status);
    });
  });

  test('mockTemplates should have valid code identifiers and variable tokens', () => {
    expect(mockTemplates.length).toBeGreaterThan(0);
    mockTemplates.forEach((tpl) => {
      expect(tpl.code).toMatch(/^[A-Z0-9_]+$/);
      expect(Array.isArray(tpl.variables)).toBe(true);
    });
  });
});
