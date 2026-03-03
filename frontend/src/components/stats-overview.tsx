'use client';

import React from 'react';
import { FileText, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { day: 'Mon', processed: 24, extracted: 12, analyzed: 8 },
  { day: 'Tue', processed: 34, extracted: 18, analyzed: 14 },
  { day: 'Wed', processed: 28, extracted: 15, analyzed: 11 },
  { day: 'Thu', processed: 45, extracted: 28, analyzed: 22 },
  { day: 'Fri', processed: 52, extracted: 38, analyzed: 31 },
  { day: 'Sat', processed: 38, extracted: 22, analyzed: 16 },
  { day: 'Sun', processed: 22, extracted: 12, analyzed: 9 },
];

const accuracyData = [
  { type: 'Invoices', accuracy: 96 },
  { type: 'Receipts', accuracy: 94 },
  { type: 'Contracts', accuracy: 91 },
  { type: 'Reports', accuracy: 88 },
  { type: 'Forms', accuracy: 92 },
];

export function StatsOverview() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Documents Processed */}
        <Card className="border-border/60 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Processed</CardTitle>
            <FileText className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-success">+12%</span> from last week
            </p>
          </CardContent>
        </Card>

        {/* Extraction Accuracy */}
        <Card className="border-border/60 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.3%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-success">+2.1%</span> improvement
            </p>
          </CardContent>
        </Card>

        {/* Errors */}
        <Card className="border-border/60 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Errors</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-destructive">-8%</span> fewer errors
            </p>
          </CardContent>
        </Card>

        {/* Completed Today */}
        <Card className="border-border/60 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today Complete</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">
              In progress: <span className="font-semibold text-foreground">23</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Processing Trends */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Processing Trends</CardTitle>
            <CardDescription>Last 7 days activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.75rem',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="processed"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={false}
                  name="Processed"
                />
                <Line
                  type="monotone"
                  dataKey="extracted"
                  stroke="var(--secondary)"
                  strokeWidth={2}
                  dot={false}
                  name="Extracted"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Classification Accuracy */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Accuracy by Type</CardTitle>
            <CardDescription>Classification accuracy rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={accuracyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted-foreground)" />
                <YAxis dataKey="type" width={80} stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.75rem',
                  }}
                />
                <Bar dataKey="accuracy" fill="var(--accent)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>Latest processed documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Invoice_2024_001.pdf', type: 'Invoice', status: 'Complete', accuracy: '98%' },
              { name: 'Receipt_Scan_3421.jpg', type: 'Receipt', status: 'Complete', accuracy: '94%' },
              { name: 'Contract_Q1_2024.pdf', type: 'Contract', status: 'Complete', accuracy: '91%' },
              { name: 'Financial_Report_2024.xlsx', type: 'Report', status: 'Processing', accuracy: '-' },
              { name: 'Form_Application_ID.pdf', type: 'Form', status: 'Complete', accuracy: '92%' },
            ].map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:bg-card/80 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.type}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    doc.status === 'Complete'
                      ? 'bg-success/20 text-success'
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {doc.status}
                  </span>
                  {doc.accuracy !== '-' && (
                    <span className="text-sm font-medium text-foreground">{doc.accuracy}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
