# Get Quotes API

A Supabase Edge Function that provides quote calculations for business setup services across different freezones.

## Endpoint

`/api/get-quotes`

## Methods

### POST (Recommended)
```bash
curl -X POST https://ajxbjxoujummahqcctuo.supabase.co/functions/v1/get-quotes \
  -H "Content-Type: application/json" \
  -d '{
    "numVisas": 2,
    "officeType": "flex",
    "durationYears": 1,
    "activityCode": "optional"
  }'
```

### GET (Backward Compatibility)
```bash
curl "https://ajxbjxoujummahqcctuo.supabase.co/functions/v1/get-quotes?numVisas=2&officeType=flex&durationYears=1&activityCode=optional"
```

## Request Parameters

| Parameter | Type | Required | Options | Description |
|-----------|------|----------|---------|-------------|
| `numVisas` | number | Yes | >= 1 | Number of visas required |
| `officeType` | string | Yes | `"none"`, `"flex"`, `"small_office"`, `"shared_desk"` | Type of office space |
| `durationYears` | number | Yes | >= 1 | Duration in years |
| `activityCode` | string | No | - | Optional activity code for specific calculations |

## Response Format

```json
{
  "quotes": [
    {
      "freezone": {
        "id": "freezone_id",
        "name": "Freezone Name"
      },
      "type": "itemized",
      "subtotal": 15000.00,
      "admin": 750.00,
      "vat": 787.50,
      "total": 16537.50,
      "details": {
        "components": [
          {
            "name": "Base License",
            "cost": 10000,
            "years": 1,
            "total": 10000
          },
          {
            "name": "Visa Fees",
            "cost": 2500,
            "quantity": 2,
            "years": 1,
            "total": 5000
          }
        ]
      }
    },
    {
      "freezone": {
        "id": "freezone_id",
        "name": "Freezone Name"
      },
      "type": "package",
      "subtotal": 12000.00,
      "admin": 600.00,
      "vat": 630.00,
      "total": 13230.00,
      "details": {
        "packageName": "Standard Package",
        "components": [
          {
            "name": "Package Base Cost",
            "cost": 12000,
            "total": 12000
          }
        ]
      }
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "numVisas must be a positive number"
}
```

### 405 Method Not Allowed
```json
{
  "error": "Method not allowed"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch freezones: [error message]"
}
```

## Quote Types

### Itemized Quotes
- Calculated based on individual components (license, visas, office space)
- Uses freezone-specific pricing from the `freezones` table
- Includes admin fees and VAT as percentages

### Package Quotes
- Based on pre-defined packages from the `packages` table
- Automatically selects the most cost-effective package that meets requirements
- Includes additional costs for extra visas or extended duration

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
   supabase functions deploy get-quotes
   ```

### Using Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/ajxbjxoujummahqcctuo/functions)
2. Click "New Function"
3. Name it `get-quotes`
4. Copy the contents of `index.ts` into the editor
5. Deploy the function

### Environment Variables

The function uses these Supabase environment variables (automatically available):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### Configuration

The function is configured in `supabase/config.toml` with:
```toml
[functions.get-quotes]
verify_jwt = false
```

This makes the function publicly accessible without authentication.

## Database Dependencies

The function requires these tables:
- `freezones` - Freezone information and pricing
- `addon_prices` - Additional pricing components
- `packages` - Pre-defined packages

## Testing

### Local Testing
```bash
supabase functions serve get-quotes
```

Then test with:
```bash
curl -X POST http://localhost:54327/functions/v1/get-quotes \
  -H "Content-Type: application/json" \
  -d '{"numVisas": 1, "officeType": "none", "durationYears": 1}'
```

### Production Testing
Replace the localhost URL with your Supabase project URL:
```bash
curl -X POST https://ajxbjxoujummahqcctuo.supabase.co/functions/v1/get-quotes \
  -H "Content-Type: application/json" \
  -d '{"numVisas": 1, "officeType": "none", "durationYears": 1}'
```

## Monitoring

Check function logs in the [Supabase Dashboard](https://supabase.com/dashboard/project/ajxbjxoujummahqcctuo/functions/get-quotes/logs) for debugging and monitoring.