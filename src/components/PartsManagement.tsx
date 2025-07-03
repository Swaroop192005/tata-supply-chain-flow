import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Package, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useParts, useAddPart } from "@/hooks/useParts";

const PartsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: parts = [], isLoading } = useParts();
  const addPartMutation = useAddPart();

  const [newPart, setNewPart] = useState({
    part_no: "",
    description: "",
    category: "",
    unit_of_measure: "",
    unit_rate: "",
    opening_stock: "",
    minimum_stock: "",
    order_quantity: ""
  });

  const handleAddPart = () => {
    if (!newPart.part_no || !newPart.description || !newPart.category) {
      return;
    }

    const part = {
      ...newPart,
      unit_rate: parseFloat(newPart.unit_rate) || 0,
      opening_stock: parseInt(newPart.opening_stock) || 0,
      current_stock: parseInt(newPart.opening_stock) || 0,
      minimum_stock: parseInt(newPart.minimum_stock) || 0,
      order_quantity: parseInt(newPart.order_quantity) || 0,
    };

    addPartMutation.mutate(part);

    setNewPart({
      part_no: "",
      description: "",
      category: "",
      unit_of_measure: "",
      unit_rate: "",
      opening_stock: "",
      minimum_stock: "",
      order_quantity: ""
    });
  };

  const filteredParts = parts.filter(part => {
    const matchesSearch = part.part_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || part.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (current: number, minimum: number) => {
    if (current <= minimum) return { label: "Critical", color: "destructive" };
    if (current <= minimum * 1.5) return { label: "Low", color: "secondary" };
    return { label: "Good", color: "default" };
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading parts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Parts Management</h2>
          <p className="text-gray-500">Manage raw materials and finished parts inventory</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Part
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Part</DialogTitle>
              <DialogDescription>Enter the details for the new part</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="partNo">Part Number *</Label>
                <Input
                  id="partNo"
                  value={newPart.part_no}
                  onChange={(e) => setNewPart({...newPart, part_no: e.target.value})}
                  placeholder="e.g., RM-003"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={newPart.category} onValueChange={(value) => setNewPart({...newPart, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Raw Material">Raw Material</SelectItem>
                    <SelectItem value="Finished Part">Finished Part</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={newPart.description}
                  onChange={(e) => setNewPart({...newPart, description: e.target.value})}
                  placeholder="Part description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitOfMeasure">Unit of Measure</Label>
                <Select value={newPart.unit_of_measure} onValueChange={(value) => setNewPart({...newPart, unit_of_measure: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PCS">PCS</SelectItem>
                    <SelectItem value="KG">KG</SelectItem>
                    <SelectItem value="LTR">LTR</SelectItem>
                    <SelectItem value="MTR">MTR</SelectItem>
                    <SelectItem value="SQM">SQM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitRate">Unit Rate (₹)</Label>
                <Input
                  id="unitRate"
                  type="number"
                  step="0.01"
                  value={newPart.unit_rate}
                  onChange={(e) => setNewPart({...newPart, unit_rate: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="openingStock">Opening Stock</Label>
                <Input
                  id="openingStock"
                  type="number"
                  value={newPart.opening_stock}
                  onChange={(e) => setNewPart({...newPart, opening_stock: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumStock">Minimum Stock</Label>
                <Input
                  id="minimumStock"
                  type="number"
                  value={newPart.minimum_stock}
                  onChange={(e) => setNewPart({...newPart, minimum_stock: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="orderQuantity">Order Quantity</Label>
                <Input
                  id="orderQuantity"
                  type="number"
                  value={newPart.order_quantity}
                  onChange={(e) => setNewPart({...newPart, order_quantity: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>
            <Button 
              onClick={handleAddPart} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={addPartMutation.isPending}
            >
              {addPartMutation.isPending ? "Adding..." : "Add Part"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-sm">
              <Label htmlFor="search">Search Parts</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  className="pl-10"
                  placeholder="Search by part number or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="min-w-48">
              <Label htmlFor="category-filter">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Raw Material">Raw Material</SelectItem>
                  <SelectItem value="Finished Part">Finished Part</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Parts Inventory ({filteredParts.length})</CardTitle>
          <CardDescription>Overview of all parts and their current stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part No.</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>UOM</TableHead>
                <TableHead>Rate (₹)</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParts.map((part) => {
                const stockStatus = getStockStatus(part.current_stock || 0, part.minimum_stock || 0);
                return (
                  <TableRow key={part.id}>
                    <TableCell className="font-medium">{part.part_no}</TableCell>
                    <TableCell>{part.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={part.category === 'Raw Material' ? 'border-blue-200 text-blue-700' : 'border-green-200 text-green-700'}>
                        {part.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{part.unit_of_measure}</TableCell>
                    <TableCell>₹{(part.unit_rate || 0).toFixed(2)}</TableCell>
                    <TableCell className="font-medium">{part.current_stock}</TableCell>
                    <TableCell>{part.minimum_stock}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={stockStatus.color === 'destructive' ? 'destructive' : stockStatus.color === 'secondary' ? 'secondary' : 'default'}>
                          {stockStatus.label}
                        </Badge>
                        {stockStatus.color === 'destructive' && <AlertTriangle className="h-4 w-4 text-red-500" />}
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

export default PartsManagement;
