-- Remove existing admin and create new admin
DELETE FROM public.user_roles WHERE role = 'admin';

-- Assign admin role to aman2711shah@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('3480cb73-78b1-4415-af1f-015021ac18bf', 'admin');