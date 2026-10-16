$ErrorActionPreference = 'Stop'
$out = Join-Path (Get-Location) 'my-react-app\EduPanel_loyiha_qollanmasi.docx'
$tmp = Join-Path (Get-Location) 'docx_build_tmp'
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
New-Item -ItemType Directory -Path $tmp | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tmp '_rels') | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tmp 'word\_rels') -Force | Out-Null
$enc = [System.Text.UTF8Encoding]::new($false)
$contentTypes = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>
'@
$rels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>
'@
$wordrels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>
'@
$styles = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/><w:sz w:val="21"/><w:lang w:val="uz-Latn-UZ"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:pPr><w:spacing w:after="240"/></w:pPr><w:rPr><w:b/><w:color w:val="183B32"/><w:sz w:val="36"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="300" w:after="140"/></w:pPr><w:rPr><w:b/><w:color w:val="183B32"/><w:sz w:val="30"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="200" w:after="80"/></w:pPr><w:rPr><w:b/><w:color w:val="486D5B"/><w:sz w:val="24"/></w:rPr></w:style></w:styles>
'@
[IO.File]::WriteAllText((Join-Path $tmp '[Content_Types].xml'),$contentTypes,$enc)
[IO.File]::WriteAllText((Join-Path $tmp '_rels\.rels'),$rels,$enc)
[IO.File]::WriteAllText((Join-Path $tmp 'word\_rels\document.xml.rels'),$wordrels,$enc)
[IO.File]::WriteAllText((Join-Path $tmp 'word\styles.xml'),$styles,$enc)
$script:paras = [System.Collections.Generic.List[object]]::new()
function P([string]$t,[string]$style='Normal') { $script:paras.Add([pscustomobject]@{t=$t;s=$style}) }
P 'EduPanel loyihasini tushunish va himoya qilish qo‘llanmasi' 'Title'
P 'React asosidagi o‘quv markazi boshqaruv paneli | O‘rganish va og‘zaki javobga tayyorgarlik uchun' 'Subtitle'
P 'Ushbu qo‘llanma my-react-app ichidagi kodni boshidan oxirigacha tushuntiradi: loyiha qanday ishga tushadi, sahifalar qanday bog‘langan, ma’lumot qayerda saqlanadi, foydalanuvchi amallari qanday bajariladi va qaysi joylari demo darajasida qoladi. O‘qib chiqqach, loyihaning maqsadi va asosiy qarorlarini ustozga o‘z so‘zingiz bilan bayon qila olishingiz kerak.'
P '1. Loyihaning qisqacha mazmuni' 'Heading1'
P 'EduPanel — o‘quv markazidagi talabalar, guruhlar, to‘lovlar va davomatni boshqarish uchun yaratilgan SPA (Single Page Application). Foydalanuvchi admin sifatida kiradi; boshqaruv panelidagi sahifalar React Router orqali almashadi. Interfeys React 19 bilan yozilgan, Vite ishlab chiqish va yig‘ish vositasi, Tailwind CSS 4 dizayn uchun, json-server esa demo REST API va ma’lumotlar saqlash uchun ishlatiladi.'
P 'Tizimdagi asosiy obyektlar: admin, guruh, talaba, to‘lov va davomat. Dashboard sahifasi shu ma’lumotlardan ko‘rsatkichlar chiqaradi. Talaba guruhga tegishli; to‘lov talaba ID-si bilan bog‘lanadi; davomat yozuvi guruh, sana va talaba holatlari to‘plamidan iborat.'
P 'Himoyada aytish mumkin: “Men o‘quv markazining boshqaruv panelini tuzdim. Admin talabalar va guruhlarni yuritadi, to‘lovlarni qayd qiladi, davomatni belgilaydi va joriy holatni bosh paneldan kuzatadi. Hozir ma’lumotlar demo sifatida json-server va db.json da saqlanadi.”'
P '2. Texnologiyalar va ularning vazifasi' 'Heading1'
P 'React 19 va React DOM — komponentlardan interfeys tuzadi va brauzerdagi root elementga chizadi. useState sahifa holatini, useEffect esa ma’lumot yuklash yoki brauzer bilan sinxronlash kabi yon ta’sirlarni boshqaradi.' 'Normal'
P 'Vite 8 — tez development serverini ishga tushiradi va production build yaratadi. @vitejs/plugin-react React JSX transformatsiyasini, @tailwindcss/vite Tailwind CSS 4 integratsiyasini beradi.'
P 'React Router DOM 7 — URL va sahifalarni bog‘laydi; BrowserRouter, Routes, Route, Navigate, Outlet, Link va NavLink ishlatilgan.'
P 'Axios — API so‘rovlarini yuboradi. axios.js ichida bitta konfiguratsiyalangan instance yaratilgan.'
P 'json-server 0.17 — db.json JSON faylidan REST API yaratadi. GET, POST, PATCH, DELETE usullari orqali demo ma’lumotlar bilan ishlaydi.'
P 'React Hook Form, Zod va @hookform/resolvers — form holatini va validatsiyani boshqaradi. Schema Zod da yozilib, zodResolver orqali forma bilan bog‘langan.'
P 'Tailwind CSS 4 — utility klasslari yordamida maket va ranglar; src/index.css da takroriy input, button va card klasslari belgilangan.'
P 'lucide-react — menyu, tahrirlash, to‘lov, kalendar kabi SVG ikonlar. concurrently — API va Vite serverini bitta npm buyrug‘i bilan birga ishga tushiradi. oxlint — statik kod tekshiruvi vositasi.'
P '3. Ishga tushirish va arxitektura' 'Heading1'
P 'Talab qilinadi: Node.js va npm. my-react-app ichida npm install dependency paketlarini o‘rnatadi. npm run dev concurrently orqali json-server ni 3001-portda va Vite ni 5173-portda ishga tushiradi. Brauzerda http://localhost:5173 ochiladi; API odatda http://localhost:3001 manzilida.'
P 'npm run server faqat API ni, npm run build production uchun dist papkasini, npm run preview yigilgan versiyani korishni, npm run lint oxlint tekshiruvini bajaradi. README demo loginni admin / admin123 deb korsatadi. Parol db.json da ochiq matn.'
P 'Ishga tushish oqimi: index.html dagi #root element → src/main.jsx → App.jsx → BrowserRouter va route daraxti → login yoki himoyalangan DashboardLayout → tanlangan sahifa → Axios orqali json-server → natija komponent state iga yoziladi → React qayta chizadi.'
P '4. Papkalar va muhim fayllar' 'Heading1'
P 'src/main.jsx — React ilovasini #root ga ulaydi, global CSS ni yuklaydi, StrictMode bilan o‘raydi va boshlang‘ich dark theme ni localStorage dan tekshiradi.'
P 'src/App.jsx — butun URL marshrutlari va sahifa komponentlarini bog‘laydi. / bosh manzili /dashboard ga yo‘naltiradi; noma’lum manzil NotFound sahifasiga tushadi.'
P 'src/pages/ — Login, Dashboard, Students, StudentDetail, Groups, GroupDetail, Payments, Attendance, Settings va NotFound sahifalari.'
P 'src/components/ — qayta ishlatiladigan DashboardLayout, ProtectedRoute, PublicRoute, Modal va StatusBadge.'
P 'src/api/axios.js — API manzili va JSON header bilan Axios instance. src/schemas/authSchema.js — login, talaba, guruh, to‘lov va sozlama validatsiyasi.'
P 'src/utils/ — auth.js admin sessiyasini tekshiradi; format.js pul/sana/ism/holat ko‘rsatishni bir xillashtiradi; debt.js qarzni hisoblaydi; errors.js server xabarini yoki fallback matnni qaytaradi.'
P 'db.json — json-server o‘qiydigan demo ma’lumot ombori. public/ — favicon va ikonka; assets/ — Vite/React namunalari hamda hero.png. vite.config.js React va Tailwind plaginlarini ulaydi. index.html sahifa sarlavhasi, til, favicon va root elementni belgilaydi.'
P '5. Ilovaning marshrutlari va kirish nazorati' 'Heading1'
P 'Yo‘llar: /login; /dashboard (bosh panel); /dashboard/students va /dashboard/students/:id; /dashboard/groups va /dashboard/groups/:id; /dashboard/payments; /dashboard/attendance; /dashboard/settings. Dashboard ichidagi sahifalar bitta umumiy layout ichida Outlet orqali ko‘rsatiladi.'
P 'ProtectedRoute readStoredAdmin() chaqiradi. Admin topilsa Outlet, topilmasa /login ga Navigate qiladi. PublicRoute teskari ishlaydi: admin bor bo‘lsa /dashboard, bo‘lmasa login sahifasini ko‘rsatadi. replace navigatsiya tarixida ortiqcha oraliq yozuv qoldirmaydi.'
P 'readStoredAdmin localStorage dagi admin JSON ni parse qiladi. JSON buzilgan, massiv yoki id yo‘q bo‘lsa, noto‘g‘ri qiymatni o‘chirib null qaytaradi. Muhim jihat: bu UI darajasidagi demo gate, haqiqiy backend xavfsizlik nazorati emas.'
P '6. Kirish va form validatsiyasi' 'Heading1'
P 'Login sahifasida React Hook Form forma holatini boshqaradi, loginSchema username kamida 3 va password kamida 6 belgi bolishini tekshiradi. Resolver Zod xatolarini formState.errors ga uzatadi. Admin /admins API dan tekshiriladi; muvaffaqiyatli bolsa, parolsiz admin localStorage ga saqlanib /dashboard ga otiladi.'
P 'settingsSchema ism va username ni tekshiradi. Yangi parol berilsa joriy parol shart va yangisi kamida 6 belgi boladi. studentSchema talaba maydonlarini; groupSchema guruh va narxni; paymentSchema talaba, summa, sar, usul va sanani tekshiradi.'
P 'Validatsiyadan keyin server bilan ishlanadi. getErrorMessage API message ni yoki tushunarli fallback xabarni qaytaradi.'
P '7. Umumiy boshqaruv, modal va mavzu' 'Heading1'
P 'DashboardLayout нь sidebar, дээд header, хэрэглэгчийн avatar ба нэр, сэдэв солих товч, mobile drawer болон Outlet агуулна. NavLink идэвхтэй route-ийг тодруулна. Logout admin-ийг localStorage-оос устгаж /login руу явуулна.'
P 'Theme товч document.documentElement дээр dark классыг сольж, theme утгыг localStorage-д хадгална. main.jsx эхлэх үед уг утгыг уншдаг тул дараагийн ачаалалд theme хадгалагдана.'
P 'Modal нь гарчиг, dialog accessibility атрибуттай. Нээлттэй үед Escape дарж хаах, эхний input/button-д focus өгөх, хаахад өмнөх focus-ийг сэргээх, backdrop дарвал хаах үйлдэлтэй. StatusBadge төлөвийн шошгыг format.js ээс авч өнгөт badge болгоно.'
P '8. Dashboard va qarz hisobi' 'Heading1'
P 'Dashboard нь students, groups, payments өгөгдлийг API-гаас авч, идэвхтэй оюутан болон бүлэг, тухайн сарын орлого, төлбөрийн түүх ба өртэй оюутныг харуулна. Dashboard код дахь яг ямар фильтр, график байгааг жишээ датаар шалгаж тайлбарлана; тоонууд нь db.json өөрчлөгдөхөд өөрчлөгдөнө.'
P 'calculateStudentDebt(student, group, payments, currentMonth) ma lumot dutuu, faal bish esvel payments array bish bol 0 ur butsaana. Busad ued tuhain sariin tuulburuudiig niiluulj, ur = max(0, sariin une - tulusun dun) gej bodno. Ur eyereg bol isDebtor true.'
P 'Jishee: sariin une 800000, tulusun 400000 bol ur 400000. Iluu tululttei bol ur 0 baina.'
P '9. Талбарын модуль' 'Heading1'
P 'Students жагсаалт API-аас оюутнуудыг авч, хайлт/шүүлтийн UI болон нэмэх, засах, устгах үйлдэлтэй. Оюутан бүлэгтэй groupId-аар холбоотой, төлөв нь active, frozen, left. Жагсаалтаас detail руу :id route-аар орно.'
P 'StudentDetail нь сонгосон оюутны дэлгэрэнгүй мэдээллийг route ID-аар авна. Бүлгийг groupId-аар олж харуулах, тухайн оюутны төлбөр/өрийн мэдээллийг нэгтгэж үзүүлэхэд ашиглагдана.'
P 'Groups хуудсанд бүлэг жагсаах, хайх, үүсгэх/засах/устгах; бүлгийн нэр, хичээл, багш, тэгш/сондгой өдөр, цаг, сарын үнэ, эхэлсэн огноо, төлөв хадгалагдана. GroupDetail сонгосон бүлгийн оюутнууд ба мэдээллийг гаргана.'
P 'Талбар болон бүлгийн маягтууд Modal + React Hook Form + Zod ашигладаг. groupId болон мөнгөн дүн JSON талбарт тоо хэлбэрээр хадгалагдах ёстой тул z.coerce.number хэрэглэдэг.'
P '10. Төлбөрийн модуль' 'Heading1'
P 'Payments хуудсанд бүх төлбөрийг оюутантай холбож харуулна. Шинэ төлбөрт оюутан, дүн, аль сарын төлбөр, бодитоор төлсөн огноо, арга (naqd/karta/click) оруулна. Формын утгыг paymentSchema шалгаж, зөв бол POST /payments хийдэг.'
P 'Оюутны нэр studentName-ээр, төлбөрийн арга statusLabel-ээр, мөнгө formatMoney-ээр форматлагдана. Жагсаалтад хайлт эсвэл сар/оюутны filter хэрэглэгдэх боломжийг UI-д тусгасан. Устгах үйлдэл нь тухайн төлбөрийн API бичлэгийг DELETE хийнэ; энэ нь тухайн сарын төлсөн нийлбэр болон өрийн тооцоонд нөлөөлнө.'
P '11. Davomat moduli' 'Heading1'
P 'Attendance нь зөвхөн идэвхтэй бүлгүүдийг эхэлж ачаална. Анхны идэвхтэй бүлгийг сонгож, бүлэг эсвэл огноо өөрчлөгдөх бүрт тухайн бүлгийн оюутнууд болон attendance бичлэгийг Promise.all-ээр зэрэг татна. Зөвхөн active оюутныг жагсаана.'
P 'Хэрэв тухайн огнооны бүртгэл байвал өмнөх төлөвүүдийг оюутны ID-аар нөхнө; шинээр ирсэн оюутанд default present онооно. Хэрэглэгч present, late, absent сонгоод хадгална. Өмнөх бичлэг байвал PATCH, шинээр бол POST хийнэ.'
P 'Хадгалахдаа тухайн үед жагсаалтад байхгүй байсан хуучин attendance records-ийг historicalRecords болгон хадгалж, одоогийн оюутнуудын шинэ тэмдэглэгээтэй нийлүүлдэг. Ингэснээр тухайн бүлгийн хуучин оюутны түүх арчигдахгүй.'
P '12. Тохиргоо ба өгөгдлийн загвар' 'Heading1'
P 'Settings нь админы нэр, username-ийг засах боломжтой. Нууц үг өөрчлөхдөө API-аас админы бичлэгийг авч, currentPassword таарч байгааг шалгана; шинэ нууц үгийг PATCH хийж, буцаж ирсэн нууц үгийг localStorage-д хадгалахгүй.'
P 'db.json has five main collections: admins, groups, students, payments, and attendance. Each record uses an id. Students point to groups by groupId; payments point to students by studentId; attendance records contain groupId, date, and per-student status.'
P 'JSON-server файлд үүсгэсэн/зассан/устгасан мэдээллийг бичдэг. Туршилтын мэдээллийг reset хийхдээ db.json-ийн backup-ийг хадгалах хэрэгтэй; JSON эвдэрвэл server эхлэхгүй.'
P '13. Формат, загвар ба хүртээмж' 'Heading1'
P 'formatMoney Intl.NumberFormat(uz-UZ)-ээр тоог бүлэглэж so‘m нэмнэ. formatDate огноог uz-UZ хэлбэрт хөрвүүлнэ, localDateString локал цагийн бүсээр YYYY-MM-DD үүсгэнэ, currentMonthString YYYY-MM авна. studentName нэр/овгийг нэгтгэж, нэр алга бол Noma’lum; statusLabel статус ба төлбөрийн аргын утгыг хүн унших шошго болгоно.'
P 'index.css Tailwind import болон dark variant-ийг тохируулж, input, btn-primary, btn-ghost, card классуудыг тодорхойлдог. UI responsive хийгдсэн: desktop sidebar, mobile drawer, жижиг дэлгэцэд нуух header нэр зэрэг шийдэл бий. aria-label, role=dialog, aria-modal, alert/status, focus-visible хэв маяг нь keyboard болон assistive technology ашиглалтад тусалдаг.'
P '14. Туршилтын demo өгөгдөл ба анхаарах хязгаарлалт' 'Heading1'
P 'db.json-д анхдагч admin, 3 бүлэг, 5 ID-тай оюутан болон нэмэгдсэн 6-р “Test Talaba”, дөрвөн төлбөр, хоёр өдрийн attendance жишээ байна. Demo date нь 2026 оны 9–10 сар. Эдгээр нь зөвхөн жишээ; бодит төвийн мэдээлэл гэж үзэж болохгүй.'
P 'Хамгаалалтын чухал хязгаар: нууц үг db.json-д plain text. Login нь клиентээс админы endpoint дуудах загвартай, session localStorage-д хадгалагдана. JSON-server дээр role-based permission, сервер талын эрх шалгалт, audit log, password hash байхгүй. Production-д backend API, bcrypt/Argon2 hash, token/cookie session, authorization, database, validation, backup болон HTTPS шаардлагатай.'
P 'Мөн README-д хэлсэн demo credentials-ийг бодит орчинд ашиглаж болохгүй. API URL VITE_API_URL environment хувьсагчаар override хийгдэж болно. API унтарсан үед зарим хуудсанд loading/error state гарна.'
P '15. Ustozga aytishga tayyor qisqa taqdimot' 'Heading1'
P 'Ilova Vite index.html dan boshlanadi; main.jsx React root ochadi, App.jsx marshrutlarni belgilaydi. ProtectedRoute loginni tekshiradi, DashboardLayout Outlet orqali sahifalarni korsatadi. Sahifalar Axios bilan json-server API dan oqiydi va REST sorovlari orqali db.json ni ozgartiradi. Formalarni React Hook Form va Zod tekshiradi. Qarz joriy oy uchun guruh narxidan tulangan summani ayirish bilan topiladi. Bu demo, production uchun himoyalangan backend kerak.'
P 'Асууж магадгүй асуулт, товч хариулт' 'Heading2'
P 'Яагаад json-server хэрэглэсэн бэ? Backend-гүйгээр REST API-г хурдан дуурайлгаж, CRUD flow-ийг front-end дээр хөгжүүлж үзэхэд тохиромжтой.'
P 'useEffect юунд хэрэгтэй вэ? Компонент нээгдэх эсвэл хамаарах утга өөрчлөгдөхөд API дуудах, theme-ийг document болон localStorage-тэй синхрончлоход хэрэглэсэн.'
P 'Zod ба React Hook Form-ын ялгаа? React Hook Form form state, submit болон алдааны төлөвийг удирдана; Zod өгөгдлийн дүрмийг схемээр шалгана; resolver хоёрын холбоос.'
P 'ProtectedRoute хангалттай хамгаалалт уу? Үгүй. Энэ нь зөвхөн UI route-ийг хаана. Сервер бүр хүсэлт бүрд хэрэглэгчийн эрхийг шалгах ёстой.'
P 'Өр хэрхэн гардаг вэ? Идэвхтэй сурагчийн тухайн сарын төлбөрүүдийг нийлүүлж бүлгийн сарын үнээс хасна; үр дүн 0-ээс доош бол 0 болгоно.'
P '16. Давтлагын төлөвлөгөө' 'Heading1'
P '1-р давталт: төслийн зорилго, технологи, файлын бүтэц. 2-р давталт: route, login, protected/public route. 3-р давталт: өгөгдлийн загвар болон API урсгал. 4-р давталт: Dashboard өрийн тооцоо, Payments болон Attendance хадгалалт. 5-р давталт: security хязгаар болон production-д сайжруулах алхмууд. Дараа нь 60–90 секундийн тайлбарыг цаас харалгүй ярьж давт.'
P 'Эх кодын лавлах' 'Heading2'
P 'Code reference: src/App.jsx, src/api/axios.js, src/schemas/authSchema.js, src/utils/debt.js, src/utils/format.js, src/components/DashboardLayout.jsx, src/pages, db.json.'

$sb = [System.Text.StringBuilder]::new()
$sb.Append("<?xml version='1.0' encoding='UTF-8' standalone='yes'?><w:document xmlns:w='http://schemas.openxmlformats.org/wordprocessingml/2006/main'><w:body>") | Out-Null
foreach ($x in $script:paras) {
  $style=$x.s; $text=[System.Security.SecurityElement]::Escape($x.t)
$template = @"
<w:p><w:pPr><w:pStyle w:val="{0}"/></w:pPr><w:r><w:t xml:space="preserve">{1}</w:t></w:r></w:p>
"@
[void]$sb.AppendFormat($template,$style,$text)
}
$sb.Append("<w:sectPr><w:pgSz w:w='12240' w:h='15840'/><w:pgMar w:top='1150' w:right='1200' w:bottom='1150' w:left='1200'/></w:sectPr></w:body></w:document>") | Out-Null
$docpath = Join-Path $tmp "word/document.xml"; [IO.File]::WriteAllText($docpath,$sb.ToString(),$enc)
if(Test-Path $out){Remove-Item $out -Force}
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($tmp,$out)
Write-Output $out
