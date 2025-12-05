# Minimal E2E Smoke (curl)

Base URL: http://localhost:3001/api/v1

1) Seed (dev only)
curl -X POST http://localhost:3001/api/v1/dev/seed

2) Signup
EMAIL="user$RANDOM@example.com"
PASSWORD="password123"
NAME="Test User"
curl -s -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"$NAME\"}" | tee /tmp/reg.json

ACCESS=$(cat /tmp/reg.json | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).data.tokens.accessToken))')
echo "Access = $ACCESS"

3) Login (optional check)
curl -s -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"

4) List products
curl -s http://localhost:3001/api/v1/products | tee /tmp/products.json
PID=$(cat /tmp/products.json | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{const j=JSON.parse(d);console.log((j.data.items[0]||{})._id||"")})')
echo "Product ID = $PID"

5) Add to cart
curl -s -X POST http://localhost:3001/api/v1/cart/add \
  -H "Authorization: Bearer $ACCESS" \
  -H "Content-Type: application/json" \
  -d "{\"productId\":\"$PID\",\"qty\":1}"

6) Apply coupon (WELCOME10 if seeded)
curl -s -X POST http://localhost:3001/api/v1/cart/apply-coupon \
  -H "Authorization: Bearer $ACCESS" \
  -H "Content-Type: application/json" \
  -d "{\"code\":\"WELCOME10\"}"

7) Create COD order
curl -s -X POST http://localhost:3001/api/v1/orders \
  -H "Authorization: Bearer $ACCESS" \
  -H "Content-Type: application/json" \
  -d "{\"method\":\"COD\"}"
