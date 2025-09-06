import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default pipeline stages (name is unique in your schema → ok to upsert)
  const stages = [
    { name: 'New', order: 1, color: '#3B82F6' },
    { name: 'Contacted', order: 2, color: '#F59E0B' },
    { name: 'Consult Booked', order: 3, color: '#8B5CF6' },
    { name: 'Won', order: 4, color: '#10B981' },
    { name: 'Lost', order: 5, color: '#EF4444' },
  ];
  for (const stage of stages) {
    await prisma.pipelineStage.upsert({
      where: { name: stage.name }, // ok: name is unique
      update: { order: stage.order, color: stage.color },
      create: stage,
    });
  }
  console.log('✅ Pipeline stages created');

  // Create default tags (name is unique → ok to upsert)
  const tags = [
    { name: 'Botox', color: '#FF6B6B' },
    { name: 'Filler', color: '#4ECDC4' },
    { name: 'Surgery', color: '#45B7D1' },
    { name: 'Laser', color: '#96CEB4' },
    { name: 'Rhinoplasty', color: '#FFEAA7' },
    { name: 'Breast Augmentation', color: '#DDA0DD' },
    { name: 'Tummy Tuck', color: '#98D8C8' },
    { name: 'Facelift', color: '#F7DC6F' },
  ];
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name }, // ok: name is unique
      update: { color: tag.color },
      create: tag,
    });
  }
  console.log('✅ Tags created');

  // Create sample campaign (name is NOT unique → do find-or-create)
  let campaign = await prisma.campaign.findFirst({
    where: { name: 'Facebook Botox Campaign' },
  });
  if (!campaign) {
    campaign = await prisma.campaign.create({
      data: {
        name: 'Facebook Botox Campaign',
        platform: 'facebook',
        monthlySpendCents: 500000, // $5,000
      },
    });
  }
  console.log('✅ Sample campaign ready');

  // Create sample leads
  const sampleLeads = [
    {
      firstName: 'Sarah',
      email: 'sarah@example.com',
      phone: '+1234567890',
      source: 'facebook',
      campaignId: campaign.id,
      adPlatform: 'facebook',
    },
    {
      firstName: 'Mike',
      email: 'mike@example.com',
      phone: '+1234567891',
      source: 'google',
      campaignId: campaign.id,
      adPlatform: 'google',
    },
    {
      firstName: 'Emma',
      email: 'emma@example.com',
      phone: '+1234567892',
      source: 'referral',
    },
  ];

  for (const leadData of sampleLeads) {
    const lead = await prisma.lead.create({ data: leadData });

    // Initial stage = New
    const newStage = await prisma.pipelineStage.findFirst({ where: { name: 'New' } });
    if (newStage) {
      await prisma.leadStage.create({
        data: { leadId: lead.id, stageId: newStage.id },
      });
    }

    // Add Botox tag if present
    const botoxTag = await prisma.tag.findFirst({ where: { name: 'Botox' } });
    if (botoxTag) {
      // prevent dup on reruns using composite unique (leadId, tagId)
      await prisma.leadTag.upsert({
        where: { 
          leadId_tagId: { 
            leadId: lead.id, 
            tagId: botoxTag.id 
          } 
        },
        update: {},
        create: { leadId: lead.id, tagId: botoxTag.id },
      });
    }

    // Activity
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: 'form_submit',
        payloadJson: {
          source: leadData.source,
          campaign: campaign.name,
        },
      },
    });

    // KPI event
    await prisma.kpiEvent.create({
      data: {
        leadId: lead.id,
        kind: 'ad_click',
        metadataJson: {
          platform: leadData.adPlatform,
          campaign: campaign.name,
        },
      },
    });
  }
  console.log('✅ Sample leads created');

  // Sample opportunities (first two leads)
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'asc' } });
  for (const lead of leads.slice(0, 2)) {
    // unique on leadId in schema → use upsert to be re-run safe
    await prisma.opportunity.upsert({
      where: { leadId: lead.id },
      update: {
        expectedValueCents: 50000,
        procedureCode: 'BTX',
        expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      create: {
        leadId: lead.id,
        expectedValueCents: 50000, // $500
        procedureCode: 'BTX',
        expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }
  console.log('✅ Sample opportunities created');

  // Sample providers (name is NOT unique → do find-or-create)
  const providers = [
    { name: 'Dr. Smith', role: 'surgeon' },
    { name: 'Dr. Johnson', role: 'surgeon' },
    { name: 'Nurse Williams', role: 'nurse' },
  ];
  for (const p of providers) {
    const existing = await prisma.provider.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.provider.create({ data: p });
    }
  }
  console.log('✅ Sample providers created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
