import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReportsDashboardView } from '../components/ReportsDashboardView';
import { SalesReportView } from '../components/SalesReportView';
import { CustomReportBuilderView } from '../components/CustomReportBuilderView';
import { ScheduledReportsView } from '../components/ScheduledReportsView';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('Enterprise Reports & Analytics Module Tests', () => {
  test('renders Executive Intelligence Dashboard correctly', () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ReportsDashboardView />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Executive Intelligence Dashboard/i)).toBeInTheDocument();
  });

  test('renders Sales Report View header', () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <SalesReportView />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Comprehensive Sales & Revenue Analytics/i)).toBeInTheDocument();
  });

  test('renders Custom Report Builder schema designer', () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <CustomReportBuilderView />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Custom Report Builder & Query Architect/i)).toBeInTheDocument();
  });

  test('renders Scheduled Reports View manager', () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ScheduledReportsView />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Scheduled Automated Report Subscriptions/i)).toBeInTheDocument();
  });
});
