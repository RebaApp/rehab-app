const prisma = require('./utils/prisma');

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create center types
  const centerTypes = await Promise.all([
    prisma.centerType.upsert({
      where: { name: 'Алкогольная зависимость' },
      update: {},
      create: { name: 'Алкогольная зависимость' }
    }),
    prisma.centerType.upsert({
      where: { name: 'Наркотическая зависимость' },
      update: {},
      create: { name: 'Наркотическая зависимость' }
    }),
    prisma.centerType.upsert({
      where: { name: 'Игровая зависимость' },
      update: {},
      create: { name: 'Игровая зависимость' }
    }),
    prisma.centerType.upsert({
      where: { name: 'Пищевая зависимость' },
      update: {},
      create: { name: 'Пищевая зависимость' }
    })
  ]);

  console.log('✅ Center types created');

  // Create services
  const services = await Promise.all([
    prisma.service.upsert({
      where: { name: 'Консультация' },
      update: {},
      create: { name: 'Консультация' }
    }),
    prisma.service.upsert({
      where: { name: 'Детокс' },
      update: {},
      create: { name: 'Детокс' }
    }),
    prisma.service.upsert({
      where: { name: 'Реабилитация' },
      update: {},
      create: { name: 'Реабилитация' }
    }),
    prisma.service.upsert({
      where: { name: 'Ресоциализация' },
      update: {},
      create: { name: 'Ресоциализация' }
    }),
    prisma.service.upsert({
      where: { name: 'Поддержка семьи' },
      update: {},
      create: { name: 'Поддержка семьи' }
    })
  ]);

  console.log('✅ Services created');

  // Create methods
  const methods = await Promise.all([
    prisma.method.upsert({
      where: { name: '12 шагов' },
      update: {},
      create: { name: '12 шагов' }
    }),
    prisma.method.upsert({
      where: { name: 'Когнитивно-поведенческая терапия' },
      update: {},
      create: { name: 'Когнитивно-поведенческая терапия' }
    }),
    prisma.method.upsert({
      where: { name: 'Арт-терапия' },
      update: {},
      create: { name: 'Арт-терапия' }
    }),
    prisma.method.upsert({
      where: { name: 'Спортивная терапия' },
      update: {},
      create: { name: 'Спортивная терапия' }
    }),
    prisma.method.upsert({
      where: { name: 'Групповая терапия' },
      update: {},
      create: { name: 'Групповая терапия' }
    })
  ]);

  console.log('✅ Methods created');

  // Create sample articles
  const articles = [
    {
      title: 'Как выбрать центр реабилитации',
      content: 'Выбор центра реабилитации - это важный шаг на пути к выздоровлению. В этой статье мы расскажем, на что обратить внимание при выборе центра...',
      excerpt: 'Руководство по выбору подходящего центра реабилитации',
      image: 'https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=Выбор+центра',
      author: 'Доктор Иванов'
    },
    {
      title: 'Этапы реабилитации',
      content: 'Реабилитация - это длительный процесс, который включает несколько этапов. Каждый этап важен для успешного выздоровления...',
      excerpt: 'Подробное описание всех этапов реабилитационного процесса',
      image: 'https://via.placeholder.com/800x400/50C878/FFFFFF?text=Этапы+реабилитации',
      author: 'Психолог Петрова'
    },
    {
      title: 'Поддержка семьи в процессе реабилитации',
      content: 'Семья играет важную роль в процессе реабилитации. В этой статье мы расскажем, как семья может помочь близкому человеку...',
      excerpt: 'Роль семьи в успешной реабилитации зависимого',
      image: 'https://via.placeholder.com/800x400/FF6B6B/FFFFFF?text=Поддержка+семьи',
      author: 'Семейный терапевт Сидорова'
    }
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { title: article.title },
      update: {},
      create: article
    });
  }

  console.log('✅ Articles created');

  // Create sample centers
  const centers = [
    {
      name: 'Центр "Новая жизнь"',
      city: 'Москва',
      address: 'ул. Тверская, 15',
      description: 'Профессиональный центр реабилитации с многолетним опытом работы',
      descriptionShort: 'Профессиональная помощь в борьбе с зависимостями',
      phone: '+7 (495) 123-45-67',
      email: 'info@newlife.ru',
      website: 'https://newlife.ru',
      workingHours: 'Пн-Вс: 9:00-21:00',
      capacity: 50,
      yearFounded: 2010,
      license: 'ЛО-77-01-123456',
      verified: true,
      verifiedUntil: '2025-12-31',
      price: '25 000 ₽/месяц',
      coordinates: JSON.stringify({ latitude: 55.7558, longitude: 37.6176 }),
      types: ['Алкогольная зависимость', 'Наркотическая зависимость'],
      services: ['Консультация', 'Детокс', 'Реабилитация'],
      methods: ['12 шагов', 'Когнитивно-поведенческая терапия']
    },
    {
      name: 'Клиника "Возрождение"',
      city: 'Санкт-Петербург',
      address: 'Невский проспект, 100',
      description: 'Современная клиника с инновационными методами лечения',
      descriptionShort: 'Инновационные методы лечения зависимостей',
      phone: '+7 (812) 234-56-78',
      email: 'info@vozrozhdenie.spb.ru',
      website: 'https://vozrozhdenie.spb.ru',
      workingHours: 'Пн-Пт: 8:00-20:00, Сб-Вс: 9:00-18:00',
      capacity: 30,
      yearFounded: 2015,
      license: 'ЛО-78-01-234567',
      verified: true,
      verifiedUntil: '2025-06-30',
      price: '35 000 ₽/месяц',
      coordinates: JSON.stringify({ latitude: 59.9311, longitude: 30.3609 }),
      types: ['Алкогольная зависимость', 'Игровая зависимость'],
      services: ['Консультация', 'Реабилитация', 'Ресоциализация'],
      methods: ['Арт-терапия', 'Спортивная терапия', 'Групповая терапия']
    }
  ];

  for (const centerData of centers) {
    const { types, services, methods, ...centerInfo } = centerData;
    
    const center = await prisma.center.create({
      data: {
        ...centerInfo,
        types: {
          connect: types.map(name => ({ name }))
        },
        services: {
          connect: services.map(name => ({ name }))
        },
        methods: {
          connect: methods.map(name => ({ name }))
        }
      }
    });

    // Add photos for each center
    await prisma.photo.createMany({
      data: [
        {
          centerId: center.id,
          url: 'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Центр+1',
          alt: 'Главное здание центра'
        },
        {
          centerId: center.id,
          url: 'https://via.placeholder.com/800x600/50C878/FFFFFF?text=Территория',
          alt: 'Территория центра'
        },
        {
          centerId: center.id,
          url: 'https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Палаты',
          alt: 'Палаты для пациентов'
        }
      ]
    });
  }

  console.log('✅ Sample centers created');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
