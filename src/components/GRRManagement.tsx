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
import { Plus, Search, FileText, Calendar, Truck } from "lucide-react";
import { toast } from "sonner";
import { useGRRs, useAddGRR } from "@/hooks/useGRRs";
import { useVendors } from "@/hooks/useVendors";

const GRRManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: grrs = [], isLoading } = useGRRs();
  const { data: vendors = [] } = useVendors();
  const addGRRMutation = useAddGRR();

  const [newGRR, setNewGRR] = useState({
    challan_date: "",
    transporter_name: "",
    po_reference: "",
    vendor_id: "",
    remarks: ""
  });

  const transporters = [
    "Express Logistics",
    "SafeCargo Ltd",
    "SpeedTrans",
    "ReliableMove",
    "FastTrack Cargo"
  ];

  const handleCreateGRR = () => {
    if (!newGRR.challan_date || !newGRR.transporter_name || !newGRR.po_reference) {
      return;
    }

    const grrNumber = `GRR-2024-${String(grrs.length + 1).padStart(3, '0')}`;
    
    const grr = {
      grr_no: grrNumber,
      ...newGRR,
      status: "Pending Inspection",
      total_value: 0
    };

    addGRRMutation.mutate(grr);

    setNewGRR({
      challan_date: "",
      transporter_name: "",
      po_reference: "",
      vendor_id: "",
      remarks: ""
    });
  };

  const filteredGRRs = grrs.filter(grr =>
    grr.grr_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grr.po_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (grr.vendors?.name && grr.vendors.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending Inspection": return { variant: "secondary" as const, color: "text-yellow-700" };
      case "Quality Check": return { variant: "outline" as const, color: "text-blue-700" };
      case "Accepted": return { variant: "default" as const, color: "text-green-700" };
      case "Rejected": return { variant: "destructive" as const, color: "text-red-700" };
      default: return { variant: "outline" as const, color: "text-gray-700" };
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading GRRs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Goods Received Reports (GRR)</h2>
          <p className="text-gray-500">Track and manage incoming material receipts</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create New GRR
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New GRR</DialogTitle>
              <DialogDescription>Enter details for the goods received</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="challanDate">Challan Date *</Label>
                <Input
                  id="challanDate"
                  type="date"
                  value={newGRR.challan_date}
                  onChange={(e) => setNewGRR({...newGRR, challan_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transporterName">Transporter *</Label>
                <Select value={newGRR.transporter_name} onValueChange={(value) => setNewGRR({...newGRR, transporter_name: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transporter" />
                  </SelectTrigger>
                  <SelectContent>
                    {transporters.map(transporter => (
                      <SelectItem key={transporter} value={transporter}>{transporter}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="poReference">PO Reference *</Label>
                <Input
                  id="poReference"
                  value={newGRR.po_reference}
                  onChange={(e) => setNewGRR({...newGRR, po_reference: e.target.value})}
                  placeholder="e.g., PO-2024-047"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendorName">Vendor</Label>
                <Select value={newGRR.vendor_id} onValueChange={(value) => setNewGRR({...newGRR, vendor_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map(vendor => (
                      <SelectItem key={vendor.id} value={vendor.id}>{vendor.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={newGRR.remarks}
                  onChange={(e) => setNewGRR({...newGRR, remarks: e.target.value})}
                  placeholder="Any special remarks or observations"
                  rows={3}
                />
              </div>
            </div>
            <Button 
              onClick={handleCreateGRR} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={addGRRMutation.isPending}
            >
              {addGRRMutation.isPending ? "Creating..." : "Create GRR"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="max-w-sm">
            <Label htmlFor="search">Search GRRs</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                className="pl-10"
                placeholder="Search by GRR, PO, or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GRR Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total GRRs</p>
                <p className="text-3xl font-bold text-gray-900">{grrs.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {grrs.filter(g => g.status === 'Pending Inspection').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-3xl font-bold text-green-600">
                  {grrs.filter(g => g.status === 'Accepted').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-blue-600">
                  ₹{grrs.reduce((sum, grr) => sum + (grr.total_value || 0), 0).toLocaleString()}
                </p>
              </div>
              <Truck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GRRs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Goods Received Reports ({filteredGRRs.length})</CardTitle>
          <CardDescription>Track all incoming material receipts and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>GRR No.</TableHead>
                <TableHead>Challan Date</TableHead>
                <TableHead>PO Reference</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Transporter</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value (₹)</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGRRs.map((grr) => {
                const statusBadge = getStatusBadge(grr.status || "");
                return (
                  <TableRow key={grr.id}>
                    <TableCell className="font-medium">{grr.grr_no}</TableCell>
                    <TableCell>{new Date(grr.challan_date).toLocaleDateString()}</TableCell>
                    <TableCell>{grr.po_reference}</TableCell>
                    <TableCell>{grr.vendors?.name || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        {grr.transporter_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadge.variant} className={statusBadge.color}>
                        {grr.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{(grr.total_value || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs text-sm line-clamp-2">
                        {grr.remarks}
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

export default GRRManagement;
