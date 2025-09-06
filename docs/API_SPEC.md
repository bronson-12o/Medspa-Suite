# MedSpa Growth Hub - API Specification

## Base URL
```
http://localhost:3001 (development)
https://your-api-domain.com (production)
```

## Authentication
All write endpoints require an API key in the `x-api-key` header:
```
x-api-key: your-secure-backend-api-key
```

## Endpoints

### Leads

#### GET /leads
Get all leads with optional filtering.

**Query Parameters:**
- `search` (string, optional): Search by name, email, or phone
- `stageId` (string, optional): Filter by pipeline stage
- `tagIds` (string, optional): Comma-separated tag IDs
- `campaignId` (string, optional): Filter by campaign

**Response:**
```json
[
  {
    "id": "clx1234567890",
    "firstName": "Sarah",
    "email": "sarah@example.com",
    "phone": "+1234567890",
    "source": "facebook",
    "campaignId": "clx0987654321",
    "adPlatform": "facebook",
    "createdAt": "2024-01-15T10:30:00Z",
    "tags": [
      {
        "tag": {
          "id": "clx1111111111",
          "name": "Botox",
          "color": "#FF6B6B"
        }
      }
    ],
    "stages": [
      {
        "stage": {
          "id": "clx2222222222",
          "name": "New",
          "color": "#3B82F6"
        },
        "changedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "opportunity": {
      "id": "clx3333333333",
      "expectedValueCents": 50000,
      "procedureCode": "BTX",
      "expectedDate": "2024-01-22T14:00:00Z"
    },
    "campaign": {
      "id": "clx0987654321",
      "name": "Facebook Botox Campaign"
    },
    "_count": {
      "activities": 3,
      "kpiEvents": 2
    }
  }
]
```

#### GET /leads/:id
Get a specific lead by ID.

**Response:**
```json
{
  "id": "clx1234567890",
  "firstName": "Sarah",
  "email": "sarah@example.com",
  "phone": "+1234567890",
  "source": "facebook",
  "campaignId": "clx0987654321",
  "adPlatform": "facebook",
  "createdAt": "2024-01-15T10:30:00Z",
  "tags": [...],
  "stages": [...],
  "activities": [...],
  "opportunity": {...},
  "campaign": {...},
  "kpiEvents": [...]
}
```

#### POST /leads
Create a new lead.

**Request Body:**
```json
{
  "externalId": "ghl_contact_123",
  "firstName": "Sarah",
  "email": "sarah@example.com",
  "phone": "+1234567890",
  "source": "facebook",
  "campaignId": "clx0987654321",
  "adPlatform": "facebook",
  "tags": ["clx1111111111", "clx4444444444"]
}
```

#### PATCH /leads/:id/stage
Update lead's pipeline stage.

**Request Body:**
```json
{
  "stageId": "clx2222222222"
}
```

#### PATCH /leads/:id/tags
Update lead's tags.

**Request Body:**
```json
{
  "tagIds": ["clx1111111111", "clx4444444444"]
}
```

#### DELETE /leads/:id
Delete a lead.

### Dashboard/KPI

#### GET /dashboard/kpi
Get dashboard KPIs for a date range.

**Query Parameters:**
- `from` (string, optional): Start date (ISO 8601)
- `to` (string, optional): End date (ISO 8601)

**Response:**
```json
{
  "summary": {
    "totalLeads": 150,
    "consultBooked": 45,
    "consultShown": 38,
    "totalRevenue": 25000,
    "totalSpend": 5000,
    "roi": 400,
    "leadToConsultRate": 30.0,
    "consultToShowRate": 84.4,
    "showToWonRate": 65.8
  },
  "leadsBySource": [
    {
      "source": "facebook",
      "count": 75
    },
    {
      "source": "google",
      "count": 45
    }
  ],
  "leadsByCampaign": [
    {
      "campaignId": "clx0987654321",
      "campaignName": "Facebook Botox Campaign",
      "leadCount": 75,
      "monthlySpend": 500000
    }
  ],
  "period": {
    "from": "2024-01-01T00:00:00Z",
    "to": "2024-01-31T23:59:59Z"
  }
}
```

#### POST /dashboard/kpi/events
Create a KPI event.

**Request Body:**
```json
{
  "leadId": "clx1234567890",
  "kind": "consult_booked",
  "valueCents": 0,
  "metadataJson": {
    "consultationDate": "2024-01-22T14:00:00Z",
    "provider": "Dr. Smith"
  }
}
```

### Tags

#### GET /tags
Get all tags.

