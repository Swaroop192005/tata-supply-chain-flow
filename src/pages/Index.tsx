
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, FileText, Users, BarChart3, AlertTriangle, CheckCircle, Database } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import PartsManagement from "@/components/PartsManagement";
import VendorManagement from "@/components/VendorManagement";
import GRRManagement from "@/components/GRRManagement";
import MIRManagement from "@/components/MIRManagement";
import QualityControl from "@/components/QualityControl";
import DatabaseExport from "@/components/DatabaseExport";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TATA Supply Chain</h1>
                <p className="text-sm text-gray-500">Enterprise Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                System Online
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin Panel</p>
                <p className="text-xs text-gray-500">Last updated: Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-fit lg:grid-cols-7 bg-white p-1 shadow-sm border">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="parts" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Parts</span>
            </TabsTrigger>
            <TabsTrigger value="vendors" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Vendors</span>
            </TabsTrigger>
            <TabsTrigger value="grr" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">GRR</span>
            </TabsTrigger>
            <TabsTrigger value="mir" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">MIR</span>
            </TabsTrigger>
            <TabsTrigger value="quality" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Quality</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="parts" className="space-y-6">
            <PartsManagement />
          </TabsContent>

          <TabsContent value="vendors" className="space-y-6">
            <VendorManagement />
          </TabsContent>

          <TabsContent value="grr" className="space-y-6">
            <GRRManagement />
          </TabsContent>

          <TabsContent value="mir" className="space-y-6">
            <MIRManagement />
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            <QualityControl />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <DatabaseExport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
