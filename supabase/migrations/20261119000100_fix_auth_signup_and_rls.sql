-- =========================================================
-- Rheuma Guard: Auth and RLS hardening
-- Does not modify the existing schema's UI-facing columns.
-- =========================================================

-- 1. Replace signup trigger with a secure account bootstrap function

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested_role TEXT;
  assigned_role public.app_role;
  full_name TEXT;
BEGIN
  requested_role := NEW.raw_user_meta_data->>'requested_role';
  full_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );

  -- Only patient or clinician can be requested publicly.
  -- Admin is never granted from signup metadata.
  IF requested_role = 'clinician' THEN
    assigned_role := 'clinician';
  ELSE
    assigned_role := 'patient';
  END IF;

  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, full_name)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  IF assigned_role = 'patient' THEN
    INSERT INTO public.patients (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  ELSE
    INSERT INTO public.clinicians (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();


-- 2. Profiles: users can see/update their own profile

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "profile_select_own_or_admin"
ON public.profiles FOR SELECT
TO authenticated
USING (
  id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "profile_update_own"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());


-- 3. Roles: users can read their own roles
-- Admin can manage roles. Normal users cannot insert/update roles.

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "roles_select_own_or_admin"
ON public.user_roles FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "roles_admin_manage"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- 4. Patients: patient sees own data.
-- Clinician only sees patients assigned to them.
-- Admin can see all.

DROP POLICY IF EXISTS "Patients can view own data" ON public.patients;
DROP POLICY IF EXISTS "Patients can update own data" ON public.patients;
DROP POLICY IF EXISTS "Users can insert own patient record" ON public.patients;

CREATE POLICY "patients_select_scoped"
ON public.patients FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR primary_clinician_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "patients_update_self"
ON public.patients FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "patients_admin_update"
ON public.patients FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- 5. Clinicians: clinicians can see/update their own clinician profile.
-- Admins can see/manage all clinician profiles.

DROP POLICY IF EXISTS "Clinicians can view own data" ON public.clinicians;
DROP POLICY IF EXISTS "Clinicians can update own data" ON public.clinicians;
DROP POLICY IF EXISTS "Users can insert own clinician record" ON public.clinicians;

CREATE POLICY "clinicians_select_self_or_admin"
ON public.clinicians FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "clinicians_update_self"
ON public.clinicians FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "clinicians_admin_manage"
ON public.clinicians FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- 6. Biomarker readings

DROP POLICY IF EXISTS "Patients can view own biomarkers" ON public.biomarker_readings;
DROP POLICY IF EXISTS "Clinicians can insert biomarkers" ON public.biomarker_readings;

CREATE POLICY "biomarkers_select_scoped"
ON public.biomarker_readings FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = biomarker_readings.patient_id
      AND (
        p.user_id = auth.uid()
        OR p.primary_clinician_id = auth.uid()
      )
  )
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "biomarkers_insert_scoped"
ON public.biomarker_readings FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = biomarker_readings.patient_id
      AND p.primary_clinician_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
);


-- 7. Medications

DROP POLICY IF EXISTS "Patients can view own medications" ON public.medications;
DROP POLICY IF EXISTS "Clinicians can manage medications" ON public.medications;

CREATE POLICY "medications_select_scoped"
ON public.medications FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = medications.patient_id
      AND (
        p.user_id = auth.uid()
        OR p.primary_clinician_id = auth.uid()
      )
  )
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "medications_clinician_manage_assigned"
ON public.medications FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = medications.patient_id
      AND p.primary_clinician_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = medications.patient_id
      AND p.primary_clinician_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
);


-- 8. Medication adherence

DROP POLICY IF EXISTS "Patients can view own adherence" ON public.medication_adherence;
DROP POLICY IF EXISTS "Patients can update own adherence" ON public.medication_adherence;

CREATE POLICY "adherence_select_scoped"
ON public.medication_adherence FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.medications m
    JOIN public.patients p ON p.id = m.patient_id
    WHERE m.id = medication_adherence.medication_id
      AND (
        p.user_id = auth.uid()
        OR p.primary_clinician_id = auth.uid()
      )
  )
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "adherence_patient_manage"
ON public.medication_adherence FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.medications m
    JOIN public.patients p ON p.id = m.patient_id
    WHERE m.id = medication_adherence.medication_id
      AND p.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.medications m
    JOIN public.patients p ON p.id = m.patient_id
    WHERE m.id = medication_adherence.medication_id
      AND p.user_id = auth.uid()
  )
);

CREATE POLICY "adherence_clinician_manage_assigned"
ON public.medication_adherence FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.medications m
    JOIN public.patients p ON p.id = m.patient_id
    WHERE m.id = medication_adherence.medication_id
      AND p.primary_clinician_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.medications m
    JOIN public.patients p ON p.id = m.patient_id
    WHERE m.id = medication_adherence.medication_id
      AND p.primary_clinician_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
);


-- 9. Symptom logs

DROP POLICY IF EXISTS "Patients can manage own symptoms" ON public.symptom_logs;

CREATE POLICY "symptoms_patient_manage"
ON public.symptom_logs FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = symptom_logs.patient_id
      AND p.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = symptom_logs.patient_id
      AND p.user_id = auth.uid()
  )
);

CREATE POLICY "symptoms_clinician_select_assigned"
ON public.symptom_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = symptom_logs.patient_id
      AND p.primary_clinician_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
);


-- 10. Activity logs

DROP POLICY IF EXISTS "Patients can manage own activity" ON public.activity_logs;

CREATE POLICY "activity_patient_manage"
ON public.activity_logs FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = activity_logs.patient_id
      AND p.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = activity_logs.patient_id
      AND p.user_id = auth.uid()
  )
);

CREATE POLICY "activity_clinician_select_assigned"
ON public.activity_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = activity_logs.patient_id
      AND p.primary_clinician_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
);


-- 11. Appointments

DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Clinicians can manage appointments" ON public.appointments;

CREATE POLICY "appointments_select_scoped"
ON public.appointments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = appointments.patient_id
      AND (
        p.user_id = auth.uid()
        OR p.primary_clinician_id = auth.uid()
      )
  )
  OR EXISTS (
    SELECT 1 FROM public.clinicians c
    WHERE c.id = appointments.clinician_id
      AND c.user_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "appointments_clinician_manage_assigned"
ON public.appointments FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.clinicians c
    WHERE c.id = appointments.clinician_id
      AND c.user_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.clinicians c
    WHERE c.id = appointments.clinician_id
      AND c.user_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
);


-- 12. Alerts

DROP POLICY IF EXISTS "Patients can view own alerts" ON public.alerts;
DROP POLICY IF EXISTS "Clinicians can create alerts" ON public.alerts;
DROP POLICY IF EXISTS "Patients can update own alerts" ON public.alerts;

CREATE POLICY "alerts_select_scoped"
ON public.alerts FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = alerts.patient_id
      AND (
        p.user_id = auth.uid()
        OR p.primary_clinician_id = auth.uid()
      )
  )
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "alerts_clinician_insert_assigned"
ON public.alerts FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = alerts.patient_id
      AND p.primary_clinician_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "alerts_patient_update_own"
ON public.alerts FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = alerts.patient_id
      AND p.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = alerts.patient_id
      AND p.user_id = auth.uid()
  )
);

-- =========================================================
-- End of migration
-- =========================================================
