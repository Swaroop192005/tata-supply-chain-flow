
-- Create purchase orders table
CREATE TABLE public.purchase_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  po_no TEXT NOT NULL UNIQUE,
  po_date DATE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id),
  total_amount DECIMAL(12,2) DEFAULT 0,
  status TEXT DEFAULT 'Draft',
  delivery_date DATE,
  terms_conditions TEXT,
  created_by TEXT,
  approved_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchase order items table
CREATE TABLE public.po_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  po_id UUID REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  part_id UUID REFERENCES public.parts(id),
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_rate DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(12,2) DEFAULT 0,
  delivery_date DATE,
  specifications TEXT
);

-- Create quality inspection table for GRR items
CREATE TABLE public.quality_inspections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grr_part_id UUID REFERENCES public.grr_parts(id) ON DELETE CASCADE,
  inspector_name TEXT NOT NULL,
  inspection_date DATE NOT NULL DEFAULT CURRENT_DATE,
  test_parameters TEXT,
  test_results TEXT,
  quality_status TEXT DEFAULT 'Pending',
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stock movements table for tracking all stock changes
CREATE TABLE public.stock_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  part_id UUID REFERENCES public.parts(id),
  movement_type TEXT NOT NULL, -- 'IN' for receipts, 'OUT' for issues
  quantity INTEGER NOT NULL,
  reference_type TEXT, -- 'GRR', 'MIR', 'ADJUSTMENT'
  reference_id UUID, -- ID of the related GRR, MIR, etc.
  movement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  unit_rate DECIMAL(10,2),
  remarks TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor rates table for tracking rates per vendor-part combination
CREATE TABLE public.vendor_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id),
  part_id UUID REFERENCES public.parts(id),
  rate DECIMAL(10,2) NOT NULL,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, part_id, effective_from)
);

-- Create reorder levels table
CREATE TABLE public.reorder_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  part_id UUID REFERENCES public.parts(id) UNIQUE,
  reorder_level INTEGER NOT NULL DEFAULT 0,
  max_stock_level INTEGER,
  lead_time_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dept_code TEXT NOT NULL UNIQUE,
  dept_name TEXT NOT NULL,
  head_of_dept TEXT,
  cost_center TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.po_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reorder_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for all new tables
CREATE POLICY "Enable all operations for all users" ON public.purchase_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.po_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.quality_inspections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.stock_movements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.vendor_rates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.reorder_levels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for all users" ON public.departments FOR ALL USING (true) WITH CHECK (true);

-- Insert sample departments
INSERT INTO public.departments (dept_code, dept_name, head_of_dept, cost_center) VALUES
('PROD-A', 'Production Line A', 'John Smith', 'CC-001'),
('PROD-B', 'Production Line B', 'Jane Doe', 'CC-002'),
('MAINT', 'Maintenance', 'Bob Wilson', 'CC-003'),
('QC', 'Quality Control', 'Alice Brown', 'CC-004');

-- Create trigger to update stock on GRR acceptance
CREATE OR REPLACE FUNCTION update_stock_on_grr_acceptance()
RETURNS TRIGGER AS $$
BEGIN
  -- If accepted_qty is being updated and is greater than 0
  IF NEW.accepted_qty IS NOT NULL AND NEW.accepted_qty > 0 AND 
     (OLD.accepted_qty IS NULL OR OLD.accepted_qty != NEW.accepted_qty) THEN
    
    -- Update current stock in parts table
    UPDATE public.parts 
    SET current_stock = current_stock + (NEW.accepted_qty - COALESCE(OLD.accepted_qty, 0))
    WHERE id = NEW.part_id;
    
    -- Record stock movement
    INSERT INTO public.stock_movements (
      part_id, movement_type, quantity, reference_type, reference_id, 
      movement_date, remarks
    ) VALUES (
      NEW.part_id, 'IN', NEW.accepted_qty - COALESCE(OLD.accepted_qty, 0), 
      'GRR', NEW.grr_id, CURRENT_DATE, 'Stock received via GRR'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stock_on_grr_acceptance
  AFTER UPDATE ON public.grr_parts
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_on_grr_acceptance();

-- Create trigger to update stock on MIR issue
CREATE OR REPLACE FUNCTION update_stock_on_mir_issue()
RETURNS TRIGGER AS $$
BEGIN
  -- Update current stock in parts table (reduce stock)
  UPDATE public.parts 
  SET current_stock = current_stock - NEW.qty_issued
  WHERE id = NEW.part_id;
  
  -- Record stock movement
  INSERT INTO public.stock_movements (
    part_id, movement_type, quantity, reference_type, reference_id, 
    movement_date, remarks
  ) VALUES (
    NEW.part_id, 'OUT', NEW.qty_issued, 'MIR', NEW.mir_id, 
    CURRENT_DATE, 'Stock issued via MIR'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stock_on_mir_issue
  AFTER INSERT ON public.mir_parts
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_on_mir_issue();
