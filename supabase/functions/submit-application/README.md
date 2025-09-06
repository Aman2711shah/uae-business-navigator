# Submit Application API

A Supabase Edge Function that handles application submissions with email notifications via SendGrid and Slack notifications for administrators.

## Endpoint

`/api/submit-application`

## Method

**POST** only

## Request Format

```bash
curl -X POST https://ajxbjxoujummahqcctuo.supabase.co/functions/v1/submit-application \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "user@example.com",
    "user_name": "John Doe",
    "payload": {
      "company_name": "Acme Corp",
      "business_type": "Technology",
      "num_visas": 2,
      "office_type": "flex",
      "additional_info": "Looking for a startup-friendly package"
    }
  }'
```

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_email` | string | Yes | Valid email address of the applicant |
| `user_name` | string | No | Full name of the applicant |
| `payload` | object | Yes | Form data containing application details |

## Response Format

### Success Response (200)
```json
{
  "ok": true,
  "requestId": "WZ-20250106-1234"
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "ok": false,
  "error": "user_email is required"
}
```

#### 405 Method Not Allowed
```json
{
  "ok": false,
  "error": "Only POST method is allowed"
}
```

#### 500 Internal Server Error
```json
{
  "ok": false,
  "error": "Failed to save submission: [error details]"
}
```

## Features

### 1. Request ID Generation
- Format: `WZ-YYYYMMDD-XXXX`
- Example: `WZ-20250106-1234`
- Automatically generated with date and random 4-digit number

### 2. Database Storage
- Saves to `submissions` table in Supabase
- Includes: `request_id`, `user_email`, `user_name`, `payload`
- Uses service role key for secure database access

### 3. Email Notifications
- Sends confirmation email to user via SendGrid
- Subject: "Wazeet — Your Request ID: [ID]"
- Includes formatted payload summary
- HTML formatted with professional styling

### 4. Slack Notifications
- Posts to admin Slack channel via webhook
- Includes request ID, user email, and field preview
- Links to admin panel for easy access
- Rich formatting with blocks and fields

## Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://ajxbjxoujummahqcctuo.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for database access | `eyJ...` |
| `SENDGRID_API_KEY` | SendGrid API key for emails | `SG.xxx` |
| `SENDGRID_FROM` | From email address | `noreply@wazeet.com` |
| `ADMIN_SLACK_WEBHOOK` | Slack webhook URL for notifications | `https://hooks.slack.com/services/...` |
| `ADMIN_EMAILS` | Comma-separated admin emails | `admin@wazeet.com,manager@wazeet.com` |
| `ADMIN_PANEL_URL` | Base URL for admin panel | `https://admin.wazeet.com` |

## Setup Instructions

### 1. SendGrid Configuration

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Verify your sender domain at [SendGrid Domains](https://app.sendgrid.com/settings/sender_auth/domain/create)
3. Create an API key at [SendGrid API Keys](https://app.sendgrid.com/settings/api_keys)
4. Set the API key as `SENDGRID_API_KEY` secret
5. Set your verified from email as `SENDGRID_FROM` secret

### 2. Slack Configuration

1. Create a Slack app at [Slack API](https://api.slack.com/apps)
2. Enable Incoming Webhooks
3. Create a webhook for your desired channel
4. Set the webhook URL as `ADMIN_SLACK_WEBHOOK` secret

### 3. Admin Configuration

1. Set comma-separated admin emails as `ADMIN_EMAILS` secret
2. Set your admin panel base URL as `ADMIN_PANEL_URL` secret

### 4. Database Configuration

The function expects a `submissions` table with these columns:
- `id` (uuid, primary key)
- `request_id` (text, unique)
- `user_email` (text)
- `user_name` (text, nullable)
- `payload` (jsonb)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 5. Secrets Setup

Use the Supabase dashboard to set these secrets:

1. Go to [Edge Functions Settings](https://supabase.com/dashboard/project/ajxbjxoujummahqcctuo/settings/functions)
2. Add each environment variable as a secret
3. Or use the Supabase CLI:

```bash
# Set secrets using CLI
supabase secrets set SENDGRID_API_KEY=your_sendgrid_api_key
supabase secrets set SENDGRID_FROM=noreply@wazeet.com
supabase secrets set ADMIN_SLACK_WEBHOOK=https://hooks.slack.com/services/...
supabase secrets set ADMIN_EMAILS=admin@wazeet.com
supabase secrets set ADMIN_PANEL_URL=https://admin.wazeet.com
```

## Deployment Instructions

### Using Supabase CLI

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link to your project**:
   ```bash
   supabase link --project-ref ajxbjxoujummahqcctuo
   ```

4. **Deploy the function**:
   ```bash
   supabase functions deploy submit-application
   ```

### Using Supabase Dashboard

1. Go to [Supabase Dashboard Functions](https://supabase.com/dashboard/project/ajxbjxoujummahqcctuo/functions)
2. Click "New Function"
3. Name it `submit-application`
4. Copy the contents of `index.ts` into the editor
5. Deploy the function

## Testing

### Local Testing
```bash
# Start local development
supabase functions serve submit-application

# Test the function
curl -X POST http://localhost:54327/functions/v1/submit-application \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "test@example.com",
    "user_name": "Test User",
    "payload": {
      "test_field": "test_value",
      "number_field": 123
    }
  }'
```

### Production Testing
```bash
curl -X POST https://ajxbjxoujummahqcctuo.supabase.co/functions/v1/submit-application \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "test@example.com",
    "user_name": "Test User",
    "payload": {
      "company_name": "Test Company",
      "business_type": "Technology"
    }
  }'
```

## Error Handling

The function includes comprehensive error handling:
- Input validation for required fields
- Email format validation
- Database error handling
- Email sending error handling (non-blocking)
- Slack notification error handling (non-blocking)
- Detailed logging for debugging

Failed email or Slack notifications won't cause the entire request to fail, ensuring the application is always saved to the database.

## Monitoring

Check function logs in the [Supabase Dashboard](https://supabase.com/dashboard/project/ajxbjxoujummahqcctuo/functions/submit-application/logs) for:
- Request processing details
- Database operations
- Email sending status
- Slack notification status
- Error diagnostics

## Security

- Function uses CORS headers for browser compatibility
- Service role key for secure database access
- Input validation and sanitization
- No JWT verification required (public endpoint)
- Sensitive data handled securely through environment variables