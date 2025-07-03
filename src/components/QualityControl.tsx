import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, CheckCircle, XCircle, AlertCircle, Award } from "lucide-react";
import { toast } from "sonner";

const QualityControl = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inspections, setInspections] = useState([
    {
      id: 1,
      inspectionId: "QC-2024-001",
      grrNo: "GRR-2024-001",
      partNo: "RM-001",
      description: "Steel Rod 12mm",
      batchNo: "ST-24-001",
      inspectionDate: "2024-01-15",
      inspector: "Quality Inspector A",
      quantityInspected: 500,
      quantityAccepted: 480,
      quantityRejected: 20,
      defectType: "Surface defects",
      testResults: {
        dimensional: "Pass",
        visual: "Fail",
        mechanical: "Pass"
      },
      status: "Completed",
      remarks: "Minor surface scratches found on 20 pieces",
      vendorName: "Tata Steel Limited"
    },
    {
      id: 2,
      inspectionId: "QC-2024-002",
      grrNo: "GRR-2024-002",
      partNo: "FP-001",
      description: "Bearing Assembly",
      batchNo: "BG-24-001",
      inspectionDate: "2024-01-16",
      inspector: "Quality Inspector B",
      quantityInspected: 100,
      quantityAccepted: 100,
      quantityRejected: 0,
      defectType: null,
      testResults: {
        dimensional: "Pass",
        visual: "Pass",
        mechanical: "Pass"
      },
      status: "Completed",
      remarks: "All items meet quality standards",
      vendorName: "SKF India Limited"
    }
  ]);

  const [newInspection, setNewInspection] = useState({
    grrNo: "",
    partNo: "",
    description: "",
    batchNo: "",
    inspector: "",
    quantityInspected: "",
    quantityAccepted: "",
    quantityRejected: "",
    defectType: "",
    dimensional: "",
    visual: "",
    mechanical: "",
    remarks: ""
  });

  const inspectors = [
    "Quality Inspector A",
    "Quality Inspector B", 
    "Quality Inspector C",
    "Senior QC Engineer",
    "QC Supervisor"
  ];

  const availableGRRs = [
    { grrNo: "GRR-2024-003", partNo: "RM-002", description: "Aluminum Sheet 2mm" },
    { grrNo: "GRR-2024-004", partNo: "FP-002", description: "Seal Kit" }
  ];

  const handleCreateInspection = () => {
    if (!newInspection.grrNo || !newInspection.partNo || !newInspection.inspector) {
      toast.error("Please fill in all required fields");
      return;
    }

    const inspectionNumber = `QC-2024-${String(inspections.length + 1).padStart(3, '0')}`;
    
    const inspection = {
      id: inspections.length + 1,
      inspectionId: inspectionNumber,
      ...newInspection,
      inspectionDate: new Date().toISOString().split('T')[0],
      quantityInspected: parseInt(newInspection.quantityInspected) || 0,
      quantityAccepted: parseInt(newInspection.quantityAccepted) || 0,
      quantityRejected: parseInt(newInspection.quantityRejected) || 0,
      testResults: {
        dimensional: newInspection.dimensional,
        visual: newInspection.visual,
        mechanical: newInspection.mechanical
      },
      status: "In Progress",
      vendorName: "Unknown Vendor"
    };

    setInspections([...inspections, inspection]);
    setNewInspection({
      grrNo: "",
      partNo: "",
      description: "",
      batchNo: "",
      inspector: "",
      quantityInspected: "",
      quantityAccepted: "",
      quantityRejected: "",
      defectType: "",
      dimensional: "",
      visual: "",
      mechanical: "",
      remarks: ""
    });
    toast.success(`Quality inspection ${inspectionNumber} created successfully!`);
  };

  const filteredInspections = inspections.filter(inspection =>
    inspection.inspectionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspection.grrNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspection.partNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Progress": return { variant: "secondary" as const, color: "text-yellow-700", icon: AlertCircle };
      case "Completed": return { variant: "default" as const, color: "text-green-700", icon: CheckCircle };
      case "Failed": return { variant: "destructive" as const, color: "text-red-700", icon: XCircle };
      default: return { variant: "outline" as const, color: "text-gray-700", icon: AlertCircle };
    }
  };

  const getTestResultBadge = (result: string) => {
    switch (result) {
      case "Pass": return { variant: "default" as const, color: "text-green-700" };
      case "Fail": return { variant: "destructive" as const, color: "text-red-700" };
      default: return { variant: "outline" as const, color: "text-gray-700" };
    }
  };

  const passRate = inspections.length > 0 
    ? ((inspections.reduce((sum, i) => sum + i.quantityAccepted, 0) / 
       inspections.reduce((sum, i) => sum + i.quantityInspected, 0)) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Quality Control</h2>
          <p className="text-gray-500">Manage quality inspections and test results</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Inspection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Quality Inspection</DialogTitle>
              <DialogDescription>Record quality inspection details and test results</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="grrNo">GRR Number *</Label>
                <Select value={newInspection.grrNo} onValueChange={(value) => {
                  const selectedGRR = availableGRRs.find(g => g.grrNo === value);
                  setNewInspection({
                    ...newInspection, 
                    grrNo: value,
                    partNo: selectedGRR?.partNo || "",
                    description: selectedGRR?.description || ""
                  });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select GRR" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGRRs.map(grr => (
                      <SelectItem key={grr.grrNo} value={grr.grrNo}>
                        {grr.grrNo} - {grr.partNo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inspector">Inspector *</Label>
                <Select value={newInspection.inspector} onValueChange={(value) => setNewInspection({...newInspection, inspector: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select inspector" />
                  </SelectTrigger>
                  <SelectContent>
                    {inspectors.map(inspector => (
                      <SelectItem key={inspector} value={inspector}>{inspector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="partNo">Part Number</Label>
                <Input
                  id="partNo"
                  value={newInspection.partNo}
                  onChange={(e) => setNewInspection({...newInspection, partNo: e.target.value})}
                  placeholder="Auto-filled from GRR"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batchNo">Batch Number</Label>
                <Input
                  id="batchNo"
                  value={newInspection.batchNo}
                  onChange={(e) => setNewInspection({...newInspection, batchNo: e.target.value})}
                  placeholder="e.g., ST-24-002"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newInspection.description}
                  onChange={(e) => setNewInspection({...newInspection, description: e.target.value})}
                  placeholder="Auto-filled from GRR"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantityInspected">Quantity Inspected</Label>
                <Input
                  id="quantityInspected"
                  type="number"
                  value={newInspection.quantityInspected}
                  onChange={(e) => setNewInspection({...newInspection, quantityInspected: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantityAccepted">Quantity Accepted</Label>
                <Input
                  id="quantityAccepted"
                  type="number"
                  value={newInspection.quantityAccepted}
                  onChange={(e) => setNewInspection({...newInspection, quantityAccepted: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantityRejected">Quantity Rejected</Label>
                <Input
                  id="quantityRejected"
                  type="number"
                  value={newInspection.quantityRejected}
                  onChange={(e) => setNewInspection({...newInspection, quantityRejected: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defectType">Defect Type</Label>
                <Input
                  id="defectType"
                  value={newInspection.defectType}
                  onChange={(e) => setNewInspection({...newInspection, defectType: e.target.value})}
                  placeholder="e.g., Surface defects"
                />
              </div>
              
              {/* Test Results */}
              <div className="col-span-2">
                <Label className="text-base font-semibold">Test Results</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="dimensional">Dimensional</Label>
                    <Select value={newInspection.dimensional} onValueChange={(value) => setNewInspection({...newInspection, dimensional: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pass">Pass</SelectItem>
                        <SelectItem value="Fail">Fail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visual">Visual</Label>
                    <Select value={newInspection.visual} onValueChange={(value) => setNewInspection({...newInspection, visual: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pass">Pass</SelectItem>
                        <SelectItem value="Fail">Fail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mechanical">Mechanical</Label>
                    <Select value={newInspection.mechanical} onValueChange={(value) => setNewInspection({...newInspection, mechanical: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pass">Pass</SelectItem>
                        <SelectItem value="Fail">Fail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={newInspection.remarks}
                  onChange={(e) => setNewInspection({...newInspection, remarks: e.target.value})}
                  placeholder="Quality inspection observations and comments"
                  rows={3}
                />
              </div>
            </div>
            <Button onClick={handleCreateInspection} className="w-full bg-blue-600 hover:bg-blue-700">
              Create Inspection Record
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="max-w-sm">
            <Label htmlFor="search">Search Inspections</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                className="pl-10"
                placeholder="Search by inspection ID, GRR, or part..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inspections</p>
                <p className="text-3xl font-bold text-gray-900">{inspections.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                <p className="text-3xl font-bold text-green-600">{passRate}%</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Items Inspected</p>
                <p className="text-3xl font-bold text-blue-600">
                  {inspections.reduce((sum, i) => sum + i.quantityInspected, 0)}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Items Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {inspections.reduce((sum, i) => sum + i.quantityRejected, 0)}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inspections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Inspections ({filteredInspections.length})</CardTitle>
          <CardDescription>Track all quality control inspections and test results</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Inspection ID</TableHead>
                <TableHead>GRR No.</TableHead>
                <TableHead>Part Details</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Quantities</TableHead>
                <TableHead>Test Results</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Defects</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInspections.map((inspection) => {
                const statusBadge = getStatusBadge(inspection.status);
                const StatusIcon = statusBadge.icon;
                return (
                  <TableRow key={inspection.id}>
                    <TableCell className="font-medium">{inspection.inspectionId}</TableCell>
                    <TableCell>{inspection.grrNo}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{inspection.partNo}</div>
                        <div className="text-sm text-gray-500">{inspection.description}</div>
                        {inspection.batchNo && (
                          <div className="text-xs text-gray-400">Batch: {inspection.batchNo}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{inspection.inspector}</TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>Inspected: <span className="font-medium">{inspection.quantityInspected}</span></div>
                        <div className="text-green-600">Accepted: {inspection.quantityAccepted}</div>
                        <div className="text-red-600">Rejected: {inspection.quantityRejected}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {Object.entries(inspection.testResults).map(([test, result]) => {
                          const resultBadge = getTestResultBadge(result);
                          return (
                            <div key={test} className="flex items-center gap-2">
                              <span className="text-xs capitalize">{test}:</span>
                              <Badge variant={resultBadge.variant} className={`text-xs ${resultBadge.color}`}>
                                {result}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" />
                        <Badge variant={statusBadge.variant} className={statusBadge.color}>
                          {inspection.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {inspection.defectType && (
                        <Badge variant="outline" className="text-xs">
                          {inspection.defectType}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs text-sm line-clamp-2">
                        {inspection.remarks}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityControl;
