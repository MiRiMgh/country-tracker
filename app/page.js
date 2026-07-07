"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Check, Lock, Plane, Star, X, ScrollText, LogOut, Mail, KeyRound } from "lucide-react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://churcvjjkdcmpaltgdwe.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_ITDurTgrCAqUNEL_U-4_gg_1fbh6vO_";

const flag = (code) =>
  code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));

const COUNTRIES = [
  { name: "Австрия", code: "AT", continent: "Европа", status: "признана" },
  { name: "Албания", code: "AL", continent: "Европа", status: "признана" },
  { name: "Андорра", code: "AD", continent: "Европа", status: "признана" },
  { name: "Беларусь", code: "BY", continent: "Европа", status: "признана" },
  { name: "Бельгия", code: "BE", continent: "Европа", status: "признана" },
  { name: "Болгария", code: "BG", continent: "Европа", status: "признана" },
  { name: "Босния и Герцеговина", code: "BA", continent: "Европа", status: "признана" },
  { name: "Ватикан", code: "VA", continent: "Европа", status: "признана" },
  { name: "Великобритания", code: "GB", continent: "Европа", status: "признана" },
  { name: "Венгрия", code: "HU", continent: "Европа", status: "признана" },
  { name: "Германия", code: "DE", continent: "Европа", status: "признана" },
  { name: "Греция", code: "GR", continent: "Европа", status: "признана" },
  { name: "Дания", code: "DK", continent: "Европа", status: "признана" },
  { name: "Ирландия", code: "IE", continent: "Европа", status: "признана" },
  { name: "Исландия", code: "IS", continent: "Европа", status: "признана" },
  { name: "Испания", code: "ES", continent: "Европа", status: "признана" },
  { name: "Италия", code: "IT", continent: "Европа", status: "признана" },
  { name: "Латвия", code: "LV", continent: "Европа", status: "признана" },
  { name: "Литва", code: "LT", continent: "Европа", status: "признана" },
  { name: "Лихтенштейн", code: "LI", continent: "Европа", status: "признана" },
  { name: "Люксембург", code: "LU", continent: "Европа", status: "признана" },
  { name: "Мальта", code: "MT", continent: "Европа", status: "признана" },
  { name: "Молдова", code: "MD", continent: "Европа", status: "признана" },
  { name: "Монако", code: "MC", continent: "Европа", status: "признана" },
  { name: "Нидерланды", code: "NL", continent: "Европа", status: "признана" },
  { name: "Норвегия", code: "NO", continent: "Европа", status: "признана" },
  { name: "Польша", code: "PL", continent: "Европа", status: "признана" },
  { name: "Португалия", code: "PT", continent: "Европа", status: "признана" },
  { name: "Румыния", code: "RO", continent: "Европа", status: "признана" },
  { name: "Сан-Марино", code: "SM", continent: "Европа", status: "признана" },
  { name: "Северная Македония", code: "MK", continent: "Европа", status: "признана" },
  { name: "Сербия", code: "RS", continent: "Европа", status: "признана", ready: true, free: { line: "🟡 Реальный путь к паспорту ЕС-кандидата, но с важной оговоркой", visa: "Безвизово для россиян", dual: "Придётся официально отказаться от гражданства РФ — Сербия двойное гражданство не признаёт (кроме этнических сербов и особых случаев)" }, paid: {
    vnj: { title: "ВНЖ", points: [
      "Через открытие фирмы (ИП/ООО) — без формально установленного минимума инвестиций, но нужно показать реальную деятельность и подавать отчётность",
      "Через покупку недвижимости (ориентировочно от €250 000 как практический уровень, юридически жёсткого порога нет)",
      "Через трудовой договор с сербской компанией",
      "Документы: загранпаспорт, основание (учредительные документы фирмы/тапу на жильё/трудовой договор), фото, справка об отсутствии судимости, медицинская страховка",
      "Подаётся в МВД Сербии (MUP), решение обычно занимает от нескольких недель до пары месяцев",
      "Выдаётся на 1 год, продлевается",
    ]},
    pmj: { title: "ПМЖ", points: [
      "После 3 лет непрерывного проживания по ВНЖ",
      "Даёт более широкие права, но само по себе не отменяет требование об отказе от другого гражданства при переходе к паспорту (см. раздел «Гражданство»)",
    ]},
    grazhdanstvo: { title: "Гражданство", points: [
      "Натурализация обычно возможна не раньше чем через 5-8 лет суммарного законного проживания (точный срок уточняется в МВД Сербии на момент подачи — правило периодически меняется)",
      "Обязательное условие для большинства заявителей — отказ от предыдущего гражданства (Сербия не признаёт двойное, кроме этнических сербов и отдельных решений)",
      "Именно этот пункт нужно оценивать до начала всего процесса, не в конце — многие узнают о нём слишком поздно, когда уже потратили годы на ВНЖ и ПМЖ",
      "Требуется также знание сербского языка и отсутствие серьёзных правонарушений",
    ]},
    lawyers: "Собираем проверенный список партнёров по Сербии — скоро.",
  } },
  { name: "Словакия", code: "SK", continent: "Европа", status: "признана" },
  { name: "Словения", code: "SI", continent: "Европа", status: "признана" },
  { name: "Украина", code: "UA", continent: "Европа", status: "признана" },
  { name: "Финляндия", code: "FI", continent: "Европа", status: "признана" },
  { name: "Франция", code: "FR", continent: "Европа", status: "признана" },
  { name: "Хорватия", code: "HR", continent: "Европа", status: "признана" },
  { name: "Черногория", code: "ME", continent: "Европа", status: "признана" },
  { name: "Чехия", code: "CZ", continent: "Европа", status: "признана" },
  { name: "Швейцария", code: "CH", continent: "Европа", status: "признана" },
  { name: "Швеция", code: "SE", continent: "Европа", status: "признана" },
  { name: "Эстония", code: "EE", continent: "Европа", status: "признана" },
  { name: "Кипр", code: "CY", continent: "Европа", status: "признана" },
  { name: "Россия", code: "RU", continent: "Европа/Азия", status: "признана" },
  { name: "Турция", code: "TR", continent: "Европа/Азия", status: "признана", ready: true, free: { line: "🟢 Один из самых доступных вариантов легализации для россиян", visa: "Безвизово до 60 дней за один заезд, не более 90 дней за 180 дней", dual: "Двойное гражданство с Россией допускается" }, paid: {
    vnj: { title: "ВНЖ (икамет)", points: [
      "Виды: туристический/по недвижимости, учебный, рабочий, семейный — 14 категорий всего",
      "Покупка недвижимости даёт право на ВНЖ без официального минимума суммы (для гражданства через инвестиции нужен порог — см. раздел «Гражданство»)",
      "Документы: загранпаспорт, 4 биометрических фото, полис медстрахования для иностранцев (yabancı sağlık sigortası), договор аренды или тапу (свидетельство на недвижимость), справка о доходе или выписка со счёта",
      "Подать заявление нужно в течение месяца после въезда — через сайт e-ikamet или миграционную службу (göç idaresi) лично",
      "Стоимость первого оформления обычно ~$50-150 (пошлина + карта + страховка), у разных провинций может отличаться",
      "Срок рассмотрения — как правило, от 2 недель до 2 месяцев",
      "Продлевать нужно заранее, до истечения срока — заявку на продление можно подать за 2 месяца до окончания текущего ВНЖ",
      "Частая ошибка — пропустить месячный срок постановки на учёт после въезда: это может привести к штрафу и осложнить продление в будущем",
    ]},
    pmj: { title: "ПМЖ", points: [
      "Оформляется как «бессрочный ВНЖ» (süresiz ikamet) после 8 лет непрерывного законного проживания",
      "Требуется отсутствие длительных выездов из страны сверх установленных лимитов и отсутствие серьёзных правонарушений",
      "Отдельно есть облегчённые условия для держателей недвижимости и пенсионеров — состав требований периодически меняется, уточнять на момент подачи",
    ]},
    grazhdanstvo: { title: "Гражданство", points: [
      "Стандартный путь: от 5 лет непрерывного проживания по ВНЖ + базовый уровень турецкого языка + отсутствие угрозы национальной безопасности (проверяется при подаче)",
      "Ускоренный путь — гражданство за инвестиции: покупка недвижимости от $400 000 с обязательством не продавать 3 года, ИЛИ банковский депозит от $500 000 на 3 года, ИЛИ создание не менее 50 рабочих мест, ИЛИ покупка гособлигаций на $500 000",
      "По инвестиционному пути язык не требуется, рассмотрение обычно занимает от 3 до 6 месяцев после подачи полного пакета",
      "Суммы порогов устанавливаются постановлением правительства и могут быть изменены — обязательно проверять актуальную цифру на официальном сайте перед сделкой, а не полагаться на цифры из статей в интернете",
      "Частая ошибка — покупка недвижимости дешевле порога «по совету риелтора, что доплатим потом»: без соответствия порогу на момент оценки заявку не примут",
    ]},
    lawyers: "Собираем проверенный список партнёров по Турции — скоро.",
  } },
  { name: "Косово", code: "XK", continent: "Европа", status: "частично признана" },
  { name: "Приднестровье", code: "MD-PR", continent: "Европа", status: "не признана" },
  { name: "Азербайджан", code: "AZ", continent: "Азия", status: "признана" },
  { name: "Армения", code: "AM", continent: "Азия", status: "признана", ready: true, free: { line: "🟢 Самый гладкий путь к паспорту среди популярных направлений", visa: "Безвизово до 180 дней в году", dual: "Двойное гражданство разрешено — отказываться от российского не нужно" }, paid: {
    vnj: { title: "ВНЖ", points: [
      "Основания: бизнес (ИП/учредитель компании), работа по контракту, учёба, брак с гражданином Армении, владение недвижимостью",
      "Минимальной суммы инвестиций не требуется — в отличие от большинства других стран пятёрки",
      "Документы: загранпаспорт, основание (документы о регистрации бизнеса/трудовой договор/справка из вуза), фото, квитанция об уплате госпошлины",
      "Подаётся в Службу миграции и национальной безопасности (МВД) — обычно рассматривается в пределах месяца",
      "Выдаётся на 1 год, продлевается; после нескольких продлений можно претендовать на статус на более долгий срок",
    ]},
    pmj: { title: "ПМЖ", points: [
      "Оформляется после нескольких лет проживания по ВНЖ (обычно от 3 лет непрерывного проживания)",
      "Даёт более широкие права по сравнению с временным ВНЖ, но требует поддержания оснований проживания",
    ]},
    grazhdanstvo: { title: "Гражданство", points: [
      "Натурализация: от 3 лет непрерывного проживания в статусе ВНЖ/ПМЖ + владение армянским языком на базовом уровне + знание основ Конституции",
      "Для этнических армян — упрощённая программа репатриации, без стандартного срока ожидания",
      "⚠️ Встречаются агентства, обещающие \"гражданство за 4-6 месяцев без ВНЖ\" — это касается узких случаев (этническое происхождение/особые решения), не рядового заявителя. Проверяйте такие обещания напрямую в консульстве, а не доверяйте только словам агентства",
      "Двойное гражданство разрешено — при получении паспорта Армении российское гражданство сохраняется автоматически, отдельного заявления на сохранение не требуется",
    ]},
    lawyers: "Собираем проверенный список партнёров по Армении — скоро.",
  } },
  { name: "Афганистан", code: "AF", continent: "Азия", status: "признана" },
  { name: "Бангладеш", code: "BD", continent: "Азия", status: "признана" },
  { name: "Бахрейн", code: "BH", continent: "Азия", status: "признана" },
  { name: "Бруней", code: "BN", continent: "Азия", status: "признана" },
  { name: "Бутан", code: "BT", continent: "Азия", status: "признана" },
  { name: "Восточный Тимор", code: "TL", continent: "Азия", status: "признана" },
  { name: "Вьетнам", code: "VN", continent: "Азия", status: "признана" },
  { name: "Грузия", code: "GE", continent: "Азия", status: "признана", ready: true, free: { line: "🟡 Доступно, но путь к паспорту самый долгий из популярных направлений", visa: "Безвизово до 365 дней", dual: "Двойное гражданство не предусмотрено (кроме репатриантов/инвесторов по решению властей)" }, paid: {
    vnj: { title: "ВНЖ", points: [
      "Основания: инвестиции в недвижимость/бизнес (индикативно от $100 000, точная планка устанавливается ведомством и может меняться), трудоустройство, учёба",
      "Документы: загранпаспорт, основание получения статуса (документы на недвижимость/бизнес/трудовой договор), фото, справка об отсутствии судимости (иногда требуется)",
      "Подаётся через Агентство развития государственных сервисов (обычно) — обработка от нескольких недель до пары месяцев",
      "Краткосрочный ВНЖ выдаётся на 1 год с продлением",
    ]},
    pmj: { title: "Постоянный вид на жительство", points: [
      "Промежуточная ступень перед гражданством — оформляется после нескольких лет проживания по краткосрочному ВНЖ",
      "Отдельная категория от гражданства, даёт больше прав (например, более свободный доступ к трудоустройству), но не паспорт",
    ]},
    grazhdanstvo: { title: "Гражданство", points: [
      "Натурализация только после 10 лет непрерывного законного проживания в стране",
      "Обязателен экзамен на знание грузинского языка, истории и основ законодательства",
      "Двойное гражданство по умолчанию не допускается — нужно отказаться от российского (кроме решений президента для инвесторов/особых заслуг — это дискреционное решение, а не стандартная процедура по заявлению)",
      "Частая ошибка — рассчитывать на упрощённые сроки «для инвесторов» без реального решения президента: это исключение, а не общее правило",
    ]},
    lawyers: "Собираем проверенный список партнёров по Грузии — скоро.",
  } },
  { name: "Израиль", code: "IL", continent: "Азия", status: "признана" },
  { name: "Индия", code: "IN", continent: "Азия", status: "признана" },
  { name: "Индонезия", code: "ID", continent: "Азия", status: "признана" },
  { name: "Иордания", code: "JO", continent: "Азия", status: "признана" },
  { name: "Ирак", code: "IQ", continent: "Азия", status: "признана" },
  { name: "Иран", code: "IR", continent: "Азия", status: "признана" },
  { name: "Йемен", code: "YE", continent: "Азия", status: "признана" },
  { name: "Казахстан", code: "KZ", continent: "Азия", status: "признана" },
  { name: "Камбоджа", code: "KH", continent: "Азия", status: "признана" },
  { name: "Катар", code: "QA", continent: "Азия", status: "признана" },
  { name: "Киргизия", code: "KG", continent: "Азия", status: "признана" },
  { name: "Китай", code: "CN", continent: "Азия", status: "признана" },
  { name: "Кувейт", code: "KW", continent: "Азия", status: "признана" },
  { name: "Лаос", code: "LA", continent: "Азия", status: "признана" },
  { name: "Ливан", code: "LB", continent: "Азия", status: "признана" },
  { name: "Малайзия", code: "MY", continent: "Азия", status: "признана" },
  { name: "Мальдивы", code: "MV", continent: "Азия", status: "признана" },
  { name: "Монголия", code: "MN", continent: "Азия", status: "признана" },
  { name: "Мьянма", code: "MM", continent: "Азия", status: "признана" },
  { name: "Непал", code: "NP", continent: "Азия", status: "признана" },
  { name: "ОАЭ", code: "AE", continent: "Азия", status: "признана", ready: true, free: { line: "🟡 ВНЖ получить легко, но гражданство почти недостижимо", visa: "Для россиян ставится бесплатно при въезде", dual: "Гражданство ОАЭ практически не выдаётся резидентам — точечные случаи по приглашению, не открытая программа" }, paid: {
    vnj: { title: "ВНЖ", points: [
      "«Золотая виза»: покупка недвижимости индикативно от 2 млн AED (~$545 000), выдаётся на 5-10 лет с продлением — точные пороги устанавливает каждый эмират и периодически их пересматривает",
      "Виза для фрилансеров/удалённых сотрудников — без покупки недвижимости, обычно на 1 год, нужно подтвердить доход",
      "Рабочая виза через работодателя-спонсора — 2-3 года, оформляет работодатель",
      "Виза для пенсионеров 55+ при подтверждённом доходе или недвижимости",
      "Документы обычно включают загранпаспорт, фото, подтверждение основания (тапу на недвижимость/трудовой договор/подтверждение дохода), медицинское обследование по прибытии",
    ]},
    pmj: { title: "Постоянного ПМЖ как отдельной категории нет", points: [
      "Роль ПМЖ фактически выполняет продлеваемая «золотая виза» на 10 лет — гражданства она не даёт",
    ]},
    grazhdanstvo: { title: "Гражданство", points: [
      "Открытой программы подачи заявления для рядовых резидентов нет",
      "С 2021 года есть закон о гражданстве по приглашению для отдельных инвесторов, учёных, врачей, деятелей культуры — решение принимается точечно правителем эмирата, самостоятельно подать заявку нельзя",
      "Вывод для планирования: если цель — именно паспорт, ОАЭ не подходит как основной вариант; если цель — образ жизни, налоговый климат и бизнес-инфраструктура, ОАЭ один из лучших вариантов в мире",
    ]},
    lawyers: "Собираем проверенный список партнёров по ОАЭ — скоро.",
  } },
  { name: "Оман", code: "OM", continent: "Азия", status: "признана" },
  { name: "Пакистан", code: "PK", continent: "Азия", status: "признана" },
  { name: "Палестина", code: "PS", continent: "Азия", status: "частично признана" },
  { name: "Саудовская Аравия", code: "SA", continent: "Азия", status: "признана" },
  { name: "Сингапур", code: "SG", continent: "Азия", status: "признана" },
  { name: "Сирия", code: "SY", continent: "Азия", status: "признана" },
  { name: "Таджикистан", code: "TJ", continent: "Азия", status: "признана" },
  { name: "Таиланд", code: "TH", continent: "Азия", status: "признана" },
  { name: "Тайвань", code: "TW", continent: "Азия", status: "частично признана" },
  { name: "Туркменистан", code: "TM", continent: "Азия", status: "признана" },
  { name: "Узбекистан", code: "UZ", continent: "Азия", status: "признана" },
  { name: "Филиппины", code: "PH", continent: "Азия", status: "признана" },
  { name: "Шри-Ланка", code: "LK", continent: "Азия", status: "признана" },
  { name: "Южная Корея", code: "KR", continent: "Азия", status: "признана" },
  { name: "Северная Корея", code: "KP", continent: "Азия", status: "признана" },
  { name: "Япония", code: "JP", continent: "Азия", status: "признана" },
  { name: "Абхазия", code: "GE-AB", continent: "Азия", status: "не признана" },
  { name: "Южная Осетия", code: "GE-SO", continent: "Азия", status: "не признана" },
  { name: "Алжир", code: "DZ", continent: "Африка", status: "признана" },
  { name: "Ангола", code: "AO", continent: "Африка", status: "признана" },
  { name: "Бенин", code: "BJ", continent: "Африка", status: "признана" },
  { name: "Ботсвана", code: "BW", continent: "Африка", status: "признана" },
  { name: "Буркина-Фасо", code: "BF", continent: "Африка", status: "признана" },
  { name: "Бурунди", code: "BI", continent: "Африка", status: "признана" },
  { name: "Габон", code: "GA", continent: "Африка", status: "признана" },
  { name: "Гамбия", code: "GM", continent: "Африка", status: "признана" },
  { name: "Гана", code: "GH", continent: "Африка", status: "признана" },
  { name: "Гвинея", code: "GN", continent: "Африка", status: "признана" },
  { name: "Гвинея-Бисау", code: "GW", continent: "Африка", status: "признана" },
  { name: "Джибути", code: "DJ", continent: "Африка", status: "признана" },
  { name: "Египет", code: "EG", continent: "Африка", status: "признана" },
  { name: "Замбия", code: "ZM", continent: "Африка", status: "признана" },
  { name: "Зимбабве", code: "ZW", continent: "Африка", status: "признана" },
  { name: "Кабо-Верде", code: "CV", continent: "Африка", status: "признана" },
  { name: "Камерун", code: "CM", continent: "Африка", status: "признана" },
  { name: "Кения", code: "KE", continent: "Африка", status: "признана" },
  { name: "Коморы", code: "KM", continent: "Африка", status: "признана" },
  { name: "Конго", code: "CG", continent: "Африка", status: "признана" },
  { name: "ДР Конго", code: "CD", continent: "Африка", status: "признана" },
  { name: "Кот-д'Ивуар", code: "CI", continent: "Африка", status: "признана" },
  { name: "Лесото", code: "LS", continent: "Африка", status: "признана" },
  { name: "Либерия", code: "LR", continent: "Африка", status: "признана" },
  { name: "Ливия", code: "LY", continent: "Африка", status: "признана" },
  { name: "Маврикий", code: "MU", continent: "Африка", status: "признана" },
  { name: "Мавритания", code: "MR", continent: "Африка", status: "признана" },
  { name: "Мадагаскар", code: "MG", continent: "Африка", status: "признана" },
  { name: "Малави", code: "MW", continent: "Африка", status: "признана" },
  { name: "Мали", code: "ML", continent: "Африка", status: "признана" },
  { name: "Марокко", code: "MA", continent: "Африка", status: "признана" },
  { name: "Мозамбик", code: "MZ", continent: "Африка", status: "признана" },
  { name: "Намибия", code: "NA", continent: "Африка", status: "признана" },
  { name: "Нигер", code: "NE", continent: "Африка", status: "признана" },
  { name: "Нигерия", code: "NG", continent: "Африка", status: "признана" },
  { name: "Руанда", code: "RW", continent: "Африка", status: "признана" },
  { name: "Сан-Томе и Принсипи", code: "ST", continent: "Африка", status: "признана" },
  { name: "Эсватини", code: "SZ", continent: "Африка", status: "признана" },
  { name: "Сейшелы", code: "SC", continent: "Африка", status: "признана" },
  { name: "Сенегал", code: "SN", continent: "Африка", status: "признана" },
  { name: "Сомали", code: "SO", continent: "Африка", status: "признана" },
  { name: "ЮАР", code: "ZA", continent: "Африка", status: "признана" },
  { name: "Судан", code: "SD", continent: "Африка", status: "признана" },
  { name: "Южный Судан", code: "SS", continent: "Африка", status: "признана" },
  { name: "Сьерра-Леоне", code: "SL", continent: "Африка", status: "признана" },
  { name: "Танзания", code: "TZ", continent: "Африка", status: "признана" },
  { name: "Того", code: "TG", continent: "Африка", status: "признана" },
  { name: "Тунис", code: "TN", continent: "Африка", status: "признана" },
  { name: "Уганда", code: "UG", continent: "Африка", status: "признана" },
  { name: "ЦАР", code: "CF", continent: "Африка", status: "признана" },
  { name: "Чад", code: "TD", continent: "Африка", status: "признана" },
  { name: "Экваториальная Гвинея", code: "GQ", continent: "Африка", status: "признана" },
  { name: "Эритрея", code: "ER", continent: "Африка", status: "признана" },
  { name: "Эфиопия", code: "ET", continent: "Африка", status: "признана" },
  { name: "Западная Сахара", code: "EH", continent: "Африка", status: "частично признана" },
  { name: "Сомалиленд", code: "SO-SL", continent: "Африка", status: "не признана" },
  { name: "Антигуа и Барбуда", code: "AG", continent: "Северная Америка", status: "признана" },
  { name: "Багамы", code: "BS", continent: "Северная Америка", status: "признана" },
  { name: "Барбадос", code: "BB", continent: "Северная Америка", status: "признана" },
  { name: "Белиз", code: "BZ", continent: "Северная Америка", status: "признана" },
  { name: "Гаити", code: "HT", continent: "Северная Америка", status: "признана" },
  { name: "Гватемала", code: "GT", continent: "Северная Америка", status: "признана" },
  { name: "Гондурас", code: "HN", continent: "Северная Америка", status: "признана" },
  { name: "Гренада", code: "GD", continent: "Северная Америка", status: "признана" },
  { name: "Доминика", code: "DM", continent: "Северная Америка", status: "признана" },
  { name: "Доминиканская Республика", code: "DO", continent: "Северная Америка", status: "признана" },
  { name: "Канада", code: "CA", continent: "Северная Америка", status: "признана" },
  { name: "Коста-Рика", code: "CR", continent: "Северная Америка", status: "признана" },
  { name: "Куба", code: "CU", continent: "Северная Америка", status: "признана" },
  { name: "Мексика", code: "MX", continent: "Северная Америка", status: "признана" },
  { name: "Никарагуа", code: "NI", continent: "Северная Америка", status: "признана" },
  { name: "Панама", code: "PA", continent: "Северная Америка", status: "признана" },
  { name: "Сальвадор", code: "SV", continent: "Северная Америка", status: "признана" },
  { name: "Сент-Винсент и Гренадины", code: "VC", continent: "Северная Америка", status: "признана" },
  { name: "Сент-Китс и Невис", code: "KN", continent: "Северная Америка", status: "признана" },
  { name: "Сент-Люсия", code: "LC", continent: "Северная Америка", status: "признана" },
  { name: "США", code: "US", continent: "Северная Америка", status: "признана" },
  { name: "Тринидад и Тобаго", code: "TT", continent: "Северная Америка", status: "признана" },
  { name: "Ямайка", code: "JM", continent: "Северная Америка", status: "признана" },
  { name: "Аргентина", code: "AR", continent: "Южная Америка", status: "признана" },
  { name: "Боливия", code: "BO", continent: "Южная Америка", status: "признана" },
  { name: "Бразилия", code: "BR", continent: "Южная Америка", status: "признана" },
  { name: "Венесуэла", code: "VE", continent: "Южная Америка", status: "признана" },
  { name: "Гайана", code: "GY", continent: "Южная Америка", status: "признана" },
  { name: "Колумбия", code: "CO", continent: "Южная Америка", status: "признана" },
  { name: "Парагвай", code: "PY", continent: "Южная Америка", status: "признана" },
  { name: "Перу", code: "PE", continent: "Южная Америка", status: "признана" },
  { name: "Суринам", code: "SR", continent: "Южная Америка", status: "признана" },
  { name: "Уругвай", code: "UY", continent: "Южная Америка", status: "признана" },
  { name: "Чили", code: "CL", continent: "Южная Америка", status: "признана" },
  { name: "Эквадор", code: "EC", continent: "Южная Америка", status: "признана" },
  { name: "Австралия", code: "AU", continent: "Океания", status: "признана" },
  { name: "Вануату", code: "VU", continent: "Океания", status: "признана" },
  { name: "Кирибати", code: "KI", continent: "Океания", status: "признана" },
  { name: "Маршалловы Острова", code: "MH", continent: "Океания", status: "признана" },
  { name: "Микронезия", code: "FM", continent: "Океания", status: "признана" },
  { name: "Науру", code: "NR", continent: "Океания", status: "признана" },
  { name: "Новая Зеландия", code: "NZ", continent: "Океания", status: "признана" },
  { name: "Палау", code: "PW", continent: "Океания", status: "признана" },
  { name: "Папуа-Новая Гвинея", code: "PG", continent: "Океания", status: "признана" },
  { name: "Самоа", code: "WS", continent: "Океания", status: "признана" },
  { name: "Соломоновы Острова", code: "SB", continent: "Океания", status: "признана" },
  { name: "Тонга", code: "TO", continent: "Океания", status: "признана" },
  { name: "Тувалу", code: "TV", continent: "Океания", status: "признана" },
  { name: "Фиджи", code: "FJ", continent: "Океания", status: "признана" },
];

