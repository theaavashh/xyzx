'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';

interface ShipmentStatusData {
  date: string;
  delivered: number;
  inTransit: number;
  pending: number;
  returned: number;
}

interface CarrierPerformanceData {
  carrier: string;
  shipments: number;
  onTimeRate: number;
  avgDeliveryDays: number;
}

interface RegionalPerformanceData {
  region: string;
  shipments: number;
  deliveryTime: number;
  successRate: number;
}

interface DeliveryTimeTrendData {
  date: string;
  avgDeliveryTime: number;
  targetTime: number;
}

interface CostAnalysisData {
  category: string;
  actualCost: number;
  budget: number;
}

interface DeliveryTimeDistributionData {
  range: string;
  count: number;
  percentage: number;
}

interface ShippingVolumeData {
  month: string;
  shipments: number;
  revenue: number;
}

// Colors for charts
const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
];

// Shipment Status Over Time Chart
interface ShipmentStatusChartProps {
  data: ShipmentStatusData[];
  title: string;
}

export function ShipmentStatusChart({ data, title }: ShipmentStatusChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            }
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="delivered"
            stackId="1"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.6}
            name="Delivered"
          />
          <Area
            type="monotone"
            dataKey="inTransit"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            name="In Transit"
          />
          <Area
            type="monotone"
            dataKey="pending"
            stackId="1"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.6}
            name="Pending"
          />
          <Area
            type="monotone"
            dataKey="returned"
            stackId="1"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.6}
            name="Returned"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Carrier Performance Comparison Chart
interface CarrierPerformanceChartProps {
  data: CarrierPerformanceData[];
  title: string;
}

export function CarrierPerformanceChart({
  data,
  title,
}: CarrierPerformanceChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="carrier" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="shipments"
            fill="#3b82f6"
            name="Shipments"
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="onTimeRate"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            name="On-Time Rate %"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Regional Performance Map Chart
interface RegionalPerformanceChartProps {
  data: RegionalPerformanceData[];
  title: string;
}

export function RegionalPerformanceChart({
  data,
  title,
}: RegionalPerformanceChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            dataKey="deliveryTime"
            name="Delivery Time (days)"
            tick={{ fontSize: 12 }}
            domain={[0, 'dataMax + 1']}
          />
          <YAxis
            type="number"
            dataKey="successRate"
            name="Success Rate (%)"
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
          />
          <ZAxis
            type="number"
            dataKey="shipments"
            range={[100, 1000]}
            name="Shipments"
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value, name) => {
              if (name === 'shipments') return [value, 'Shipments'];
              if (name === 'deliveryTime')
                return [`${value} days`, 'Delivery Time'];
              if (name === 'successRate') return [`${value}%`, 'Success Rate'];
              return [value, name || ''];
            }}
          />
          <Scatter name="Regions" data={data} fill="#3b82f6">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

// Delivery Time Trend Chart
interface DeliveryTimeTrendChartProps {
  data: DeliveryTimeTrendData[];
  title: string;
}

export function DeliveryTimeTrendChart({
  data,
  title,
}: DeliveryTimeTrendChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            }
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value) => [`${Number(value) || 0} days`, '']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="avgDeliveryTime"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            name="Average Delivery Time"
          />
          <Line
            type="monotone"
            dataKey="targetTime"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Target Time"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Cost vs Budget Analysis Chart
interface CostAnalysisChartProps {
  data: CostAnalysisData[];
  title: string;
}

export function CostAnalysisChart({ data, title }: CostAnalysisChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value) => [`$${(Number(value) || 0).toLocaleString()}`, 'Amount']}
          />
          <Legend />
          <Bar
            dataKey="actualCost"
            fill="#3b82f6"
            name="Actual Cost"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="budget"
            fill="#10b981"
            name="Budget"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Delivery Time Distribution Pie Chart
interface DeliveryTimeDistributionChartProps {
  data: DeliveryTimeDistributionData[];
  title: string;
}

export function DeliveryTimeDistributionChart({
  data,
  title,
}: DeliveryTimeDistributionChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) =>
              `${name}: ${((percent || 0) * 100).toFixed(1)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            nameKey="range"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, _name, props) => {
              const payload = props.payload as DeliveryTimeDistributionData | undefined;
              return [
                `${value} shipments (${payload?.percentage || 0}%)`,
                payload?.range || '',
              ];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Shipping Volume and Revenue Chart
interface ShippingVolumeChartProps {
  data: ShippingVolumeData[];
  title: string;
}

export function ShippingVolumeChart({ data, title }: ShippingVolumeChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="shipments"
            fill="#3b82f6"
            name="Shipments"
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            name="Revenue ($)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
