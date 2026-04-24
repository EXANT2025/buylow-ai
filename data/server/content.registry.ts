import type { ServerRegistry } from "./content.types"

export const SERVER_CONTENT: ServerRegistry = {
  "okx-mobile": {
    2: {
      title: {
        en: "Create OKX Account & Complete KYC",
        ko: "Buylow AI 연동 거래소 계정 생성 및 KYC 인증",
        ar: "إنشاء حساب OKX وإكمال التحقق",
        ru: "Создание аккаунта OKX и прохождение KYC",
        zh: "创建OKX账户并完成KYC验证",
        es: "Crear cuenta OKX y completar KYC",
        id: "Buat Akun OKX & Selesaikan KYC",
        th: "สร้างบัญชี OKX และยืนยันตัวตน KYC",
        vi: "Tạo Tài Khoản OKX & Hoàn Thành KYC",
        tr: "OKX Hesabı Oluştur ve KYC Tamamla",
      },
      sections: [
        {
          heading: {
            en: "Create Account",
            ko: "계정 생성",
            ar: "إنشاء حساب",
            ru: "Создать аккаунт",
            zh: "创建账户",
            es: "Crear cuenta",
            id: "Buat Akun",
            th: "สร้างบัญชี",
            vi: "Tạo Tài Khoản",
            tr: "Hesap Oluştur",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/server_pic/okx1-1.png",
            alt: "OKX 계정 생성",
          },
          paragraphs: [
            {
              en: "1. Select **your country**, check the agreement items, and click **Create Account**.",
              ko: "1. **본인의 국가**를 선택한 다음, 동의 사항을 체크하고 **Create Account** 를 클릭합니다.",
              ar: "1. اختر **بلدك**، وافق على الشروط، ثم انقر **Create Account**.",
              ru: "1. Выберите **вашу страну**, отметьте согласие и нажмите **Create Account**.",
              zh: "1. 选择**您的国家**，勾选同意条款，点击**Create Account**。",
              es: "1. Selecciona **tu país**, acepta los términos y haz clic en **Create Account**.",
              id: "1. Pilih **negara Anda**, centang item persetujuan, dan klik **Create Account**.",
              th: "1. เลือก **ประเทศของคุณ** ทำเครื่องหมายรายการข้อตกลง และคลิก **Create Account**",
              vi: "1. Chọn **quốc gia của bạn**, đánh dấu các mục đồng ý và nhấp **Create Account**.",
              tr: "1. **Ülkenizi** seçin, sözleşme maddelerini işaretleyin ve **Create Account**'a tıklayın.",
            },
            {
              en: "2. Enter your **email**.",
              ko: "2. **이메일**을 입력합니다.",
              ar: "2. أدخل **بريدك الإلكتروني**.",
              ru: "2. Введите **email**.",
              zh: "2. 输入**邮箱**。",
              es: "2. Ingresa tu **email**.",
              id: "2. Masukkan **email** Anda.",
              th: "2. ป้อน **อีเมล** ของคุณ",
              vi: "2. Nhập **email** của bạn.",
              tr: "2. **E-postanızı** girin.",
            },
          ],
          link: {
            label: {
              en: "Go to Buylow AI Exclusive Signup Page",
              ko: "Buylow AI 전용 계정 생성 링크로 이동",
              ar: "الانتقال إلى صفحة تسجيل Buylow AI الحصرية",
              ru: "Перейти на страницу регистрации Buylow AI",
              zh: "前往 Buylow AI 专属注册页面",
              es: "Ir a la página de registro exclusiva de Buylow AI",
              id: "Buka Halaman Pendaftaran Eksklusif Buylow AI",
              th: "ไปที่หน้าลงทะเบียนพิเศษของ Buylow AI",
              vi: "Đi đến Trang Đăng Ký Độc Quyền Buylow AI",
              tr: "Buylow AI Özel Kayıt Sayfasına Git",
            },
            href: "https://www.okx.com/join/EXITANTS",
            slot: "signup.okx",
          },
          layout: "fullTop",
        },
        {
          heading: {
            en: "**★ Important Notice ★**",
            ko: "**★ 중요 안내 ★**",
            ar: "**★ إشعار هام ★**",
            ru: "**★ Важное уведомление ★**",
            zh: "**★ 重要提示 ★**",
            es: "**★ Aviso importante ★**",
            id: "**★ Pemberitahuan Penting ★**",
            th: "**★ ประกาศสำคัญ ★**",
            vi: "**★ Thông Báo Quan Trọng ★**",
            tr: "**★ Önemli Bildirim ★**",
          },
          paragraphs: [
            {
              en: "- If you already have an OKX account, we recommend switching your existing OKX account to the Buylow AI code using the button below.",
              ko: "- 이미 OKX 아이디가 가입되어있다면, 아래 버튼을 클릭하여 기존 OKX 계정에서 Buylow AI 전용 코드로 변경하는 것을 추천 드립니다.",
              ar: "- إذا كان لديك حساب OKX، نوصي بتحويله إلى كود Buylow AI عبر الزر أدناه.",
              ru: "- Если у вас уже есть аккаунт OKX, рекомендуем переключить его на код Buylow AI.",
              zh: "- 如果您已有OKX账户，建议点击下方按钮切换至 Buylow AI 专属代码。",
              es: "- Si ya tienes cuenta OKX, te recomendamos cambiar al código Buylow AI con el botón de abajo.",
              id: "- Jika Anda sudah memiliki akun OKX, kami sarankan untuk mengubah akun OKX Anda ke kode Buylow AI menggunakan tombol di bawah.",
              th: "- หากคุณมีบัญชี OKX อยู่แล้ว เราแนะนำให้เปลี่ยนบัญชี OKX ที่มีอยู่เป็นรหัส Buylow AI โดยใช้ปุ่มด้านล่าง",
              vi: "- Nếu bạn đã có tài khoản OKX, chúng tôi khuyên bạn chuyển sang mã Buylow AI bằng nút bên dưới.",
              tr: "- Zaten bir OKX hesabınız varsa, aşağıdaki düğmeyi kullanarak mevcut OKX hesabınızı Buylow AI koduna değiştirmenizi öneririz.",
            },
          ],
          buttons: [
            {
              label: {
                en: "Change to Buylow AI Code",
                ko: "Buylow AI 코드 변경하기",
                ar: "تغيير إلى كود Buylow AI",
                ru: "Изменить на код Buylow AI",
                zh: "更改为 Buylow AI 代码",
                es: "Cambiar a código Buylow AI",
                id: "Ubah ke Kode Buylow AI",
                th: "เปลี่ยนเป็นรหัส Buylow AI",
                vi: "Đổi sang Mã Buylow AI",
                tr: "Buylow AI Koduna Değiştir",
              },
              action: "openOkxCodeSwitchModal",
            },
          ],
          layout: "textOnly",
        },
        {
          heading: {
            en: "Phone Verification",
            ko: "휴대폰 인증",
            ar: "التحقق من الهاتف",
            ru: "Подтверждение телефона",
            zh: "手机验证",
            es: "Verificación telefónica",
            id: "Verifikasi Telepon",
            th: "ยืนยันหมายเลขโทรศัพท์",
            vi: "Xác Minh Điện Thoại",
            tr: "Telefon Doğrulama",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/server_pic/okx1-2.png",
            alt: "휴대폰 인증",
          },
          paragraphs: [
            {
              en: "1. Select your **country code**, enter your **phone number**, and click **Verify now**.",
              ko: "1. **국가 번호**를 선택한 다음, 본인의 **휴대폰 번호**를 입력하고 **Verify now** 를 클릭합니다.",
              ar: "1. اختر **رمز الدولة**، أدخل **رقم هاتفك**، وانقر **Verify now**.",
              ru: "1. Выберите **код страны**, введите **номер телефона** и нажмите **Verify now**.",
              zh: "1. 选择**国家代码**，输入**手机号码**，点击**Verify now**。",
              es: "1. Selecciona el **código de país**, ingresa tu **número de teléfono** y haz clic en **Verify now**.",
              id: "1. Pilih **kode negara**, masukkan **nomor telepon** Anda, dan klik **Verify now**.",
              th: "1. เลือก **รหัสประเทศ** ป้อน **หมายเลขโทรศัพท์** ของคุณ และคลิก **Verify now**",
              vi: "1. Chọn **mã quốc gia**, nhập **số điện thoại** của bạn và nhấp **Verify now**.",
              tr: "1. **Ülke kodunuzu** seçin, **telefon numaranızı** girin ve **Verify now**'a tıklayın.",
            },
            {
              en: "2. Enter the **verification code** from the SMS sent to your phone.",
              ko: "2. 입력한 휴대폰으로 온 인증 문자의 **인증 번호**를 입력합니다.",
              ar: "2. أدخل **رمز التحقق** من الرسالة النصية.",
              ru: "2. Введите **код подтверждения** из SMS.",
              zh: "2. 输入收到的**短信验证码**。",
              es: "2. Ingresa el **código de verificación** del SMS.",
              id: "2. Masukkan **kode verifikasi** dari SMS yang dikirim ke telepon Anda.",
              th: "2. ป้อน **รหัสยืนยัน** จาก SMS ที่ส่งไปยังโทรศัพท์ของคุณ",
              vi: "2. Nhập **mã xác minh** từ SMS được gửi đến điện thoại của bạn.",
              tr: "2. Telefonunuza gönderilen SMS'teki **doğrulama kodunu** girin.",
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            en: "Set Password",
            ko: "비밀번호 설정",
            ar: "تعيين كلمة المرور",
            ru: "Установка пароля",
            zh: "设置密码",
            es: "Establecer contraseña",
            id: "Atur Kata Sandi",
            th: "ตั้งรหัสผ่าน",
            vi: "Đặt Mật Khẩu",
            tr: "Şifre Belirle",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/server_pic/okx1-3.png",
            alt: "비밀번호 설정",
          },
          paragraphs: [
            {
              en: "Please set a password following the **password rules** shown at the bottom.",
              ko: "하단에 **비밀번호 규칙**을 준수하여 비밀번호를 설정하시길 바랍니다.",
              ar: "يرجى تعيين كلمة مرور وفقاً **لقواعد كلمة المرور** أدناه.",
              ru: "Установите пароль согласно **правилам** внизу.",
              zh: "请按照底部的**密码规则**设置密码。",
              es: "Establece una contraseña siguiendo las **reglas** mostradas abajo.",
              id: "Silakan atur kata sandi dengan mengikuti **aturan kata sandi** yang ditunjukkan di bawah.",
              th: "กรุณาตั้งรหัสผ่านตาม **กฎรหัสผ่าน** ที่แสดงด้านล่าง",
              vi: "Vui lòng đặt mật khẩu theo **quy tắc mật khẩu** được hiển thị ở dưới.",
              tr: "Lütfen aşağıda gösterilen **şifre kurallarını** izleyerek bir şifre belirleyin.",
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            en: "Start Identity Verification",
            ko: "신원 인증 시작",
            ar: "بدء التحقق من الهوية",
            ru: "Начать верификацию",
            zh: "开始身份验证",
            es: "Iniciar verificación de identidad",
            id: "Mulai Verifikasi Identitas",
            th: "เริ่มยืนยันตัวตน",
            vi: "Bắt Đầu Xác Minh Danh Tính",
            tr: "Kimlik Doğrulamayı Başlat",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/server_pic/okx1-4.png",
            alt: "신원 인증 시작",
          },
          paragraphs: [
            {
              en: "1. Click the **9 dots** icon in the top left corner.",
              ko: "1. 좌측 상단 **점 9개** 아이콘을 클릭합니다.",
              ar: "1. انقر على أيقونة **النقاط التسعة** في أعلى اليسار.",
              ru: "1. Нажмите на **9 точек** в левом верхнем углу.",
              zh: "1. 点击左上角的**九点**图标。",
              es: "1. Haz clic en el ícono de **9 puntos** en la esquina superior izquierda.",
              id: "1. Klik ikon **9 titik** di pojok kiri atas.",
              th: "1. คลิกไอคอน **9 จุด** ที่มุมซ้ายบน",
              vi: "1. Nhấp vào biểu tượng **9 chấm** ở góc trên bên trái.",
              tr: "1. Sol üst köşedeki **9 nokta** simgesine tıklayın.",
            },
            {
              en: "2. You will see **Identity verification** marked as Unverified. Click on it.",
              ko: "2. **Identity verification**이 Unverified라고 나와있을 텐데, 클릭해줍니다.",
              ar: "2. سترى **Identity verification** غير موثق. انقر عليه.",
              ru: "2. Вы увидите **Identity verification** как Unverified. Нажмите на него.",
              zh: "2. 您会看到**Identity verification**显示为Unverified，点击它。",
              es: "2. Verás **Identity verification** como No verificado. Haz clic en él.",
              id: "2. Anda akan melihat **Identity verification** ditandai sebagai Unverified. Klik untuk masuk.",
              th: "2. คุณจะเห็น **Identity verification** ที่ระบุว่า Unverified คลิกที่มัน",
              vi: "2. Bạn sẽ thấy **Identity verification** được đánh dấu là Unverified. Nhấp vào đó.",
              tr: "2. **Identity verification** seçeneğini Unverified olarak göreceksiniz. Üzerine tıklayın.",
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            en: "Capture ID",
            ko: "신분증 촬영",
            ar: "التقاط صورة الهوية",
            ru: "Сфотографировать документ",
            zh: "拍摄证件照",
            es: "Capturar identificación",
            id: "Ambil Foto ID",
            th: "ถ่ายภาพบัตรประจำตัว",
            vi: "Chụp Giấy Tờ Tùy Thân",
            tr: "Kimlik Fotoğrafı Çek",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/server_pic/okx1-5.png",
            alt: "신분증 촬영",
          },
          paragraphs: [
            {
              en: "1. Select one of the **3 types** of identification.",
              ko: "1. **3개 종류**의 신분증 중에서 1가지를 선택합니다.",
              ar: "1. اختر أحد **الأنواع الثلاثة** للهوية.",
              ru: "1. Выберите один из **3 типов** документов.",
              zh: "1. 从**3种**证件中选择一种。",
              es: "1. Selecciona uno de los **3 tipos** de identificación.",
              id: "1. Pilih salah satu dari **3 jenis** identifikasi.",
              th: "1. เลือกหนึ่งใน **3 ประเภท** ของบัตรประจำตัว",
              vi: "1. Chọn một trong **3 loại** giấy tờ tùy thân.",
              tr: "1. **3 tür** kimlik belgesinden birini seçin.",
            },
            {
              en: "2. After checking the policy agreement, click **Next** and **capture your ID**.",
              ko: "2. 정책에 동의 체크를 한 이후에, **Next**를 누르고 **신분증을 촬영**해 줍니다.",
              ar: "2. بعد المو��فقة على السياسة، انقر **Next** ثم **التقط صورة هويتك**.",
              ru: "2. После согласия с политикой нажмите **Next** и **сфотографируйте документ**.",
              zh: "2. 同意政策后，点击**Next**并**拍摄证件照**。",
              es: "2. Tras aceptar la política, haz clic en **Next** y **captura tu identificación**.",
              id: "2. Setelah menyetujui kebijakan, klik **Next** dan **ambil foto ID** Anda.",
              th: "2. หลังจากเห็นด้วยกับนโยบาย คลิก **Next** และ **ถ่ายภาพบัตรประจำตัว** ของคุณ",
              vi: "2. Sau khi đồng ý với chính sách, nhấp **Next** và **chụp ảnh giấy tờ tùy thân**.",
              tr: "2. Politika sözleşmesini onayladıktan sonra **Next**'e tıklayın ve **kimliğinizi çekin**.",
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            en: "Enter Identity Details",
            ko: "신원 정보 입력",
            ar: "إدخال بيانات الهوية",
            ru: "Ввод личных данных",
            zh: "输入身份信息",
            es: "Ingresar datos de identidad",
            id: "Masukkan Detail Identitas",
            th: "ป้อนรายละเอียดตัวตน",
            vi: "Nhập Chi Tiết Danh Tính",
            tr: "Kimlik Bilgilerini Girin",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/okx_step1.png",
            alt: "신원 정보 입력",
          },
          paragraphs: [
            {
              en: "1. Following the image above, enter your name in both **Korean & English**, then click **Next**.",
              ko: "1. 위 사진을 따라 **한글&영문** 이름을 모두 입력한 다음, **Next**를 클릭해줍니다.",
              ar: "1. كما في الصورة، أدخل اسمك **بالكورية والإنجليزية**، ثم انقر **Next**.",
              ru: "1. Как на изображении, введите имя на **корейском и английском**, затем нажмите **Next**.",
              zh: "1. 如图所示，输入**韩文和英文**姓名，然后点击**Next**。",
              es: "1. Como en la imagen, ingresa tu nombre en **coreano e inglés**, luego haz clic en **Next**.",
              id: "1. Ikuti gambar di atas, masukkan nama Anda dalam **bahasa lokal & Inggris**, lalu klik **Next**.",
              th: "1. ตามภาพด้านบน ป้อนชื่อของคุณทั้ง **ภาษาไทยและอังกฤษ** จากนั้นคลิก **Next**",
              vi: "1. Theo hình ảnh trên, nhập tên của bạn bằng **tiếng địa phương và tiếng Anh**, sau đó nhấp **Next**.",
              tr: "1. Yukarıdaki resmi takip ederek, adınızı hem **yerel dil hem de İngilizce** olarak girin, ardından **Next**'e tıklayın.",
            },
            {
              en: "2. After entering your **residential address**, click **Submit**.",
              ko: "2. 이후 자신의 **거주 주소**를 입력해준 이후, **Submit**을 클릭해줍니다.",
              ar: "2. بعد إدخال **عنوان إقامتك**، انقر **Submit**.",
              ru: "2. После ввода **адреса проживания** нажмите **Submit**.",
              zh: "2. 输入**居住地址**后，点击**Submit**。",
              es: "2. Después de ingresar tu **dirección**, haz clic en **Submit**.",
              id: "2. Setelah memasukkan **alamat tempat tinggal** Anda, klik **Submit**.",
              th: "2. หลังจากป้อน **ที่อยู่ที่พักอาศัย** ของคุณ คลิก **Submit**",
              vi: "2. Sau khi nhập **địa chỉ cư trú** của bạn, nhấp **Submit**.",
              tr: "2. **İkamet adresinizi** girdikten sonra **Submit**'e tıklayın.",
            },
          ],
          layout: "fullTop",
        },
      ],
    },
    3: {
      title: {
        en: "Buylow AI - API Key Integration",
        ko: "Buylow AI - API 키 연동",
        ar: "Buylow AI - ربط مفتاح API",
        ru: "Buylow AI - Интеграция API-ключа",
        zh: "Buylow AI - API密钥绑定",
        es: "Buylow AI - Integración de clave API",
        id: "Buylow AI - Integrasi Kunci API",
        th: "Buylow AI - การเชื่อมต่อคีย์ API",
        vi: "Buylow AI - Tích Hợp Khóa API",
        tr: "Buylow AI - API Anahtarı Entegrasyonu",
      },
      sections: [
        {
          heading: {
            en: "Start Creating API Key",
            ko: "API 키 생성 시작",
            ar: "بدء إنشاء مفتاح API",
            ru: "Начать создание API-ключа",
            zh: "开始创建API密钥",
            es: "Comenzar a crear clave API",
            id: "Mulai Buat Kunci API",
            th: "เริ่มสร้างคีย์ API",
            vi: "Bắt Đầu Tạo Khóa API",
            tr: "API Anahtarı Oluşturmaya Başla",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/server_pic/okx2-1.png",
            alt: "Start Creating API Key",
          },
          paragraphs: [
            {
              en: '1. On the OKX home screen, tap the <span class="warn-red">9 dots icon</span> in the top-left.\n\n2. Scroll all the way down and enter the <span class="warn-red">API</span> menu.',
              ko: '1.\tOKX 홈 화면에서 좌측 상단 <span class="warn-red">점 9개 아이콘</span>을 클릭합니다.\n\n2. 이후 가장 아래까지 스크롤 내려서 <span class="warn-red">API</span> 메뉴에 들어갑니다.',
              ar: '1. من شاشة OKX الرئيسية، انقر على <span class="warn-red">أيقونة النقاط التسعة</span> في أعلى اليسار.\n\n2. مرر للأسفل وادخل قائمة <span class="warn-red">API</span>.',
              ru: '1. На главном экране OKX нажмите <span class="warn-red">9 точек</span> в левом верхнем углу.\n\n2. Прокрутите вниз и войдите в меню <span class="warn-red">API</span>.',
              zh: '1. 在OKX主页，点击左上角的<span class="warn-red">九点图标</span>。\n\n2. 向下滚动，进入<span class="warn-red">API</span>菜单。',
              es: '1. En la pantalla de OKX, toca el <span class="warn-red">ícono de 9 puntos</span> arriba a la izquierda.\n\n2. Desplázate hacia abajo y entra al menú <span class="warn-red">API</span>.',
              id: '1. Di layar utama OKX, ketuk <span class="warn-red">ikon 9 titik</span> di kiri atas.\n\n2. Gulir ke bawah dan masuk ke menu <span class="warn-red">API</span>.',
              th: '1. ที่หน้าจอหลักของ OKX แตะ <span class="warn-red">ไอคอน 9 จุด</span> ที่มุมซ้ายบน\n\n2. เลื่อนลงและเข้าสู่เมนู <span class="warn-red">API</span>',
              vi: '1. Trên màn hình chính OKX, nhấn vào <span class="warn-red">biểu tượng 9 chấm</span> ở góc trên bên trái.\n\n2. Cuộn xuống và vào menu <span class="warn-red">API</span>.',
              tr: '1. OKX ana ekranında, sol üstteki <span class="warn-red">9 nokta simgesine</span> dokunun.\n\n2. Aşağı kaydırın ve <span class="warn-red">API</span> menüsüne girin.',
            },
          ],
          layout: "fullTop",
        },

        {
          heading: {
            en: "Create API Key [1]",
            ko: "API 키 생성 [1]",
            ar: "إنشاء مفتاح API [1]",
            ru: "Создание API-ключа [1]",
            zh: "创建API密钥 [1]",
            es: "Crear clave API [1]",
            id: "Buat Kunci API [1]",
            th: "สร้างคีย์ API [1]",
            vi: "Tạo Khóa API [1]",
            tr: "API Anahtarı Oluştur [1]",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/okx_buylow2-1.png",
            alt: "Create API Key [1]",
          },
          paragraphs: [
            {
              en: '1. Tap <span class="warn-red">Create API key</span>.\n\n2. In <span class="warn-red">API name</span>, enter any name you can easily recognize.\n   Then scroll down.',
              ko: '1.\t<span class="warn-red">Create API key</span>를 클릭합니다.\n\n2. <span class="warn-red">API name</span>에 자신이 알아보기 편하도록 원하는 이름으로 지은 다음,\n   하단으로 스크롤 내립니다.',
              ar: '1. انقر <span class="warn-red">Create API key</span>.\n\n2. في <span class="warn-red">API name</span>، أدخل اسماً يسهل تذكره.\n   ثم مرر للأسفل.',
              ru: '1. Нажмите <span class="warn-red">Create API key</span>.\n\n2. В <span class="warn-red">API name</span> введите любое понятное вам имя.\n   Затем прокрутите вниз.',
              zh: '1. 点击 <span class="warn-red">Create API key</span>。\n\n2. 在 <span class="warn-red">API name</span> 中输入便于识别的名称。\n   然后向下滚动。',
              es: '1. Toca <span class="warn-red">Create API key</span>.\n\n2. En <span class="warn-red">API name</span>, ingresa un nombre fácil de recordar.\n   Luego desplázate hacia abajo.',
              id: '1. Ketuk <span class="warn-red">Create API key</span>.\n\n2. Di <span class="warn-red">API name</span>, masukkan nama yang mudah Anda kenali.\n   Lalu gulir ke bawah.',
              th: '1. แตะ <span class="warn-red">Create API key</span>\n\n2. ใน <span class="warn-red">API name</span> ป้อนชื่อที่คุณจำได้ง่าย\n   จากนั้นเลื่อนลง',
              vi: '1. Nhấn <span class="warn-red">Create API key</span>.\n\n2. Trong <span class="warn-red">API name</span>, nhập tên bạn dễ nhận ra.\n   Sau đó cuộn xuống.',
              tr: '1. <span class="warn-red">Create API key</span>\'e dokunun.\n\n2. <span class="warn-red">API name</span> bölümüne kolayca tanıyabileceğiniz bir ad girin.\n   Ardından aşağı kaydırın.',
            },
          ],
          layout: "fullTop",
        },

        {
          heading: {
            en: "Create API Key [2]",
            ko: "API 키 생성 [2]",
            ar: "إنشاء مفتاح API [2]",
            ru: "Создание API-ключа [2]",
            zh: "创建API密钥 [2]",
            es: "Crear clave API [2]",
            id: "Buat Kunci API [2]",
            th: "สร้างคีย์ API [2]",
            vi: "Tạo Khóa API [2]",
            tr: "API Anahtarı Oluştur [2]",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/server_pic/okx2-3.png",
            alt: "Create API Key [2]",
          },
          paragraphs: [
            {
              en:
                '1. Under <span class="warn-red">Permissions</span>, check <span class="warn-red">Read</span> and <span class="warn-red">Trade</span>.\n\n' +
                '2. In <span class="warn-red">Passphrase</span>, set a <span class="warn-red">password</span> that meets the conditions shown below.\n' +
                '⦿ Important: <span class="warn-red">Passphrase (password)</span> must be entered when integrating Buylow AI,\n  so be sure to note it down.\n\n' +
                '3. After saving your <span class="warn-red">Passphrase</span>, tap <span class="warn-red">Submit all</span>.\n\n' +
                '4. When <span class="warn-red">passkey verification</span> appears, tap <span class="warn-red">Verify now</span> to verify.',
              ko:
                '1. <span class="warn-red">Permissions</span>에서 <span class="warn-red">Read</span> 와 <span class="warn-red">Trade</span>를 체크한 다음,\n\n' +
                '2. <span class="warn-red">Passphrase</span>에 하단 조건에 맞춰서 <span class="warn-red">비밀번호</span>를 설정해줍니다.\n' +
                '⦿ 중요 : <span class="warn-red">Passphrase(비밀번호)</span>는 Buylow AI 연동 시 반드시 입력해야하기 때문에\n  반드시 메모해주세요.\n\n' +
                '3. <span class="warn-red">Passphrase</span> 메모까지 완료했다면,\n   하단에 <span class="warn-red">Submit all</span>을 클릭해줍니다.\n\n' +
                '4. 그럼 <span class="warn-red">passkey 인증</span>이 뜰텐데,\n   <span class="warn-red">Verify now</span>를 클릭하여 인증해줍니다.',
              ar:
                '1. ضمن <span class="warn-red">Permissions</span>، حدد <span class="warn-red">Read</span> و <span class="warn-red">Trade</span>.\n\n' +
                '2. في <span class="warn-red">Passphrase</span>، عيّن <span class="warn-red">كلمة مرور</span> تستوفي الشروط أدناه.\n' +
                '⦿ مهم: <span class="warn-red">Passphrase</span> مطلوب عند ربط Buylow AI.\n  احفظه جيداً.\n\n' +
                '3. بعد حفظ <span class="warn-red">Passphrase</span>، انقر <span class="warn-red">Submit all</span>.\n\n' +
                '4. عند ظهور <span class="warn-red">passkey verification</span>، انقر <span class="warn-red">Verify now</span>.',
              ru:
                '1. В <span class="warn-red">Permissions</span> отметьте <span class="warn-red">Read</span> и <span class="warn-red">Trade</span>.\n\n' +
                '2. В <span class="warn-red">Passphrase</span> задайте <span class="warn-red">пароль</span> по условиям ниже.\n' +
                '⦿ Важно: <span class="warn-red">Passphrase</span> понадобится при интеграции Buylow AI.\n  Обязательно запишите его.\n\n' +
                '3. После сохранения <span class="warn-red">Passphrase</span> нажмите <span class="warn-red">Submit all</span>.\n\n' +
                '4. При появлении <span class="warn-red">passkey verification</span> нажмите <span class="warn-red">Verify now</span>.',
              zh:
                '1. 在 <span class="warn-red">Permissions</span> 下，勾选 <span class="warn-red">Read</span> 和 <span class="warn-red">Trade</span>。\n\n' +
                '2. 在 <span class="warn-red">Passphrase</span> 中设置符合条件的<span class="warn-red">密码</span>。\n' +
                '⦿ 重要：<span class="warn-red">Passphrase</span> 在绑定 Buylow AI 时必须输入，\n  请务必记录。\n\n' +
                '3. 保存 <span class="warn-red">Passphrase</span> 后，点击 <span class="warn-red">Submit all</span>。\n\n' +
                '4. 出现 <span class="warn-red">passkey verification</span> 时，点击 <span class="warn-red">Verify now</span>。',
              es:
                '1. En <span class="warn-red">Permissions</span>, marca <span class="warn-red">Read</span> y <span class="warn-red">Trade</span>.\n\n' +
                '2. En <span class="warn-red">Passphrase</span>, establece una <span class="warn-red">contraseña</span> según las condiciones.\n' +
                '⦿ Importante: <span class="warn-red">Passphrase</span> es necesario al integrar Buylow AI.\n  Anótalo bien.\n\n' +
                '3. Tras guardar tu <span class="warn-red">Passphrase</span>, toca <span class="warn-red">Submit all</span>.\n\n' +
                '4. Cuando aparezca <span class="warn-red">passkey verification</span>, toca <span class="warn-red">Verify now</span>.',
              id:
                '1. Di bagian <span class="warn-red">Permissions</span>, centang <span class="warn-red">Read</span> dan <span class="warn-red">Trade</span>.\n\n' +
                '2. Di <span class="warn-red">Passphrase</span>, atur <span class="warn-red">kata sandi</span> yang memenuhi syarat di bawah.\n' +
                '⦿ Penting: <span class="warn-red">Passphrase (kata sandi)</span> harus dimasukkan saat mengintegrasikan Buylow AI,\n  pastikan untuk mencatatnya.\n\n' +
                '3. Setelah menyimpan <span class="warn-red">Passphrase</span>, ketuk <span class="warn-red">Submit all</span>.\n\n' +
                '4. Saat <span class="warn-red">passkey verification</span> muncul, ketuk <span class="warn-red">Verify now</span> untuk verifikasi.',
              th:
                '1. ภายใต้ <span class="warn-red">Permissions</span> เลือก <span class="warn-red">Read</span> และ <span class="warn-red">Trade</span>\n\n' +
                '2. ใน <span class="warn-red">Passphrase</span> ตั้ง<span class="warn-red">รหัสผ่าน</span>ที่ตรงตามเงื่อนไขด้านล่าง\n' +
                '⦿ สำคัญ: <span class="warn-red">Passphrase (รหัสผ่าน)</span> ต้องป้อนเมื่อเชื่อมต่อ Buylow AI\n  อย่าลืมจดไว้\n\n' +
                '3. หลังจากบันทึก <span class="warn-red">Passphrase</span> แตะ <span class="warn-red">Submit all</span>\n\n' +
                '4. เมื่อ <span class="warn-red">passkey verification</span> ปรากฏ แตะ <span class="warn-red">Verify now</span> เพื่อยืนยัน',
              vi:
                '1. Trong phần <span class="warn-red">Permissions</span>, chọn <span class="warn-red">Read</span> và <span class="warn-red">Trade</span>.\n\n' +
                '2. Trong <span class="warn-red">Passphrase</span>, đặt <span class="warn-red">mật khẩu</span> đáp ứng các điều kiện bên dưới.\n' +
                '⦿ Quan trọng: <span class="warn-red">Passphrase (mật khẩu)</span> phải được nhập khi tích hợp Buylow AI,\n  hãy chắc chắn ghi chú lại.\n\n' +
                '3. Sau khi lưu <span class="warn-red">Passphrase</span>, nhấn <span class="warn-red">Submit all</span>.\n\n' +
                '4. Khi <span class="warn-red">passkey verification</span> xuất hiện, nhấn <span class="warn-red">Verify now</span> để xác minh.',
              tr:
                '1. <span class="warn-red">Permissions</span> altında, <span class="warn-red">Read</span> ve <span class="warn-red">Trade</span> seçeneklerini işaretleyin.\n\n' +
                '2. <span class="warn-red">Passphrase</span> bölümünde, aşağıdaki koşulları karşılayan bir <span class="warn-red">şifre</span> belirleyin.\n' +
                '⦿ Önemli: <span class="warn-red">Passphrase (şifre)</span> Buylow AI entegrasyonunda girilmesi gerekir,\n  mutlaka not edin.\n\n' +
                '3. <span class="warn-red">Passphrase</span> kaydettikten sonra, <span class="warn-red">Submit all</span>\'a dokunun.\n\n' +
                '4. <span class="warn-red">passkey verification</span> göründüğünde, doğrulamak için <span class="warn-red">Verify now</span>\'a dokunun.',
            },
          ],
          layout: "fullTop",
        },

        {
          heading: {
            en: "Create API Key [3]",
            ko: "API 키 생성 [3]",
            ar: "إنشاء مفتاح API [3]",
            ru: "Создание API-ключа [3]",
            zh: "创建API密钥 [3]",
            es: "Crear clave API [3]",
            id: "Buat Kunci API [3]",
            th: "สร้างคีย์ API [3]",
            vi: "Tạo Khóa API [3]",
            tr: "API Anahtarı Oluştur [3]",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/okx_buylow2-2.png",
            alt: "Create API Key [3]",
          },
          paragraphs: [
            {
              en:
                '1. Enter the <span class="warn-red">verification code</span> sent to your phone, then tap <span class="warn-red">Confirm</span>.\n\n' +
                '2. Enter the <span class="warn-red">verification code</span> sent to your email, then tap <span class="warn-red">Confirm</span>.',
              ko:
                '1. 휴대폰으로 온 <span class="warn-red">인증 번호</span>를 입력한 다음\n   <span class="warn-red">Confirm</span>을 클릭해줍니다.\n\n' +
                '2. 계정 이메일로 온 <span class="warn-red">인증 번호</span>를 입력한 다음\n   <span class="warn-red">Confirm</span>을 클릭해줍니다.',
              ar:
                '1. أدخل <span class="warn-red">رمز التحقق</span> المرسل لهاتفك، ثم انقر <span class="warn-red">Confirm</span>.\n\n' +
                '2. أدخل <span class="warn-red">رمز التحقق</span> المرسل لبريدك، ثم انقر <span class="warn-red">Confirm</span>.',
              ru:
                '1. Введите <span class="warn-red">код подтверждения</span> из SMS и нажмите <span class="warn-red">Confirm</span>.\n\n' +
                '2. Введите <span class="warn-red">код подтверждения</span> из email и нажмите <span class="warn-red">Confirm</span>.',
              zh:
                '1. 输入手机收到的<span class="warn-red">验证码</span>，点击 <span class="warn-red">Confirm</span>。\n\n' +
                '2. 输入邮箱收到的<span class="warn-red">验证码</span>，点击 <span class="warn-red">Confirm</span>。',
              es:
                '1. Ingresa el <span class="warn-red">código de verificación</span> enviado a tu teléfono, luego toca <span class="warn-red">Confirm</span>.\n\n' +
                '2. Ingresa el <span class="warn-red">código de verificación</span> enviado a tu email, luego toca <span class="warn-red">Confirm</span>.',
              id:
                '1. Masukkan <span class="warn-red">kode verifikasi</span> yang dikirim ke telepon Anda, lalu ketuk <span class="warn-red">Confirm</span>.\n\n' +
                '2. Masukkan <span class="warn-red">kode verifikasi</span> yang dikirim ke email Anda, lalu ketuk <span class="warn-red">Confirm</span>.',
              th:
                '1. ป้อน<span class="warn-red">รหัสยืนยัน</span>ที่ส่งไปยังโทรศัพท์ของคุณ จากนั้นแตะ <span class="warn-red">Confirm</span>\n\n' +
                '2. ป้อน<span class="warn-red">รหัสยืนยัน</span>ที่ส่งไปยังอีเมลของคุณ จากนั้นแตะ <span class="warn-red">Confirm</span>',
              vi:
                '1. Nhập <span class="warn-red">mã xác minh</span> được gửi đến điện thoại của bạn, sau đó nhấn <span class="warn-red">Confirm</span>.\n\n' +
                '2. Nhập <span class="warn-red">mã xác minh</span> được gửi đến email của bạn, sau đó nhấn <span class="warn-red">Confirm</span>.',
              tr:
                '1. Telefonunuza gönderilen <span class="warn-red">doğrulama kodunu</span> girin, ardından <span class="warn-red">Confirm</span>\'e dokunun.\n\n' +
                '2. E-postanıza gönderilen <span class="warn-red">doğrulama kodunu</span> girin, ardından <span class="warn-red">Confirm</span>\'e dokunun.',
            },
          ],
          layout: "fullTop",
        },

        {
          heading: {
            en: "API Key Creation Complete",
            ko: "API 키 생성 완료",
            ar: "اكتمل إنشاء مفتاح API",
            ru: "Создание API-ключа завершено",
            zh: "API密钥创建完成",
            es: "Creación de clave API completada",
            id: "Pembuatan Kunci API Selesai",
            th: "การสร้างคีย์ API เสร็จสมบูรณ์",
            vi: "Hoàn Tất Tạo Khóa API",
            tr: "API Anahtarı Oluşturma Tamamlandı",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/okx_buylow2-3.png",
            alt: "API Key Creation Complete",
          },
          paragraphs: [
            {
              en:
                'Now your <span class="warn-red">API key creation is complete</span>.\n\n' +
                'Click <span class="warn-red">Show info</span> as shown above,\nthen copy and save <span class="warn-red">API key</span> and <span class="warn-red">Secret key</span> into the same notepad where you saved your <span class="warn-red">Passphrase</span>.\n\n' +
                '⦿ Important: <span class="warn-red">API key</span>, <span class="warn-red">Secret key</span>, and <span class="warn-red">Passphrase (password)</span>\n  must be entered when integrating Buylow AI, so be sure to note them down.',
              ko:
                '자, 이제 <span class="warn-red">API 키 생성이 완료</span> 되었습니다.\n\n' +
                '그럼 위 사진처럼 <span class="warn-red">Show info</span>를 클릭한 다음,\n이전에 <span class="warn-red">Passphrase</span>를 복사해놓았던 메모장에 <span class="warn-red">API key</span>와 <span class="warn-red">Secret key</span>를 복사해서 메모해둡니다.\n\n' +
                '⦿ 중요 : <span class="warn-red">API key</span>와 <span class="warn-red">Secret key</span>, <span class="warn-red">Passphrase(비밀번호)</span>는\n  Buylow AI 연동 시 반드시 입력해야하기 때문에\n  반드시 메모해주세요.',
              ar:
                'اكتمل الآن <span class="warn-red">إنشاء مفتاح API</span>.\n\n' +
                'انقر <span class="warn-red">Show info</span> كما في الصورة،\nثم انسخ <span class="warn-red">API key</span> و <span class="warn-red">Secret key</span> واحفظهما مع <span class="warn-red">Passphrase</span>.\n\n' +
                '⦿ مهم: <span class="warn-red">API key</span> و <span class="warn-red">Secret key</span> و <span class="warn-red">Passphrase</span>\n  مطلوبة عند ربط Buylow AI. احفظها جيداً.',
              ru:
                'Теперь <span class="warn-red">создание API-ключа завершено</span>.\n\n' +
                'Нажмите <span class="warn-red">Show info</span> как показано выше,\nзатем скопируйте <span class="warn-red">API key</span> и <span class="warn-red">Secret key</span> туда же, где сохранили <span class="warn-red">Passphrase</span>.\n\n' +
                '⦿ Важно: <span class="warn-red">API key</span>, <span class="warn-red">Secret key</span> и <span class="warn-red">Passphrase</span>\n  понадобятся при интеграции Buylow AI. Обязательно сохраните их.',
              zh:
                '现在 <span class="warn-red">API密钥创建完成</span>。\n\n' +
                '如图所示点击 <span class="warn-red">Show info</span>，\n然后将 <span class="warn-red">API key</span> 和 <span class="warn-red">Secret key</span> 复制保存到记录 <span class="warn-red">Passphrase</span> 的地方。\n\n' +
                '⦿ 重要：<span class="warn-red">API key</span>、<span class="warn-red">Secret key</span> 和 <span class="warn-red">Passphrase</span>\n  在绑定 Buylow AI 时必须输入，请务必记录。',
              es:
                'Ahora <span class="warn-red">la creación de la clave API está completa</span>.\n\n' +
                'Haz clic en <span class="warn-red">Show info</span> como se muestra,\nluego copia <span class="warn-red">API key</span> y <span class="warn-red">Secret key</span> junto con tu <span class="warn-red">Passphrase</span>.\n\n' +
                '⦿ Importante: <span class="warn-red">API key</span>, <span class="warn-red">Secret key</span> y <span class="warn-red">Passphrase</span>\n  son necesarios al integrar Buylow AI. Anótalos bien.',
              id:
                'Sekarang <span class="warn-red">pembuatan kunci API selesai</span>.\n\n' +
                'Klik <span class="warn-red">Show info</span> seperti yang ditunjukkan di atas,\nlalu salin dan simpan <span class="warn-red">API key</span> dan <span class="warn-red">Secret key</span> ke notepad yang sama tempat Anda menyimpan <span class="warn-red">Passphrase</span>.\n\n' +
                '⦿ Penting: <span class="warn-red">API key</span>, <span class="warn-red">Secret key</span>, dan <span class="warn-red">Passphrase (kata sandi)</span>\n  harus dimasukkan saat mengintegrasikan Buylow AI, pastikan untuk mencatatnya.',
              th:
                'ตอนนี้ <span class="warn-red">การสร้างคีย์ API เสร็จสมบูรณ์</span>แล้ว\n\n' +
                'คลิก <span class="warn-red">Show info</span> ตามที่แสดงด้านบน\nจากนั้นคัดลอกและบันทึก <span class="warn-red">API key</span> และ <span class="warn-red">Secret key</span> ลงใน notepad เดียวกับที่คุณบันทึก <span class="warn-red">Passphrase</span>\n\n' +
                '⦿ สำคัญ: <span class="warn-red">API key</span>, <span class="warn-red">Secret key</span> และ <span class="warn-red">Passphrase (รหัสผ่าน)</span>\n  ต้องป้อนเมื่อเชื่อมต่อ Buylow AI อย่าลืมจดไว้',
              vi:
                'Bây giờ <span class="warn-red">việc tạo khóa API đã hoàn tất</span>.\n\n' +
                'Nhấp <span class="warn-red">Show info</span> như hình trên,\nsau đó sao chép và lưu <span class="warn-red">API key</span> và <span class="warn-red">Secret key</span> vào cùng notepad nơi bạn đã lưu <span class="warn-red">Passphrase</span>.\n\n' +
                '⦿ Quan trọng: <span class="warn-red">API key</span>, <span class="warn-red">Secret key</span> và <span class="warn-red">Passphrase (mật khẩu)</span>\n  phải được nhập khi tích hợp Buylow AI, hãy chắc chắn ghi chú lại.',
              tr:
                'Artık <span class="warn-red">API anahtarı oluşturma işlemi tamamlandı</span>.\n\n' +
                'Yukarıda gösterildiği gibi <span class="warn-red">Show info</span>\'ya tıklayın,\nardından <span class="warn-red">API key</span> ve <span class="warn-red">Secret key</span>\'i <span class="warn-red">Passphrase</span>\'i kaydettiğiniz not defterine kopyalayıp kaydedin.\n\n' +
                '⦿ Önemli: <span class="warn-red">API key</span>, <span class="warn-red">Secret key</span> ve <span class="warn-red">Passphrase (şifre)</span>\n  Buylow AI entegrasyonunda girilmesi gerekir, mutlaka not edin.',
            },
          ],
          layout: "fullTop",
        },
      ],
    },
    4: {
      title: {
        ko: "Buylow AI 봇 생성 및 등록",
        en: "Create & Register Buylow AI Bot",
        ar: "إنشاء وتسجيل بوت Buylow AI",
        ru: "Создание и регистрация бота Buylow AI",
        zh: "创建并注册 Buylow AI 机器人",
        es: "Crear y registrar bot de Buylow AI",
        id: "Buat & Daftar Bot Buylow AI",
        th: "สร้างและลงทะเบียนบอท Buylow AI",
        vi: "Tạo & Đăng Ký Bot Buylow AI",
        tr: "Buylow AI Bot Oluştur ve Kaydet",
      },
      sections: [
        {
          heading: {
            ko: "Render.com 검색",
            en: "Search Render.com",
            ar: "البحث عن Render.com",
            ru: "Поиск Render.com",
            zh: "搜索 Render.com",
            es: "Buscar Render.com",
            id: "Cari Render.com",
            th: "ค้นหา Render.com",
            vi: "Tìm Render.com",
            tr: "Render.com Ara",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/okx_step3-1.png",
            alt: "Render.com search",
          },
          paragraphs: [
            {
              ko: '1.\t구글 사이트에서 <span class="warn-red">render.com</span>을 검색합니다.',
              en: '1.\tSearch <span class="warn-red">render.com</span> on Google.',
              ar: '1.\tابحث عن <span class="warn-red">render.com</span> في Google.',
              ru: '1.\tНайдите <span class="warn-red">render.com</span> в Google.',
              zh: '1.\t在Google上搜索 <span class="warn-red">render.com</span>。',
              es: '1.\tBusca <span class="warn-red">render.com</span> en Google.',
              id: '1.\tCari <span class="warn-red">render.com</span> di Google.',
              th: '1.\tค้นหา <span class="warn-red">render.com</span> บน Google',
              vi: '1.\tTìm <span class="warn-red">render.com</span> trên Google.',
              tr: '1.\tGoogle\'da <span class="warn-red">render.com</span> arayın.',
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            ko: "Render.com 접속",
            en: "Access Render.com",
            ar: "الدخول إلى Render.com",
            ru: "Доступ к Render.com",
            zh: "访问 Render.com",
            es: "Acceder a Render.com",
            id: "Akses Render.com",
            th: "เข้าถึง Render.com",
            vi: "Truy Cập Render.com",
            tr: "Render.com Erişimi",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/okx_step3-2.png",
            alt: "Access Render.com",
          },
          paragraphs: [
            {
              ko: '1.\t상단에 <span class="warn-red">render.com</span>에 접속합니다.\n\n2. 우측 상단에 <span class="warn-red">DashBoard</span> 버튼을 클릭합니다.',
              en: '1.\tOpen <span class="warn-red">render.com</span>.\n\n2. Click the <span class="warn-red">DashBoard</span> button on the top right.',
              ar: '1.\tافتح <span class="warn-red">render.com</span>.\n\n2. انقر زر <span class="warn-red">DashBoard</span> في أعلى اليمين.',
              ru: '1.\tОткройте <span class="warn-red">render.com</span>.\n\n2. Нажмите <span class="warn-red">DashBoard</span> в правом верхнем углу.',
              zh: '1.\t打开 <span class="warn-red">render.com</span>。\n\n2. 点击右上角的 <span class="warn-red">DashBoard</span> 按钮。',
              es: '1.\tAbre <span class="warn-red">render.com</span>.\n\n2. Haz clic en <span class="warn-red">DashBoard</span> arriba a la derecha.',
              id: '1.\tBuka <span class="warn-red">render.com</span>.\n\n2. Klik tombol <span class="warn-red">DashBoard</span> di kanan atas.',
              th: '1.\tเปิด <span class="warn-red">render.com</span>\n\n2. คลิกปุ่ม <span class="warn-red">DashBoard</span> ที่มุมขวาบน',
              vi: '1.\tMở <span class="warn-red">render.com</span>.\n\n2. Nhấp nút <span class="warn-red">DashBoard</span> ở góc trên bên phải.',
              tr: '1.\t<span class="warn-red">render.com</span> açın.\n\n2. Sağ üstteki <span class="warn-red">DashBoard</span> düğmesine tıklayın.',
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            ko: "Render.com 로그인",
            en: "Log in to Render.com",
            ar: "تسجيل الدخول إلى Render.com",
            ru: "Вход в Render.com",
            zh: "登录 Render.com",
            es: "Iniciar sesión en Render.com",
            id: "Masuk ke Render.com",
            th: "เข้าสู่ระบบ Render.com",
            vi: "Đăng Nhập Render.com",
            tr: "Render.com Girişi",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/server_pic/render3.png",
            alt: "Render.com login",
          },
          paragraphs: [
            {
              ko: '1. <span class="warn-red">(추천) 구글 아이디</span>로 로그인 합니다.\n(아무 이메일로 계정 생성해도 상관 없음.)\n\n2.  좌측 상단 <span class="warn-red">줄 5개</span> 메뉴 아이콘을 클릭합니다.',
              en: '1. Log in with <span class="warn-red">(Recommended) Google account</span>.\n(Any email account is also fine.)\n\n2. Tap the <span class="warn-red">5-lines</span> menu icon on the top left.',
              ar: '1. سجل الدخول بـ <span class="warn-red">(موصى به) حساب Google</span>.\n(أي بريد إلكتروني مقبول.)\n\n2. انقر أيقونة <span class="warn-red">الخطوط الخ��سة</span> في أعلى اليسار.',
              ru: '1. Войдите через <span class="warn-red">(рекомендуется) аккаунт Google</span>.\n(Можно использовать любой email.)\n\n2. Нажмите <span class="warn-red">5 линий</span> в левом верхнем углу.',
              zh: '1. 使用 <span class="warn-red">(推荐) Google账户</span> 登录。\n(也可以用任何邮箱注册。)\n\n2. 点击左上角的 <span class="warn-red">五条线</span> 菜单图标。',
              es: '1. Inicia sesión con <span class="warn-red">(Recomendado) cuenta de Google</span>.\n(Cualquier email también sirve.)\n\n2. Toca el ícono de <span class="warn-red">5 líneas</span> arriba a la izquierda.',
              id: '1. Masuk dengan <span class="warn-red">(Disarankan) akun Google</span>.\n(Email apa pun juga boleh.)\n\n2. Ketuk ikon menu <span class="warn-red">5 garis</span> di kiri atas.',
              th: '1. เข้าสู่ระบบด้วย <span class="warn-red">(แนะนำ) บัญชี Google</span>\n(อีเมลใดก็ได้)\n\n2. แตะไอคอนเมนู <span class="warn-red">5 เส้น</span> ที่มุมซ้ายบน',
              vi: '1. Đăng nhập với <span class="warn-red">(Khuyến nghị) tài khoản Google</span>.\n(Email nào cũng được.)\n\n2. Nhấn vào biểu tượng menu <span class="warn-red">5 dòng</span> ở góc trên bên trái.',
              tr: '1. <span class="warn-red">(Önerilen) Google hesabı</span> ile giriş yapın.\n(Herhangi bir e-posta hesabı da olur.)\n\n2. Sol üstteki <span class="warn-red">5 çizgi</span> menü simgesine dokunun.',
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            ko: "결제 수단 등록 (1)",
            en: "Add Payment Method (1)",
            ar: "إضافة طريقة الدفع (1)",
            ru: "Добавление способа оплаты (1)",
            zh: "添加支付方式 (1)",
            es: "Agregar método de pago (1)",
            id: "Tambah Metode Pembayaran (1)",
            th: "เพิ่มวิธีการชำระเงิน (1)",
            vi: "Thêm Phương Thức Thanh Toán (1)",
            tr: "Ödeme Yöntemi Ekle (1)",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/server_pic/render4.png",
            alt: "Add payment method 1",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/server_pic/render4.png",
            alt: "Add payment method 1",
          },
          paragraphs: [
            {
              ko: '1. 하단에 <span class="warn-red">Billing</span> 칸을 클릭합니다.\n\n2. 하단에 <span class="warn-red">+ Add Card</span> 버튼을 클릭합니다.',
              en: '1. Tap <span class="warn-red">Billing</span> at the bottom.\n\n2. Tap <span class="warn-red">+ Add Card</span>.',
              ar: '1. انقر <span class="warn-red">Billing</span> في الأسفل.\n\n2. انقر <span class="warn-red">+ Add Card</span>.',
              ru: '1. Нажмите <span class="warn-red">Billing</span> внизу.\n\n2. Нажмите <span class="warn-red">+ Add Card</span>.',
              zh: '1. 点击底部的 <span class="warn-red">Billing</span>。\n\n2. 点击 <span class="warn-red">+ Add Card</span>。',
              es: '1. Toca <span class="warn-red">Billing</span> en la parte inferior.\n\n2. Toca <span class="warn-red">+ Add Card</span>.',
              id: '1. Ketuk <span class="warn-red">Billing</span> di bagian bawah.\n\n2. Ketuk <span class="warn-red">+ Add Card</span>.',
              th: '1. แตะ <span class="warn-red">Billing</span> ที่ด้านล่าง\n\n2. แตะ <span class="warn-red">+ Add Card</span>',
              vi: '1. Nhấn <span class="warn-red">Billing</span> ở phía dưới.\n\n2. Nhấn <span class="warn-red">+ Add Card</span>.',
              tr: '1. Alt kısımda <span class="warn-red">Billing</span>\'e dokunun.\n\n2. <span class="warn-red">+ Add Card</span>\'a dokunun.',
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            ko: "결제 수단 등록 (2)",
            en: "Add Payment Method (2)",
            ar: "إضافة طريقة الدفع (2)",
            ru: "Добавление способа оплаты (2)",
            zh: "添加支付方式 (2)",
            es: "Agregar método de pago (2)",
            id: "Tambah Metode Pembayaran (2)",
            th: "เพิ่มวิธีการชำระเงิน (2)",
            vi: "Thêm Phương Thức Thanh Toán (2)",
            tr: "Ödeme Yöntemi Ekle (2)",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/okx_step3-5.png",
            alt: "Add payment method 2",
          },
          paragraphs: [
            {
              ko: '1. 필요 정보를 알맞게 입력합니다.\n\n2. 정보를 모두 입력했다면, <span class="warn-red">Add Card</span>를 클릭합니다.\n\n3. 결제 수단 등록이 완료되었다면,\n\n다시  좌측 상단 <span class="warn-red">줄 5개</span> 메뉴 아이콘을 클릭한 다음,\n우측 상단 <span class="warn-red">[+]</span> 버튼을 클릭해줍니다.',
              en: '1. Enter the required payment information.\n\n2. Click <span class="warn-red">Add Card</span>.\n\n3. After the payment method is added,\n\nTap the <span class="warn-red">5-lines</span> menu icon again,\nthen tap the <span class="warn-red">[+]</span> button on the top right.',
              ar: '1. أدخل معلومات الدفع المطلوبة.\n\n2. انقر <span class="warn-red">Add Card</span>.\n\n3. بعد إضافة طريقة الدفع،\n\nانقر أيقونة <span class="warn-red">الخطوط الخمسة</span> مجدداً،\nثم انقر زر <span class="warn-red">[+]</span> في أعلى اليمين.',
              ru: '1. Введите платежные данные.\n\n2. Нажмите <span class="warn-red">Add Card</span>.\n\n3. После добавления способа оплаты\n\nснова нажмите <span class="warn-red">5 линий</span>,\nзатем <span class="warn-red">[+]</span> в правом верхнем углу.',
              zh: '1. 输入所需的支付信息。\n\n2. 点击 <span class="warn-red">Add Card</span>。\n\n3. 添加支付方式后，\n\n再次点击 <span class="warn-red">五条线</span> 菜单图标，\n然后点击右上角的 <span class="warn-red">[+]</span> 按钮。',
              es: '1. Ingresa la información de pago requerida.\n\n2. Haz clic en <span class="warn-red">Add Card</span>.\n\n3. Después de agregar el método de pago,\n\ntoca el ícono de <span class="warn-red">5 líneas</span> de nuevo,\nluego toca el botón <span class="warn-red">[+]</span> arriba a la derecha.',
              id: '1. Masukkan informasi pembayaran yang diperlukan.\n\n2. Klik <span class="warn-red">Add Card</span>.\n\n3. Setelah metode pembayaran ditambahkan,\n\nKetuk ikon menu <span class="warn-red">5 garis</span> lagi,\nlalu ketuk tombol <span class="warn-red">[+]</span> di kanan atas.',
              th: '1. ป้อนข้อมูลการชำระเงินที่จำเป็น\n\n2. คลิก <span class="warn-red">Add Card</span>\n\n3. หลังจากเพิ่มวิธีการชำระเงินแล้ว\n\nแตะไอคอนเมนู <span class="warn-red">5 เส้น</span> อีกครั้ง\nจากนั้นแตะปุ่ม <span class="warn-red">[+]</span> ที่มุมขวาบน',
              vi: '1. Nhập thông tin thanh toán cần thiết.\n\n2. Nhấp <span class="warn-red">Add Card</span>.\n\n3. Sau khi phương thức thanh toán được thêm,\n\nNhấn vào biểu tượng menu <span class="warn-red">5 dòng</span> một lần nữa,\nsau đó nhấn nút <span class="warn-red">[+]</span> ở góc trên bên phải.',
              tr: '1. Gerekli ödeme bilgilerini girin.\n\n2. <span class="warn-red">Add Card</span>\'a tıklayın.\n\n3. Ödeme yöntemi eklendikten sonra,\n\n<span class="warn-red">5 çizgi</span> menü simgesine tekrar dokunun,\nardından sağ üstteki <span class="warn-red">[+]</span> düğmesine dokunun.',
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            ko: "Buylow AI 서버 등록 (1)",
            en: "Register Buylow AI Server (1)",
            ar: "تسجيل خادم Buylow AI (1)",
            ru: "Регистрация сервера Buylow AI (1)",
            zh: "注册 Buylow AI 服务器 (1)",
            es: "Registrar servidor Buylow AI (1)",
            id: "Daftar Server Buylow AI (1)",
            th: "ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (1)",
            vi: "Đăng Ký Máy Chủ Buylow AI (1)",
            tr: "Buylow AI Sunucusunu Kaydet (1)",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/server_pic/render6.png",
            alt: "Register Buylow AI server 1",
          },
          paragraphs: [
            {
              ko: '1. 4번째 메뉴에 <span class="warn-red">Background Worker</span>을 클릭해줍니다.\n\n2. 상단 3가지 메뉴 중에 <span class="warn-red">Existing Image</span>를 클릭해줍니다.',
              en: '1. Tap <span class="warn-red">Background Worker</span> (4th menu).\n\n2. From the top menu, select <span class="warn-red">Existing Image</span>.',
              ar: '1. انقر <span class="warn-red">Background Worker</span> (القائمة الرابعة).\n\n2. من القائمة العلوية، اختر <span class="warn-red">Existing Image</span>.',
              ru: '1. Нажмите <span class="warn-red">Background Worker</span> (4-й пункт).\n\n2. Из верхнего меню выберите <span class="warn-red">Existing Image</span>.',
              zh: '1. 点击 <span class="warn-red">Background Worker</span> (第四个菜单)。\n\n2. 从顶部菜单选择 <span class="warn-red">Existing Image</span>。',
              es: '1. Toca <span class="warn-red">Background Worker</span> (4to menú).\n\n2. Del menú superior, selecciona <span class="warn-red">Existing Image</span>.',
              id: '1. Ketuk <span class="warn-red">Background Worker</span> (menu ke-4).\n\n2. Dari menu atas, pilih <span class="warn-red">Existing Image</span>.',
              th: '1. แตะ <span class="warn-red">Background Worker</span> (เมนูที่ 4)\n\n2. จากเมนูด้านบน เลือก <span class="warn-red">Existing Image</span>',
              vi: '1. Nhấn <span class="warn-red">Background Worker</span> (menu thứ 4).\n\n2. Từ menu trên cùng, chọn <span class="warn-red">Existing Image</span>.',
              tr: '1. <span class="warn-red">Background Worker</span>\'a dokunun (4. menü).\n\n2. Üst menüden <span class="warn-red">Existing Image</span>\'i seçin.',
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            ko: "Buylow AI 서버 등록 (2)",
            en: "Register Buylow AI Server (2)",
            ar: "تسجيل خادم Buylow AI (2)",
            ru: "Регистрация сервера Buylow AI (2)",
            zh: "注册 Buylow AI 服务器 (2)",
            es: "Registrar servidor Buylow AI (2)",
            id: "Daftar Server Buylow AI (2)",
            th: "ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (2)",
            vi: "Đăng Ký Máy Chủ Buylow AI (2)",
            tr: "Buylow AI Sunucusunu Kaydet (2)",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/server_pic/render7-2.png",
            alt: "Register Buylow AI server 2 - OKX",
          },
          paragraphs: [
            {
              ko: '1. [URL] → <span class="warn-red">exitant/buylow-okx-2.0:latest</span> 입력\n\n2. 하단에 <span class="warn-red">[Connect →]</span> 버튼을 클릭한다.\n\n3. 이후 아래로 스크롤해서 <span class="warn-red">Region</span>은 반드시 <span class="warn-red">Oregon(US West)</span>를 선택한다.\n\n4. 그리고 아래 요금제 종류에서 <span class="warn-red">Starter</span>라고 되어있는 월 7달러짜리 요금제를 선택한다.',
              en: '1. [URL] → Enter <span class="warn-red">exitant/buylow-okx-2.0:latest</span>\n\n2. Click <span class="warn-red">[Connect →]</span>\n\n3. Scroll down and set <span class="warn-red">Region</span> to <span class="warn-red">Oregon (US West)</span>\n\n4. Select the <span class="warn-red">Starter</span> plan ($7/month).',
              ar: '1. [URL] → أدخل <span class="warn-red">exitant/buylow-okx-2.0:latest</span>\n\n2. انقر <span class="warn-red">[Connect →]</span>\n\n3. مرر للأسفل واختر <span class="warn-red">Region</span> كـ <span class="warn-red">Oregon (US West)</span>\n\n4. اختر خطة <span class="warn-red">Starter</span> ($7/شهر).',
              ru: '1. [URL] → Введите <span class="warn-red">exitant/buylow-okx-2.0:latest</span>\n\n2. Нажмите <span class="warn-red">[Connect →]</span>\n\n3. Прокрутите вниз и выберите <span class="warn-red">Region</span>: <span class="warn-red">Oregon (US West)</span>\n\n4. Выберите тариф <span class="warn-red">Starter</span> ($7/мес).',
              zh: '1. [URL] → 输入 <span class="warn-red">exitant/buylow-okx-2.0:latest</span>\n\n2. 点击 <span class="warn-red">[Connect →]</span>\n\n3. 向下滚动，将 <span class="warn-red">Region</span> 设置为 <span class="warn-red">Oregon (US West)</span>\n\n4. 选择 <span class="warn-red">Starter</span> 套餐 ($7/月)。',
              es: '1. [URL] → Ingresa <span class="warn-red">exitant/buylow-okx-2.0:latest</span>\n\n2. Haz clic en <span class="warn-red">[Connect →]</span>\n\n3. Desplázate y configura <span class="warn-red">Region</span> como <span class="warn-red">Oregon (US West)</span>\n\n4. Selecciona el plan <span class="warn-red">Starter</span> ($7/mes).',
              id: '1. [URL] → Masukkan <span class="warn-red">exitant/buylow-okx-2.0:latest</span>\n\n2. Klik <span class="warn-red">[Connect →]</span>\n\n3. Gulir ke bawah dan atur <span class="warn-red">Region</span> ke <span class="warn-red">Oregon (US West)</span>\n\n4. Pilih paket <span class="warn-red">Starter</span> ($7/bulan).',
              th: '1. [URL] → ป้อน <span class="warn-red">exitant/buylow-okx-2.0:latest</span>\n\n2. คลิก <span class="warn-red">[Connect →]</span>\n\n3. เลื่อนลงและตั้ง <span class="warn-red">Region</span> เป็น <span class="warn-red">Oregon (US West)</span>\n\n4. เลือกแผน <span class="warn-red">Starter</span> ($7/เดือน)',
              vi: '1. [URL] → Nhập <span class="warn-red">exitant/buylow-okx-2.0:latest</span>\n\n2. Nhấp <span class="warn-red">[Connect →]</span>\n\n3. Cuộn xuống và đặt <span class="warn-red">Region</span> thành <span class="warn-red">Oregon (US West)</span>\n\n4. Chọn gói <span class="warn-red">Starter</span> ($7/tháng).',
              tr: '1. [URL] → <span class="warn-red">exitant/buylow-okx-2.0:latest</span> girin\n\n2. <span class="warn-red">[Connect →]</span>\'a tıklayın\n\n3. Aşağı kaydırın ve <span class="warn-red">Region</span>\'ı <span class="warn-red">Oregon (US West)</span> olarak ayarlayın\n\n4. <span class="warn-red">Starter</span> planını ($7/ay) seçin.',
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            ko: "Buylow AI 서버 등록 (3)",
            en: "Register Buylow AI Server (3)",
            ar: "تسجيل خادم Buylow AI (3)",
            ru: "Регистрация сервера Buylow AI (3)",
            zh: "注册 Buylow AI 服务器 (3)",
            es: "Registrar servidor Buylow AI (3)",
            id: "Daftar Server Buylow AI (3)",
            th: "ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (3)",
            vi: "Đăng Ký Máy Chủ Buylow AI (3)",
            tr: "Buylow AI Sunucusunu Kaydet (3)",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/okx_step3-7.png",
            alt: "Register Buylow AI server 3",
          },
          paragraphs: [
            {
              ko: '1. 그리고 하단으로 내려서 <span class="warn-red">[Add form .env]</span>라고 되어있는 버튼을 클릭한다.\n\n2. 이후 이전 Buylow AI 전용 <span class="warn-red">API 키</span>를 발급받을 때,\n내가 복사해놓으라고 했었던 <span class="warn-red">3가지</span>를 다음과 같이 입력한다.\n\nAPI_KEY=<span class="warn-red">(복사해놓았던 API key 입력)</span>\nSECRET_KEY=<span class="warn-red">(복사해놓았던 Secret key 입력)</span>\nPASSPHRASE=<span class="warn-red">(복사해놓았던 Passphrase 입력)</span>\n\n<span class="warn-red">※ 오타가 나면 절대 안되기 때문에 복사해서 붙여넣는 것을 추천한다.</span>\n\n3. 모두 잘 입력했다면, 하단에 <span class="warn-red">[Add variables]</span> 버튼을 클릭한다.',
              en: '1. Scroll down and click <span class="warn-red">[Add form .env]</span>.\n\n2. When you created your Buylow AI <span class="warn-red">API keys</span>, you were told to copy <span class="warn-red">3 values</span>.\nEnter them like this:\n\nAPI_KEY=<span class="warn-red">(Paste your API key)</span>\nSECRET_KEY=<span class="warn-red">(Paste your Secret key)</span>\nPASSPHRASE=<span class="warn-red">(Paste your Passphrase)</span>\n\n<span class="warn-red">※ Do NOT type manually. Copy & paste to avoid typos.</span>\n\n3. Click <span class="warn-red">[Add variables]</span>.',
              ar: '1. مرر للأسفل وانقر <span class="warn-red">[Add form .env]</span>.\n\n2. عند إنشاء مفاتيح <span class="warn-red">API</span> لـ Buylow AI، طُلب منك نسخ <span class="warn-red">3 قيم</span>.\nأدخلها كالتالي:\n\nAPI_KEY=<span class="warn-red">(الصق API key)</span>\nSECRET_KEY=<span class="warn-red">(الصق Secret key)</span>\nPASSPHRASE=<span class="warn-red">(الصق Passphrase)</span>\n\n<span class="warn-red">※ لا تكتب يدوياً. انسخ والصق لتجنب الأخطاء.</span>\n\n3. انقر <span class="warn-red">[Add variables]</span>.',
              ru: '1. Прокрутите вниз и нажмите <span class="warn-red">[Add form .env]</span>.\n\n2. Ранее при создании <span class="warn-red">API-ключей</span> Buylow AI вы сохранили <span class="warn-red">3 значения</span>.\nВведите их так:\n\nAPI_KEY=<span class="warn-red">(Вставьте API key)</span>\nSECRET_KEY=<span class="warn-red">(Вставьте Secret key)</span>\nPASSPHRASE=<span class="warn-red">(Вставьте Passphrase)</span>\n\n<span class="warn-red">※ Не вводите вручную. Копируйте и вставляйте.</span>\n\n3. Нажмите <span class="warn-red">[Add variables]</span>.',
              zh: '1. 向下滚动并点击 <span class="warn-red">[Add form .env]</span>。\n\n2. 创建 Buylow AI <span class="warn-red">API密钥</span>时，您保存了 <span class="warn-red">3个值</span>。\n按如下格式输入：\n\nAPI_KEY=<span class="warn-red">(粘贴您的 API key)</span>\nSECRET_KEY=<span class="warn-red">(粘贴您的 Secret key)</span>\nPASSPHRASE=<span class="warn-red">(粘贴您的 Passphrase)</span>\n\n<span class="warn-red">※ 请勿手动输入。请复制粘贴以避免错误。</span>\n\n3. 点击 <span class="warn-red">[Add variables]</span>。',
              es: '1. Desplázate y haz clic en <span class="warn-red">[Add form .env]</span>.\n\n2. Cuando creaste tus claves <span class="warn-red">API</span> de Buylow AI, guardaste <span class="warn-red">3 valores</span>.\nIngrésalos así:\n\nAPI_KEY=<span class="warn-red">(Pega tu API key)</span>\nSECRET_KEY=<span class="warn-red">(Pega tu Secret key)</span>\nPASSPHRASE=<span class="warn-red">(Pega tu Passphrase)</span>\n\n<span class="warn-red">※ NO escribas manualmente. Copia y pega para evitar errores.</span>\n\n3. Haz clic en <span class="warn-red">[Add variables]</span>.',
              id: '1. Gulir ke bawah dan klik <span class="warn-red">[Add form .env]</span>.\n\n2. Saat Anda membuat <span class="warn-red">kunci API</span> Buylow AI, Anda diminta menyalin <span class="warn-red">3 nilai</span>.\nMasukkan seperti ini:\n\nAPI_KEY=<span class="warn-red">(Tempel API key Anda)</span>\nSECRET_KEY=<span class="warn-red">(Tempel Secret key Anda)</span>\nPASSPHRASE=<span class="warn-red">(Tempel Passphrase Anda)</span>\n\n<span class="warn-red">※ JANGAN ketik manual. Salin & tempel untuk menghindari kesalahan.</span>\n\n3. Klik <span class="warn-red">[Add variables]</span>.',
              th: '1. เลื่อนลงและคลิก <span class="warn-red">[Add form .env]</span>\n\n2. เมื่อคุณสร้าง <span class="warn-red">API keys</span> ของ Buylow AI คุณถูกบอกให้คัดลอก <span class="warn-red">3 ค่า</span>\nป้อนดังนี้:\n\nAPI_KEY=<span class="warn-red">(วาง API key ของคุณ)</span>\nSECRET_KEY=<span class="warn-red">(วาง Secret key ของคุณ)</span>\nPASSPHRASE=<span class="warn-red">(วาง Passphrase ของคุณ)</span>\n\n<span class="warn-red">※ อย่าพิมพ์ด้วยตนเอง คัดลอกและวางเพื่อหลีกเลี่ยงการพิมพ์ผิด</span>\n\n3. คลิก <span class="warn-red">[Add variables]</span>',
              vi: '1. Cuộn xuống và nhấp <span class="warn-red">[Add form .env]</span>.\n\n2. Khi bạn tạo <span class="warn-red">khóa API</span> Buylow AI, bạn được yêu cầu sao chép <span class="warn-red">3 giá trị</span>.\nNhập như sau:\n\nAPI_KEY=<span class="warn-red">(Dán API key của bạn)</span>\nSECRET_KEY=<span class="warn-red">(Dán Secret key của bạn)</span>\nPASSPHRASE=<span class="warn-red">(Dán Passphrase của bạn)</span>\n\n<span class="warn-red">※ ĐỪNG nhập thủ công. Sao chép & dán để tránh lỗi đánh máy.</span>\n\n3. Nhấp <span class="warn-red">[Add variables]</span>.',
              tr: '1. Aşağı kaydırın ve <span class="warn-red">[Add form .env]</span>\'a tıklayın.\n\n2. Buylow AI <span class="warn-red">API anahtarlarınızı</span> oluştururken, <span class="warn-red">3 değer</span> kopyalamanız istenmişti.\nŞu şekilde girin:\n\nAPI_KEY=<span class="warn-red">(API key\'inizi yapıştırın)</span>\nSECRET_KEY=<span class="warn-red">(Secret key\'inizi yapıştırın)</span>\nPASSPHRASE=<span class="warn-red">(Passphrase\'inizi yapıştırın)</span>\n\n<span class="warn-red">※ Manuel yazmayın. Hataları önlemek için kopyalayıp yapıştırın.</span>\n\n3. <span class="warn-red">[Add variables]</span>\'a tıklayın.',
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            ko: "Buylow AI 서버 등록 (4)",
            en: "Register Buylow AI Server (4)",
            ar: "تسجيل خادم Buylow AI (4)",
            ru: "Регистрация сервера Buylow AI (4)",
            zh: "注册 Buylow AI 服务器 (4)",
            es: "Registrar servidor Buylow AI (4)",
            id: "Daftar Server Buylow AI (4)",
            th: "ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (4)",
            vi: "Đăng Ký Máy Chủ Buylow AI (4)",
            tr: "Buylow AI Sunucusunu Kaydet (4)",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/okx_step3-8.png",
            alt: "Register Buylow AI server 4",
          },
          paragraphs: [
            {
              ko: '1. 자, 그럼 이렇게 <span class="warn-red">API Key 3가지</span>가 잘 추가된 것을 확인할 수 있을 것이다.\n\n2. 이제 Buylow AI를 텔레그램 봇으로 조종하기 위하여,\n<span class="warn-red">Bot Token</span>과 <span class="warn-red">Chat ID</span> 2가지를 추가해야하기 때문에\n다시 하단 <span class="warn-red">[Add form .env]</span> 버튼을 클릭한다.\n\n3. 이후 우선 아래 텍스트를 입력창에 붙여넣기만 해라.\n\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=',
              en: '1. Confirm that the <span class="warn-red">3 API variables</span> were added.\n\n2. To control Buylow AI via Telegram,\nyou must add <span class="warn-red">Bot Token</span> and <span class="warn-red">Chat ID</span>.\nClick <span class="warn-red">[Add form .env]</span> again.\n\n3. For now, just paste these lines:\n\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=',
              ar: '1. تأكد من إضافة <span class="warn-red">متغيرات API الثلاثة</span>.\n\n2. للتحكم في Buylow AI عبر Telegram،\nيجب إضافة <span class="warn-red">Bot Token</span> و <span class="warn-red">Chat ID</span>.\nانقر <span class="warn-red">[Add form .env]</span> مجدداً.\n\n3. الآن، الصق هذه السطور:\n\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=',
              ru: '1. Убедитесь, что <span class="warn-red">3 переменные API</span> добавлены.\n\n2. Для управления Buylow AI через Telegram\nнужно добавить <span class="warn-red">Bot Token</span> и <span class="warn-red">Chat ID</span>.\nСнова нажмите <span class="warn-red">[Add form .env]</span>.\n\n3. Пока просто вставьте эти строки:\n\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=',
              zh: '1. 确认 <span class="warn-red">3个API变量</span>已添加。\n\n2. 要通过Telegram控制 Buylow AI，\n需要添加 <span class="warn-red">Bot Token</span> 和 <span class="warn-red">Chat ID</span>。\n再次点击 <span class="warn-red">[Add form .env]</span>。\n\n3. 现在先粘贴这些内容：\n\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=',
              es: '1. Confirma que las <span class="warn-red">3 variables API</span> fueron agregadas.\n\n2. Para controlar Buylow AI vía Telegram,\ndebes agregar <span class="warn-red">Bot Token</span> y <span class="warn-red">Chat ID</span>.\nHaz clic en <span class="warn-red">[Add form .env]</span> de nuevo.\n\n3. Por ahora, solo pega estas líneas:\n\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=',
              id: '1. Konfirmasi bahwa <span class="warn-red">3 variabel API</span> telah ditambahkan.\n\n2. Untuk mengontrol Buylow AI melalui Telegram,\nAnda harus menambahkan <span class="warn-red">Bot Token</span> dan <span class="warn-red">Chat ID</span>.\nKlik <span class="warn-red">[Add form .env]</span> lagi.\n\n3. Untuk saat ini, cukup tempel baris ini:\n\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=',
              th: '1. ยืนยันว่า <span class="warn-red">ตัวแปร API 3 ตัว</span> ถูกเพิ่มแล้ว\n\n2. เพื่อควบคุม Buylow AI ผ่าน Telegram\nคุณต้องเพิ่ม <span class="warn-red">Bot Token</span> และ <span class="warn-red">Chat ID</span>\nคลิก <span class="warn-red">[Add form .env]</span> อีกครั้ง\n\n3. ตอนนี้ แค่วางบรรทัดเหล่านี้:\n\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=',
              vi: '1. Xác nhận rằng <span class="warn-red">3 biến API</span> đã được thêm.\n\n2. Để điều khiển Buylow AI qua Telegram,\nbạn phải thêm <span class="warn-red">Bot Token</span> và <span class="warn-red">Chat ID</span>.\nNhấp <span class="warn-red">[Add form .env]</span> một lần nữa.\n\n3. Bây giờ, chỉ cần dán các dòng này:\n\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=',
              tr: '1. <span class="warn-red">3 API değişkeninin</span> eklendiğini onaylayın.\n\n2. Buylow AI\'yı Telegram üzerinden kontrol etmek için\n<span class="warn-red">Bot Token</span> ve <span class="warn-red">Chat ID</span> eklemeniz gerekir.\nTekrar <span class="warn-red">[Add form .env]</span>\'a tıklayın.\n\n3. Şimdilik sadece bu satırları yapıştırın:\n\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=',
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            ko: "Buylow AI 서버 등록 (5)",
            en: "Register Buylow AI Server (5)",
            ar: "تسجيل خادم Buylow AI (5)",
            ru: "Регистрация сервера Buylow AI (5)",
            zh: "注册 Buylow AI 服务器 (5)",
            es: "Registrar servidor Buylow AI (5)",
            id: "Daftar Server Buylow AI (5)",
            th: "ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (5)",
            vi: "Đăng Ký Máy Chủ Buylow AI (5)",
            tr: "Buylow AI Sunucusunu Kaydet (5)",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/server_pic/render10.png",
            alt: "Register Buylow AI server 5",
          },
          paragraphs: [
            {
              ko: '1. 이제 서버 등록 사이트에서 잠시 나와서,\n<span class="warn-red">텔레그램 앱</span>에 들어가서, 상단 <span class="warn-red">돋보기 검색 버튼</span>을 눌러라.\n(앱이 없다면, 앱 스토어 혹은 플레이 스토어에서 설치해라.)\n\n2. 검색창에 <span class="warn-red">BotFather</span>이라고 검색한 다음,\n최상단에 나오는 프로필을 가진 대화방에 입장해라.',
              en: '1. Leave the Render screen for a moment.\nOpen the <span class="warn-red">Telegram app</span> and tap the <span class="warn-red">search (magnifier)</span> icon.\n(Install Telegram if you don\'t have it.)\n\n2. Search <span class="warn-red">BotFather</span> and enter the official chat.',
              ar: '1. اترك شاشة Render مؤقتاً.\nافتح <span class="warn-red">تطبيق Telegram</span> وانقر أيقونة <span class="warn-red">البحث</span>.\n(ثبّت Telegram إذا لم يكن لديك.)\n\n2. ابحث عن <span class="warn-red">BotFather</span> وادخل المحادثة الرسمية.',
              ru: '1. Временно покиньте Render.\nОткройте <span class="warn-red">Telegram</span> и нажмите <span class="warn-red">поиск</span>.\n(Установите Telegram, если нет.)\n\n2. Найдите <span class="warn-red">BotFather</span> и войдите в официальный чат.',
              zh: '1. 暂时离开Render页面。\n打开 <span class="warn-red">Telegram应用</span>，点击 <span class="warn-red">搜索</span>图标。\n(如果没有，请安装Telegram。)\n\n2. 搜索 <span class="warn-red">BotFather</span> 并进入官方聊天。',
              es: '1. Deja la pantalla de Render por un momento.\nAbre la <span class="warn-red">app de Telegram</span> y toca el ícono de <span class="warn-red">búsqueda</span>.\n(Instala Telegram si no lo tienes.)\n\n2. Busca <span class="warn-red">BotFather</span> y entra al chat oficial.',
              id: '1. Tinggalkan layar Render sebentar.\nBuka <span class="warn-red">aplikasi Telegram</span> dan ketuk ikon <span class="warn-red">pencarian (kaca pembesar)</span>.\n(Instal Telegram jika belum punya.)\n\n2. Cari <span class="warn-red">BotFather</span> dan masuk ke obrolan resmi.',
              th: '1. ออกจากหน้าจอ Render สักครู่\nเปิด <span class="warn-red">แอป Telegram</span> แล้วแตะไอคอน <span class="warn-red">ค้นหา (แว่นขยาย)</span>\n(ติดตั้ง Telegram ถ้าไม่มี)\n\n2. ค้นหา <span class="warn-red">BotFather</span> และเข้าสู่แชทอย่างเป็นทางการ',
              vi: '1. Tạm rời màn hình Render.\nMở <span class="warn-red">ứng dụng Telegram</span> và nhấn vào biểu tượng <span class="warn-red">tìm kiếm (kính lúp)</span>.\n(Cài đặt Telegram nếu bạn chưa có.)\n\n2. Tìm kiếm <span class="warn-red">BotFather</span> và vào cuộc trò chuyện chính thức.',
              tr: '1. Render ekranından bir an için ayrılın.\n<span class="warn-red">Telegram uygulamasını</span> açın ve <span class="warn-red">arama (büyüteç)</span> simgesine dokunun.\n(Yoksa Telegram\'ı yükleyin.)\n\n2. <span class="warn-red">BotFather</span>\'ı arayın ve resmi sohbete girin.',
            },
          ],
          link: {
            label: {
              ko: "[BotFather] 텔레그램 채널 입장하기",
              en: "Join [BotFather] Telegram",
              ar: "الانضمام إلى [BotFather] على Telegram",
              ru: "Войти в [BotFather] Telegram",
              zh: "加入 [BotFather] Telegram",
              es: "Unirse a [BotFather] Telegram",
              id: "Gabung [BotFather] Telegram",
              th: "เข้าร่วม [BotFather] Telegram",
              vi: "Tham Gia [BotFather] Telegram",
              tr: "[BotFather] Telegram'a Katıl",
            },
            href: "https://t.me/BotFather",
          },
          layout: "fullTop",
        },
        {
          heading: {
            ko: "Buylow AI 서버 등록 (6)",
            en: "Register Buylow AI Server (6)",
            ar: "تسجيل خادم Buylow AI (6)",
            ru: "Регистрация сервера Buylow AI (6)",
            zh: "注册 Buylow AI 服务器 (6)",
            es: "Registrar servidor Buylow AI (6)",
            id: "Daftar Server Buylow AI (6)",
            th: "ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (6)",
            vi: "Đăng Ký Máy Chủ Buylow AI (6)",
            tr: "Buylow AI Sunucusunu Kaydet (6)",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/server_pic/render11.png",
            alt: "Register Buylow AI server 6",
          },
          paragraphs: [
            {
              ko: '1. <span class="warn-red">/start</span> 버튼을 누르고,\n\n2. <span class="warn-red">/newbot</span>이라는 메뉴를 실행해라.',
              en: '1. Tap <span class="warn-red">/start</span>\n\n2. Run <span class="warn-red">/newbot</span>.',
              ar: '1. انقر <span class="warn-red">/start</span>\n\n2. شغّل <span class="warn-red">/newbot</span>.',
              ru: '1. Нажмите <span class="warn-red">/start</span>\n\n2. Выполните <span class="warn-red">/newbot</span>.',
              zh: '1. 点击 <span class="warn-red">/start</span>\n\n2. 执行 <span class="warn-red">/newbot</span>。',
              es: '1. Toca <span class="warn-red">/start</span>\n\n2. Ejecuta <span class="warn-red">/newbot</span>.',
              id: '1. Ketuk <span class="warn-red">/start</span>\n\n2. Jalankan <span class="warn-red">/newbot</span>.',
              th: '1. แตะ <span class="warn-red">/start</span>\n\n2. เรียกใช้ <span class="warn-red">/newbot</span>',
              vi: '1. Nhấn <span class="warn-red">/start</span>\n\n2. Chạy <span class="warn-red">/newbot</span>.',
              tr: '1. <span class="warn-red">/start</span>\'a dokunun\n\n2. <span class="warn-red">/newbot</span>\'u çalıştırın.',
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            ko: "Buylow AI 서버 등록 (7)",
            en: "Register Buylow AI Server (7)",
            ar: "تسجيل خادم Buylow AI (7)",
            ru: "Регистрация сервера Buylow AI (7)",
            zh: "注册 Buylow AI 服务器 (7)",
            es: "Registrar servidor Buylow AI (7)",
            id: "Daftar Server Buylow AI (7)",
            th: "ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (7)",
            vi: "Đăng Ký Máy Chủ Buylow AI (7)",
            tr: "Buylow AI Sunucusunu Kaydet (7)",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/buylow30.png",
            alt: "Register Buylow AI server 7",
          },
          paragraphs: [
            {
              ko: '그럼 아마 여러분의 새로운 봇의 이름을 지어라고 할텐데,\n좌측 사진처럼 이름을 설정하면 봇 생성이 안될 것이다.\n\n그 이유는 봇 이름에는 반드시\n이름의 마지막에는 <span class="warn-red">bot</span> 이라는 단어로 끝나야 한다.\n\n예시)\nBuylow AI (X)\nBuylow AI_Bot (O)',
              en: 'Telegram will ask you to name your bot.\nIf you set it like the left image, it will fail.\n\nThe bot username must end with <span class="warn-red">bot</span>.\n\nExample)\nBuylow AI (X)\nBuylow AI_Bot (O)',
              ar: 'سيطلب منك Telegram تسمية البوت.\nإذا أدخلت كما في الصورة اليسرى، ستفشل.\n\nاسم البوت يجب أن ينتهي بـ <span class="warn-red">bot</span>.\n\nمثال:\nBuylow AI (X)\nBuylow AI_Bot (O)',
              ru: 'Telegram попросит назвать бота.\nЕсли назвать как на левом изображении, не сработает.\n\nИмя бота должно заканчиваться на <span class="warn-red">bot</span>.\n\nПример:\nBuylow AI (X)\nBuylow AI_Bot (O)',
              zh: 'Telegram会要求您为机器人命名。\n如果像左图那样设置，将会失败。\n\n机器人用户名必须以 <span class="warn-red">bot</span> 结尾。\n\n示例：\nBuylow AI (X)\nBuylow AI_Bot (O)',
              es: 'Telegram te pedirá nombrar tu bot.\nSi lo configuras como en la imagen izquierda, fallará.\n\nEl nombre del bot debe terminar con <span class="warn-red">bot</span>.\n\nEjemplo:\nBuylow AI (X)\nBuylow AI_Bot (O)',
              id: 'Telegram akan meminta Anda memberi nama bot.\nJika Anda mengaturnya seperti gambar kiri, akan gagal.\n\nNama pengguna bot harus diakhiri dengan <span class="warn-red">bot</span>.\n\nContoh:\nBuylow AI (X)\nBuylow AI_Bot (O)',
              th: 'Telegram จะขอให้คุณตั้งชื่อบอท\nถ้าตั้งค่าเหมือนภาพซ้าย จะล้มเหลว\n\nชื่อผู้ใช้บอทต้องลงท้ายด้วย <span class="warn-red">bot</span>\n\nตัวอย่าง:\nBuylow AI (X)\nBuylow AI_Bot (O)',
              vi: 'Telegram sẽ yêu cầu bạn đặt tên cho bot.\nNếu bạn đặt như hình bên trái, sẽ thất bại.\n\nTên người dùng bot phải kết thúc bằng <span class="warn-red">bot</span>.\n\nVí dụ:\nBuylow AI (X)\nBuylow AI_Bot (O)',
              tr: 'Telegram sizden botunuza isim vermenizi isteyecektir.\nSol resimdeki gibi ayarlarsanız başarısız olur.\n\nBot kullanıcı adı <span class="warn-red">bot</span> ile bitmelidir.\n\nÖrnek:\nBuylow AI (X)\nBuylow AI_Bot (O)',
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            ko: "Buylow AI 서버 등록 (8)",
            en: "Register Buylow AI Server (8)",
            ar: "تسجيل خادم Buylow AI (8)",
            ru: "Регистрация сервера Buylow AI (8)",
            zh: "注册 Buylow AI 服务器 (8)",
            es: "Registrar servidor Buylow AI (8)",
            id: "Daftar Server Buylow AI (8)",
            th: "ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (8)",
            vi: "Đăng Ký Máy Chủ Buylow AI (8)",
            tr: "Buylow AI Sunucusunu Kaydet (8)",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/buylow31.png",
            alt: "Register Buylow AI server 8",
          },
          paragraphs: [
            {
              ko: '1. 여러분의 <span class="warn-red">텔레그램 봇 이름</span>까지 지었다면,\n이렇게 새롭게 만든 텔레그램 봇의 <span class="warn-red">Bot Token</span>이 포함된 멘트가 올 것이다.\n\n2. 그럼 이 봇 토큰을 선택하여 <span class="warn-red">복사 (Ctrl + C)</span> 해주도록 하자.\n<span class="warn-red">※ 주의 사항</span> : 봇 토큰은 <span class="warn-red">[숫자 : 영어 알파벳 조합]</span>으로 되어있으니, 해당 부분을 <span class="warn-red">전부 복사</span>해야 한다.',
              en: '1. After naming your <span class="warn-red">Telegram bot</span>, you will receive a message containing the <span class="warn-red">Bot Token</span>.\n\n2. Select it and <span class="warn-red">copy (Ctrl + C)</span>.\n<span class="warn-red">※ Important</span>: The token is a <span class="warn-red">number:letters</span> format, so copy <span class="warn-red">the entire string</span>.',
              ar: '1. بعد تسمية <span class="warn-red">بوت Telegram</span>، ستتلقى رسالة تحتوي على <span class="warn-red">Bot Token</span>.\n\n2. حدده و<span class="warn-red">انسخه (Ctrl + C)</span>.\n<span class="warn-red">※ مهم</span>: التوكن بصيغة <span class="warn-red">رقم:حروف</span>، انس�� <span class="warn-red">السلسلة كاملة</span>.',
              ru: '1. После именования <span class="warn-red">Telegram-бота</span> вы получите сообщение с <span class="warn-red">Bot Token</span>.\n\n2. Выделите и <span class="warn-red">скопируйте (Ctrl + C)</span>.\n<span class="warn-red">※ Важно</span>: Токен в формате <span class="warn-red">число:буквы</span>, скопируйте <span class="warn-red">всю строку</span>.',
              zh: '1. 为 <span class="warn-red">Telegram机器人</span>命名后，您将收到包含 <span class="warn-red">Bot Token</span> 的消息。\n\n2. 选中并<span class="warn-red">复制 (Ctrl + C)</span>。\n<span class="warn-red">※ 重要</span>：Token格式为 <span class="warn-red">数字:字母</span>，请<span class="warn-red">完整复制</span>。',
              es: '1. Después de nombrar tu <span class="warn-red">bot de Telegram</span>, recibirás un mensaje con el <span class="warn-red">Bot Token</span>.\n\n2. Selecciónalo y <span class="warn-red">copia (Ctrl + C)</span>.\n<span class="warn-red">※ Importante</span>: El token es formato <span class="warn-red">número:letras</span>, copia <span class="warn-red">toda la cadena</span>.',
              id: '1. Setelah memberi nama <span class="warn-red">bot Telegram</span> Anda, Anda akan menerima pesan yang berisi <span class="warn-red">Bot Token</span>.\n\n2. Pilih dan <span class="warn-red">salin (Ctrl + C)</span>.\n<span class="warn-red">※ Penting</span>: Token dalam format <span class="warn-red">angka:huruf</span>, jadi salin <span class="warn-red">seluruh string</span>.',
              th: '1. หลังจากตั้งชื่อ <span class="warn-red">บอท Telegram</span> ของคุณ คุณจะได้รับข้อความที่มี <span class="warn-red">Bot Token</span>\n\n2. เลือกและ <span class="warn-red">คัดลอก (Ctrl + C)</span>\n<span class="warn-red">※ สำคัญ</span>: Token อยู่ในรูปแบบ <span class="warn-red">ตัวเลข:ตัวอักษร</span> ดังนั้นให้คัดลอก <span class="warn-red">ทั้งหมด</span>',
              vi: '1. Sau khi đặt tên cho <span class="warn-red">bot Telegram</span> của bạn, bạn sẽ nhận được tin nhắn chứa <span class="warn-red">Bot Token</span>.\n\n2. Chọn và <span class="warn-red">sao chép (Ctrl + C)</span>.\n<span class="warn-red">※ Quan trọng</span>: Token có định dạng <span class="warn-red">số:chữ</span>, vì vậy hãy sao chép <span class="warn-red">toàn bộ chuỗi</span>.',
              tr: '1. <span class="warn-red">Telegram botunuzu</span> adlandırdıktan sonra, <span class="warn-red">Bot Token</span>\'ı içeren bir mesaj alacaksınız.\n\n2. Seçin ve <span class="warn-red">kopyalayın (Ctrl + C)</span>.\n<span class="warn-red">※ Önemli</span>: Token <span class="warn-red">sayı:harf</span> formatındadır, bu yüzden <span class="warn-red">tüm dizgiyi</span> kopyalayın.',
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            ko: "Buylow AI 서버 등록 (9)",
            en: "Register Buylow AI Server (9)",
            ar: "تسجيل خادم Buylow AI (9)",
            ru: "Регистрация сервера Buylow AI (9)",
            zh: "注册 Buylow AI 服务器 (9)",
            es: "Registrar servidor Buylow AI (9)",
            id: "Daftar Server Buylow AI (9)",
            th: "ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (9)",
            vi: "Đăng Ký Máy Chủ Buylow AI (9)",
            tr: "Buylow AI Sunucusunu Kaydet (9)",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/server_pic/render14.png",
            alt: "Register Buylow AI server 9",
          },
          paragraphs: [
            {
              ko: '1. 자, 이제 다시 <span class="warn-red">서버 등록 사이트</span>에 들어가서,\n<span class="warn-red">TELEGRAM_BOT_TOKEN=</span> 부분에 방금 여러분이 복사한 <span class="warn-red">Bot Token</span>을 붙여넣으면<span class="warn-red">(Ctrl + V)</span> 된다.\n\n2. 그리고 다시 <span class="warn-red">텔레그램 앱</span>에 들어가서 <span class="warn-red">돋보기 검색 버튼</span>을 누르고 <span class="warn-red">userinfo</span>라고 검색한 다음,\n위 사진처럼 생긴 <span class="warn-red">Userinfo 봇 대화방</span>에 들어가도록 하자.',
              en: '1. Go back to the <span class="warn-red">Render screen</span>.\nPaste your token into <span class="warn-red">TELEGRAM_BOT_TOKEN=</span> using <span class="warn-red">(Ctrl + V)</span>.\n\n2. Open <span class="warn-red">Telegram</span>, tap <span class="warn-red">search</span>, type <span class="warn-red">userinfo</span>, and enter the <span class="warn-red">Userinfo bot</span> chat.',
              ar: '1. عد إلى <span class="warn-red">شاشة Render</span>.\nالصق التوكن في <span class="warn-red">TELEGRAM_BOT_TOKEN=</span> باستخدام <span class="warn-red">(Ctrl + V)</span>.\n\n2. افتح <span class="warn-red">Telegram</span>، انقر <span class="warn-red">بحث</span>، اكتب <span class="warn-red">userinfo</span>، وادخل محادثة <span class="warn-red">Userinfo bot</span>.',
              ru: '1. Вернитесь на <span class="warn-red">страницу Render</span>.\nВставьте токен в <span class="warn-red">TELEGRAM_BOT_TOKEN=</span> через <span class="warn-red">(Ctrl + V)</span>.\n\n2. Откройте <span class="warn-red">Telegram</span>, нажмите <span class="warn-red">поиск</span>, введите <span class="warn-red">userinfo</span> и войдите в чат <span class="warn-red">Userinfo bot</span>.',
              zh: '1. 返回 <span class="warn-red">Render页面</span>。\n将Token粘贴到 <span class="warn-red">TELEGRAM_BOT_TOKEN=</span> 中，使用 <span class="warn-red">(Ctrl + V)</span>。\n\n2. 打开 <span class="warn-red">Telegram</span>，点击 <span class="warn-red">搜索</span>，输入 <span class="warn-red">userinfo</span>，进入 <span class="warn-red">Userinfo bot</span> 聊天。',
              es: '1. Vuelve a la <span class="warn-red">pantalla de Render</span>.\nPega tu token en <span class="warn-red">TELEGRAM_BOT_TOKEN=</span> usando <span class="warn-red">(Ctrl + V)</span>.\n\n2. Abre <span class="warn-red">Telegram</span>, toca <span class="warn-red">buscar</span>, escribe <span class="warn-red">userinfo</span> y entra al chat <span class="warn-red">Userinfo bot</span>.',
              id: '1. Kembali ke <span class="warn-red">layar Render</span>.\nTempel token Anda ke <span class="warn-red">TELEGRAM_BOT_TOKEN=</span> menggunakan <span class="warn-red">(Ctrl + V)</span>.\n\n2. Buka <span class="warn-red">Telegram</span>, ketuk <span class="warn-red">cari</span>, ketik <span class="warn-red">userinfo</span>, dan masuk ke obrolan <span class="warn-red">Userinfo bot</span>.',
              th: '1. กลับไปที่ <span class="warn-red">หน้าจอ Render</span>\nวาง token ของคุณใน <span class="warn-red">TELEGRAM_BOT_TOKEN=</span> โดยใช้ <span class="warn-red">(Ctrl + V)</span>\n\n2. เปิด <span class="warn-red">Telegram</span> แตะ <span class="warn-red">ค้นหา</span> พิมพ์ <span class="warn-red">userinfo</span> และเข้าสู่แชท <span class="warn-red">Userinfo bot</span>',
              vi: '1. Quay lại <span class="warn-red">màn hình Render</span>.\nDán token của bạn vào <span class="warn-red">TELEGRAM_BOT_TOKEN=</span> bằng <span class="warn-red">(Ctrl + V)</span>.\n\n2. Mở <span class="warn-red">Telegram</span>, nhấn <span class="warn-red">tìm kiếm</span>, gõ <span class="warn-red">userinfo</span>, và vào cuộc trò chuyện <span class="warn-red">Userinfo bot</span>.',
              tr: '1. <span class="warn-red">Render ekranına</span> geri dönün.\nToken\'ınızı <span class="warn-red">TELEGRAM_BOT_TOKEN=</span>\'a <span class="warn-red">(Ctrl + V)</span> kullanarak yapıştırın.\n\n2. <span class="warn-red">Telegram</span>\'ı açın, <span class="warn-red">ara</span>\'ya dokunun, <span class="warn-red">userinfo</span> yazın ve <span class="warn-red">Userinfo bot</span> sohbetine girin.',
            },
          ],
          link: {
            label: {
              ko: "[Userinfo] 텔레그램 채널 입장하기",
              en: "Join [Userinfo] Telegram",
              ar: "الانضمام إلى [Userinfo] على Telegram",
              ru: "Войти в [Userinfo] Telegram",
              zh: "加入 [Userinfo] Telegram",
              es: "Unirse a [Userinfo] Telegram",
              id: "Gabung [Userinfo] Telegram",
              th: "เข้าร่วม [Userinfo] Telegram",
              vi: "Tham Gia [Userinfo] Telegram",
              tr: "[Userinfo] Telegram'a Katıl",
            },
            href: "https://t.me/userinfobot",
          },
          layout: "fullTop",
        },
        {
          heading: {
            ko: "Buylow AI 서버 등록 (10)",
            en: "Register Buylow AI Server (10)",
            ar: "تسجيل خادم Buylow AI (10)",
            ru: "Регистрация сервера Buylow AI (10)",
            zh: "注册 Buylow AI 服务器 (10)",
            es: "Registrar servidor Buylow AI (10)",
            id: "Daftar Server Buylow AI (10)",
            th: "ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (10)",
            vi: "Đăng Ký Máy Chủ Buylow AI (10)",
            tr: "Buylow AI Sunucusunu Kaydet (10)",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/okx_step3-14.png",
            alt: "Register Buylow AI server 10",
          },
          paragraphs: [
            {
              ko: '1.  <span class="warn-red">userinfo bot</span>에 들어가서 <span class="warn-red">/start</span> 를 입력하면,\n\n2. 여러분의 <span class="warn-red">텔레그램 Chat Id</span>가 전송되는데,\n숫자 부분을 클릭하여 <span class="warn-red">복사 (Ctrl + C)</span>해주도록 하자.\n\n3. 그리도 다시 <span class="warn-red">서버 등록 사이트</span>에 들어가서,\n<span class="warn-red">TELEGRAM_CHAT_ID=</span> 부분에 방금 여러분이 복사한 <span class="warn-red">Id</span>을 붙여넣으면<span class="warn-red">(Ctrl + V)</span> 된다.\n\n4. 이렇게 <span class="warn-red">TELEGRAM_BOT_TOKEN=</span>과 <span class="warn-red">TELEGRAM_CHAT_ID=</span>을 모두 입력했다면,\n아래에 <span class="warn-red">[Add variables]</span> 버튼을 클릭하도록 하자.',
              en: '1. In <span class="warn-red">userinfo bot</span>, type <span class="warn-red">/start</span>.\n\n2. Your <span class="warn-red">Telegram Chat ID</span> will be sent.\nCopy the number with <span class="warn-red">(Ctrl + C)</span>.\n\n3. Go back to <span class="warn-red">Render</span> and paste it into <span class="warn-red">TELEGRAM_CHAT_ID=</span> with <span class="warn-red">(Ctrl + V)</span>.\n\n4. When both <span class="warn-red">TELEGRAM_BOT_TOKEN=</span> and <span class="warn-red">TELEGRAM_CHAT_ID=</span> are filled,\nclick <span class="warn-red">[Add variables]</span>.',
              ar: '1. في <span class="warn-red">userinfo bot</span>، اكتب <span class="warn-red">/start</span>.\n\n2. سيُرسل <span class="warn-red">Chat ID</span> الخاص بك.\nانسخ الرقم بـ <span class="warn-red">(Ctrl + C)</span>.\n\n3. عد إلى <span class="warn-red">Render</span> والصقه في <span class="warn-red">TELEGRAM_CHAT_ID=</span> بـ <span class="warn-red">(Ctrl + V)</span>.\n\n4. بعد ملء <span class="warn-red">TELEGRAM_BOT_TOKEN=</span> و <span class="warn-red">TELEGRAM_CHAT_ID=</span>،\nانقر <span class="warn-red">[Add variables]</span>.',
              ru: '1. В <span class="warn-red">userinfo bot</span> введите <span class="warn-red">/start</span>.\n\n2. Вам отправят ваш <span class="warn-red">Telegram Chat ID</span>.\nСкопируйте число через <span class="warn-red">(Ctrl + C)</span>.\n\n3. Вернитесь в <span class="warn-red">Render</span> и вставьте в <span class="warn-red">TELEGRAM_CHAT_ID=</span> чер��з <span class="warn-red">(Ctrl + V)</span>.\n\n4. Когда оба поля <span class="warn-red">TELEGRAM_BOT_TOKEN=</span> и <span class="warn-red">TELEGRAM_CHAT_ID=</span> заполнены,\nнажмите <span class="warn-red">[Add variables]</span>.',
              zh: '1. 在 <span class="warn-red">userinfo bot</span> 中输入 <span class="warn-red">/start</span>。\n\n2. 您的 <span class="warn-red">Telegram Chat ID</span> 将被发送。\n使用 <span class="warn-red">(Ctrl + C)</span> 复制数字。\n\n3. 返回 <span class="warn-red">Render</span>，将其粘贴到 <span class="warn-red">TELEGRAM_CHAT_ID=</span> 中，使用 <span class="warn-red">(Ctrl + V)</span>。\n\n4. 当 <span class="warn-red">TELEGRAM_BOT_TOKEN=</span> 和 <span class="warn-red">TELEGRAM_CHAT_ID=</span> 都填写完毕后，\n点击 <span class="warn-red">[Add variables]</span>。',
              es: '1. En <span class="warn-red">userinfo bot</span>, escribe <span class="warn-red">/start</span>.\n\n2. Se enviará tu <span class="warn-red">Telegram Chat ID</span>.\nCopia el número con <span class="warn-red">(Ctrl + C)</span>.\n\n3. Vuelve a <span class="warn-red">Render</span> y pégalo en <span class="warn-red">TELEGRAM_CHAT_ID=</span> con <span class="warn-red">(Ctrl + V)</span>.\n\n4. Cuando <span class="warn-red">TELEGRAM_BOT_TOKEN=</span> y <span class="warn-red">TELEGRAM_CHAT_ID=</span> estén llenos,\nhaz clic en <span class="warn-red">[Add variables]</span>.',
              id: '1. Di <span class="warn-red">userinfo bot</span>, ketik <span class="warn-red">/start</span>.\n\n2. <span class="warn-red">Telegram Chat ID</span> Anda akan dikirim.\nSalin angkanya dengan <span class="warn-red">(Ctrl + C)</span>.\n\n3. Kembali ke <span class="warn-red">Render</span> dan tempel ke <span class="warn-red">TELEGRAM_CHAT_ID=</span> dengan <span class="warn-red">(Ctrl + V)</span>.\n\n4. Ketika <span class="warn-red">TELEGRAM_BOT_TOKEN=</span> dan <span class="warn-red">TELEGRAM_CHAT_ID=</span> sudah diisi,\nklik <span class="warn-red">[Add variables]</span>.',
              th: '1. ใน <span class="warn-red">userinfo bot</span> พิมพ์ <span class="warn-red">/start</span>\n\n2. <span class="warn-red">Telegram Chat ID</span> ของคุณจะถูกส่ง\nคัดลอกตัวเลขด้วย <span class="warn-red">(Ctrl + C)</span>\n\n3. กลับไปที่ <span class="warn-red">Render</span> และวางใน <span class="warn-red">TELEGRAM_CHAT_ID=</span> ด้วย <span class="warn-red">(Ctrl + V)</span>\n\n4. เมื่อ <span class="warn-red">TELEGRAM_BOT_TOKEN=</span> และ <span class="warn-red">TELEGRAM_CHAT_ID=</span> ถูกกรอกแล้ว\nคลิก <span class="warn-red">[Add variables]</span>',
              vi: '1. Trong <span class="warn-red">userinfo bot</span>, gõ <span class="warn-red">/start</span>.\n\n2. <span class="warn-red">Telegram Chat ID</span> của bạn sẽ được gửi.\nSao chép số bằng <span class="warn-red">(Ctrl + C)</span>.\n\n3. Quay lại <span class="warn-red">Render</span> và dán vào <span class="warn-red">TELEGRAM_CHAT_ID=</span> bằng <span class="warn-red">(Ctrl + V)</span>.\n\n4. Khi cả <span class="warn-red">TELEGRAM_BOT_TOKEN=</span> và <span class="warn-red">TELEGRAM_CHAT_ID=</span> đã được điền,\nnhấp <span class="warn-red">[Add variables]</span>.',
              tr: '1. <span class="warn-red">userinfo bot</span>\'ta <span class="warn-red">/start</span> yazın.\n\n2. <span class="warn-red">Telegram Chat ID</span>\'niz gönderilecektir.\nSayıyı <span class="warn-red">(Ctrl + C)</span> ile kopyalayın.\n\n3. <span class="warn-red">Render</span>\'a geri dönün ve <span class="warn-red">TELEGRAM_CHAT_ID=</span>\'a <span class="warn-red">(Ctrl + V)</span> ile yapıştırın.\n\n4. <span class="warn-red">TELEGRAM_BOT_TOKEN=</span> ve <span class="warn-red">TELEGRAM_CHAT_ID=</span> doldurulduğunda,\n<span class="warn-red">[Add variables]</span>\'a tıklayın.',
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            ko: "Buylow AI 서버 등록 (11)",
            en: "Register Buylow AI Server (11)",
            ar: "تسجيل خادم Buylow AI (11)",
            ru: "Регистрация сервера Buylow AI (11)",
            zh: "注册 Buylow AI 服务器 (11)",
            es: "Registrar servidor Buylow AI (11)",
            id: "Daftar Server Buylow AI (11)",
            th: "ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (11)",
            vi: "Đăng Ký Máy Chủ Buylow AI (11)",
            tr: "Buylow AI Sunucusunu Kaydet (11)",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/exitant34.png",
            alt: "Register Buylow AI server 11",
          },
          paragraphs: [
            {
              ko: '1.  그럼 이렇게 위 좌측 사진처럼 <span class="warn-red">아래 5개의 환경변수</span>가 모두 적용된 상태일 것이다.\nAPI_KEY=\nSECRET_KEY=\nPASSPHRASE=\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=\n\n2. 그럼 이제 하단에 <span class="warn-red">[Deploy Background Worker]</span> 버튼을 클릭하도록 하자.\n\n3. 그럼 여러분의 <span class="warn-red">서버 봇 Log 창</span>에 \n<span class="warn-red">==> Starting service...</span>\n<span class="warn-red">==> Your service is live 🎉</span>\n\n이 문구가 뜬 뒤 <span class="warn-red">1~2분 후</span>에  위 우측 사진처럼 뜨면 정상적으로 실행이 완료된 것이다.',
              en: '1. You should now see all <span class="warn-red">5 environment variables</span> added:\nAPI_KEY=\nSECRET_KEY=\nPASSPHRASE=\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=\n\n2. Click <span class="warn-red">[Deploy Background Worker]</span>.\n\n3. In the <span class="warn-red">server log</span>, you will see:\n<span class="warn-red">==> Starting service...</span>\n<span class="warn-red">==> Your service is live 🎉</span>\n\nAfter <span class="warn-red">1–2 minutes</span>, if it looks like the top-right image, deployment is complete.',
              ar: '1. يجب أن ترى الآن <span class="warn-red">5 متغيرات بيئة</span> مضافة:\nAPI_KEY=\nSECRET_KEY=\nPASSPHRASE=\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=\n\n2. انقر <span class="warn-red">[Deploy Background Worker]</span>.\n\n3. في <span class="warn-red">سجل الخادم</span>، سترى:\n<span class="warn-red">==> Starting service...</span>\n<span class="warn-red">==> Your service is live 🎉</span>\n\nبعد <span class="warn-red">1-2 دقيقة</span>، إذا ظهر كالصورة، اكتمل النشر.',
              ru: '1. Теперь должны быть видны все <span class="warn-red">5 переменных окружения</span>:\nAPI_KEY=\nSECRET_KEY=\nPASSPHRASE=\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=\n\n2. Нажмите <span class="warn-red">[Deploy Background Worker]</span>.\n\n3. В <span class="warn-red">логе сервера</span> появится:\n<span class="warn-red">==> Starting service...</span>\n<span class="warn-red">==> Your service is live 🎉</span>\n\nЧерез <span class="warn-red">1–2 минуты</span>, если всё как на картинке, развёртывание завершено.',
              zh: '1. 现在应该看到所有 <span class="warn-red">5个环境变量</span> 已添加：\nAPI_KEY=\nSECRET_KEY=\nPASSPHRASE=\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=\n\n2. 点击 <span class="warn-red">[Deploy Background Worker]</span>。\n\n3. 在 <span class="warn-red">服务器日志</span>中，您将看到：\n<span class="warn-red">==> Starting service...</span>\n<span class="warn-red">==> Your service is live 🎉</span>\n\n<span class="warn-red">1-2分钟</span>后，如果显示如�����所示，则部署完成。',
              es: '1. Ahora deberías ver las <span class="warn-red">5 variables de entorno</span> agregadas:\nAPI_KEY=\nSECRET_KEY=\nPASSPHRASE=\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=\n\n2. Haz clic en <span class="warn-red">[Deploy Background Worker]</span>.\n\n3. En el <span class="warn-red">log del servidor</span>, verás:\n<span class="warn-red">==> Starting service...</span>\n<span class="warn-red">==> Your service is live 🎉</span>\n\nDespués de <span class="warn-red">1-2 minutos</span>, si se ve como la imagen, el despliegue está completo.',
              id: '1. Sekarang Anda seharusnya melihat semua <span class="warn-red">5 variabel lingkungan</span> ditambahkan:\nAPI_KEY=\nSECRET_KEY=\nPASSPHRASE=\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=\n\n2. Klik <span class="warn-red">[Deploy Background Worker]</span>.\n\n3. Di <span class="warn-red">log server</span>, Anda akan melihat:\n<span class="warn-red">==> Starting service...</span>\n<span class="warn-red">==> Your service is live 🎉</span>\n\nSetelah <span class="warn-red">1-2 menit</span>, jika terlihat seperti gambar kanan atas, deployment selesai.',
              th: '1. ตอนนี้คุณควรเห็น <span class="warn-red">ตัวแปรสภาพแวดล้อม 5 ตัว</span> ทั้งหมดถูกเพิ่มแล้ว:\nAPI_KEY=\nSECRET_KEY=\nPASSPHRASE=\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=\n\n2. คลิก <span class="warn-red">[Deploy Background Worker]</span>\n\n3. ใน <span class="warn-red">log เซิร์ฟเวอร์</span> คุณจะเห็น:\n<span class="warn-red">==> Starting service...</span>\n<span class="warn-red">==> Your service is live 🎉</span>\n\nหลังจาก <span class="warn-red">1-2 นาที</span> ถ้าดูเหมือนภาพขวาบน การติดตั้งเสร็จสมบูรณ์',
              vi: '1. Bây giờ bạn sẽ thấy tất cả <span class="warn-red">5 biến môi trường</span> đã được thêm:\nAPI_KEY=\nSECRET_KEY=\nPASSPHRASE=\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=\n\n2. Nhấp <span class="warn-red">[Deploy Background Worker]</span>.\n\n3. Trong <span class="warn-red">log máy chủ</span>, bạn sẽ thấy:\n<span class="warn-red">==> Starting service...</span>\n<span class="warn-red">==> Your service is live 🎉</span>\n\nSau <span class="warn-red">1-2 phút</span>, nếu nó trông giống hình ảnh trên cùng bên phải, triển khai đã hoàn tất.',
              tr: '1. Şimdi eklenen tüm <span class="warn-red">5 ortam değişkenini</span> görmelisiniz:\nAPI_KEY=\nSECRET_KEY=\nPASSPHRASE=\nTELEGRAM_BOT_TOKEN=\nTELEGRAM_CHAT_ID=\n\n2. <span class="warn-red">[Deploy Background Worker]</span>\'a tıklayın.\n\n3. <span class="warn-red">Sunucu log</span>\'unda şunları göreceksiniz:\n<span class="warn-red">==> Starting service...</span>\n<span class="warn-red">==> Your service is live 🎉</span>\n\n<span class="warn-red">1-2 dakika</span> sonra, sağ üst görüntüye benziyorsa, dağıtım tamamlanmıştır.',
            },
          ],
          layout: "fullTop",
        },
        {
          heading: {
            ko: "Buylow AI 서버 등록 (12)",
            en: "Register Buylow AI Server (12)",
            ar: "تسجيل خادم Buylow AI (12)",
            ru: "Регистрация сервера Buylow AI (12)",
            zh: "注册 Buylow AI 服务器 (12)",
            es: "Registrar servidor Buylow AI (12)",
            id: "Daftar Server Buylow AI (12)",
            th: "ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (12)",
            vi: "Đăng Ký Máy Chủ Buylow AI (12)",
            tr: "Buylow AI Sunucusunu Kaydet (12)",
          },
          image: {
            src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/buylow35.png",
            alt: "Register Buylow AI server 12",
          },
          paragraphs: [
            {
              ko: "1. 이제 다시 텔레그램 앱으로 돌아가서\n여러분의 생성한 텔레그��� 봇의 이름을 검색해서 접속한다.\n\n2. 이후 /start 버튼을 입력하면,\nBuylow AI 사용하기 위한 세팅이 모두 완료되었다.\n\n※ 이제 실제로 Buylow AI를 사용하기 위하여\n다음 단계로 넘어가서 Buylow AI 운용 시드 입금, 알고리즘 전략, 봇 세팅법 등을 차근차근 배워서 개미 탈출을 위한 여정을 시작하자.",
              en: "1. Go back to Telegram and search your bot name to enter the chat.\n\n2. Type /start.\nNow the setup for using Buylow AI is complete.\n\n※ To actually use Buylow AI,\nmove to the next step and learn deposits, strategies, and bot settings step-by-step.",
              ar: "1. عد إلى Telegram وابحث عن اسم البوت للدخول.\n\n2. اكتب /start.\nاكتمل الآن إعداد Buylow AI.\n\n※ لاستخدام Buylow AI فعلياً،\nانتقل للخطوة التالية وتعلم الإيداع والاستراتيجيات والإعدادات.",
              ru: "1. Вернитесь в Telegram и найдите имя бота для входа.\n\n2. Введите /start.\nНастройка Buylow AI завершена.\n\n※ Чтобы начать использовать Buylow AI,\nперейдите к следующему шагу и изучите пополнение, стратегии и настройки.",
              zh: "1. 返回Telegram，搜索您的机器人名称进入聊天。\n\n2. 输入 /start。\n现在 Buylow AI 的设置已完成。\n\n※ 要实际使用 Buylow AI，\n请继续下一步，学习存款、策略和机器人设置。",
              es: "1. Vuelve a Telegram y busca el nombre de tu bot para entrar.\n\n2. Escribe /start.\nLa configuración de Buylow AI está completa.\n\n※ Para usar Buylow AI realmente,\npasa al siguiente paso y aprende depósitos, estrategias y configuración.",
              id: "1. Kembali ke Telegram dan cari nama bot Anda untuk masuk ke chat.\n\n2. Ketik /start.\nSekarang pengaturan untuk menggunakan Buylow AI sudah selesai.\n\n※ Untuk benar-benar menggunakan Buylow AI,\nlanjut ke langkah berikutnya dan pelajari deposit, strategi, dan pengaturan bot langkah demi langkah.",
              th: "1. กลับไปที่ Telegram และค้นหาชื่อบอทของคุณเพื่อเข้าสู่แชท\n\n2. พิมพ์ /start\nตอนนี้การตั้งค่าสำหรับใช้ Buylow AI เสร็จสมบูรณ์แล้ว\n\n※ เพื่อใช้งาน Buylow AI จริง\nไปยังขั้นตอนถัดไปและเรียนรู้การฝากเงิน กลยุทธ์ และการตั้งค่าบอททีละขั้นตอน",
              vi: "1. Quay lại Telegram và tìm kiếm tên bot của bạn để vào cuộc trò chuyện.\n\n2. Gõ /start.\nBây giờ việc thiết lập để sử dụng Buylow AI đã hoàn tất.\n\n※ Để thực sự sử dụng Buylow AI,\nchuyển sang bước tiếp theo và học từng bước về nạp tiền, chiến lược và cài đặt bot.",
              tr: "1. Telegram'a geri dönün ve sohbete girmek için bot adınızı arayın.\n\n2. /start yazın.\nŞimdi Buylow AI kullanmak için kurulum tamamlandı.\n\n※ Buylow AI'yı gerçekten kullanmak için,\nbir sonraki adıma geçin ve adım adım para yatırma, stratejiler ve bot ayarlarını öğrenin.",
            },
          ],
          layout: "fullTop",
        },
      ],
    },
    5: {
      title: {
        en: "Appendix",
        ko: "부록",
        ar: "الملحق",
        ru: "Приложение",
        zh: "附录",
        es: "Apéndice",
        id: "Lampiran",
        th: "ภาคผนวก",
        vi: "Phụ Lục",
        tr: "Ek",
      },
      sections: [
        {
          layout: "imageCard",
          cards: [
            {
              image: {
                src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/community1.png",
                alt: "Community",
              },
              href: "https://t.me/addlist/iDor86zShwo5MzU1",
            },
            {
              image: {
                src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/strategy1.png",
                alt: "Strategy",
              },
              href: "/strategy?step=1",
            },
            {
              image: {
                src: "https://rrstujleucibhqesorup.supabase.co/storage/v1/object/public/buylow_homepage/trade_log1.png",
                alt: "Trade Log",
              },
              href: "",
            },
          ],
        },
      ],
    },
  },
  // okx-mobile-btc is an exact copy of okx-mobile content (Bitcoin variant)
  get "okx-mobile-btc"() {
    return this["okx-mobile"]
  },
  // okx-mobile-gold is an exact copy of okx-mobile content (Gold variant)
  get "okx-mobile-gold"() {
    return this["okx-mobile"]
  },
}
