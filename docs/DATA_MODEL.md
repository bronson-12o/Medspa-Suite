# MedSpa Growth Hub - Data Model

## Entity Relationship Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      Lead       │    │      Tag        │    │  PipelineStage  │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ externalId (UK) │    │ name (UK)       │    │ name (UK)       │
│ firstName       │    │ color           │    │ order (UK)      │
│ email           │    │ createdAt       │    │ color           │
│ phone           │    └─────────────────┘    │ createdAt       │
│ source          │           │               └─────────────────┘
│ campaignId (FK) │           │                       │
│ adPlatform      │           │                       │
│ createdAt       │           │                       │
│ updatedAt       │           │                       │
└─────────────────┘           │                       │
         │                    │                       │
         │                    │                       │
         │    ┌─────────────────┐    ┌─────────────────┐
         │    │    LeadTag      │    │    LeadStage    │
         │    ├─────────────────┤    ├─────────────────┤
         │    │ id (PK)         │    │ id (PK)         │
         │    │ leadId (FK)     │    │ leadId (FK)     │
         │    │ tagId (FK)      │    │ stageId (FK)    │
         │    └─────────────────┘    │ changedAt       │
         │                           └─────────────────┘
         │
         │    ┌─────────────────┐    ┌─────────────────┐
         │    │   Opportunity   │    │    Activity     │
         │    ├─────────────────┤    ├─────────────────┤
         │    │ id (PK)         │    │ id (PK)         │
         │    │ leadId (FK,UK)  │    │ leadId (FK)     │
         │    │ expectedValue   │    │ type            │
         │    │ procedureCode   │    │ payloadJson     │
         │    │ expectedDate    │    │ createdAt       │
         │    │ createdAt       │    └─────────────────┘
         │    │ updatedAt       │
         │    └─────────────────┘
         │
         │    ┌─────────────────┐    ┌─────────────────┐
         │    │    Campaign     │    │    KpiEvent     │
         │    ├─────────────────┤    ├─────────────────┤
         │    │ id (PK)         │    │ id (PK)         │
         │    │ name            │    │ leadId (FK)     │
         │    │ platform        │    │ kind            │
         │    │ monthlySpend    │    │ valueCents      │
         │    │ createdAt       │    │ occurredAt      │
         │    │ updatedAt       │    │ metadataJson    │
         │    └─────────────────┘    └─────────────────┘