const CONTINENTS = ["Все", ...Array.from(new Set(COUNTRIES.map((c) => c.continent)))];

const authFetch = (path, body) =>
  fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify(body),
  }).then((r) => r.json());

function AuthScreen({ onAuthed }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const data = await authFetch("signup", { email, password });
        if (data.error_description || data.msg) throw new Error(data.error_description || data.msg);
        if (data.access_token) {
          onAuthed({ token: data.access_token, id: data.user.id, email: data.user.email });
        } else {
          setError("Аккаунт создан. Теперь войди по почте и паролю.");
          setMode("login");
        }
      } else {
        const data = await authFetch("token?grant_type=password", { email, password });
        if (data.error_description || data.msg) throw new Error(data.error_description || data.msg);
        onAuthed({ token: data.access_token, id: data.user.id, email: data.user.email });
      }
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Не удалось связаться с сервером. Проверь Project URL и ключ в коде, и что в Supabase включён доступ по email (шаг с Confirm email)."
          : err.message || "Что-то пошло не так"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#16233F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "-apple-system, Inter, sans-serif",
        padding: "16px 16px 40px",
      }}
    >
      <div style={{ background: "#FFFDF8", borderRadius: 16, padding: 32, width: "100%", maxWidth: 360 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <ScrollText size={20} color="#C9A24B" />
          <span style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8B8778" }}>
            Мой паспорт мира
          </span>
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 24, margin: "6px 0 20px", color: "#1B2A44" }}>
          {mode === "login" ? "Вход" : "Регистрация"}
        </h1>

        <div>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <Mail size={15} color="#8B8778" style={{ position: "absolute", left: 12, top: 13 }} />
            <input
              type="email"
              placeholder="Почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              style={{
                width: "100%",
                padding: "11px 12px 11px 34px",
                borderRadius: 8,
                border: "1px solid #D9D2BC",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <KeyRound size={15} color="#8B8778" style={{ position: "absolute", left: 12, top: 13 }} />
            <input
              type="password"
              placeholder="Пароль (минимум 6 символов)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              style={{
                width: "100%",
                padding: "11px 12px 11px 34px",
                borderRadius: 8,
                border: "1px solid #D9D2BC",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div style={{ background: "#FBEAE6", color: "#A6382C", fontSize: 12.5, padding: "8px 10px", borderRadius: 6, marginBottom: 12 }}>
              {error}
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading || !email || password.length < 6}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 8,
              border: "none",
              background: "#16233F",
              color: "#F6F1E4",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              opacity: loading || !email || password.length < 6 ? 0.6 : 1,
            }}
          >
            {loading ? "Секунду..." : mode === "login" ? "Войти" : "Создать аккаунт"}
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#8B8778", marginTop: 16 }}>
          {mode === "login" ? "Ещё нет аккаунта?" : "Уже есть аккаунт?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
            style={{ background: "none", border: "none", color: "#A6382C", cursor: "pointer", fontWeight: 600, fontSize: 13 }}
          >
            {mode === "login" ? "Зарегистрироваться" : "Войти"}
          </button>
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 360, marginTop: 20 }}>
        <div style={{ background: "#1F304F", border: "1px solid #33456B", borderRadius: 12, padding: 18, marginBottom: 8 }}>
          <div style={{ color: "#C9A24B", fontWeight: 700, fontSize: 13.5, marginBottom: 6 }}>Подписка «Паспорт+» — 599 ₽ / месяц</div>
          <div style={{ color: "#C9C2AE", fontSize: 12.5, lineHeight: 1.5 }}>
            Полные справочные материалы по визам, ВНЖ, ПМЖ, гражданству и подборка юристов по всем доступным странам. Продлевается автоматически, отменить можно в любой момент.
          </div>
        </div>
        <div style={{ background: "#1F304F", border: "1px solid #33456B", borderRadius: 12, padding: 18 }}>
          <div style={{ color: "#C9A24B", fontWeight: 700, fontSize: 13.5, marginBottom: 6 }}>Доступ к одной стране — 299 ₽</div>
          <div style={{ color: "#C9C2AE", fontSize: 12.5, lineHeight: 1.5 }}>
            Разовая покупка без подписки: полные материалы по одной выбранной стране, доступ навсегда.
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 11.5, color: "#7C87A0", marginTop: 14 }}>
          <a href="/oferta" style={{ color: "#9AA3B8" }}>Публичная оферта</a> · <a href="/contacts" style={{ color: "#9AA3B8" }}>Контакты и реквизиты</a>
        </p>
      </div>
    </div>
  );
}

