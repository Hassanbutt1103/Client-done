# CSV Upload Guide - Postman

## 🚀 Quick Steps

### 1. **Login First (Get Token)**
```json
POST http://localhost:3002/api/v1/users/login
Content-Type: application/json

{
  "email": "admin@vpengenharia.com",
  "password": "admin123",
  "userType": "admin"
}
```

**Response**: Copy the `token` value from response

---

### 2. **Upload CSV File**

**Request Configuration:**
- **Method**: `POST`
- **URL**: `http://localhost:3002/api/v1/client-data/upload`
- **Headers**: 
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```
- **Body Type**: `form-data`
- **Form Data**:
  - Key: `csvFile`
  - Type: `File`
  - Value: Select `sample_financial_data.csv`

---

## 📋 Detailed Steps

### Step 1: Set Up Authentication
1. First, login to get your token
2. Copy the token from login response
3. In upload request, go to **Headers** tab
4. Add: `Authorization: Bearer YOUR_TOKEN`

### Step 2: Configure File Upload
1. Go to **Body** tab
2. Select **form-data** radio button
3. Add new row:
   - **Key**: Type `csvFile`
   - **Type**: Click dropdown, select `File` 
   - **Value**: Click "Select Files", browse to your CSV

### Step 3: Upload
1. Click **Send**
2. Wait for processing (usually 1-2 seconds)
3. Check response for success confirmation

---

## ✅ Success Indicators

**Status Code**: `200 OK`

**Response Body**:
```json
{
  "status": "success",
  "message": "CSV file processed successfully from memory",
  "data": {
    "totalRecords": 15,
    "savedRecords": 15,
    "fileName": "sample_financial_data.csv",
    "uploadedBy": "user_id_here",
    "uploadedAt": "timestamp_here"
  }
}
```

**Server Logs**: You should see:
```
📄 Processing CSV file from memory: sample_financial_data.csv
✅ Saved 15 records to database from memory
```

---

## ❌ Common Issues & Solutions

### Issue: 401 Unauthorized
**Cause**: Missing or invalid token
**Solution**: 
1. Login first to get fresh token
2. Copy exact token value (no extra spaces)
3. Use format: `Bearer TOKEN_VALUE`

### Issue: 400 Bad Request - "No file uploaded"
**Cause**: Body not configured correctly
**Solution**:
1. Use `form-data` (not raw or x-www-form-urlencoded)
2. Key must be exactly `csvFile`
3. Type must be `File` (not Text)

### Issue: 500 Internal Server Error
**Cause**: Server or database issue
**Solution**:
1. Check server is running on port 3002
2. Verify database connection in server logs
3. Check CSV file format matches expected columns

---

## 📊 CSV File Format

The system automatically detects and supports multiple CSV formats:

### **🔧 Separators Supported:**
- ✅ **Commas (,)** - Standard international format
- ✅ **Semicolons (;)** - European/Brazilian format  
- ✅ **Tabs (\t)** - Tab-separated values

### **📋 Column Name Formats:**

**Format 1** (with underscores):
```csv
DATA,RECEBER_VP,PAGAR_VP,RECEBER_TGN,PAGAR_TGN,TOTAL_RECEBER,TOTAL_A_PAGAR,SALDO_DIARIO,SALDO_ACUMULADO
```

**Format 2** (with spaces - like FLUXO DE CAIXA REAL 2025 C.csv):
```csv
DATA;RECEBER VP;PAGAR VP;RECEBER TGN;PAGAR TGN;TOTAL RECEBER;TOTAL A PAGAR;SALDO DIARIO;SALDO ACUMULADO
```

### **📄 Sample Rows:**

**Comma-separated:**
```csv
01/01/2025,R$ 15000.00,R$ 8500.00,R$ 12000.00,R$ 6500.00,R$ 27000.00,R$ 15000.00,R$ 12000.00,R$ 12000.00
```

**Semicolon-separated (your format):**
```csv
01/01/2025;R$ 15000.00;R$ 8500.00;R$ 12000.00;R$ 6500.00;R$ 27000.00;R$ 15000.00;R$ 12000.00;R$ 12000.00
```

**✨ Smart Detection:** The system automatically detects the separator and column format used in your file!

---

## 🔍 Testing Results

After successful upload, test with:

**Get Data**: `GET http://localhost:3002/api/v1/client-data`
**Get Analytics**: `GET http://localhost:3002/api/v1/client-data/analytics`

Both require the same `Authorization: Bearer TOKEN` header. 