'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { reportsApi } from '@/lib/api';
import { format, subDays } from 'date-fns';

interface RevenuePoint {
  day: string;
  totalCents: number;
  total: number;
}

export default function DashboardPage() {
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Default to last 30 days
  const [fromDate, setFromDate] = useState(() => {
    const date = subDays(new Date(), 30);
    return format(date, 'yyyy-MM-dd');
  });
  
  const [toDate, setToDate] = useState(() => {
    return format(new Date(), 'yyyy-MM-dd');
  });

  const fetchRevenueData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await reportsApi.getRevenue(fromDate, toDate);
      
      // Transform the data to include both cents and dollar values
      const transformedData = response.data.map((point: any) => ({
        ...point,
        total: point.totalCents / 100,
      }));
      
      setRevenueData(transformedData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch revenue data');
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchRevenueData();
  }, [fromDate, toDate, fetchRevenueData]);

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    if (field === 'from') {
      setFromDate(value);
    } else {
      setToDate(value);
    }
  };

  const formatTooltip = (value: number, name: string) => {
    if (name === 'total') {
      return [`$${value.toLocaleString()}`, 'Revenue'];
    }
    return [value, name];
  };

  const formatXAxisLabel = (tickItem: string) => {
    return format(new Date(tickItem), 'MMM dd');
  };

  const formatYAxisLabel = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Revenue analytics and key metrics
          </p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading dashboard data
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Revenue analytics and key metrics
        </p>
      </div>

      {/* Date Range Controls */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div>
            <label className="label">From Date</label>
            <input
              type="date"
              className="input max-w-xs"
              value={fromDate}
              onChange={(e) => handleDateChange('from', e.target.value)}
            />
          </div>
          
          <div>
            <label className="label">To Date</label>
            <input
              type="date"
              className="input max-w-xs"
              value={toDate}
              onChange={(e) => handleDateChange('to', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="card">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">Revenue Over Time</h2>
          <p className="text-sm text-gray-500">Daily revenue breakdown</p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  tickFormatter={formatXAxisLabel}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={formatYAxisLabel}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(label) => format(new Date(label), 'PPP')}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${revenueData.reduce((sum, point) => sum + point.total, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Daily</p>
              <p className="text-2xl font-bold text-gray-900">
                ${revenueData.length > 0 
                  ? Math.round(revenueData.reduce((sum, point) => sum + point.total, 0) / revenueData.length).toLocaleString()
                  : '0'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Peak Day</p>
              <p className="text-2xl font-bold text-gray-900">
                ${revenueData.length > 0 
                  ? Math.max(...revenueData.map(p => p.total)).toLocaleString()
                  : '0'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}