// prisma/seed.ts
// Run: npx ts-node prisma/seed.ts
// or:  npx prisma db seed (if configured in package.json)
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Jabiyehome database...");

  // ─── Admin user ────────────────────────────────────────────────────────────
  const adminPassword = await hash("Admin@Jabiyehome1!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@Jabiyehome.com" },
    update: {},
    create: {
      email: "admin@Jabiyehome.com",
      name: "Jabiyehome Admin",
      passwordHash: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Admin user:", admin.email);

  // ─── Brands ────────────────────────────────────────────────────────────────
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: "proshield" },
      update: {},
      create: { name: "ProShield", slug: "proshield", description: "Professional-grade outdoor security cameras" },
    }),
    prisma.brand.upsert({
      where: { slug: "smartguard" },
      update: {},
      create: { name: "SmartGuard", slug: "smartguard", description: "Wireless alarm systems and sensors" },
    }),
    prisma.brand.upsert({
      where: { slug: "nexlock" },
      update: {},
      create: { name: "NexLock", slug: "nexlock", description: "Smart locks and access control" },
    }),
    prisma.brand.upsert({
      where: { slug: "visionpro" },
      update: {},
      create: { name: "VisionPro", slug: "visionpro", description: "AI-powered indoor cameras" },
    }),
  ]);
  console.log(`✅ ${brands.length} brands seeded`);

  // ─── Categories (tree) ─────────────────────────────────────────────────────
  const cameras = await prisma.category.upsert({
    where: { slug: "cameras" },
    update: {},
    create: { name: "Security Cameras", slug: "cameras", depth: 0, sortOrder: 1 },
  });
  const alarms = await prisma.category.upsert({
    where: { slug: "alarms" },
    update: {},
    create: { name: "Alarm Systems", slug: "alarms", depth: 0, sortOrder: 2 },
  });
  const smartHome = await prisma.category.upsert({
    where: { slug: "smart-home" },
    update: {},
    create: { name: "Smart Home", slug: "smart-home", depth: 0, sortOrder: 3 },
  });
  const kits = await prisma.category.upsert({
    where: { slug: "kits" },
    update: {},
    create: { name: "Security Kits", slug: "kits", depth: 0, sortOrder: 4 },
  });
  const sensors = await prisma.category.upsert({
    where: { slug: "sensors" },
    update: {},
    create: { name: "Motion Sensors", slug: "sensors", depth: 0, sortOrder: 5 },
  });

  // Subcategories
  await Promise.all([
    prisma.category.upsert({ where: { slug: "cameras/indoor" }, update: {}, create: { name: "Indoor Cameras", slug: "cameras/indoor", parentId: cameras.id, depth: 1, sortOrder: 0 } }),
    prisma.category.upsert({ where: { slug: "cameras/outdoor" }, update: {}, create: { name: "Outdoor Cameras", slug: "cameras/outdoor", parentId: cameras.id, depth: 1, sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: "cameras/4k" }, update: {}, create: { name: "4K Cameras", slug: "cameras/4k", parentId: cameras.id, depth: 1, sortOrder: 2 } }),
    prisma.category.upsert({ where: { slug: "cameras/ai-powered" }, update: {}, create: { name: "AI-Powered Cameras", slug: "cameras/ai-powered", parentId: cameras.id, depth: 1, sortOrder: 3 } }),
    prisma.category.upsert({ where: { slug: "alarms/wireless" }, update: {}, create: { name: "Wireless Alarms", slug: "alarms/wireless", parentId: alarms.id, depth: 1, sortOrder: 0 } }),
    prisma.category.upsert({ where: { slug: "alarms/smart" }, update: {}, create: { name: "Smart Alarms", slug: "alarms/smart", parentId: alarms.id, depth: 1, sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: "smart-home/smart-locks" }, update: {}, create: { name: "Smart Locks", slug: "smart-home/smart-locks", parentId: smartHome.id, depth: 1, sortOrder: 0 } }),
    prisma.category.upsert({ where: { slug: "smart-home/smart-thermostats" }, update: {}, create: { name: "Smart Thermostats", slug: "smart-home/smart-thermostats", parentId: smartHome.id, depth: 1, sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: "kits/starter" }, update: {}, create: { name: "Starter Kits", slug: "kits/starter", parentId: kits.id, depth: 1, sortOrder: 0 } }),
    prisma.category.upsert({ where: { slug: "kits/family" }, update: {}, create: { name: "Family Kits", slug: "kits/family", parentId: kits.id, depth: 1, sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: "sensors/pir" }, update: {}, create: { name: "PIR Sensors", slug: "sensors/pir", parentId: sensors.id, depth: 1, sortOrder: 0 } }),
    prisma.category.upsert({ where: { slug: "sensors/pet-friendly" }, update: {}, create: { name: "Pet-Friendly Sensors", slug: "sensors/pet-friendly", parentId: sensors.id, depth: 1, sortOrder: 1 } }),
  ]);
  console.log("✅ Categories seeded (5 root, 12 subcategories)");

  // ─── Sample products ───────────────────────────────────────────────────────
  const products = [
    {
      name: "ProShield 4K Outdoor Camera",
      slug: "proshield-4k-outdoor-camera",
      description: "Ultra HD 4K outdoor security camera with AI-powered person and vehicle detection, colour night vision to 30m, and 180-day cloud storage. IP67 rated. WiFi + PoE.",
      shortDesc: "4K AI outdoor camera with colour night vision",
      price: 249.99,
      salePrice: 189.99,
      sku: "PS-4K-OUT-001",
      stock: 42,
      lowStockAlert: 10,
      categoryId: cameras.id,
      brandId: brands[0].id,
      isFeatured: true,
      isPublished: true,
      tags: ["4k", "outdoor", "ai", "night-vision", "ip67"],
      specs: {
        Resolution: "4K Ultra HD (3840×2160)",
        "Night vision": "Colour up to 30m",
        "Field of view": "130° horizontal",
        Connectivity: "WiFi 802.11ac / PoE",
        Storage: "128GB SD + cloud",
        "Weather rating": "IP67",
        Audio: "Two-way with noise cancellation",
      },
    },
    {
      name: "SmartGuard Wireless Alarm Kit",
      slug: "smartguard-wireless-alarm-kit",
      description: "Complete wireless alarm system: hub, 2 PIR sensors, 2 door contacts, 105dB siren, and GSM/WiFi backup. Self-monitor or upgrade to professional monitoring.",
      shortDesc: "Complete wireless alarm with GSM backup",
      price: 349.99,
      sku: "SG-ALARM-KIT-001",
      stock: 18,
      categoryId: alarms.id,
      brandId: brands[1].id,
      isFeatured: true,
      isPublished: true,
      tags: ["wireless", "alarm", "gsm", "kit", "grade-2"],
      specs: {
        Hub: "WiFi + GSM dual-band",
        Siren: "105 dB internal + external",
        "Battery backup": "12h in power cut",
        "Pet immunity": "Up to 25 kg",
        Certification: "Grade 2 EN50131",
      },
    },
    {
      name: "NexLock Pro Smart Door Lock",
      slug: "nexlock-pro-smart-door-lock",
      description: "Fingerprint (0.3s), PIN, RFID, and app access. Auto-lock, tamper alerts, and Works with Matter, Alexa, Google Home, Apple HomeKit.",
      shortDesc: "Fingerprint & app smart lock with auto-lock",
      price: 299.99,
      salePrice: 224.99,
      sku: "NL-PRO-001",
      stock: 31,
      categoryId: smartHome.id,
      brandId: brands[2].id,
      isFeatured: true,
      isPublished: true,
      tags: ["smart-lock", "fingerprint", "rfid", "matter"],
      specs: {
        "Fingerprint speed": "0.3 seconds",
        "Access methods": "Fingerprint, PIN, RFID, app, key",
        Connectivity: "WiFi + Bluetooth",
        "Battery life": "Up to 12 months",
        Compatibility: "Matter, Alexa, Google, HomeKit",
      },
    },
    {
      name: "Family Security Kit — 8-piece",
      slug: "family-security-kit-8-piece",
      description: "Everything a family home needs: 2 ProShield outdoor cameras, 1 VisionPro indoor camera, SmartGuard wireless alarm, 2 motion sensors, NexLock smart lock, and professional installation.",
      shortDesc: "Complete 8-piece home security bundle",
      price: 899.99,
      salePrice: 649.99,
      sku: "KIT-FAM-8PC-001",
      stock: 9,
      lowStockAlert: 5,
      categoryId: kits.id,
      isFeatured: true,
      isPublished: true,
      tags: ["kit", "bundle", "family", "best-value", "installation-included"],
      specs: {
        Cameras: "2× outdoor 4K + 1× indoor PTZ",
        Alarm: "SmartGuard wireless with GSM backup",
        Lock: "NexLock Pro smart lock",
        Sensors: "2× pet-friendly PIR motion sensors",
        Installation: "Professional installation included",
        Support: "12 months premium support",
      },
    },
    {
      name: "VisionPro Indoor PTZ Camera",
      slug: "visionpro-indoor-ptz-camera",
      description: "360° pan-tilt-zoom indoor camera with AI face recognition, 1080p colour night vision, two-way audio, and local + cloud storage. Baby monitor mode included.",
      shortDesc: "360° PTZ indoor camera with AI face recognition",
      price: 149.99,
      sku: "VP-PTZ-INT-001",
      stock: 56,
      categoryId: cameras.id,
      brandId: brands[3].id,
      isPublished: true,
      tags: ["indoor", "ptz", "ai", "baby-monitor"],
      specs: {
        Resolution: "1080p Full HD",
        "Pan/Tilt/Zoom": "360° / 90° / 8×",
        "Night vision": "Colour to 10m",
        Detection: "AI face recognition",
        Audio: "Two-way with active noise filter",
      },
    },
    {
      name: "SmartGuard Pet-Friendly Motion Sensor",
      slug: "smartguard-pet-friendly-motion-sensor",
      description: "Advanced dual-technology PIR sensor that ignores pets up to 25 kg while accurately detecting human intruders. Wireless, 2-year battery life.",
      shortDesc: "Ignores pets up to 25 kg, 2-year battery",
      price: 49.99,
      sku: "SG-PIR-PET-001",
      stock: 120,
      categoryId: sensors.id,
      brandId: brands[1].id,
      isPublished: true,
      tags: ["pir", "pet-friendly", "wireless", "sensor"],
      specs: {
        "Pet immunity": "Up to 25 kg",
        Technology: "Dual PIR + microwave",
        Range: "12m × 90°",
        Battery: "2× AA, up to 2 years",
        Mounting: "Wall or ceiling, 2.1m height",
      },
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        publishedAt: product.isPublished ? new Date() : null,
      },
    });
  }
  console.log(`✅ ${products.length} products seeded`);

  // ─── FAQs ──────────────────────────────────────────────────────────────────
  const faqs = [
    { question: "Do I need professional installation?", answer: "All our wireless systems are designed for DIY installation. Professional installation is available free on orders over $299.", sortOrder: 0 },
    { question: "What happens if my internet goes down?", answer: "Our systems include cellular (GSM) backup. The system automatically switches to the cellular network if your internet fails.", sortOrder: 1 },
    { question: "Can I monitor my cameras when away?", answer: "Yes. The Jabiyehome app gives you live feeds, two-way audio, and instant push notifications from anywhere in the world.", sortOrder: 2 },
    { question: "Are products compatible with Alexa and Google Home?", answer: "All smart home products support the Matter standard and are compatible with Alexa, Google Home, Apple HomeKit, and Samsung SmartThings.", sortOrder: 3 },
    { question: "What's included in your warranty?", answer: "Every product comes with a 2-year manufacturer warranty. Extended 5-year warranties are available at checkout.", sortOrder: 4 },
  ];

  for (const faq of faqs) {
    await prisma.faq.create({ data: faq }).catch(() => {}); // skip if exists
  }
  console.log(`✅ ${faqs.length} FAQs seeded`);

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
