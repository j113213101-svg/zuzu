import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  await prisma.inquiry.deleteMany();
  await prisma.property.deleteMany();
  await prisma.news.deleteMany();
  await prisma.guide.deleteMany();
  await prisma.review.deleteMany();
  await prisma.agent.deleteMany();

  const password = await bcrypt.hash("zuzu1234", 10);

  const agent1 = await prisma.agent.create({
    data: {
      email: "demo@zuzu.tw",
      password,
      name: "林雅婷",
      phone: "0912-000-000",
      agency: "租租不動產·西屯門市",
      role: "agent",
    },
  });

  const agent2 = await prisma.agent.create({
    data: {
      email: "alex@zuzu.tw",
      password,
      name: "陳彥廷",
      phone: "0933-000-000",
      agency: "租租不動產·北屯門市",
      role: "agent",
    },
  });

  const sampleImgs = (seed: number) => {
    return [
      `https://picsum.photos/seed/zuzu-${seed}-a/1200/900`,
      `https://picsum.photos/seed/zuzu-${seed}-b/1200/900`,
      `https://picsum.photos/seed/zuzu-${seed}-c/1200/900`,
      `https://picsum.photos/seed/zuzu-${seed}-d/1200/900`,
      `https://picsum.photos/seed/zuzu-${seed}-e/1200/900`,
    ].join(",");
  };

  const properties = [
    {
      title: "西屯·逢甲商圈 採光良好 1+1 房",
      district: "西屯區",
      address: "台中市西屯區文華路附近",
      price: 16800,
      layout: "1房1廳1衛",
      area: 9.5,
      floor: "4F/7F",
      propertyType: "獨立套房",
      features: "獨立陽台,有電梯,可開火,近逢甲夜市,管理員",
      description: "步行 3 分鐘到逢甲商圈，採光通透，全新整理。\n含：冷氣、冰箱、洗衣機、熱水器、床、書桌。\n管理費含網路、公共水電。",
      petFriendly: false,
      allowSubsidy: true,
      images: sampleImgs(1),
      agentId: agent1.id,
    },
    {
      title: "北屯·崇德六路 靜巷大面窗 雙人房",
      district: "北屯區",
      address: "台中市北屯區崇德六路附近",
      price: 13500,
      layout: "1房1衛",
      area: 7.2,
      floor: "3F/5F",
      propertyType: "套房",
      features: "大面窗,新家具,近捷運綠線",
      description: "崇德六路靜巷內，週邊生活機能完整。\n走路 6 分鐘到捷運松竹站。",
      petFriendly: true,
      allowSubsidy: true,
      images: sampleImgs(2),
      agentId: agent1.id,
    },
    {
      title: "南屯·向上路精品質感 2 房",
      district: "南屯區",
      address: "台中市南屯區向上路附近",
      price: 28000,
      layout: "2房1廳2衛",
      area: 22,
      floor: "11F/14F",
      propertyType: "整層",
      features: "景觀陽台,健身房,管理員,雙衛浴",
      description: "向上路豪宅區，全室採光通透。\n社區附設健身房、閱覽室。",
      petFriendly: false,
      allowSubsidy: false,
      images: sampleImgs(3),
      agentId: agent2.id,
    },
    {
      title: "西區·勤美商圈 挑高 loft 單人套房",
      district: "西區",
      address: "台中市西區向上北路附近",
      price: 14500,
      layout: "1房1衛",
      area: 8,
      floor: "5F/5F",
      propertyType: "獨立套房",
      features: "挑高,loft,可開火,近勤美誠品",
      description: "勤美商圈核心地段，挑高設計，二樓夾層做睡眠區。",
      petFriendly: true,
      allowSubsidy: true,
      images: sampleImgs(4),
      agentId: agent2.id,
    },
    {
      title: "北區·一中商圈 學生首選 小資套房",
      district: "北區",
      address: "台中市北區一中街附近",
      price: 8800,
      layout: "1房1衛",
      area: 5.5,
      floor: "2F/5F",
      propertyType: "套房",
      features: "近中友,近中國醫,有電梯",
      description: "一中街後巷，學生首選，含水電網路。",
      petFriendly: false,
      allowSubsidy: true,
      images: sampleImgs(5),
      agentId: agent1.id,
    },
    {
      title: "東區·大慶車站旁 2 房近市區",
      district: "東區",
      address: "台中市東區進化路附近",
      price: 19500,
      layout: "2房1廳1衛",
      area: 15,
      floor: "3F/5F",
      propertyType: "公寓",
      features: "近大慶車站,雙陽台,可開火",
      description: "走路 5 分鐘到大慶車站，通勤 Taipei 超方便。",
      petFriendly: true,
      allowSubsidy: true,
      images: sampleImgs(6),
      agentId: agent1.id,
    },
  ];

  function slugify(s: string, i: number) {
    return (
      s
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50) + "-" + i
    );
  }

  for (const [i, p] of properties.entries()) {
    const tier = p.price < 12000 ? "budget" : p.price <= 20000 ? "standard" : "premium";
    await prisma.property.create({
      data: { ...p, slug: slugify(p.title, i), budgetTier: tier },
    });
  }

  await prisma.news.createMany({
    data: [
      {
        title: "租租西屯門市開幕，首月免服務費",
        slug: "xitun-opening",
        excerpt: "西屯新據點正式營業，到店看房即贈搬家折抵券。",
        body: "租租西屯門市於本月正式開幕，作為我們在中台灣的第二個據點，未來將服務逢甲、中科、西屯一帶的租屋需求。\n\n即日起至月底，到店看房的新客戶可領取搬家折抵券一張，使用於合作搬家公司享 500 元折抵。",
        published: true,
      },
      {
        title: "2026 租屋補貼擴大，單身青年加碼 1.2 倍",
        slug: "subsidy-2026",
        excerpt: "今年度租屋補貼新制上路，20–40 歲青年可享加碼。",
        body: "營建署公布 2026 年度住宅租金補貼新制，20–40 歲青年戶基本補助加碼 1.2 倍。\n\n租租可協助整理申請文件，並陪同房東簽署同意書。",
        published: true,
      },
      {
        title: "與台中在地搬家品牌『好搬』聯名合作",
        slug: "partner-hoban",
        excerpt: "透過租租媒合的房客，使用好搬搬家享 85 折。",
        body: "即日起，透過租租成功租賃的房客，預約好搬搬家皆可享 85 折專屬優惠。搬家當天租租顧問陪同現場。",
        published: true,
      },
    ],
  });

  await prisma.guide.createMany({
    data: [
      {
        title: "第一次租屋該注意什麼？",
        slug: "first-time-renter",
        category: "新手入門",
        body: "第一次找房最怕遇到雷房東。建議從以下幾點檢查：\n\n1. 確認房東本人身分（身分證、所有權狀）\n2. 現場看屋，確認水壓、電源、網路訊號\n3. 詳讀合約，特別是違約金條款\n4. 家具家電清單拍照存證\n5. 押金不得超過兩個月租金",
        published: true,
      },
      {
        title: "租金補貼完整攻略：誰可以申請、怎麼申請",
        slug: "subsidy-complete-guide",
        category: "補助指南",
        body: "租金補貼由內政部營建署主辦，符合條件的家戶每月可領 3,200–8,000 元不等。\n\n申請條件：\n- 中華民國國民\n- 家庭年所得低於當地 50% 分位點\n- 未接受其他政府住宅補貼\n\n申請流程：線上申辦 → 上傳文件 → 審查 → 撥款。",
        published: true,
      },
      {
        title: "看房必帶清單：5 樣東西讓你看出好房子",
        slug: "viewing-checklist",
        category: "看房技巧",
        body: "建議看房時隨身攜帶：\n\n1. 手機手電筒（檢查角落、管線）\n2. 插座測電筆\n3. 捲尺（測量家具擺放）\n4. 筆和筆記本（記錄缺點）\n5. 喝過的寶特瓶（測試水壓）",
        published: true,
      },
      {
        title: "合約重點逐條解析",
        slug: "contract-essentials",
        category: "合約指南",
        body: "租賃合約的關鍵條款：\n- 租期與提前解約條件\n- 押金退還時機\n- 維修責任歸屬\n- 家具家電清單\n- 水電網路費分攤方式\n- 禁止事項（養寵物、轉租等）",
        published: true,
      },
    ],
  });

  await prisma.review.createMany({
    data: [
      {
        tenantName: "Celine 王",
        rating: 5,
        quote: "顧問超有耐心，幫我從 8 間房選到現在最滿意的一間。搬家當天還陪我對水電點交。",
        location: "西屯區",
        approved: true,
      },
      {
        tenantName: "David L.",
        rating: 5,
        quote: "第一次自己在外租屋，補助申請都是租租幫忙整理文件。省下很多時間。",
        location: "北區",
        approved: true,
      },
      {
        tenantName: "Jenny 陳",
        rating: 4,
        quote: "推薦的房源都在預算內，實際看屋跟照片一致沒有落差。",
        location: "南屯區",
        approved: true,
      },
      {
        tenantName: "Ryan 黃",
        rating: 5,
        quote: "帶寵物找房很困難，但租租顧問挑了三間可養貓的，都很合適。",
        location: "東區",
        approved: true,
      },
    ],
  });

  console.log("Seed done.");
  console.log("Demo login: demo@zuzu.tw / zuzu1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
