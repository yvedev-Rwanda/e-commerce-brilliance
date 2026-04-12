CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
TO public
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO public
USING (public.has_role(auth.uid(), 'admin'));