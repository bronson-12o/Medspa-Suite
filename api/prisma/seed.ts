import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data in reverse dependency order for clean seed
  await prisma.kpiEvent.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.leadStage.deleteMany();
  await prisma.leadTag.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.pipelineStage.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.provider.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create campaigns with realistic spend data
  const campaigns = await Promise.all([
    prisma.campaign.create({
      data: {
        name: 'Facebook Botox Campaign',
        platform: 'facebook',
        monthlySpendCents: 250000, // $2,500
      },
    }),
    prisma.campaign.create({
      data: {
        name: 'Google Ads Filler Promo',
        platform: 'google',
        monthlySpendCents: 180000, // $1,800
      },
    }),
    prisma.campaign.create({
      data: {
        name: 'Instagram Rhinoplasty',
        platform: 'instagram',
        monthlySpendCents: 420000, // $4,200
      },
    }),
    prisma.campaign.create({
      data: {
        name: 'Referral Program',
        platform: 'referral',
        monthlySpendCents: 50000, // $500
      },
    }),
  ]);

  console.log(`✅ Created ${campaigns.length} campaigns`);

  // Create pipeline stages
  const pipelineStages = await Promise.all([
    prisma.pipelineStage.create({
      data: { name: 'New', order: 1, color: '#3B82F6' },
    }),
    prisma.pipelineStage.create({
      data: { name: 'Consult Booked', order: 2, color: '#8B5CF6' },
    }),
    prisma.pipelineStage.create({
      data: { name: 'Consult Show', order: 3, color: '#F59E0B' },
    }),
    prisma.pipelineStage.create({
      data: { name: 'Paid', order: 4, color: '#10B981' },
    }),
  ]);

  console.log(`✅ Created ${pipelineStages.length} pipeline stages`);

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({
      data: { name: 'High Value', color: '#EF4444' },
    }),
    prisma.tag.create({
      data: { name: 'Repeat Customer', color: '#10B981' },
    }),
    prisma.tag.create({
      data: { name: 'Referral', color: '#8B5CF6' },
    }),
  ]);

  console.log(`✅ Created ${tags.length} tags`);

  // Base date for consistent timestamps (7 days ago to now)
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 7);

  // Helper to generate dates spread across the 7-day period
  const getRandomDateInRange = (daysOffset: number = 0) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + Math.floor(Math.random() * 7) + daysOffset);
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    return date;
  };

  // Create leads with spread-out creation dates
  const leads = await Promise.all([
    // Facebook Botox Campaign leads
    prisma.lead.create({
      data: {
        firstName: 'Sarah',
        email: 'sarah.johnson@email.com',
        phone: '+1234567890',
        source: 'facebook',
        campaignId: campaigns[0].id,
        adPlatform: 'facebook',
        stageId: pipelineStages[0].id, // New
        createdAt: getRandomDateInRange(-2),
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Emma',
        email: 'emma.davis@email.com',
        phone: '+1234567891',
        source: 'facebook',
        campaignId: campaigns[0].id,
        adPlatform: 'facebook',
        stageId: pipelineStages[0].id, // New
        createdAt: getRandomDateInRange(-1),
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Jessica',
        email: 'jessica.wilson@email.com',
        phone: '+1234567892',
        source: 'facebook',
        campaignId: campaigns[0].id,
        adPlatform: 'facebook',
        stageId: pipelineStages[0].id, // New
        createdAt: getRandomDateInRange(),
      },
    }),
    // Google Ads Filler leads
    prisma.lead.create({
      data: {
        firstName: 'Michael',
        email: 'michael.brown@email.com',
        phone: '+1234567893',
        source: 'google',
        campaignId: campaigns[1].id,
        adPlatform: 'google',
        stageId: pipelineStages[0].id, // New
        createdAt: getRandomDateInRange(-3),
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Ashley',
        email: 'ashley.miller@email.com',
        phone: '+1234567894',
        source: 'google',
        campaignId: campaigns[1].id,
        adPlatform: 'google',
        stageId: pipelineStages[0].id, // New
        createdAt: getRandomDateInRange(-1),
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'David',
        email: 'david.garcia@email.com',
        phone: '+1234567895',
        source: 'google',
        campaignId: campaigns[1].id,
        adPlatform: 'google',
        stageId: pipelineStages[0].id, // New
        createdAt: getRandomDateInRange(),
      },
    }),
    // Instagram Rhinoplasty leads
    prisma.lead.create({
      data: {
        firstName: 'Madison',
        email: 'madison.rodriguez@email.com',
        phone: '+1234567896',
        source: 'instagram',
        campaignId: campaigns[2].id,
        adPlatform: 'instagram',
        stageId: pipelineStages[0].id, // New
        createdAt: getRandomDateInRange(-4),
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Tyler',
        email: 'tyler.martinez@email.com',
        phone: '+1234567897',
        source: 'instagram',
        campaignId: campaigns[2].id,
        adPlatform: 'instagram',
        stageId: pipelineStages[0].id, // New
        createdAt: getRandomDateInRange(-2),
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Samantha',
        email: 'samantha.anderson@email.com',
        phone: '+1234567898',
        source: 'instagram',
        campaignId: campaigns[2].id,
        adPlatform: 'instagram',
        stageId: pipelineStages[0].id, // New
        createdAt: getRandomDateInRange(),
      },
    }),
    // Referral leads
    prisma.lead.create({
      data: {
        firstName: 'Christopher',
        email: 'christopher.thomas@email.com',
        phone: '+1234567899',
        source: 'referral',
        campaignId: campaigns[3].id,
        stageId: pipelineStages[0].id, // New
        createdAt: getRandomDateInRange(-5),
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Amanda',
        email: 'amanda.jackson@email.com',
        phone: '+1234567800',
        source: 'referral',
        campaignId: campaigns[3].id,
        stageId: pipelineStages[0].id, // New
        createdAt: getRandomDateInRange(-3),
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Brandon',
        email: 'brandon.white@email.com',
        phone: '+1234567801',
        source: 'referral',
        campaignId: campaigns[3].id,
        stageId: pipelineStages[0].id, // New
        createdAt: getRandomDateInRange(-1),
      },
    }),
  ]);

  console.log(`✅ Created ${leads.length} leads`);

  // Create KPI events with timestamps spread across multiple days
  // This validates the end-exclusive report logic
  const kpiEvents = [];
  
  for (const lead of leads) {
    // Each lead gets an ad click event
    kpiEvents.push(
      prisma.kpiEvent.create({
        data: {
          leadId: lead.id,
          kind: 'ad_click',
          occurredAt: getRandomDateInRange(-6),
          metadataJson: { source: lead.source, campaign: lead.campaignId },
        },
      })
    );

    // 70% chance of consultation booked
    if (Math.random() > 0.3) {
      kpiEvents.push(
        prisma.kpiEvent.create({
          data: {
            leadId: lead.id,
            kind: 'consult_booked',
            occurredAt: getRandomDateInRange(-4),
            metadataJson: { bookedBy: 'website_form' },
          },
        })
      );

      // 80% chance of showing up if booked
      if (Math.random() > 0.2) {
        kpiEvents.push(
          prisma.kpiEvent.create({
            data: {
              leadId: lead.id,
              kind: 'consult_show',
              occurredAt: getRandomDateInRange(-2),
              metadataJson: { duration_minutes: Math.floor(Math.random() * 60) + 30 },
            },
          })
        );

        // 60% chance of payment if they showed
        if (Math.random() > 0.4) {
          const procedureValues = [45000, 65000, 125000, 235000, 850000]; // $450, $650, $1250, $2350, $8500
          kpiEvents.push(
            prisma.kpiEvent.create({
              data: {
                leadId: lead.id,
                kind: 'invoice_paid',
                valueCents: procedureValues[Math.floor(Math.random() * procedureValues.length)],
                occurredAt: getRandomDateInRange(),
                metadataJson: { 
                  procedure: ['Botox', 'Filler', 'Laser', 'Rhinoplasty', 'BBL'][Math.floor(Math.random() * 5)],
                  payment_method: 'card'
                },
              },
            })
          );
        }
      }
    }
  }

  await Promise.all(kpiEvents);
  console.log(`✅ Created ${kpiEvents.length} KPI events`);

  // Create some opportunities
  const highValueLeads = leads.slice(0, 4);
  const opportunities = await Promise.all(
    highValueLeads.map(lead =>
      prisma.opportunity.create({
        data: {
          leadId: lead.id,
          expectedValueCents: Math.floor(Math.random() * 500000) + 100000, // $1k-$6k
          procedureCode: ['BTX', 'FILLER', 'LASER', 'RHINO'][Math.floor(Math.random() * 4)],
          expectedDate: getRandomDateInRange(7), // Future dates
        },
      })
    )
  );

  console.log(`✅ Created ${opportunities.length} opportunities`);

  // Add some lead tags
  const leadTags = await Promise.all([
    prisma.leadTag.create({
      data: { leadId: leads[0].id, tagId: tags[0].id }, // High Value
    }),
    prisma.leadTag.create({
      data: { leadId: leads[1].id, tagId: tags[1].id }, // Repeat Customer
    }),
    prisma.leadTag.create({
      data: { leadId: leads[9].id, tagId: tags[2].id }, // Referral
    }),
    prisma.leadTag.create({
      data: { leadId: leads[10].id, tagId: tags[2].id }, // Referral
    }),
  ]);

  console.log(`✅ Created ${leadTags.length} lead tags`);

  // Add lead stages for tracking and update current stages
  const leadStages = await Promise.all([
    prisma.leadStage.create({
      data: {
        leadId: leads[0].id,
        stageId: pipelineStages[3].id, // Paid
        changedAt: getRandomDateInRange(-1),
      },
    }),
    prisma.leadStage.create({
      data: {
        leadId: leads[1].id,
        stageId: pipelineStages[2].id, // Consult Show
        changedAt: getRandomDateInRange(-2),
      },
    }),
    prisma.leadStage.create({
      data: {
        leadId: leads[2].id,
        stageId: pipelineStages[1].id, // Consult Booked
        changedAt: getRandomDateInRange(-1),
      },
    }),
  ]);

  // Update current stage for some leads to show progression
  await Promise.all([
    prisma.lead.update({
      where: { id: leads[0].id },
      data: { stageId: pipelineStages[3].id }, // Paid
    }),
    prisma.lead.update({
      where: { id: leads[1].id },
      data: { stageId: pipelineStages[2].id }, // Consult Show
    }),
    prisma.lead.update({
      where: { id: leads[2].id },
      data: { stageId: pipelineStages[1].id }, // Consult Booked
    }),
  ]);

  console.log(`✅ Created ${leadStages.length} lead stage assignments`);

  // Create a provider
  const provider = await prisma.provider.create({
    data: {
      name: 'Dr. Sarah Mitchell',
      role: 'surgeon',
    },
  });

  console.log('✅ Created provider');

  console.log('🎉 Database seed completed successfully!');
  console.log(`
📊 Summary:
- ${campaigns.length} campaigns
- ${leads.length} leads  
- ${kpiEvents.length} KPI events spread across 7 days
- ${opportunities.length} opportunities
- ${pipelineStages.length} pipeline stages
- ${tags.length} tags

🧪 Test the seeded data:
API Reports: curl "http://localhost:3001/reports/revenue?from=${baseDate.toISOString().split('T')[0]}&to=${new Date().toISOString().split('T')[0]}"
DB Browser: http://localhost:8081 (after docker compose up)
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