export default function CountryTracker() {
  const [user, setUser] = useState(null);
  const [visited, setVisited] = useState(new Set());
  const [query, setQuery] = useState("");
  const [continent, setContinent] = useState("Все");
  const [onlyReady, setOnlyReady] = useState(false);
  const [devUnlocked, setDevUnlocked] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [purchasedCountries, setPurchasedCountries] = useState(new Set());
  const [payLoading, setPayLoading] = useState(false);
  const [activeCountry, setActiveCountry] = useState(null);
  const [activeTab, setActiveTab] = useState("vnj");
  const [showPaywall, setShowPaywall] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`${SUPABASE_URL}/rest/v1/visited_countries?select=country_code`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then((rows) => {
        if (Array.isArray(rows)) setVisited(new Set(rows.map((r) => r.country_code)));
      });

    fetch(`${SUPABASE_URL}/rest/v1/subscriptions?select=status,current_period_end`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then((rows) => {
        if (Array.isArray(rows) && rows[0]) {
          const active = rows[0].status === "active" && new Date(rows[0].current_period_end) > new Date();
          setHasSubscription(active);
        }
      });

    fetch(`${SUPABASE_URL}/rest/v1/country_purchases?select=country_code`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then((rows) => {
        if (Array.isArray(rows)) setPurchasedCountries(new Set(rows.map((r) => r.country_code)));
      });
  }, [user]);

  const pay = async (type, countryCode) => {
    setPayLoading(true);
    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ type, countryCode }),
      });
      const data = await res.json();
      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
      } else {
        alert(data.error || "Не удалось создать платёж");
      }
    } catch (e) {
      alert("Ошибка соединения с сервером оплаты");
    } finally {
      setPayLoading(false);
    }
  };

  const toggleVisited = async (code) => {
    if (!user) return;
    const isVisited = visited.has(code);
    setSyncing(true);
    setVisited((prev) => {
      const next = new Set(prev);
      isVisited ? next.delete(code) : next.add(code);
      return next;
    });
    try {
      if (isVisited) {
        await fetch(
          `${SUPABASE_URL}/rest/v1/visited_countries?country_code=eq.${code}&user_id=eq.${user.id}`,
          { method: "DELETE", headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${user.token}` } }
        );
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/visited_countries`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${user.token}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ user_id: user.id, country_code: code }),
        });
      }
    } finally {
      setSyncing(false);
    }
  };

  const filtered = useMemo(() => {
    return COUNTRIES.filter((c) => {
      const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase());
      const matchesContinent = continent === "Все" || c.continent === continent;
      const matchesReady = !onlyReady || c.ready;
      return matchesQuery && matchesContinent && matchesReady;
    });
  }, [query, continent, onlyReady]);

  const percent = Math.round((visited.size / COUNTRIES.length) * 100);

  if (!user) {
    return <AuthScreen onAuthed={setUser} />;
  }

  return (
    <div style={{ fontFamily: "-apple-system, Inter, sans-serif", background: "#F6F1E4", minHeight: "100vh", color: "#1B2A44" }}>
      <style>{`
        @keyframes stampIn {
          0% { transform: scale(2.4) rotate(-14deg); opacity: 0; }
          60% { transform: scale(0.9) rotate(-8deg); opacity: 1; }
          100% { transform: scale(1) rotate(-8deg); opacity: 1; }
        }
        .stamp { animation: stampIn 0.35s ease-out; }
        .country-card { transition: border-color 0.15s ease, transform 0.15s ease; }
        .country-card:hover { transform: translateY(-2px); }
      `}</style>

      <header style={{ background: "#16233F", color: "#F6F1E4", padding: "2rem 1.5rem 2.5rem" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <ScrollText size={22} color="#C9A24B" />
              <span style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C9A24B" }}>
                Мой паспорт мира
              </span>
            </div>
            <button
              onClick={() => setUser(null)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #33456B", color: "#C9C2AE", borderRadius: 8, padding: "6px 12px", fontSize: 12.5, cursor: "pointer" }}
            >
              <LogOut size={13} /> {user.email}
            </button>
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 34, fontWeight: 700, margin: "6px 0 8px", lineHeight: 1.15 }}>
            Отмечай страны, которые повидал
          </h1>
          <p style={{ fontSize: 14, color: "#C9C2AE", maxWidth: 520, lineHeight: 1.6, margin: "0 0 22px" }}>
            Отметки сохраняются в твоём аккаунте и никуда не пропадут.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div style={{ background: "#1F304F", border: "1px solid #33456B", borderRadius: 10, padding: "10px 16px", minWidth: 120 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#C9A24B" }}>{visited.size}</div>
              <div style={{ fontSize: 12, color: "#9AA3B8" }}>стран посещено</div>
            </div>
            <div style={{ background: "#1F304F", border: "1px solid #33456B", borderRadius: 10, padding: "10px 16px", minWidth: 120 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#C9A24B" }}>{percent}%</div>
              <div style={{ fontSize: 12, color: "#9AA3B8" }}>мира открыто</div>
            </div>
            <div style={{ background: "#1F304F", border: "1px solid #33456B", borderRadius: 10, padding: "10px 16px", minWidth: 120 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#C9A24B" }}>{COUNTRIES.length}</div>
              <div style={{ fontSize: 12, color: "#9AA3B8" }}>всего в базе</div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 1.5rem 0" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
          <div style={{ position: "relative", flex: "1 1 220px" }}>
            <Search size={16} color="#8B8778" style={{ position: "absolute", left: 12, top: 12 }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти страну..."
              style={{
                width: "100%",
                padding: "10px 12px 10px 34px",
                borderRadius: 8,
                border: "1px solid #D9D2BC",
                background: "#FFFDF8",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            onClick={() => setShowPaywall(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#A6382C",
              color: "#FBEAE6",
              border: "none",
              borderRadius: 8,
              padding: "10px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Star size={14} /> Подписка
          </button>
          <button
            onClick={() => setDevUnlocked((v) => !v)}
            title="Временный переключатель для проверки платного контента без реальной оплаты"
            style={{
              background: "none",
              border: "1px dashed #C9C2AE",
              color: "#8B8778",
              borderRadius: 8,
              padding: "9px 12px",
              fontSize: 11.5,
              cursor: "pointer",
            }}
          >
            {devUnlocked ? "Демо: платный контент открыт" : "Демо: показать платный контент"}
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
          <button
            onClick={() => setOnlyReady((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid " + (onlyReady ? "#16233F" : "#D9D2BC"),
              background: onlyReady ? "#16233F" : "#FFFDF8",
              color: onlyReady ? "#F6F1E4" : "#5C574A",
              fontSize: 12.5,
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: onlyReady ? "#C9A24B" : "#D9D2BC",
                display: "inline-block",
              }}
            />
            Только готовые страны
          </button>
          <span style={{ fontSize: 11.5, color: "#8B8778" }}>
            {COUNTRIES.filter((c) => c.ready).length} из {COUNTRIES.length} уже оформлены
          </span>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
          {CONTINENTS.map((c) => (
            <button
              key={c}
              onClick={() => setContinent(c)}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                border: "1px solid " + (continent === c ? "#16233F" : "#D9D2BC"),
                background: continent === c ? "#16233F" : "#FFFDF8",
                color: continent === c ? "#F6F1E4" : "#5C574A",
                fontSize: 12.5,
                cursor: "pointer",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 1.5rem 3rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {filtered.map((c) => {
            const isVisited = visited.has(c.code);
            return (
              <div
                key={c.name}
                className="country-card"
                style={{
                  position: "relative",
                  background: "#FFFDF8",
                  border: "1px solid " + (isVisited ? "#C9A24B" : "#E4DDC8"),
                  borderRadius: 12,
                  padding: "14px 14px 12px",
                  cursor: "pointer",
                  overflow: "hidden",
                  opacity: c.ready ? 1 : 0.72,
                }}
                onClick={() => { setActiveCountry(c); setActiveTab("vnj"); }}
              >
                {isVisited && (
                  <div
                    className="stamp"
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      border: "2px solid #A6382C",
                      color: "#A6382C",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: "rotate(-8deg)",
                    }}
                  >
                    <Check size={15} strokeWidth={3} />
                  </div>
                )}
                <div style={{ fontSize: 30, marginBottom: 8 }}>{flag(c.code.slice(0, 2))}</div>
                <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 2 }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color: "#8B8778" }}>{c.continent}</div>
                {c.status !== "признана" && (
                  <div style={{ fontSize: 10.5, color: "#5C7A5E", marginTop: 4 }}>{c.status}</div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVisited(c.code);
                  }}
                  style={{
                    marginTop: 10,
                    width: "100%",
                    padding: "6px 0",
                    fontSize: 12,
                    borderRadius: 6,
                    border: "1px solid " + (isVisited ? "#C9A24B" : "#D9D2BC"),
                    background: isVisited ? "#FBF2DE" : "#F6F1E4",
                    color: "#1B2A44",
                    cursor: "pointer",
                  }}
                >
                  {isVisited ? "Отметить как не посещённую" : "Я тут был"}
                </button>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "#8B8778", marginTop: 40 }}>Ничего не найдено</p>
        )}
      </div>

      {activeCountry && (
        <div
          onClick={() => setActiveCountry(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(22,35,63,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 50 }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#FFFDF8", borderRadius: 16, maxWidth: 480, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: 24, position: "relative" }}>
            <button onClick={() => setActiveCountry(null)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer" }}>
              <X size={18} color="#8B8778" />
            </button>
            <div style={{ fontSize: 46 }}>{flag(activeCountry.code.slice(0, 2))}</div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, margin: "8px 0 4px" }}>{activeCountry.name}</h2>
            <p style={{ fontSize: 13, color: "#8B8778", margin: "0 0 18px" }}>
              {activeCountry.continent} · {activeCountry.status}
            </p>

            {activeCountry.ready && activeCountry.free && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 10, lineHeight: 1.4 }}>
                  {activeCountry.free.line}
                </div>
                <div style={{ fontSize: 12.5, color: "#3D3A30", lineHeight: 1.6, marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>Виза для россиян: </span>
                  {activeCountry.free.visa}
                </div>
                <div style={{ fontSize: 12.5, color: "#3D3A30", lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 600 }}>Двойное гражданство: </span>
                  {activeCountry.free.dual}
                </div>
              </div>
            )}

            {!activeCountry.ready && (
              <p style={{ fontSize: 12.5, color: "#8B8778", marginBottom: 14 }}>
                Подробная информация по этой стране пока готовится.
              </p>
            )}

            {(devUnlocked || hasSubscription || purchasedCountries.has(activeCountry.code)) && activeCountry.ready && activeCountry.paid ? (
              <div>
                <div style={{ display: "flex", gap: 6, marginBottom: 14, borderBottom: "1px solid #E4DDC8" }}>
                  {[
                    { key: "vnj", label: "ВНЖ" },
                    { key: "pmj", label: "ПМЖ" },
                    { key: "grazhdanstvo", label: "Гражданство" },
                    { key: "lawyers", label: "Юристы" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      style={{
                        background: "none",
                        border: "none",
                        borderBottom: "2px solid " + (activeTab === tab.key ? "#A6382C" : "transparent"),
                        color: activeTab === tab.key ? "#16233F" : "#8B8778",
                        fontWeight: activeTab === tab.key ? 700 : 500,
                        fontSize: 12.5,
                        padding: "0 0 8px",
                        cursor: "pointer",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === "lawyers" ? (
                  <div style={{ background: "#F6F1E4", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: "#5C574A", lineHeight: 1.5 }}>
                    {activeCountry.paid.lawyers}
                  </div>
                ) : (
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 8, color: "#16233F" }}>
                      {activeCountry.paid[activeTab].title}
                    </div>
                    <ul style={{ fontSize: 12.5, color: "#3D3A30", lineHeight: 1.65, paddingLeft: 18, marginTop: 0, marginBottom: 0 }}>
                      {activeCountry.paid[activeTab].points.map((p, i) => (
                        <li key={i} style={{ marginBottom: 4 }}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #E4DDC8", fontSize: 10.5, color: "#A39D8A", lineHeight: 1.5 }}>
                  Информация носит справочный характер и не является юридической консультацией. Условия программ могут меняться. Перед принятием решений рекомендуем проверять актуальные требования в официальных источниках страны или у практикующего юриста.
                </div>
              </div>
            ) : (
              <>
                <div style={{ background: "#F6F1E4", border: "1px dashed #D9D2BC", borderRadius: 10, padding: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Lock size={18} color="#A6382C" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 4 }}>Доступно по подписке</div>
                    <div style={{ fontSize: 12.5, color: "#5C574A", lineHeight: 1.5 }}>
                      Подробный визовый гид, ВНЖ, ПМЖ, путь к гражданству и проверенные юристы по этой стране.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { setActiveCountry(null); setShowPaywall(true); }}
                  style={{ width: "100%", marginTop: 14, padding: "12px 0", borderRadius: 8, border: "none", background: "#16233F", color: "#F6F1E4", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                >
                  Оформить подписку
                </button>
                {activeCountry.ready && (
                  <button
                    onClick={() => pay("country", activeCountry.code)}
                    disabled={payLoading}
                    style={{ width: "100%", marginTop: 8, padding: "11px 0", borderRadius: 8, border: "1px solid #16233F", background: "none", color: "#16233F", fontSize: 13.5, fontWeight: 600, cursor: payLoading ? "default" : "pointer", opacity: payLoading ? 0.7 : 1 }}
                  >
                    {payLoading ? "Секунду..." : "Купить доступ только к этой стране — 299 ₽"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {showPaywall && (
        <div onClick={() => setShowPaywall(false)} style={{ position: "fixed", inset: 0, background: "rgba(22,35,63,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#16233F", color: "#F6F1E4", borderRadius: 16, maxWidth: 420, width: "100%", padding: 28, position: "relative" }}>
            <button onClick={() => setShowPaywall(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer" }}>
              <X size={18} color="#9AA3B8" />
            </button>
            <Plane size={22} color="#C9A24B" />
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, margin: "10px 0 6px" }}>Подписка «Паспорт+»</h2>
            <p style={{ fontSize: 13, color: "#C9C2AE", lineHeight: 1.6, marginBottom: 18 }}>
              Полные визовые гиды по каждой стране: Шенген, ВНЖ, ПМЖ, гражданство и подборка проверенных юристов для оформления.
            </p>
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
              599 ₽<span style={{ fontSize: 13, fontWeight: 400, color: "#9AA3B8" }}> / месяц</span>
            </div>
            <button
              onClick={() => pay("subscription")}
              disabled={payLoading}
              style={{ width: "100%", marginTop: 14, padding: "12px 0", borderRadius: 8, border: "none", background: "#C9A24B", color: "#16233F", fontSize: 14, fontWeight: 700, cursor: payLoading ? "default" : "pointer", opacity: payLoading ? 0.7 : 1 }}
            >
              {payLoading ? "Секунду..." : "Оформить подписку"}
            </button>
            <p style={{ fontSize: 11, color: "#7C87A0", marginTop: 10, textAlign: "center" }}>
              Оплата через ЮKassa. Списание повторяется каждый месяц, отменить можно в любой момент.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
