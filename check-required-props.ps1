#!/usr/bin/env pwsh
# Script to check which FormField components are missing 'required' prop
# based on their validation schema

$formsDir = "d:\nextjs\src\components\admin"
$formFiles = Get-ChildItem -Path $formsDir -Recurse -Filter "*Form.tsx"

Write-Host "Checking forms for missing 'required' props..." -ForegroundColor Cyan
Write-Host ""

foreach ($file in $formFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Extract schema definition
    if ($content -match '(?s)const \w+Schema = z\.object\(\{(.*?)\}\);') {
        $schema = $matches[1]
        
        # Find fields with .min(1, in schema (required fields)
        $requiredFields = [regex]::Matches($schema, '(\w+):\s*z\.\w+\([^\)]*\)\.min\(1,') | 
            ForEach-Object { $_.Groups[1].Value }
        
        if ($requiredFields.Count -gt 0) {
            Write-Host "File: $($file.Name)" -ForegroundColor Yellow
            Write-Host "  Required fields in schema: $($requiredFields -join ', ')" -ForegroundColor Gray
            
            # Check if FormField has required prop for these fields
            foreach ($field in $requiredFields) {
                # Look for FormField with this field name
                $pattern = "(?s)<FormField[^>]*\{\.\.\.register\(`"$field`"\)\}[^>]*>"
                if ($content -match $pattern) {
                    $formFieldTag = $matches[0]
                    if ($formFieldTag -notmatch '\brequired\b') {
                        Write-Host "    ❌ Missing 'required' prop for field: $field" -ForegroundColor Red
                    } else {
                        Write-Host "    ✅ Has 'required' prop for field: $field" -ForegroundColor Green
                    }
                }
            }
            Write-Host ""
        }
    }
}

Write-Host "Check complete!" -ForegroundColor Cyan
