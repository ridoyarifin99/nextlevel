-- NEXT LEVEL SUBS — Order financial consistency and delivery-component pricing fix
-- Delivery components are fulfillment records by default. A non-zero component price is an intentional additional charge.
-- Financial totals are recalculated from order_items + order_item_components so subtotal, tax, total and paid revenue cannot drift.

create or replace function public.admin_add_component(p_order_item_id uuid, p_component_name text, p_component_slug text default null, p_component_image text default null, p_custom_name text default null, p_service_name text default null, p_plan_duration text default null, p_quantity integer default 1, p_slot_number integer default 1, p_component_price numeric default 0, p_delivery_status text default 'pending', p_subscription_start timestamptz default null, p_subscription_expiry timestamptz default null, p_subscription_email text default null, p_subscription_password text default null, p_delivery_note text default null, p_admin_note text default null, p_reason text default 'Admin component creation') returns public.order_item_components language plpgsql security definer set search_path=public,pg_catalog as $$
declare v_order_id uuid; v_new public.order_item_components; v_order public.orders; v_new_subtotal numeric; v_new_tax numeric; v_new_total numeric;
begin
  if not public.is_admin() then raise exception 'admin access required' using errcode='42501'; end if;
  select order_id into v_order_id from public.order_items where id=p_order_item_id;
  if v_order_id is null then raise exception 'order item not found' using errcode='P0002'; end if;
  insert into public.order_item_components(order_item_id,component_name,component_slug,component_image,custom_name,service_name,plan_duration,quantity,slot_number,component_price,delivery_status,subscription_start,subscription_expiry,subscription_email,subscription_password,delivery_note,admin_note)
  values(p_order_item_id,p_component_name,p_component_slug,p_component_image,p_custom_name,p_service_name,p_plan_duration,greatest(1,p_quantity),greatest(1,p_slot_number),greatest(0,p_component_price),p_delivery_status,p_subscription_start,p_subscription_expiry,p_subscription_email,p_subscription_password,p_delivery_note,p_admin_note)
  returning * into v_new;
  select * into v_order from public.orders where id=v_order_id for update;
  select coalesce((select sum(coalesce(oi.price,0)*greatest(1,coalesce(oi.quantity,1))) from public.order_items oi where oi.order_id=v_order_id),0)+coalesce((select sum(greatest(0,coalesce(c.component_price,0))*greatest(1,coalesce(c.quantity,1))) from public.order_item_components c join public.order_items oi on oi.id=c.order_item_id where oi.order_id=v_order_id),0) into v_new_subtotal;
  v_new_tax:=round(v_new_subtotal*0.0185,2);
  v_new_total:=greatest(0,round(v_new_subtotal+v_new_tax-coalesce(v_order.discount,0),2));
  update public.orders set subtotal=v_new_subtotal,tax=v_new_tax,total=v_new_total,paid_amount=case when payment_status='paid' then greatest(0,coalesce(paid_amount,0)+(v_new_total-coalesce(v_order.total,0))) else paid_amount end,updated_at=now() where id=v_order_id;
  if v_new.component_price<>0 or v_new.quantity<>1 then insert into public.order_adjustments(order_id,adjustment_type,amount,previous_amount,new_amount,reason,created_by) values(v_order_id,'price',v_new_total-coalesce(v_order.total,0),case when v_order.payment_status='paid' then v_order.paid_amount else v_order.total end,case when v_order.payment_status='paid' then greatest(0,coalesce(v_order.paid_amount,0)+(v_new_total-coalesce(v_order.total,0))) else v_new_total end,p_reason,auth.uid()); end if;
  insert into public.order_activity_log(order_id,component_id,action,reason,created_by) values(v_order_id,v_new.id,'create',p_reason,auth.uid());
  return v_new;
end; $$;

