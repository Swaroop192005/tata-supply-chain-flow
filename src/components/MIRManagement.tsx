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
import { Plus, Search, ClipboardList, Calendar, Factory } from "lucide-react";
import { toast } from "sonner";
import { useMIRs, useAddMIR, useUpdateMIR } from "@/hooks/useMIRs";
import { useParts } from "@/hooks/useParts";

const MIRManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: mirs = [], isLoading } = useMIRs();
  const { data: parts = [] } = useParts();
  const addMIRMutation = useAddMIR();
  const updateMIRMutation = useUpdateMIR();

  const [newMIR, setNewMIR] = useState({
    date: "",
    department: "",
    requested_by: "",
    purpose: "",
    remarks: ""
  });

  const departments = [
    "Production Line A",
    "Production Line B", 
    "Production Line C",
    "Quality Control",
    "Maintenance",
    "Research & Development"
  ];

  const handleCreateMIR = () => {
    if (!newMIR.date || !newMIR.department || !newMIR.requested_by) {
      return;
    }

    const mirNumber = `MIR-2024-${String(mirs.length + 1).padStart(3, '0')}`;
    
    const mir = {
      mir_no: mirNumber,
      ...newMIR,
      status: "Pending",
      total_value: 0
    };

    addMIRMutation.mutate(mir);

    setNewMIR({
      date: "",
      department: "",
      requested_by: "",
      purpose: "",
      remarks: ""
    });
  };

  const handleApproveMIR = (mirId: string) => {
    updateMIRMutation.mutate({ id: mirId, status: "Issued" });
  };

  const filteredMIRs = mirs.filter(mir =>
    mir.mir_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mir.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mir.requested_by.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending": return { variant: "secondary" as const, color: "text-yellow-700" };
      case "Issued": return { variant: "default" as const, color: "text-green-700" };
      case "Cancelled": return { variant: "destructive" as const, color: "text-red-700" };
      default: return { variant: "outline" as const, color: "text-gray-700" };
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading MIRs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Material Issue Requisition (MIR)</h2>
          <p className="text-gray-500">Manage material issues to production departments</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create New MIR
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New MIR</DialogTitle>
              <DialogDescription>Request material for production or maintenance</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newMIR.date}
                  onChange={(e) => setNewMIR({...newMIR, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={newMIR.department} onValueChange={(value) => setNewMIR({...newMIR, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="requestedBy">Requested By *</Label>
                <Input
                  id="requestedBy"
                  value={newMIR.requested_by}
                  onChange={(e) => setNewMIR({...newMIR, requested_by: e.target.value})}
                  placeholder="Employee name"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Textarea
                  id="purpose"
                  value={newMIR.purpose}
                  onChange={(e) => setNewMIR({...newMIR, purpose: e.target.value})}
                  placeholder="Purpose of material requirement"
                  rows={2}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={newMIR.remarks}
                  onChange={(e) => setNewMIR({...newMIR, remarks: e.target.value})}
                  placeholder="Additional remarks or special instructions"
                  rows={2}
                />
              </div>
            </div>
            <Button 
              onClick={handleCreateMIR} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={addMIRMutation.isPending}
            >
              {addMIRMutation.isPending ? "Creating..." : "Create MIR"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="max-w-sm">
            <Label htmlFor="search">Search MIRs</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                className="pl-10"
                placeholder="Search by MIR, department, or requestor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MIR Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total MIRs</p>
                <p className="text-3xl font-bold text-gray-900">{mirs.length}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {mirs.filter(m => m.status === 'Pending').length}
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
                <p className="text-sm font-medium text-gray-600">Issued</p>
                <p className="text-3xl font-bold text-green-600">
                  {mirs.filter(m => m.status === 'Issued').length}
                </p>
              </div>
              <Factory className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-blue-600">
                  ₹{mirs.reduce((sum, mir) => sum + (mir.total_value || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="text-blue-500 text-2xl">₹</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MIRs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Material Issue Requisitions ({filteredMIRs.length})</CardTitle>
          <CardDescription>Track all material requisitions and their fulfillment status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MIR No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value (₹)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMIRs.map((mir) => {
                const statusBadge = getStatusBadge(mir.status || "");
                return (
                  <TableRow key={mir.id}>
                    <TableCell className="font-medium">{mir.mir_no}</TableCell>
                    <TableCell>{new Date(mir.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Factory className="h-3 w-3" />
                        {mir.department}
                      </div>
                    </TableCell>
                    <TableCell>{mir.requested_by}</TableCell>
                    <TableCell>
                      <div className="max-w-xs text-sm line-clamp-2">
                        {mir.purpose}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadge.variant} className={statusBadge.color}>
                        {mir.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{(mir.total_value || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {mir.status === 'Pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveMIR(mir.id)}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={updateMIRMutation.isPending}
                        >
                          Issue
                        </Button>
                      )}
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

export default MIRManagement;
