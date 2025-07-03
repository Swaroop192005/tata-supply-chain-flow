
import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Database, FileText } from 'lucide-react';
import { useExportDatabase } from '@/hooks/useExportDatabase';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

const ERDiagram = () => {
  const diagramRef = useRef<HTMLDivElement>(null);
  const { exportToExcel } = useExportDatabase();

  const exportToPDF = async () => {
    if (diagramRef.current) {
      try {
        const canvas = await html2canvas(diagramRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a3');
        
        const imgWidth = 420;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save('Tata_Supply_Chain_ER_Diagram.pdf');
        toast.success('ER Diagram exported to PDF successfully!');
      } catch (error) {
        console.error('PDF export error:', error);
        toast.error('Failed to export ER diagram to PDF');
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Documentation Export
          </CardTitle>
          <CardDescription>
            Export comprehensive database documentation including ER diagram and table structures
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={exportToPDF} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Export ER Diagram (PDF)
            </Button>
            <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Database (Excel)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Project Report */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Comprehensive Project Report</CardTitle>
          <CardDescription>
            Detailed analysis of the Tata Supply Chain Management System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Project Overview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600">🎯 Project Overview</h3>
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <p><strong>System Name:</strong> Tata Supply Chain Management System</p>
                <p><strong>Type:</strong> Enterprise Web Application</p>
                <p><strong>Technology Stack:</strong> React, TypeScript, Tailwind CSS, Supabase</p>
                <p><strong>Database Tables:</strong> 15 Core Tables</p>
                <p><strong>Main Modules:</strong> 6 Primary Modules</p>
              </div>
            </div>

            {/* Technical Architecture */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600">🏗️ Technical Architecture</h3>
              <div className="bg-green-50 p-4 rounded-lg space-y-2">
                <p><strong>Frontend:</strong> React 18 with TypeScript</p>
                <p><strong>UI Framework:</strong> Tailwind CSS + Shadcn/UI</p>
                <p><strong>Backend:</strong> Supabase (PostgreSQL)</p>
                <p><strong>State Management:</strong> TanStack Query</p>
                <p><strong>Authentication:</strong> Row Level Security (RLS)</p>
              </div>
            </div>
          </div>

          {/* Core Modules */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-600">🛠️ Core Modules Implemented</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium">📦 Parts Management</h4>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Inventory tracking</li>
                  <li>• Stock levels monitoring</li>
                  <li>• Reorder management</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium">🏢 Vendor Management</h4>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Vendor profiles</li>
                  <li>• Rating system</li>
                  <li>• Payment terms</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium">📋 GRR Management</h4>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Goods receipt processing</li>
                  <li>• Quality inspection</li>
                  <li>• Stock updates</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium">📤 MIR Management</h4>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Material requisitions</li>
                  <li>• Department-wise tracking</li>
                  <li>• Approval workflows</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium">✅ Quality Control</h4>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Inspection management</li>
                  <li>• Test parameters</li>
                  <li>• Quality reporting</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium">📊 Analytics Dashboard</h4>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Real-time metrics</li>
                  <li>• Performance tracking</li>
                  <li>• Visual reporting</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Database Structure */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-600">🗄️ Database Structure</h3>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Master Tables:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• vendors (Vendor information)</li>
                    <li>• parts (Parts catalog)</li>
                    <li>• departments (Organization units)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Transaction Tables:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• grrs (Goods Receipt Records)</li>
                    <li>• mirs (Material Issue Requisitions)</li>
                    <li>• purchase_orders (PO management)</li>
                    <li>• quality_inspections (QC records)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-600">🚀 Advanced Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium">Automation Features:</h4>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Automatic stock updates via triggers</li>
                  <li>• Real-time inventory tracking</li>
                  <li>• Automated reorder alerts</li>
                  <li>• Stock movement logging</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium">Export & Reporting:</h4>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Excel export functionality</li>
                  <li>• PDF report generation</li>
                  <li>• ER diagram documentation</li>
                  <li>• Comprehensive data sheets</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-teal-600">📈 System Capabilities</h3>
            <div className="bg-teal-50 p-4 rounded-lg">
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-teal-600">15+</div>
                  <div className="text-sm">Database Tables</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-600">25+</div>
                  <div className="text-sm">API Endpoints</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-600">6</div>
                  <div className="text-sm">Core Modules</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-600">100%</div>
                  <div className="text-sm">Responsive Design</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Compliance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-indigo-600">🔒 Security & Data Protection</h3>
            <div className="bg-indigo-50 p-4 rounded-lg space-y-2">
              <p>• <strong>Row Level Security (RLS):</strong> Database-level access control</p>
              <p>• <strong>Data Validation:</strong> Comprehensive input validation</p>
              <p>• <strong>Audit Trail:</strong> Complete transaction logging</p>
              <p>• <strong>Backup & Recovery:</strong> Automated database backups</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Entity Relationship Diagram</CardTitle>
          <CardDescription>
            Tata Supply Chain CO LTD - Database Management System (Responsive View)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div ref={diagramRef} className="bg-white p-4 overflow-x-auto">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-gray-800 mb-2">
                Tata Supply Chain CO LTD
              </h1>
              <h2 className="text-lg font-semibold text-gray-600 mb-1">
                Database Management System
              </h2>
              <p className="text-sm text-gray-500">Entity Relationship Diagram</p>
            </div>
            
            <svg width="100%" height="600" viewBox="0 0 1000 600" className="border border-gray-300 rounded-lg">
              {/* Vendors Entity */}
              <g>
                <rect x="50" y="50" width="130" height="100" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2" rx="5"/>
                <text x="115" y="70" textAnchor="middle" className="font-bold text-xs">VENDORS</text>
                <line x1="50" y1="80" x2="180" y2="80" stroke="#1976d2" strokeWidth="1"/>
                <text x="55" y="95" className="text-xs">• vendor_code (PK)</text>
                <text x="55" y="108" className="text-xs">• name</text>
                <text x="55" y="121" className="text-xs">• address</text>
                <text x="55" y="134" className="text-xs">• rating</text>
              </g>

              {/* Parts Entity */}
              <g>
                <rect x="250" y="50" width="130" height="100" fill="#e8f5e8" stroke="#388e3c" strokeWidth="2" rx="5"/>
                <text x="315" y="70" textAnchor="middle" className="font-bold text-xs">PARTS</text>
                <line x1="250" y1="80" x2="380" y2="80" stroke="#388e3c" strokeWidth="1"/>
                <text x="255" y="95" className="text-xs">• part_no (PK)</text>
                <text x="255" y="108" className="text-xs">• description</text>
                <text x="255" y="121" className="text-xs">• current_stock</text>
                <text x="255" y="134" className="text-xs">• unit_rate</text>
              </g>

              {/* GRRs Entity */}
              <g>
                <rect x="450" y="50" width="130" height="100" fill="#fff3e0" stroke="#f57c00" strokeWidth="2" rx="5"/>
                <text x="515" y="70" textAnchor="middle" className="font-bold text-xs">GRRs</text>
                <line x1="450" y1="80" x2="580" y2="80" stroke="#f57c00" strokeWidth="1"/>
                <text x="455" y="95" className="text-xs">• grr_no (PK)</text>
                <text x="455" y="108" className="text-xs">• challan_date</text>
                <text x="455" y="121" className="text-xs">• status</text>
                <text x="455" y="134" className="text-xs">• vendor_id (FK)</text>
              </g>

              {/* MIRs Entity */}
              <g>
                <rect x="50" y="200" width="130" height="100" fill="#fce4ec" stroke="#c2185b" strokeWidth="2" rx="5"/>
                <text x="115" y="220" textAnchor="middle" className="font-bold text-xs">MIRs</text>
                <line x1="50" y1="230" x2="180" y2="230" stroke="#c2185b" strokeWidth="1"/>
                <text x="55" y="245" className="text-xs">• mir_no (PK)</text>
                <text x="55" y="258" className="text-xs">• date</text>
                <text x="55" y="271" className="text-xs">• department</text>
                <text x="55" y="284" className="text-xs">• status</text>
              </g>

              {/* Departments Entity */}
              <g>
                <rect x="250" y="200" width="130" height="100" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2" rx="5"/>
                <text x="315" y="220" textAnchor="middle" className="font-bold text-xs">DEPARTMENTS</text>
                <line x1="250" y1="230" x2="380" y2="230" stroke="#7b1fa2" strokeWidth="1"/>
                <text x="255" y="245" className="text-xs">• dept_code (PK)</text>
                <text x="255" y="258" className="text-xs">• dept_name</text>
                <text x="255" y="271" className="text-xs">• head_of_dept</text>
                <text x="255" y="284" className="text-xs">• is_active</text>
              </g>

              {/* Purchase Orders Entity */}
              <g>
                <rect x="450" y="200" width="130" height="100" fill="#e1f5fe" stroke="#0277bd" strokeWidth="2" rx="5"/>
                <text x="515" y="220" textAnchor="middle" className="font-bold text-xs">PURCHASE_ORDERS</text>
                <line x1="450" y1="230" x2="580" y2="230" stroke="#0277bd" strokeWidth="1"/>
                <text x="455" y="245" className="text-xs">• po_no (PK)</text>
                <text x="455" y="258" className="text-xs">• po_date</text>
                <text x="455" y="271" className="text-xs">• vendor_id (FK)</text>
                <text x="455" y="284" className="text-xs">• status</text>
              </g>

              {/* Stock Movements Entity */}
              <g>
                <rect x="650" y="50" width="130" height="100" fill="#efebe9" stroke="#5d4037" strokeWidth="2" rx="5"/>
                <text x="715" y="70" textAnchor="middle" className="font-bold text-xs">STOCK_MOVEMENTS</text>
                <line x1="650" y1="80" x2="780" y2="80" stroke="#5d4037" strokeWidth="1"/>
                <text x="655" y="95" className="text-xs">• id (PK)</text>
                <text x="655" y="108" className="text-xs">• part_id (FK)</text>
                <text x="655" y="121" className="text-xs">• movement_type</text>
                <text x="655" y="134" className="text-xs">• quantity</text>
              </g>

              {/* Quality Inspections Entity */}
              <g>
                <rect x="650" y="200" width="130" height="100" fill="#e8eaf6" stroke="#3f51b5" strokeWidth="2" rx="5"/>
                <text x="715" y="220" textAnchor="middle" className="font-bold text-xs">QUALITY_INSPECTIONS</text>
                <line x1="650" y1="230" x2="780" y2="230" stroke="#3f51b5" strokeWidth="1"/>
                <text x="655" y="245" className="text-xs">• id (PK)</text>
                <text x="655" y="258" className="text-xs">• grr_part_id (FK)</text>
                <text x="655" y="271" className="text-xs">• quality_status</text>
                <text x="655" y="284" className="text-xs">• inspector_name</text>
              </g>

              {/* Reorder Levels Entity */}
              <g>
                <rect x="250" y="350" width="130" height="80" fill="#e0f2f1" stroke="#00695c" strokeWidth="2" rx="5"/>
                <text x="315" y="370" textAnchor="middle" className="font-bold text-xs">REORDER_LEVELS</text>
                <line x1="250" y1="380" x2="380" y2="380" stroke="#00695c" strokeWidth="1"/>
                <text x="255" y="395" className="text-xs">• part_id (FK)</text>
                <text x="255" y="408" className="text-xs">• reorder_level</text>
                <text x="255" y="421" className="text-xs">• max_stock_level</text>
              </g>

              {/* Relationships */}
              {/* Vendors to GRRs */}
              <line x1="180" y1="90" x2="450" y2="90" stroke="#666" strokeWidth="1.5" markerEnd="url(#arrowhead)"/>
              <text x="315" y="85" textAnchor="middle" className="text-xs bg-white px-1">1:M</text>
              
              {/* Vendors to Purchase Orders */}
              <line x1="180" y1="120" x2="450" y2="220" stroke="#666" strokeWidth="1.5" markerEnd="url(#arrowhead)"/>
              <text x="315" y="170" textAnchor="middle" className="text-xs bg-white px-1">1:M</text>
              
              {/* Parts to Stock Movements */}
              <line x1="380" y1="90" x2="650" y2="90" stroke="#666" strokeWidth="1.5" markerEnd="url(#arrowhead)"/>
              <text x="515" y="85" textAnchor="middle" className="text-xs bg-white px-1">1:M</text>
              
              {/* Parts to Reorder Levels */}
              <line x1="315" y1="150" x2="315" y2="350" stroke="#666" strokeWidth="1.5" markerEnd="url(#arrowhead)"/>
              <text x="320" y="250" textAnchor="start" className="text-xs bg-white px-1">1:1</text>
              
              {/* MIRs to Departments */}
              <line x1="180" y1="250" x2="250" y2="250" stroke="#666" strokeWidth="1.5" markerEnd="url(#arrowhead)"/>
              <text x="215" y="245" textAnchor="middle" className="text-xs bg-white px-1">M:1</text>

              {/* Arrow marker definition */}
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" 
                        refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#666"/>
                </marker>
              </defs>

              {/* Legend */}
              <g>
                <rect x="820" y="50" width="150" height="180" fill="#f5f5f5" stroke="#666" strokeWidth="1" rx="5"/>
                <text x="895" y="70" textAnchor="middle" className="font-bold text-xs">LEGEND</text>
                <line x1="830" y1="80" x2="960" y2="80" stroke="#666" strokeWidth="1"/>
                
                <rect x="830" y="90" width="12" height="12" fill="#e3f2fd" stroke="#1976d2"/>
                <text x="850" y="100" className="text-xs">Master Tables</text>
                
                <rect x="830" y="110" width="12" height="12" fill="#fff3e0" stroke="#f57c00"/>
                <text x="850" y="120" className="text-xs">Transaction Tables</text>
                
                <rect x="830" y="130" width="12" height="12" fill="#efebe9" stroke="#5d4037"/>
                <text x="850" y="140" className="text-xs">Movement Tables</text>
                
                <line x1="830" y1="155" x2="850" y2="155" stroke="#666" strokeWidth="1.5" markerEnd="url(#arrowhead)"/>
                <text x="860" y="160" className="text-xs">Relationship</text>
                
                <text x="835" y="180" className="text-xs">1:1 - One to One</text>
                <text x="835" y="195" className="text-xs">1:M - One to Many</text>
                <text x="835" y="210" className="text-xs">M:1 - Many to One</text>
              </g>
            </svg>

            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">System Features Summary:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium">Core Functionalities:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs mt-2">
                    <li>Real-time Inventory Management</li>
                    <li>Automated Stock Movement Tracking</li>
                    <li>Quality Control Integration</li>
                    <li>Vendor Performance Monitoring</li>
                    <li>Purchase Order Management</li>
                    <li>Department-wise Requisition System</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Technical Highlights:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs mt-2">
                    <li>Database Triggers for Automation</li>
                    <li>Row Level Security (RLS)</li>
                    <li>Comprehensive Export Features</li>
                    <li>Responsive Design Architecture</li>
                    <li>Real-time Data Synchronization</li>
                    <li>Audit Trail & Compliance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ERDiagram;