create or replace function public.admin_update_component(p_component_id uuid, p_component_name text, p_component_slug text default null, p_component_image text default null, p_custom_name text default null, p_service_name text default null, p_plan_duration text default null, p_quantity integer default 1, p_slot_number integer default 1, p_component_price numeric default 0, p_delivery_status text default 'pending', p_subscription_start timestamptz default null, p_subscription_expiry timestamptz default null, p_subscription_email text default null, p_subscription_password text default null, p_delivery_note text default null, p_admin_note text default null, p_reason text default 'Admin component update') returns public.order_item_components language plpgsql security definer set search_path=public,pg_catalog as $$
declare v_old public.order_item_components; v_new public.order_item_components; v_order_id uuid; v_order public.orders; v_new_subtotal numeric; v_new_tax numeric; v_new_total numeric;
begin
  if not public.is_admin() then raise exception 'admin access required' using errcode='42501'; end if;
  select * into v_old from public.order_item_components where id=p_component_id for update;
  if not found then raise exception 'component not found' using errcode='P0002'; end if;
  select oi.order_id into v_order_id from public.order_items oi where oi.id=v_old.order_item_id;
  if v_order_id is null then raise exception 'parent order not found' using errcode='P0002'; end if;
  select * into v_order from public.orders where id=v_order_id for update;
  update public.order_item_components set component_name=p_component_name,component_slug=p_component_slug,component_image=p_component_image,custom_name=p_custom_name,service_name=p_service_name,plan_duration=p_plan_duration,quantity=greatest(1,p_quantity),slot_number=greatest(1,p_slot_number),component_price=greatest(0,p_component_price),delivery_status=p_delivery_status,subscription_start=p_subscription_start,subscription_expiry=p_subscription_expiry,subscription_email=p_subscription_email,subscription_password=p_subscription_password,delivery_note=p_delivery_note,admin_note=p_admin_note,updated_at=now() where id=p_component_id returning * into v_new;
  select coalesce((select sum(coalesce(oi.price,0)*greatest(1,coalesce(oi.quantity,1))) from public.order_items oi where oi.order_id=v_order_id),0)+coalesce((select sum(greatest(0,coalesce(c.component_price,0))*greatest(1,coalesce(c.quantity,1))) from public.order_item_components c join public.order_items oi on oi.id=c.order_item_id where oi.order_id=v_order_id),0) into v_new_subtotal;
  v_new_tax:=round(v_new_subtotal*0.0185,2);
  v_new_total:=greatest(0,round(v_new_subtotal+v_new_tax-coalesce(v_order.discount,0),2));
  update public.orders set subtotal=v_new_subtotal,tax=v_new_tax,total=v_new_total,paid_amount=case when payment_status='paid' then greatest(0,coalesce(paid_amount,0)+(v_new_total-coalesce(v_order.total,0))) else paid_amount end,updated_at=now() where id=v_order_id;
  if v_new_total<>coalesce(v_order.total,0) then insert into public.order_adjustments(order_id,adjustment_type,amount,previous_amount,new_amount,reason,created_by) values(v_order_id,'price',v_new_total-coalesce(v_order.total,0),case when v_order.payment_status='paid' then v_order.paid_amount else v_order.total end,case when v_order.payment_status='paid' then greatest(0,coalesce(v_order.paid_amount,0)+(v_new_total-coalesce(v_order.total,0))) else v_new_total end,p_reason,auth.uid()); end if;
  insert into public.order_activity_log(order_id,component_id,action,field_name,old_value,new_value,reason,created_by)
  select v_order_id,p_component_id,'update',x.field_name,x.old_value,x.new_value,p_reason,auth.uid() from (values ('component_name',v_old.component_name,v_new.component_name),('component_slug',v_old.component_slug,v_new.component_slug),('component_image',v_old.component_image,v_new.component_image),('custom_name',v_old.custom_name,v_new.custom_name),('service_name',v_old.service_name,v_new.service_name),('plan_duration',v_old.plan_duration,v_new.plan_duration),('quantity',v_old.quantity::text,v_new.quantity::text),('slot_number',v_old.slot_number::text,v_new.slot_number::text),('component_price',v_old.component_price::text,v_new.component_price::text),('delivery_status',v_old.delivery_status,v_new.delivery_status),('subscription_start',v_old.subscription_start::text,v_new.subscription_start::text),('subscription_expiry',v_old.subscription_expiry::text,v_new.subscription_expiry::text),('subscription_email',v_old.subscription_email,v_new.subscription_email),('subscription_password',v_old.subscription_password,v_new.subscription_password),('delivery_note',v_old.delivery_note,v_new.delivery_note),('admin_note',v_old.admin_note,v_new.admin_note)) x(field_name,old_value,new_value) where x.old_value is distinct from x.new_value;
  return v_new;
end; $$;

create or replace function public.admin_delete_component(p_component_id uuid, p_reason text default 'Admin component deletion') returns boolean language plpgsql security definer set search_path=public,pg_catalog as $$
declare v_old public.order_item_components; v_order_id uuid; v_order public.orders; v_new_subtotal numeric; v_new_tax numeric; v_new_total numeric;
begin
  if not public.is_admin() then raise exception 'admin access required' using errcode='42501'; end if;
  select * into v_old from public.order_item_components where id=p_component_id for update;
  if not found then raise exception 'component not found' using errcode='P0002'; end if;
  select oi.order_id into v_order_id from public.order_items oi where oi.id=v_old.order_item_id;
  if v_order_id is null then raise exception 'order not found' using errcode='P0002'; end if;
  select * into v_order from public.orders where id=v_order_id for update;
  insert into public.order_activity_log(order_id,component_id,action,reason,created_by) values(v_order_id,p_component_id,'delete',p_reason,auth.uid());
  delete from public.order_item_components where id=p_component_id;
  select coalesce((select sum(coalesce(oi.price,0)*greatest(1,coalesce(oi.quantity,1))) from public.order_items oi where oi.order_id=v_order_id),0)+coalesce((select sum(greatest(0,coalesce(c.component_price,0))*greatest(1,coalesce(c.quantity,1))) from public.order_item_components c join public.order_items oi on oi.id=c.order_item_id where oi.order_id=v_order_id),0) into v_new_subtotal;
  v_new_tax:=round(v_new_subtotal*0.0185,2);
  v_new_total:=greatest(0,round(v_new_subtotal+v_new_tax-coalesce(v_order.discount,0),2));
  update public.orders set subtotal=v_new_subtotal,tax=v_new_tax,total=v_new_total,paid_amount=case when payment_status='paid' then greatest(0,coalesce(paid_amount,0)+(v_new_total-coalesce(v_order.total,0))) else paid_amount end,updated_at=now() where id=v_order_id;
  if v_new_total<>coalesce(v_order.total,0) then insert into public.order_adjustments(order_id,adjustment_type,amount,previous_amount,new_amount,reason,created_by) values(v_order_id,'price',v_new_total-coalesce(v_order.total,0),case when v_order.payment_status='paid' then v_order.paid_amount else v_order.total end,case when v_order.payment_status='paid' then greatest(0,coalesce(v_order.paid_amount,0)+(v_new_total-coalesce(v_order.total,0))) else v_new_total end,p_reason,auth.uid()); end if;
  return true;
end; $$;
