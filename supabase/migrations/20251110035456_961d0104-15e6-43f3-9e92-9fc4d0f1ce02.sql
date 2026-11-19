-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'patient', 'clinician');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create patients table (extended profile for patients)
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  diagnosis_date DATE,
  primary_clinician_id UUID REFERENCES auth.users(id),
  disease_activity TEXT CHECK (disease_activity IN ('Low', 'Moderate', 'High')),
  flare_risk_percentage INTEGER CHECK (flare_risk_percentage >= 0 AND flare_risk_percentage <= 100),
  drug_response TEXT CHECK (drug_response IN ('Good', 'Partial', 'Poor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create clinicians table (extended profile for clinicians)
CREATE TABLE public.clinicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  specialization TEXT,
  license_number TEXT,
  hospital_affiliation TEXT,
  years_of_experience INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create biomarker_readings table
CREATE TABLE public.biomarker_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  reading_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  il6_level DECIMAL(10,2),
  crp_level DECIMAL(10,2),
  mmp9_level DECIMAL(10,2),
  tnf_r1_level DECIMAL(10,2),
  homocystine_level DECIMAL(10,2),
  glycerol3p_level DECIMAL(10,2),
  leptin_level DECIMAL(10,2),
  vcam1_level DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create medications table
CREATE TABLE public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  response_prediction TEXT CHECK (response_prediction IN ('Good', 'Partial', 'Poor')),
  response_confidence INTEGER CHECK (response_confidence >= 0 AND response_confidence <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create medication_adherence table
CREATE TABLE public.medication_adherence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE NOT NULL,
  scheduled_time TIMESTAMPTZ NOT NULL,
  taken_at TIMESTAMPTZ,
  was_taken BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create symptom_logs table
CREATE TABLE public.symptom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  log_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
  time_of_day TEXT CHECK (time_of_day IN ('Morning', 'Afternoon', 'Evening', 'Night')),
  joint_stiffness TEXT CHECK (joint_stiffness IN ('None', 'Mild', 'Moderate', 'Severe')),
  fatigue_level TEXT CHECK (fatigue_level IN ('None', 'Low', 'Moderate', 'High', 'Severe')),
  swelling_locations TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create activity_logs table
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  steps INTEGER,
  active_minutes INTEGER,
  sleep_hours DECIMAL(4,2),
  sleep_quality INTEGER CHECK (sleep_quality >= 0 AND sleep_quality <= 100),
  sleep_interruptions INTEGER,
  joint_mobility TEXT CHECK (joint_mobility IN ('Poor', 'Fair', 'Good', 'Excellent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  clinician_id UUID REFERENCES public.clinicians(id) ON DELETE CASCADE NOT NULL,
  appointment_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'No-Show')) DEFAULT 'Scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  alert_type TEXT CHECK (alert_type IN ('warning', 'success', 'info', 'urgent')) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biomarker_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_adherence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  )
$$;

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clinicians_updated_at BEFORE UPDATE ON public.clinicians
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON public.medications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for patients
CREATE POLICY "Patients can view own data"
  ON public.patients FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'clinician') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients can update own data"
  ON public.patients FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own patient record"
  ON public.patients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for clinicians
CREATE POLICY "Clinicians can view own data"
  ON public.clinicians FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clinicians can update own data"
  ON public.clinicians FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clinician record"
  ON public.clinicians FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for biomarker_readings
CREATE POLICY "Patients can view own biomarkers"
  ON public.biomarker_readings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = biomarker_readings.patient_id
      AND patients.user_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'clinician')
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Clinicians can insert biomarkers"
  ON public.biomarker_readings FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'clinician') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for medications
CREATE POLICY "Patients can view own medications"
  ON public.medications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = medications.patient_id
      AND patients.user_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'clinician')
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Clinicians can manage medications"
  ON public.medications FOR ALL
  USING (public.has_role(auth.uid(), 'clinician') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for medication_adherence
CREATE POLICY "Patients can view own adherence"
  ON public.medication_adherence FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.medications
      JOIN public.patients ON patients.id = medications.patient_id
      WHERE medications.id = medication_adherence.medication_id
      AND patients.user_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'clinician')
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Patients can update own adherence"
  ON public.medication_adherence FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.medications
      JOIN public.patients ON patients.id = medications.patient_id
      WHERE medications.id = medication_adherence.medication_id
      AND patients.user_id = auth.uid()
    )
  );

-- RLS Policies for symptom_logs
CREATE POLICY "Patients can manage own symptoms"
  ON public.symptom_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = symptom_logs.patient_id
      AND patients.user_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'clinician')
    OR public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for activity_logs
CREATE POLICY "Patients can manage own activity"
  ON public.activity_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = activity_logs.patient_id
      AND patients.user_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'clinician')
    OR public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for appointments
CREATE POLICY "Users can view own appointments"
  ON public.appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = appointments.patient_id
      AND patients.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.clinicians
      WHERE clinicians.id = appointments.clinician_id
      AND clinicians.user_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Clinicians can manage appointments"
  ON public.appointments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.clinicians
      WHERE clinicians.user_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for alerts
CREATE POLICY "Patients can view own alerts"
  ON public.alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = alerts.patient_id
      AND patients.user_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'clinician')
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Clinicians can create alerts"
  ON public.alerts FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'clinician') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients can update own alerts"
  ON public.alerts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = alerts.patient_id
      AND patients.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_biomarker_readings_patient_id ON public.biomarker_readings(patient_id);
CREATE INDEX idx_biomarker_readings_reading_date ON public.biomarker_readings(reading_date);
CREATE INDEX idx_medications_patient_id ON public.medications(patient_id);
CREATE INDEX idx_symptom_logs_patient_id ON public.symptom_logs(patient_id);
CREATE INDEX idx_symptom_logs_log_date ON public.symptom_logs(log_date);
CREATE INDEX idx_activity_logs_patient_id ON public.activity_logs(patient_id);
CREATE INDEX idx_activity_logs_log_date ON public.activity_logs(log_date);
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_clinician_id ON public.appointments(clinician_id);
CREATE INDEX idx_appointments_appointment_date ON public.appointments(appointment_date);
CREATE INDEX idx_alerts_patient_id ON public.alerts(patient_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);