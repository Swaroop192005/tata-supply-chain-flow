
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

export const useExportDatabase = () => {
  const exportToExcel = async () => {
    try {
      // Fetch all table data
      const [
        vendorsData,
        partsData,
        grrsData,
        mirsData,
        departmentsData,
        purchaseOrdersData,
        stockMovementsData,
        reorderLevelsData,
        qualityInspectionsData
      ] = await Promise.all([
        supabase.from('vendors').select('*'),
        supabase.from('parts').select('*'),
        supabase.from('grrs').select('*, vendors(name), grr_parts(*, parts(part_no, description))'),
        supabase.from('mirs').select('*, mir_parts(*, parts(part_no, description))'),
        supabase.from('departments').select('*'),
        supabase.from('purchase_orders').select('*, vendors(name), po_items(*, parts(part_no, description))'),
        supabase.from('stock_movements').select('*, parts(part_no, description)'),
        supabase.from('reorder_levels').select('*, parts(part_no, description)'),
        supabase.from('quality_inspections').select('*, grr_parts(*, parts(part_no, description), grrs(grr_no))')
      ]);

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Database Schema Sheet
      const schemaData = [
        ['Table Name', 'Column Name', 'Data Type', 'Nullable', 'Default Value', 'Description'],
        // Vendors table
        ['vendors', 'id', 'UUID', 'No', 'gen_random_uuid()', 'Primary key'],
        ['vendors', 'vendor_code', 'TEXT', 'No', '', 'Unique vendor code'],
        ['vendors', 'name', 'TEXT', 'No', '', 'Vendor name'],
        ['vendors', 'address', 'TEXT', 'No', '', 'Vendor address'],
        ['vendors', 'phone', 'TEXT', 'Yes', '', 'Contact phone'],
        ['vendors', 'email', 'TEXT', 'Yes', '', 'Contact email'],
        ['vendors', 'payment_terms', 'TEXT', 'Yes', '', 'Payment terms'],
        ['vendors', 'rating', 'DECIMAL(2,1)', 'Yes', '0', 'Vendor rating'],
        ['vendors', 'status', 'TEXT', 'Yes', 'Active', 'Vendor status'],
        ['vendors', 'created_at', 'TIMESTAMP', 'No', 'now()', 'Creation timestamp'],
        ['vendors', 'updated_at', 'TIMESTAMP', 'No', 'now()', 'Update timestamp'],
        
        // Parts table
        ['parts', 'id', 'UUID', 'No', 'gen_random_uuid()', 'Primary key'],
        ['parts', 'part_no', 'TEXT', 'No', '', 'Unique part number'],
        ['parts', 'description', 'TEXT', 'No', '', 'Part description'],
        ['parts', 'category', 'TEXT', 'No', '', 'Part category'],
        ['parts', 'unit_of_measure', 'TEXT', 'Yes', '', 'Unit of measure'],
        ['parts', 'unit_rate', 'DECIMAL(10,2)', 'Yes', '0', 'Unit rate'],
        ['parts', 'opening_stock', 'INTEGER', 'Yes', '0', 'Opening stock'],
        ['parts', 'current_stock', 'INTEGER', 'Yes', '0', 'Current stock'],
        ['parts', 'minimum_stock', 'INTEGER', 'Yes', '0', 'Minimum stock level'],
        ['parts', 'order_quantity', 'INTEGER', 'Yes', '0', 'Standard order quantity'],
        ['parts', 'created_at', 'TIMESTAMP', 'No', 'now()', 'Creation timestamp'],
        ['parts', 'updated_at', 'TIMESTAMP', 'No', 'now()', 'Update timestamp'],
        
        // GRRs table
        ['grrs', 'id', 'UUID', 'No', 'gen_random_uuid()', 'Primary key'],
        ['grrs', 'grr_no', 'TEXT', 'No', '', 'Unique GRR number'],
        ['grrs', 'challan_date', 'DATE', 'No', '', 'Challan date'],
        ['grrs', 'transporter_name', 'TEXT', 'No', '', 'Transporter name'],
        ['grrs', 'po_reference', 'TEXT', 'No', '', 'PO reference'],
        ['grrs', 'vendor_id', 'UUID', 'Yes', '', 'Foreign key to vendors'],
        ['grrs', 'status', 'TEXT', 'Yes', 'Pending Inspection', 'GRR status'],
        ['grrs', 'total_value', 'DECIMAL(10,2)', 'Yes', '0', 'Total value'],
        ['grrs', 'remarks', 'TEXT', 'Yes', '', 'Remarks'],
        ['grrs', 'created_at', 'TIMESTAMP', 'No', 'now()', 'Creation timestamp'],
        ['grrs', 'updated_at', 'TIMESTAMP', 'No', 'now()', 'Update timestamp'],
        
        // MIRs table
        ['mirs', 'id', 'UUID', 'No', 'gen_random_uuid()', 'Primary key'],
        ['mirs', 'mir_no', 'TEXT', 'No', '', 'Unique MIR number'],
        ['mirs', 'date', 'DATE', 'No', '', 'MIR date'],
        ['mirs', 'department', 'TEXT', 'No', '', 'Requesting department'],
        ['mirs', 'requested_by', 'TEXT', 'No', '', 'Requested by'],
        ['mirs', 'status', 'TEXT', 'Yes', 'Pending', 'MIR status'],
        ['mirs', 'total_value', 'DECIMAL(10,2)', 'Yes', '0', 'Total value'],
        ['mirs', 'purpose', 'TEXT', 'Yes', '', 'Purpose of requisition'],
        ['mirs', 'remarks', 'TEXT', 'Yes', '', 'Remarks'],
        ['mirs', 'created_at', 'TIMESTAMP', 'No', 'now()', 'Creation timestamp'],
        ['mirs', 'updated_at', 'TIMESTAMP', 'No', 'now()', 'Update timestamp'],
        
        // Departments table
        ['departments', 'id', 'UUID', 'No', 'gen_random_uuid()', 'Primary key'],
        ['departments', 'dept_code', 'TEXT', 'No', '', 'Unique department code'],
        ['departments', 'dept_name', 'TEXT', 'No', '', 'Department name'],
        ['departments', 'head_of_dept', 'TEXT', 'Yes', '', 'Head of department'],
        ['departments', 'cost_center', 'TEXT', 'Yes', '', 'Cost center code'],
        ['departments', 'is_active', 'BOOLEAN', 'Yes', 'true', 'Active status'],
        ['departments', 'created_at', 'TIMESTAMP', 'No', 'now()', 'Creation timestamp'],
        
        // Purchase Orders table
        ['purchase_orders', 'id', 'UUID', 'No', 'gen_random_uuid()', 'Primary key'],
        ['purchase_orders', 'po_no', 'TEXT', 'No', '', 'Unique PO number'],
        ['purchase_orders', 'po_date', 'DATE', 'No', '', 'PO date'],
        ['purchase_orders', 'vendor_id', 'UUID', 'Yes', '', 'Foreign key to vendors'],
        ['purchase_orders', 'total_amount', 'DECIMAL(12,2)', 'Yes', '0', 'Total amount'],
        ['purchase_orders', 'status', 'TEXT', 'Yes', 'Draft', 'PO status'],
        ['purchase_orders', 'delivery_date', 'DATE', 'Yes', '', 'Expected delivery date'],
        ['purchase_orders', 'terms_conditions', 'TEXT', 'Yes', '', 'Terms and conditions'],
        ['purchase_orders', 'created_by', 'TEXT', 'Yes', '', 'Created by'],
        ['purchase_orders', 'approved_by', 'TEXT', 'Yes', '', 'Approved by'],
        ['purchase_orders', 'created_at', 'TIMESTAMP', 'No', 'now()', 'Creation timestamp'],
        ['purchase_orders', 'updated_at', 'TIMESTAMP', 'No', 'now()', 'Update timestamp'],
        
        // Stock Movements table
        ['stock_movements', 'id', 'UUID', 'No', 'gen_random_uuid()', 'Primary key'],
        ['stock_movements', 'part_id', 'UUID', 'Yes', '', 'Foreign key to parts'],
        ['stock_movements', 'movement_type', 'TEXT', 'No', '', 'IN or OUT'],
        ['stock_movements', 'quantity', 'INTEGER', 'No', '', 'Quantity moved'],
        ['stock_movements', 'reference_type', 'TEXT', 'Yes', '', 'GRR, MIR, ADJUSTMENT'],
        ['stock_movements', 'reference_id', 'UUID', 'Yes', '', 'Reference ID'],
        ['stock_movements', 'movement_date', 'DATE', 'No', 'CURRENT_DATE', 'Movement date'],
        ['stock_movements', 'unit_rate', 'DECIMAL(10,2)', 'Yes', '', 'Unit rate'],
        ['stock_movements', 'remarks', 'TEXT', 'Yes', '', 'Remarks'],
        ['stock_movements', 'created_by', 'TEXT', 'Yes', '', 'Created by'],
        ['stock_movements', 'created_at', 'TIMESTAMP', 'No', 'now()', 'Creation timestamp'],
        
        // Reorder Levels table
        ['reorder_levels', 'id', 'UUID', 'No', 'gen_random_uuid()', 'Primary key'],
        ['reorder_levels', 'part_id', 'UUID', 'Yes', '', 'Foreign key to parts (unique)'],
        ['reorder_levels', 'reorder_level', 'INTEGER', 'No', '0', 'Reorder level'],
        ['reorder_levels', 'max_stock_level', 'INTEGER', 'Yes', '', 'Maximum stock level'],
        ['reorder_levels', 'lead_time_days', 'INTEGER', 'Yes', '0', 'Lead time in days'],
        ['reorder_levels', 'created_at', 'TIMESTAMP', 'No', 'now()', 'Creation timestamp'],
        ['reorder_levels', 'updated_at', 'TIMESTAMP', 'No', 'now()', 'Update timestamp'],
        
        // Quality Inspections table
        ['quality_inspections', 'id', 'UUID', 'No', 'gen_random_uuid()', 'Primary key'],
        ['quality_inspections', 'grr_part_id', 'UUID', 'Yes', '', 'Foreign key to grr_parts'],
        ['quality_inspections', 'inspector_name', 'TEXT', 'No', '', 'Inspector name'],
        ['quality_inspections', 'inspection_date', 'DATE', 'No', 'CURRENT_DATE', 'Inspection date'],
        ['quality_inspections', 'test_parameters', 'TEXT', 'Yes', '', 'Test parameters'],
        ['quality_inspections', 'test_results', 'TEXT', 'Yes', '', 'Test results'],
        ['quality_inspections', 'quality_status', 'TEXT', 'Yes', 'Pending', 'Quality status'],
        ['quality_inspections', 'remarks', 'TEXT', 'Yes', '', 'Remarks'],
        ['quality_inspections', 'created_at', 'TIMESTAMP', 'No', 'now()', 'Creation timestamp']
      ];

      const schemaWs = XLSX.utils.aoa_to_sheet(schemaData);
      XLSX.utils.book_append_sheet(wb, schemaWs, 'Database Schema');

      // ER Relationships Sheet
      const relationshipsData = [
        ['From Table', 'From Column', 'To Table', 'To Column', 'Relationship Type'],
        ['grrs', 'vendor_id', 'vendors', 'id', 'Many-to-One'],
        ['grr_parts', 'grr_id', 'grrs', 'id', 'Many-to-One'],
        ['grr_parts', 'part_id', 'parts', 'id', 'Many-to-One'],
        ['mirs', 'department', 'departments', 'dept_name', 'Reference'],
        ['mir_parts', 'mir_id', 'mirs', 'id', 'Many-to-One'],
        ['mir_parts', 'part_id', 'parts', 'id', 'Many-to-One'],
        ['purchase_orders', 'vendor_id', 'vendors', 'id', 'Many-to-One'],
        ['po_items', 'po_id', 'purchase_orders', 'id', 'Many-to-One'],
        ['po_items', 'part_id', 'parts', 'id', 'Many-to-One'],
        ['stock_movements', 'part_id', 'parts', 'id', 'Many-to-One'],
        ['reorder_levels', 'part_id', 'parts', 'id', 'One-to-One'],
        ['quality_inspections', 'grr_part_id', 'grr_parts', 'id', 'Many-to-One'],
        ['vendor_parts', 'vendor_id', 'vendors', 'id', 'Many-to-Many'],
        ['vendor_parts', 'part_id', 'parts', 'id', 'Many-to-Many'],
        ['vendor_rates', 'vendor_id', 'vendors', 'id', 'Many-to-One'],
        ['vendor_rates', 'part_id', 'parts', 'id', 'Many-to-One']
      ];

      const relationshipsWs = XLSX.utils.aoa_to_sheet(relationshipsData);
      XLSX.utils.book_append_sheet(wb, relationshipsWs, 'ER Relationships');

      // Add data sheets
      if (vendorsData.data && vendorsData.data.length > 0) {
        const vendorsWs = XLSX.utils.json_to_sheet(vendorsData.data);
        XLSX.utils.book_append_sheet(wb, vendorsWs, 'Vendors Data');
      }

      if (partsData.data && partsData.data.length > 0) {
        const partsWs = XLSX.utils.json_to_sheet(partsData.data);
        XLSX.utils.book_append_sheet(wb, partsWs, 'Parts Data');
      }

      if (grrsData.data && grrsData.data.length > 0) {
        const grrsWs = XLSX.utils.json_to_sheet(grrsData.data);
        XLSX.utils.book_append_sheet(wb, grrsWs, 'GRRs Data');
      }

      if (mirsData.data && mirsData.data.length > 0) {
        const mirsWs = XLSX.utils.json_to_sheet(mirsData.data);
        XLSX.utils.book_append_sheet(wb, mirsWs, 'MIRs Data');
      }

      if (departmentsData.data && departmentsData.data.length > 0) {
        const departmentsWs = XLSX.utils.json_to_sheet(departmentsData.data);
        XLSX.utils.book_append_sheet(wb, departmentsWs, 'Departments Data');
      }

      if (purchaseOrdersData.data && purchaseOrdersData.data.length > 0) {
        const purchaseOrdersWs = XLSX.utils.json_to_sheet(purchaseOrdersData.data);
        XLSX.utils.book_append_sheet(wb, purchaseOrdersWs, 'Purchase Orders Data');
      }

      if (stockMovementsData.data && stockMovementsData.data.length > 0) {
        const stockMovementsWs = XLSX.utils.json_to_sheet(stockMovementsData.data);
        XLSX.utils.book_append_sheet(wb, stockMovementsWs, 'Stock Movements Data');
      }

      if (reorderLevelsData.data && reorderLevelsData.data.length > 0) {
        const reorderLevelsWs = XLSX.utils.json_to_sheet(reorderLevelsData.data);
        XLSX.utils.book_append_sheet(wb, reorderLevelsWs, 'Reorder Levels Data');
      }

      if (qualityInspectionsData.data && qualityInspectionsData.data.length > 0) {
        const qualityInspectionsWs = XLSX.utils.json_to_sheet(qualityInspectionsData.data);
        XLSX.utils.book_append_sheet(wb, qualityInspectionsWs, 'Quality Inspections Data');
      }

      // Export to file
      XLSX.writeFile(wb, 'Tata_Supply_Chain_Database.xlsx');
      toast.success('Database exported to Excel successfully!');
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export database');
    }
  };

  return { exportToExcel };
};
