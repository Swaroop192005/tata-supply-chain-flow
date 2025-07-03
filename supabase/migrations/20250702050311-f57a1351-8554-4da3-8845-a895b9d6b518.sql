
-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  payment_terms TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create parts table
CREATE TABLE public.parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  part_no TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  unit_of_measure TEXT,
  unit_rate DECIMAL(10,2) DEFAULT 0,
  opening_stock INTEGER DEFAULT 0,
  current_stock INTEGER DEFAULT 0,
  minimum_stock INTEGER DEFAULT 0,
  order_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor_parts junction table (many-to-many relationship)
CREATE TABLE public.vendor_parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  part_id UUID REFERENCES public.parts(id) ON DELETE CASCADE,
  UNIQUE(vendor_id, part_id)
);

-- Create GRRs (Goods Received Reports) table
CREATE TABLE public.grrs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grr_no TEXT NOT NULL UNIQUE,
  challan_date DATE NOT NULL,
  transporter_name TEXT NOT NULL,
  po_reference TEXT NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id),
  status TEXT DEFAULT 'Pending Inspection',
  total_value DECIMAL(10,2) DEFAULT 0,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create GRR parts table (items in each GRR)
CREATE TABLE public.grr_parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grr_id UUID REFERENCES public.grrs(id) ON DELETE CASCADE,
  part_id UUID REFERENCES public.parts(id),
  challan_qty INTEGER NOT NULL DEFAULT 0,
  accepted_qty INTEGER DEFAULT 0,
  rejected_qty INTEGER DEFAULT 0
);

-- Create MIRs (Material Issue Requisitions) table
CREATE TABLE public.mirs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mir_no TEXT NOT NULL UNIQUE,
  date DATE NOT NULL,
  department TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  total_value DECIMAL(10,2) DEFAULT 0,
  purpose TEXT,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create MIR parts table (items in each MIR)
CREATE TABLE public.mir_parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mir_id UUID REFERENCES public.mirs(id) ON DELETE CASCADE,
  part_id UUID REFERENCES public.parts(id),
  qty_issued INTEGER NOT NULL DEFAULT 0,
  unit_rate DECIMAL(10,2) DEFAULT 0
);

-- Insert sample vendors data
INSERT INTO public.vendors (vendor_code, name, address, phone, email, payment_terms, rating, status) VALUES
('V001', 'Tata Steel Limited', 'Bombay House, 24 Homi Mody Street, Mumbai - 400001', '+91-22-6665-8282', 'contact@tatasteel.com', '30 Days Net', 4.8, 'Active'),
('V002', 'SKF India Limited', '1 Taratolla Road, Garden Reach, Kolkata - 700024', '+91-33-2469-8000', 'info@skf.com', '45 Days Net', 4.6, 'Active'),
('V003', 'Hindalco Industries', 'Ahura Centre, B-Wing, 2nd Floor, Mahakali Caves Road, Mumbai - 400093', '+91-22-6691-7000', 'corporate@hindalco.com', '60 Days Net', 4.4, 'Active');

-- Insert sample parts data
INSERT INTO public.parts (part_no, description, category, unit_of_measure, unit_rate, opening_stock, current_stock, minimum_stock, order_quantity) VALUES
('RM-001', 'Steel Rod 12mm', 'Raw Material', 'KG', 45.50, 1000, 850, 200, 500),
('FP-001', 'Bearing Assembly', 'Finished Part', 'PCS', 125.00, 500, 75, 100, 200),
('RM-002', 'Aluminum Sheet 2mm', 'Raw Material', 'SQM', 180.75, 800, 425, 150, 300);

-- Insert vendor-parts relationships
INSERT INTO public.vendor_parts (vendor_id, part_id) VALUES
((SELECT id FROM public.vendors WHERE vendor_code = 'V001'), (SELECT id FROM public.parts WHERE part_no = 'RM-001')),
((SELECT id FROM public.vendors WHERE vendor_code = 'V002'), (SELECT id FROM public.parts WHERE part_no = 'FP-001')),
((SELECT id FROM public.vendors WHERE vendor_code = 'V003'), (SELECT id FROM public.parts WHERE part_no = 'RM-002'));

-- Insert sample GRRs data
INSERT INTO public.grrs (grr_no, challan_date, transporter_name, po_reference, vendor_id, status, total_value, remarks) VALUES
('GRR-2024-001', '2024-01-15', 'Express Logistics', 'PO-2024-045', (SELECT id FROM public.vendors WHERE vendor_code = 'V001'), 'Quality Check', 22750.00, 'Minor surface defects in 20 pieces'),
('GRR-2024-002', '2024-01-16', 'SafeCargo Ltd', 'PO-2024-046', (SELECT id FROM public.vendors WHERE vendor_code = 'V002'), 'Accepted', 12500.00, 'All items passed quality inspection');

-- Insert sample GRR parts data
INSERT INTO public.grr_parts (grr_id, part_id, challan_qty, accepted_qty, rejected_qty) VALUES
((SELECT id FROM public.grrs WHERE grr_no = 'GRR-2024-001'), (SELECT id FROM public.parts WHERE part_no = 'RM-001'), 500, 480, 20),
((SELECT id FROM public.grrs WHERE grr_no = 'GRR-2024-002'), (SELECT id FROM public.parts WHERE part_no = 'FP-001'), 100, 100, 0);

-- Insert sample MIRs data
INSERT INTO public.mirs (mir_no, date, department, requested_by, status, total_value, purpose, remarks) VALUES
('MIR-2024-001', '2024-01-15', 'Production Line A', 'John Doe', 'Issued', 9100.00, 'Manufacturing of Product XYZ', 'Urgent requirement for production'),
('MIR-2024-002', '2024-01-16', 'Production Line B', 'Jane Smith', 'Pending', 6250.00, 'Maintenance work', 'For scheduled maintenance');

-- Insert sample MIR parts data
INSERT INTO public.mir_parts (mir_id, part_id, qty_issued, unit_rate) VALUES
((SELECT id FROM public.mirs WHERE mir_no = 'MIR-2024-001'), (SELECT id FROM public.parts WHERE part_no = 'RM-001'), 200, 45.50),
((SELECT id FROM public.mirs WHERE mir_no = 'MIR-2024-002'), (SELECT id FROM public.parts WHERE part_no = 'FP-001'), 50, 125.00);

-- Enable Row Level Security (RLS) - for future authentication implementation
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grr_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mirs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mir_parts ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for now (can be restricted later when auth is added)
CREATE POLICY "Enable all operations for all users" ON public.vendors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.parts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.vendor_parts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.grrs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.grr_parts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.mirs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.mir_parts FOR ALL USING (true) WITH CHECK (true);
