#!/bin/bash
# API Endpoint Verification Script

echo "🧪 Quran API Endpoint Testing"
echo "================================"

BASE_URL="http://localhost:3000/api/v1"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "\n${BLUE}ℹ️  Make sure the API is running: npm start${NC}\n"

# Test Health Check
echo -e "${YELLOW}1. Testing Health Check${NC}"
curl -s "$BASE_URL/health" | jq '.' || echo "Failed to connect"

# Test Get All Surahs
echo -e "\n${YELLOW}2. Testing Get All Surahs${NC}"
echo "First surah:"
curl -s "$BASE_URL/surahs" | jq '.data.surahs[0]' || echo "Failed"

echo -e "\nLast surah:"
curl -s "$BASE_URL/surahs" | jq '.data.surahs[-1]' || echo "Failed"

echo -e "\nTotal surahs:"
curl -s "$BASE_URL/surahs" | jq '.metadata.total' || echo "Failed"

# Test Get Specific Surah
echo -e "\n${YELLOW}3. Testing Get Surah #1 with Ayahs${NC}"
curl -s "$BASE_URL/surah/1" | jq '.data | {name_english, total_ayahs, first_ayah: .ayahs[0].translation}' || echo "Failed"

# Test Search
echo -e "\n${YELLOW}4. Testing Search Functionality${NC}"
echo "Searching for 'mercy':"
curl -s "$BASE_URL/search?q=mercy&page=1&limit=5" | jq '.data[0:2]' || echo "Failed"

# Test API Info
echo -e "\n${YELLOW}5. Testing API Info${NC}"
curl -s "$BASE_URL/info" | jq '.data | {name, version, endpoints: (.endpoints | keys)}' || echo "Failed"

# Test Rate Limiting
echo -e "\n${YELLOW}6. Testing Rate Limiting Headers${NC}"
echo "Rate limit headers:"
curl -s -i "$BASE_URL/health" | grep -i "x-ratelimit" || echo "Rate limit headers not found"

# Test 404 Error
echo -e "\n${YELLOW}7. Testing Error Handling (404)${NC}"
curl -s "$BASE_URL/invalid-endpoint" | jq '.error' || echo "Failed"

# Test Invalid Surah ID
echo -e "\n${YELLOW}8. Testing Error Handling (Invalid Surah ID)${NC}"
curl -s "$BASE_URL/surah/999" | jq '.error' || echo "Failed"

echo -e "\n${GREEN}✅ Testing Complete${NC}\n"
