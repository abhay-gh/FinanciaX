export interface User { id:number; email:string; full_name:string; is_active:boolean; created_at:string }
export interface Account { id:number; user_id:number; name:string; institution?:string; account_type:string; balance:number; currency:string; mask?:string; is_active:boolean }
export interface Category { id:number; name:string; icon?:string; color?:string }
export type TxType = 'income'|'expense'|'transfer'
export interface Transaction { id:number; account_id:number; category_id?:number; amount:number; transaction_type:TxType; description:string; notes?:string; transaction_date:string; merchant?:string; is_recurring:boolean; ai_category_suggestion?:string }
export interface Budget { id:number; user_id:number; category_id:number; name:string; amount:number; period:string; year:number; month?:number; is_active:boolean; spent:number }
export interface Goal { id:number; user_id:number; name:string; description?:string; target_amount:number; current_amount:number; target_date?:string; status:string; icon?:string; progress_pct:number }
export interface NetWorth { total_assets:number; total_liabilities:number; net_worth:number }
export interface MonthlySummary { income:number; expense:number; transfer:number; savings:number }
export interface SpendingByCat { category:string; color:string; total:number }