```

## Table Descriptions

### Lead
**Purpose**: Store lead information (non-PHI only)
**Key Fields**:
- `externalId`: GHL contact ID for sync
- `firstName`: First name only (no last name for privacy)
- `email/phone`: Contact information
- `source`: Lead source (facebook, google, referral, etc.)
- `campaignId`: Associated marketing campaign
- `adPlatform`: Advertising platform used

**Relationships**:
- One-to-many with LeadTag
- One-to-many with LeadStage
- One-to-one with Opportunity
- One-to-many with Activity
- One-to-many with KpiEvent
- Many-to-one with Campaign

### Tag
**Purpose**: Categorize leads by procedure interest
**Key Fields**:
- `name`: Tag name (Botox, Filler, Surgery, etc.)
- `color`: UI color for visualization

**Relationships**:
- Many-to-many with Lead through LeadTag

### LeadTag
**Purpose**: Junction table for Lead-Tag many-to-many relationship
**Key Fields**:
- `leadId`: Foreign key to Lead
- `tagId`: Foreign key to Tag

### PipelineStage
**Purpose**: Define sales pipeline stages
**Key Fields**:
- `name`: Stage name (New, Contacted, Consult Booked, Won, Lost)
- `order`: Display order in pipeline
- `color`: UI color for visualization

**Relationships**:
- One-to-many with LeadStage

### LeadStage
**Purpose**: Track lead progression through pipeline
**Key Fields**:
- `leadId`: Foreign key to Lead
- `stageId`: Foreign key to PipelineStage
- `changedAt`: When stage was changed

**Relationships**:
- Many-to-one with Lead
- Many-to-one with PipelineStage

### Opportunity
**Purpose**: Store expected revenue and procedure details
**Key Fields**:
- `leadId`: Foreign key to Lead (unique)
- `expectedValueCents`: Expected revenue in cents
- `procedureCode`: Procedure type (BTX, FILLER, etc.)
- `expectedDate`: When procedure is expected

**Relationships**:
- One-to-one with Lead

### Activity
**Purpose**: Log all interactions with leads
**Key Fields**:
- `leadId`: Foreign key to Lead
- `type`: Activity type (sms_sent, email_sent, call, etc.)
- `payloadJson`: Flexible data for different activity types
- `createdAt`: When activity occurred

**Relationships**:
- Many-to-one with Lead

### Campaign
**Purpose**: Track marketing campaigns and spend
**Key Fields**:
- `name`: Campaign name
- `platform`: Advertising platform (facebook, google, etc.)
- `monthlySpendCents`: Monthly budget in cents

**Relationships**:
- One-to-many with Lead

### KpiEvent
**Purpose**: Track key performance indicators
**Key Fields**:
- `leadId`: Foreign key to Lead
- `kind`: Event type (ad_click, consult_booked, etc.)
- `valueCents`: Revenue value in cents (for paid events)
- `occurredAt`: When event occurred
- `metadataJson`: Additional event data

**Relationships**:
- Many-to-one with Lead

### Provider
**Purpose**: Store provider information for commission tracking
**Key Fields**:
- `name`: Provider name
- `role`: Provider role (surgeon, nurse, consultant, etc.)

**Relationships**:
- One-to-many with CommissionRule

### CommissionRule
**Purpose**: Define commission rules for providers
**Key Fields**:
- `providerId`: Foreign key to Provider
- `ruleJson`: Flexible rule definition

**Relationships**:
- Many-to-one with Provider

## Data Types and Constraints

### Enums

#### Procedure Codes
```typescript
enum ProcedureCode {
  BTX = 'BTX',           // Botox
  FILLER = 'FILLER',     // Dermal Filler
  LASER = 'LASER',       // Laser Treatment
  RHINO = 'RHINO',       // Rhinoplasty
  BREAST = 'BREAST',     // Breast Augmentation
  TUMMY = 'TUMMY',       // Tummy Tuck
  FACE = 'FACE',         // Facelift
}
```

#### Activity Types
```typescript
enum ActivityType {
  SMS_SENT = 'sms_sent',
  EMAIL_SENT = 'email_sent',
  CALL = 'call',
  FORM_SUBMIT = 'form_submit',
  STAGE_CHANGE = 'stage_change',
  TAG_ADDED = 'tag_added',
}
```

#### KPI Event Types
```typescript
enum KpiEventType {
  AD_CLICK = 'ad_click',
  CONSULT_BOOKED = 'consult_booked',
  CONSULT_SHOW = 'consult_show',
  INVOICE_PAID = 'invoice_paid',
}
```

#### Pipeline Stages
```typescript
enum PipelineStage {
  NEW = 'New',
  CONTACTED = 'Contacted',
  CONSULT_BOOKED = 'Consult Booked',
  WON = 'Won',
  LOST = 'Lost',
}
```

### Constraints

#### Lead
- `externalId` must be unique if provided
- `email` must be valid email format if provided
- `phone` must be valid phone format if provided
- `campaignId` must reference existing campaign if provided

#### LeadTag
- `leadId` and `tagId` combination must be unique
- Both foreign keys must reference existing records

#### LeadStage
- `leadId` and `stageId` must reference existing records
- `changedAt` cannot be in the future

#### Opportunity
- `leadId` must be unique (one opportunity per lead)
- `expectedValueCents` must be positive
- `expectedDate` cannot be in the past

#### Activity
- `type` must be one of the defined activity types
- `payloadJson` must be valid JSON

#### KpiEvent
- `kind` must be one of the defined KPI event types
- `valueCents` must be positive for revenue events
- `occurredAt` cannot be in the future

## Indexes

### Primary Indexes
- All tables have `id` as primary key (CUID)

### Unique Indexes
- `Lead.externalId` (unique)
- `Tag.name` (unique)
- `PipelineStage.name` (unique)
- `PipelineStage.order` (unique)
- `LeadTag(leadId, tagId)` (unique)
- `Opportunity.leadId` (unique)

### Performance Indexes
- `Lead.createdAt` (for date range queries)
- `Lead.source` (for source filtering)
- `Lead.campaignId` (for campaign filtering)
- `LeadStage.changedAt` (for stage history)
- `Activity.createdAt` (for activity history)
- `KpiEvent.occurredAt` (for KPI date ranges)
- `KpiEvent.kind` (for KPI filtering)

## Data Privacy and Security

### PHI Policy
**Allowed Data**:
- First name or initials only
- Email and phone for contact
- Campaign and source information
- Procedure interest tags
- Pipeline stage
- Expected value and procedure codes
- Generic activity logs

**Forbidden Data**:
- Last names or full names
- Medical history or notes
- Identifiable photos
- Consent forms
- Diagnosis information
- Any Protected Health Information (PHI)

### Data Retention
- Lead data: 7 years (business requirement)
- Activity logs: 3 years
- KPI events: 5 years
- Soft deletes for audit trail

### Encryption
- All data encrypted at rest (database level)
- All data encrypted in transit (HTTPS/TLS)
- API keys stored securely
- No plaintext storage of sensitive data

## Migration Strategy

### Initial Migration
1. Create all tables with proper constraints
2. Insert default pipeline stages
3. Insert default tags
4. Create sample data for testing

### Future Migrations
- Add new fields with default values
- Create new indexes for performance
- Add new tables for additional features
- Maintain backward compatibility

## Backup and Recovery

### Backup Strategy
- Daily automated backups
- Point-in-time recovery capability
- Cross-region backup replication
- Regular backup testing

### Recovery Procedures
- Documented recovery processes
- Regular disaster recovery drills
- Data integrity verification
- Minimal downtime objectives
