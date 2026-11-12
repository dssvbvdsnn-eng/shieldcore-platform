-- Optional starter demo workspace.
-- 1) Sign up a user with Supabase Auth.
-- 2) Replace the UUID below with that user's auth.users.id from Authentication > Users.
-- 3) Run this script once. It creates the workspace, membership, sample customer and sample events.
do $$
declare
  v_user uuid := '00000000-0000-0000-0000-000000000001'; -- REPLACE THIS
  v_workspace uuid := '10000000-0000-4000-8000-000000000001';
  c1 uuid := '20000000-0000-4000-8000-000000000001';
  c2 uuid := '20000000-0000-4000-8000-000000000002';
  c3 uuid := '20000000-0000-4000-8000-000000000003';
  t1 uuid := '30000000-0000-4000-8000-000000000001';
  t2 uuid := '30000000-0000-4000-8000-000000000002';
begin
  insert into public.workspaces(id,name,plan) values(v_workspace,'ShieldCore Demo Workspace','demo') on conflict do nothing;
  insert into public.workspace_members(workspace_id,user_id,role) values(v_workspace,v_user,'owner') on conflict do nothing;
  insert into public.customers(id,workspace_id,company_name,industry,contact_name,email,health_score,status) values
    (c1,v_workspace,'Northstar Commerce','E-commerce','Mariam Hassan','ops@northstar.example',91,'Active'),
    (c2,v_workspace,'Vertex Pay','FinTech','Omar Adel','security@vertex.example',84,'Active'),
    (c3,v_workspace,'SwiftCart','E-commerce','Nour Youssef','risk@swiftcart.example',68,'Watchlist') on conflict do nothing;
  insert into public.transactions(id,workspace_id,customer_id,external_ref,amount,currency,endpoint,country,risk_score,decision,reasons)
    values (t1,v_workspace,c1,'TX-SEED-001',2450,'EGP','/v1/checkout/pay','EG',12,'allow','["Known device","Normal velocity"]'::jsonb),
           (t2,v_workspace,c3,'TX-SEED-002',8700,'EGP','/v1/promo/redeem','EG',62,'review','["Velocity spike","New account"]'::jsonb) on conflict do nothing;
  insert into public.risk_cases(workspace_id,customer_id,transaction_id,title,severity,status,owner,resolution)
    values(v_workspace,c3,t2,'High velocity / checkout activity','High','Open','Ibrahim','Review promotion activity and confirm customer context.') ;
  insert into public.interactions(workspace_id,customer_id,channel,summary,next_action)
    values(v_workspace,c3,'Call','Reviewed repeated promotion attempts with risk contact.','Share pilot review checklist');
end $$;
