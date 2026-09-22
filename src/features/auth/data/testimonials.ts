export interface Testimonial {
  id: string;
  quote: string;
  customerName: string;
  customerLogo: string;
  backgroundImage: string;
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "pasaport-pizza",
    quote:
      "Çok şubeli yapımızda en önemli konu, tüm operasyonu merkezden sağlıklı ve anlık şekilde yönetebilmek. Adisyo sayesinde şubelerimizin verilerine tek panel üzerinden anında ulaşabiliyoruz. Raporlamalarımız artık net, şeffaf ve karşılaştırılabilir. Karar alma süreçlerimiz hızlandı, operasyonel kontrolümüz güçlendi.",
    customerName: "Pasaport Pizza",
    customerLogo: "/images/login/customers/pasaport-pizza.svg",
    backgroundImage: "/images/login/slides/signup-pasaport.webp",
  },
  {
    id: "terra-pizza",
    quote:
      "Franchise yapımızı verimli yönetmek en önemli önceliklerimizden biri. Adisyo sayesinde tüm satış kanallarını ve operasyonları tek panelde toplayarak şubelerimiz için daha sade ve yönetilebilir bir sistem kurduk. Kullanıcı dostu yapısı ve esnek altyapısıyla ekiplerimiz hızlıca adapte oldu, operasyonlarımızda ciddi hız ve pratiklik kazandık. Bugün Adisyo, büyüyen yapımızı aynı standart ve hızda yönetmemizi sağlayan güçlü bir çözüm ortağımız.",
    customerName: "Terra Pizza",
    customerLogo: "/images/login/customers/terra-pizza.svg",
    backgroundImage: "/images/login/slides/signup-terra.webp",
  },
  {
    id: "bulent-borekcilik",
    quote:
      "Şubelerimizde Adisyo'yu devreye aldığımız ilk günden itibaren ekibimiz sistemi neredeyse hiç eğitim almadan kullanmaya başladı. Arayüzün sade ve anlaşılır olması, operasyonumuzun kesintiye uğramamasını sağladı. Yeni personel adaptasyon süresi ciddi şekilde kısaldı. Hızlı, pratik ve zincir yapımıza uygun bir sistem arıyorduk; Adisyo bu beklentimizi fazlasıyla karşıladı.",
    customerName: "Bülent Börekçilik",
    customerLogo: "/images/login/customers/bulent-borek.svg",
    backgroundImage: "/images/login/slides/signup-bulent.webp",
  },
  {
    id: "boston-drink-dessert",
    quote:
      "Yoğun saatlerde sipariş akışını doğru yönetmek bizim için kritik. Adisyo'nun hızlı ve stabil altyapısı, kasa ve sipariş süreçlerinde akışı kesintisiz ilerletiyor. Özellikle yoğun dönemlerde operasyonel rahatlık sağlıyor ve ekip performansını artırıyor. Hızın önemli olduğu konseptimizde, sistemin akıcı çalışması büyük fark yaratıyor.",
    customerName: "Boston Drink & Dessert (Boston DD)",
    customerLogo: "/images/login/customers/boston-drink-dessert.svg",
    backgroundImage: "/images/login/slides/signup-boston.webp",
  },
  {
    id: "tchibo-turkiye",
    quote:
      "Perakende ve yeme-içme operasyonunu birlikte yönettiğimiz yapımızda sistem güvenilirliği ve entegrasyon kabiliyeti önceliğimizdi. Adisyo, süreçlerimizi sadeleştirirken aynı zamanda kurumsal standartlarımızla uyumlu bir altyapı sundu. Teknik tarafta beklentilerimizi karşılayan, ölçeklenebilir ve güvenilir bir çözüm elde ettik. Kurumsal operasyonlarda istikrar sağlayan bir sistemle çalışmak bizim için önemliydi.",
    customerName: "Tchibo Türkiye",
    customerLogo: "/images/login/customers/tchibo-vector.svg",
    backgroundImage: "/images/login/slides/signup-tchibo.webp",
  },
];
