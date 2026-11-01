CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'متنوع',
  short text NOT NULL DEFAULT '',
  use_place text NOT NULL DEFAULT '',
  pests text[] NOT NULL DEFAULT '{}',
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  available boolean NOT NULL DEFAULT true,
  regulated boolean NOT NULL DEFAULT false,
  image_url text NOT NULL DEFAULT '',
  usage text NOT NULL DEFAULT '',
  safety text[] NOT NULL DEFAULT '{}',
  storage_note text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.products (slug, name, category, short, use_place, pests, price, available, regulated, usage, safety, storage_note, sort_order) VALUES
('gel-bait-roach', 'جل طعم للصراصير', 'طعوم', 'جل طعم موضعي للأماكن الضيقة.', 'المطابخ والحمامات', '{"الصراصير"}', 180, true, false, 'يوضع نقاط صغيرة في الشقوق وخلف الأجهزة بعيدًا عن متناول الأطفال.', '{"يُحفظ بعيدًا عن متناول الأطفال والحيوانات الأليفة","اتبع التعليمات المدونة على العبوة","لا يُستخدم بالقرب من الطعام"}', 'مكان جاف وبارد بعيدًا عن الشمس.', 1),
('rodent-station', 'محطة طعوم قوارض مغلقة', 'منتجات مكافحة القوارض', 'محطة آمنة بقفل لحماية الطعوم.', 'المخازن والمنشآت والحدائق', '{"الفئران","الجرذان"}', 350, true, false, 'توضع على مسارات القوارض بمحاذاة الجدران.', '{"يُحفظ بعيدًا عن متناول الأطفال والحيوانات الأليفة","اتبع التعليمات المدونة على العبوة","لا يُستخدم بالقرب من الطعام"}', 'تخزن نظيفة وجافة.', 2),
('sticky-traps', 'مصائد لاصقة (10 قطع)', 'مصائد', 'مصائد مراقبة بدون مواد كيميائية.', 'المنازل والمطاعم', '{"الصراصير","العناكب","الحشرات الزاحفة"}', 120, true, false, 'توضع في الزوايا وأسفل الأثاث ويتم تغييرها دوريًا.', '{"تُبعد عن الأطفال والحيوانات الأليفة"}', 'في عبوتها الأصلية.', 3),
('ant-bait', 'طعم النمل المنزلي', 'منتجات مكافحة النمل', 'يُحمل إلى المستعمرة للقضاء عليها.', 'المنازل', '{"النمل"}', 150, true, false, 'يوضع على مسار النمل دون رش مبيدات حوله.', '{"يُحفظ بعيدًا عن متناول الأطفال والحيوانات الأليفة","اتبع التعليمات المدونة على العبوة","لا يُستخدم بالقرب من الطعام"}', 'مكان جاف.', 4),
('pro-insecticide', 'مبيد حشري احترافي مركز', 'مبيدات حشرية', 'للاستخدام المهني تحت إشراف متخصص.', 'المنشآت التجارية', '{"الحشرات الزاحفة والطائرة"}', 650, true, true, 'يُخفف حسب التعليمات ويُستخدم بواسطة فني مدرب فقط.', '{"يُحفظ بعيدًا عن متناول الأطفال والحيوانات الأليفة","اتبع التعليمات المدونة على العبوة","لا يُستخدم بالقرب من الطعام","يتطلب ارتداء معدات الوقاية الشخصية","يُفضل استشارة الدكتور قبل الاستخدام"}', 'مكان مغلق وجيد التهوية بعيدًا عن الأغذية.', 5),
('bedbug-encasement', 'غطاء مرتبة واقٍ من بق الفراش', 'منتجات مكافحة بق الفراش', 'غطاء محكم يمنع اختباء البق.', 'غرف النوم والفنادق', '{"بق الفراش"}', 900, false, false, 'يُركب على المرتبة ويُغلق بالكامل.', '{"مناسب للاستخدام المنزلي"}', 'مكان جاف.', 6),
('hand-sprayer', 'رشاشة ضغط يدوية 2 لتر', 'معدات وأدوات', 'رشاشة متينة بفوهة قابلة للتعديل.', 'الاستخدام المهني والمنزلي', '{"—"}', 420, true, false, 'تُنظف جيدًا بعد كل استخدام.', '{"لا تُستخدم لمياه الشرب بعد استعمالها للمبيدات"}', 'فارغة ونظيفة.', 7),
('door-sweep', 'شريط عزل أسفل الأبواب', 'منتجات وقائية', 'يمنع دخول الحشرات والقوارض.', 'الأبواب الخارجية', '{"القوارض","الحشرات الزاحفة"}', 95, true, false, 'يُثبت أسفل الباب بإحكام.', '{"منتج غير كيميائي"}', '—', 8);

COMMENT ON COLUMN public.products.use_place IS 'الاستخدامات المناسبة';
COMMENT ON COLUMN public.products.storage_note IS 'التخزين';