**Response:**
```json
[
  {
    "id": "clx1111111111",
    "name": "Botox",
    "color": "#FF6B6B",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /tags
Create a new tag.

**Request Body:**
```json
{
  "name": "Filler",
  "color": "#4ECDC4"
}
```

#### PATCH /tags/:id
Update a tag.

**Request Body:**
```json
{
  "name": "Dermal Filler",
  "color": "#4ECDC4"
}
```

#### DELETE /tags/:id
Delete a tag.

### Pipelines

#### GET /pipelines
Get all pipeline stages with leads.

**Response:**
```json
[
  {
    "id": "clx2222222222",
    "name": "New",
    "order": 1,
    "color": "#3B82F6",
    "leads": [
      {
        "lead": {
          "id": "clx1234567890",
          "firstName": "Sarah",
          "email": "sarah@example.com",
          "tags": [...],
          "opportunity": {...}
        },
        "changedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
]
```

#### POST /pipelines
Create a new pipeline stage.

**Request Body:**
```json
{
  "name": "Qualified",
  "order": 2,
  "color": "#F59E0B"
}
```

### Campaigns

#### GET /campaigns
Get all campaigns.

**Response:**
```json
[
  {
    "id": "clx0987654321",
    "name": "Facebook Botox Campaign",
    "platform": "facebook",
    "monthlySpendCents": 500000,
    "createdAt": "2024-01-01T00:00:00Z",
    "_count": {
      "leads": 75
    }
  }
]
```

#### POST /campaigns
Create a new campaign.

**Request Body:**
```json
{
  "name": "Google Ads Campaign",
  "platform": "google",
  "monthlySpendCents": 300000
}
```

### Opportunities

#### POST /opportunities
Create an opportunity for a lead.

**Request Body:**
```json
{
  "leadId": "clx1234567890",
  "expectedValueCents": 50000,
  "procedureCode": "BTX",
  "expectedDate": "2024-01-22T14:00:00Z"
}
```

#### PATCH /opportunities/:id
Update an opportunity.

**Request Body:**
```json
{
  "expectedValueCents": 75000,
  "procedureCode": "BTX_PREMIUM"
}
```

#### GET /opportunities/lead/:leadId
Get opportunity for a specific lead.

### Activities

#### GET /activities/lead/:leadId
Get activities for a specific lead.

**Response:**
```json
[
  {
    "id": "clx5555555555",
    "leadId": "clx1234567890",
    "type": "stage_change",
    "payloadJson": {
      "fromStage": "New",
      "toStage": "Contacted"
    },
    "createdAt": "2024-01-15T11:00:00Z"
  }
]
```

#### POST /activities
Create a new activity.

**Request Body:**
```json
{
  "leadId": "clx1234567890",
  "type": "email_sent",
  "payloadJson": {
    "template": "welcome",
    "subject": "Welcome to our practice"
  }
}
```

### Automations

#### GET /automations
Get all automations.

**Response:**
```json
[
  {
    "id": "1",
    "name": "New Lead Welcome",
    "description": "Send welcome message to new leads",
    "trigger": "lead_created",
    "conditions": [],
    "actions": [
      {
        "type": "send_email",
        "template": "welcome",
        "delay": 0
      }
    ],
    "enabled": true
  }
]
```

#### POST /automations
Create a new automation.

**Request Body:**
```json
{
  "name": "Follow-up After 24h",
  "description": "Follow up with leads who haven't been contacted",
  "trigger": "time_based",
  "conditions": [
    {
      "field": "stage",
      "operator": "equals",
      "value": "New"
    }
  ],
  "actions": [
    {
      "type": "send_sms",
      "template": "follow_up",
      "delay": "24h"
    }
  ],
  "enabled": true
}
```

#### POST /automations/:id/execute
Execute an automation manually.

**Request Body:**
```json
{
  "leadId": "clx1234567890",
  "context": {
    "source": "facebook",
    "campaign": "Botox Campaign"
  }
}
```

### Webhooks

#### POST /webhooks/ghl/lead
Handle GHL lead webhook.

**Request Body:**
```json
{
  "contactId": "ghl_contact_123",
  "firstName": "Sarah",
  "email": "sarah@example.com",
  "phone": "+1234567890",
  "source": "facebook",
  "tags": ["Botox", "New Patient"]
}
```

**Response:**
```json
{
  "success": true,
  "leadId": "clx1234567890",
  "message": "Lead processed successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid API key",
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Lead not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Rate Limiting

- 100 requests per minute per API key
- 1000 requests per hour per API key

## Data Types

### Procedure Codes
- `BTX` - Botox
- `FILLER` - Dermal Filler
- `LASER` - Laser Treatment
- `RHINO` - Rhinoplasty
- `BREAST` - Breast Augmentation
- `TUMMY` - Tummy Tuck
- `FACE` - Facelift

### Activity Types
- `sms_sent` - SMS message sent
- `email_sent` - Email sent
- `call` - Phone call made
- `form_submit` - Form submitted
- `stage_change` - Pipeline stage changed
- `tag_added` - Tag added to lead

### KPI Event Types
- `ad_click` - Ad clicked
- `consult_booked` - Consultation booked
- `consult_show` - Consultation attended
- `invoice_paid` - Payment received

### Pipeline Stages
- `New` - New lead
- `Contacted` - Initial contact made
- `Consult Booked` - Consultation scheduled
- `Won` - Converted to patient
- `Lost` - Lead lost
