export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      departments: {
        Row: {
          cost_center: string | null
          created_at: string
          dept_code: string
          dept_name: string
          head_of_dept: string | null
          id: string
          is_active: boolean | null
        }
        Insert: {
          cost_center?: string | null
          created_at?: string
          dept_code: string
          dept_name: string
          head_of_dept?: string | null
          id?: string
          is_active?: boolean | null
        }
        Update: {
          cost_center?: string | null
          created_at?: string
          dept_code?: string
          dept_name?: string
          head_of_dept?: string | null
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      grr_parts: {
        Row: {
          accepted_qty: number | null
          challan_qty: number
          grr_id: string | null
          id: string
          part_id: string | null
          rejected_qty: number | null
        }
        Insert: {
          accepted_qty?: number | null
          challan_qty?: number
          grr_id?: string | null
          id?: string
          part_id?: string | null
          rejected_qty?: number | null
        }
        Update: {
          accepted_qty?: number | null
          challan_qty?: number
          grr_id?: string | null
          id?: string
          part_id?: string | null
          rejected_qty?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "grr_parts_grr_id_fkey"
            columns: ["grr_id"]
            isOneToOne: false
            referencedRelation: "grrs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grr_parts_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
        ]
      }
      grrs: {
        Row: {
          challan_date: string
          created_at: string
          grr_no: string
          id: string
          po_reference: string
          remarks: string | null
          status: string | null
          total_value: number | null
          transporter_name: string
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          challan_date: string
          created_at?: string
          grr_no: string
          id?: string
          po_reference: string
          remarks?: string | null
          status?: string | null
          total_value?: number | null
          transporter_name: string
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          challan_date?: string
          created_at?: string
          grr_no?: string
          id?: string
          po_reference?: string
          remarks?: string | null
          status?: string | null
          total_value?: number | null
          transporter_name?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grrs_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      mir_parts: {
        Row: {
          id: string
          mir_id: string | null
          part_id: string | null
          qty_issued: number
          unit_rate: number | null
        }
        Insert: {
          id?: string
          mir_id?: string | null
          part_id?: string | null
          qty_issued?: number
          unit_rate?: number | null
        }
        Update: {
          id?: string
          mir_id?: string | null
          part_id?: string | null
          qty_issued?: number
          unit_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mir_parts_mir_id_fkey"
            columns: ["mir_id"]
            isOneToOne: false
            referencedRelation: "mirs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mir_parts_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
        ]
      }
      mirs: {
        Row: {
          created_at: string
          date: string
          department: string
          id: string
          mir_no: string
          purpose: string | null
          remarks: string | null
          requested_by: string
          status: string | null
          total_value: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          department: string
          id?: string
          mir_no: string
          purpose?: string | null
          remarks?: string | null
          requested_by: string
          status?: string | null
          total_value?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          department?: string
          id?: string
          mir_no?: string
          purpose?: string | null
          remarks?: string | null
          requested_by?: string
          status?: string | null
          total_value?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      parts: {
        Row: {
          category: string
          created_at: string
          current_stock: number | null
          description: string
          id: string
          minimum_stock: number | null
          opening_stock: number | null
          order_quantity: number | null
          part_no: string
          unit_of_measure: string | null
          unit_rate: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          current_stock?: number | null
          description: string
          id?: string
          minimum_stock?: number | null
          opening_stock?: number | null
          order_quantity?: number | null
          part_no: string
          unit_of_measure?: string | null
          unit_rate?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          current_stock?: number | null
          description?: string
          id?: string
          minimum_stock?: number | null
          opening_stock?: number | null
          order_quantity?: number | null
          part_no?: string
          unit_of_measure?: string | null
          unit_rate?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      po_items: {
        Row: {
          delivery_date: string | null
          id: string
          part_id: string | null
          po_id: string | null
          quantity: number
          specifications: string | null
          total_amount: number | null
          unit_rate: number | null
        }
        Insert: {
          delivery_date?: string | null
          id?: string
          part_id?: string | null
          po_id?: string | null
          quantity?: number
          specifications?: string | null
          total_amount?: number | null
          unit_rate?: number | null
        }
        Update: {
          delivery_date?: string | null
          id?: string
          part_id?: string | null
          po_id?: string | null
          quantity?: number
          specifications?: string | null
          total_amount?: number | null
          unit_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "po_items_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "po_items_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          approved_by: string | null
          created_at: string
          created_by: string | null
          delivery_date: string | null
          id: string
          po_date: string
          po_no: string
          status: string | null
          terms_conditions: string | null
          total_amount: number | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          delivery_date?: string | null
          id?: string
          po_date: string
          po_no: string
          status?: string | null
          terms_conditions?: string | null
          total_amount?: number | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          delivery_date?: string | null
          id?: string
          po_date?: string
          po_no?: string
          status?: string | null
          terms_conditions?: string | null
          total_amount?: number | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_inspections: {
        Row: {
          created_at: string
          grr_part_id: string | null
          id: string
          inspection_date: string
          inspector_name: string
          quality_status: string | null
          remarks: string | null
          test_parameters: string | null
          test_results: string | null
        }
        Insert: {
          created_at?: string
          grr_part_id?: string | null
          id?: string
          inspection_date?: string
          inspector_name: string
          quality_status?: string | null
          remarks?: string | null
          test_parameters?: string | null
          test_results?: string | null
        }
        Update: {
          created_at?: string
          grr_part_id?: string | null
          id?: string
          inspection_date?: string
          inspector_name?: string
          quality_status?: string | null
          remarks?: string | null
          test_parameters?: string | null
          test_results?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quality_inspections_grr_part_id_fkey"
            columns: ["grr_part_id"]
            isOneToOne: false
            referencedRelation: "grr_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      reorder_levels: {
        Row: {
          created_at: string
          id: string
          lead_time_days: number | null
          max_stock_level: number | null
          part_id: string | null
          reorder_level: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_time_days?: number | null
          max_stock_level?: number | null
          part_id?: string | null
          reorder_level?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_time_days?: number | null
          max_stock_level?: number | null
          part_id?: string | null
          reorder_level?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reorder_levels_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: true
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          movement_date: string
          movement_type: string
          part_id: string | null
          quantity: number
          reference_id: string | null
          reference_type: string | null
          remarks: string | null
          unit_rate: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          movement_date?: string
          movement_type: string
          part_id?: string | null
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          remarks?: string | null
          unit_rate?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          movement_date?: string
          movement_type?: string
          part_id?: string | null
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          remarks?: string | null
          unit_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_parts: {
        Row: {
          id: string
          part_id: string | null
          vendor_id: string | null
        }
        Insert: {
          id?: string
          part_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          id?: string
          part_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_parts_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_parts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_rates: {
        Row: {
          created_at: string
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean | null
          part_id: string | null
          rate: number
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          part_id?: string | null
          rate: number
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          part_id?: string | null
          rate?: number
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_rates_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_rates_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string
          created_at: string
          email: string | null
          id: string
          name: string
          payment_terms: string | null
          phone: string | null
          rating: number | null
          status: string | null
          updated_at: string
          vendor_code: string
        }
        Insert: {
          address: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          payment_terms?: string | null
          phone?: string | null
          rating?: number | null
          status?: string | null
          updated_at?: string
          vendor_code: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          payment_terms?: string | null
          phone?: string | null
          rating?: number | null
          status?: string | null
          updated_at?: string
          vendor_code?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
