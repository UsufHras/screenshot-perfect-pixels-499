CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'الوقاية',
  excerpt text NOT NULL DEFAULT '',
  minutes integer NOT NULL DEFAULT 5,
  published_on date NOT NULL DEFAULT current_date,
  image_url text NOT NULL DEFAULT '',
  body text[] NOT NULL DEFAULT '{}'::text[],
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.articles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view articles"
  ON public.articles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert articles"
  ON public.articles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update articles"
  ON public.articles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete articles"
  ON public.articles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Backfill: seed the original sample articles so the blog stays populated.
INSERT INTO public.articles (slug, title, category, excerpt, minutes, published_on, image_url, body, sort_order) VALUES
('bed-bugs-signs', 'كيف تعرف أن منزلك مصاب ببق الفراش؟', 'الحشرات', 'علامات مبكرة تساعدك على اكتشاف الإصابة قبل انتشارها.', 5, '2026-09-12', '', ARRAY['بق الفراش حشرة صغيرة تتغذى على الدم ليلًا وتختبئ في حواف المراتب والأثاث.','من أهم العلامات: لدغات متتابعة، بقع دم صغيرة على الملاءات، ونقاط سوداء في حواف المرتبة.','عند ملاحظة هذه العلامات لا تحاول الرش العشوائي، بل اطلب فحصًا متخصصًا.'], 1),
('roaches-return', 'لماذا تعود الصراصير بعد رش المبيد؟', 'مكافحة الآفات', 'الرش وحده لا يكفي، وهذه هي الأسباب الحقيقية.', 6, '2026-09-02', '', ARRAY['كثير من المبيدات المنزلية تقتل الحشرات الظاهرة فقط دون الوصول إلى البيض والمخابئ.','كما أن الاستخدام المتكرر لنفس المادة قد يؤدي إلى مقاومة.','الحل هو التشخيص الصحيح وبرنامج متكامل يجمع بين الطعوم والنظافة وغلق المخابئ.'], 2),
('rodents-prevention', 'كيف تمنع دخول الفئران إلى المنزل؟', 'القوارض', 'خطوات عملية لغلق نقاط الدخول وتقليل جذب القوارض.', 4, '2026-08-20', '', ARRAY['تستطيع الفأرة المرور من فتحة بحجم قلم.','أغلق الفتحات حول المواسير، وركّب شرائط عزل أسفل الأبواب، وأحكم تخزين الطعام.','إذا لاحظت فضلات أو آثار قضم فاطلب معاينة.'], 3),
('restaurants', 'مكافحة الآفات في المطاعم: أهم إجراءات الوقاية', 'نصائح للمطاعم', 'دليل مختصر لمديري المطاعم للحفاظ على بيئة آمنة.', 7, '2026-08-05', '', ARRAY['المطاعم بيئة جاذبة للآفات بسبب الغذاء والرطوبة.','التزم بجدول نظافة يومي، وافحص البضائع الواردة، واعتمد برنامجًا وقائيًا دوريًا موثقًا.'], 4),
('pro-vs-diy', 'متى تحتاج إلى مكافحة احترافية بدلًا من المبيدات المنزلية؟', 'صحة وسلامة', 'متى يصبح التدخل المتخصص ضرورة وليس رفاهية.', 5, '2026-07-22', '', ARRAY['إذا تكررت الإصابة أو كانت الآفة من النوع الصعب مثل بق الفراش أو النمل الأبيض.','وإذا كان المكان يضم أطفالًا أو كبار سن أو منشأة غذائية، فالمكافحة المتخصصة أكثر أمانًا.'], 5);