
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Package, Users, FileText, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

const Dashboard = () => {
  const kpiData = [
    { name: "Total Parts", value: 275, icon: Package, color: "bg-blue-500", change: "+12" },
    { name: "Active Vendors", value: 45, icon: Users, color: "bg-green-500", change: "+3" },
    { name: "Pending GRRs", value: 18, icon: FileText, color: "bg-yellow-500", change: "-5" },
    { name: "Low Stock Items", value: 7, icon: AlertTriangle, color: "bg-red-500", change: "+2" }
  ];

  const inventoryData = [
    { category: "Raw Materials", current: 185, minimum: 150, maximum: 250 },
    { category: "Finished Parts", value: 90, minimum: 75, maximum: 120 }
  ];

  const vendorPerformance = [
    { name: "Vendor A", onTime: 95, quality: 98 },
    { name: "Vendor B", onTime: 88, quality: 92 },
    { name: "Vendor C", onTime: 92, quality: 96 },
    { name: "Vendor D", onTime: 85, quality: 90 }
  ];

  const monthlyTrend = [
    { month: "Jan", received: 120, issued: 110 },
    { month: "Feb", received: 135, issued: 125 },
    { month: "Mar", received: 145, issued: 140 },
    { month: "Apr", received: 128, issued: 135 },
    { month: "May", received: 155, issued: 148 },
    { month: "Jun", received: 142, issued: 152 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    {kpi.change.startsWith('+') ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${kpi.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {kpi.change} this month
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${kpi.color}`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Status */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Current stock levels vs minimum requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm text-gray-500">{item.current || item.value}/{item.maximum}</span>
                  </div>
                  <Progress 
                    value={((item.current || item.value) / item.maximum) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vendor Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Performance</CardTitle>
            <CardDescription>On-time delivery and quality metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={vendorPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="onTime" fill="#3B82F6" name="On-Time %" />
                <Bar dataKey="quality" fill="#10B981" name="Quality %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Material Flow</CardTitle>
          <CardDescription>Material received vs issued over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="received" stroke="#3B82F6" strokeWidth={2} name="Received" />
              <Line type="monotone" dataKey="issued" stroke="#10B981" strokeWidth={2} name="Issued" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest system activities and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New GRR #GRR-2024-001 created</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
              <Badge variant="outline">New</Badge>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Part ABC-123 below minimum stock</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
              <Badge variant="outline" className="border-yellow-500 text-yellow-700">Alert</Badge>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Quality inspection passed for GRR #GRR-2024-001</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
              <Badge variant="outline" className="border-green-500 text-green-700">Approved</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
