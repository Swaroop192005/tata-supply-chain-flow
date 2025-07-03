
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Users, Phone, Mail, MapPin } from "lucide-react";
import { useVendors, useAddVendor } from "@/hooks/useVendors";

const VendorManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: vendors = [], isLoading } = useVendors();
  const addVendorMutation = useAddVendor();

  const [newVendor, setNewVendor] = useState({
    vendor_code: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    payment_terms: ""
  });

  const handleAddVendor = () => {
    if (!newVendor.vendor_code || !newVendor.name || !newVendor.address) {
      return;
    }

    addVendorMutation.mutate({
      ...newVendor,
      rating: 0,
      status: "Active"
    });

    setNewVendor({
      vendor_code: "",
      name: "",
      address: "",
      phone: "",
      email: "",
      payment_terms: ""
    });
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.vendor_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.5) return { label: "Excellent", variant: "default" as const };
    if (rating >= 4.0) return { label: "Good", variant: "secondary" as const };
    if (rating >= 3.5) return { label: "Average", variant: "outline" as const };
    return { label: "Poor", variant: "destructive" as const };
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading vendors...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Vendor Management</h2>
          <p className="text-gray-500">Manage supplier relationships and performance</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>Enter the vendor details</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="vendorCode">Vendor Code *</Label>
                <Input
                  id="vendorCode"
                  value={newVendor.vendor_code}
                  onChange={(e) => setNewVendor({...newVendor, vendor_code: e.target.value})}
                  placeholder="e.g., V004"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                  placeholder="+91-XX-XXXX-XXXX"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="name">Vendor Name *</Label>
                <Input
                  id="name"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                  placeholder="Company name"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={newVendor.address}
                  onChange={(e) => setNewVendor({...newVendor, address: e.target.value})}
                  placeholder="Complete address"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                  placeholder="email@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Input
                  id="paymentTerms"
                  value={newVendor.payment_terms}
                  onChange={(e) => setNewVendor({...newVendor, payment_terms: e.target.value})}
                  placeholder="e.g., 30 Days Net"
                />
              </div>
            </div>
            <Button 
              onClick={handleAddVendor} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={addVendorMutation.isPending}
            >
              {addVendorMutation.isPending ? "Adding..." : "Add Vendor"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="max-w-sm">
            <Label htmlFor="search">Search Vendors</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                className="pl-10"
                placeholder="Search by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-3xl font-bold text-gray-900">{vendors.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                <p className="text-3xl font-bold text-green-600">{vendors.filter(v => v.status === 'Active').length}</p>
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
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {vendors.length > 0 ? (vendors.reduce((acc, v) => acc + (v.rating || 0), 0) / vendors.length).toFixed(1) : "0.0"}
                </p>
              </div>
              <div className="text-yellow-500 text-2xl">★</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Directory ({filteredVendors.length})</CardTitle>
          <CardDescription>Complete list of suppliers and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => {
                const ratingBadge = getRatingBadge(vendor.rating || 0);
                return (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.vendor_code}</TableCell>
                    <TableCell>
                      <div className="font-medium">{vendor.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {vendor.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {vendor.phone}
                          </div>
                        )}
                        {vendor.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {vendor.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1 max-w-xs">
                        <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                        <span className="text-sm line-clamp-2">{vendor.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>{vendor.payment_terms}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{(vendor.rating || 0).toFixed(1)}</span>
                        <Badge variant={ratingBadge.variant}>
                          {ratingBadge.label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={vendor.status === 'Active' ? 'default' : 'secondary'}>
                        {vendor.status}
                      </Badge>
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

export default VendorManagement;
