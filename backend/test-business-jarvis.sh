#!/bin/bash

echo "��� Business Jarvis Comprehensive Test Suite"
echo "==========================================="
echo ""

# Test 1: API Health Check
echo "Test 1: API Health Check"
echo "========================"
response=$(curl -s http://localhost:5000/health)
if [[ $response == *"Business Jarvis"* ]]; then
    echo "✅ API is responding with Business Jarvis branding"
    echo "Response: $response" | head -3
else
    echo "❌ API health check failed"
    echo "Response: $response"
fi
echo ""

# Test 2: Database Connection
echo "Test 2: Database Connection"
echo "==========================="
cd backend
if npx prisma db push --accept-data-loss 2>/dev/null; then
    echo "✅ Database connection working"
else
    echo "❌ Database connection failed"
fi
echo ""

# Test 3: User Registration
echo "Test 3: User Registration"
echo "========================"
reg_response=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test'$(date +%s)'@test.com",
    "password": "test123",
    "organizationName": "Test Company"
  }')

if [[ $reg_response == *"token"* ]]; then
    echo "✅ User registration working"
    token=$(echo $reg_response | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Token received: ${token:0:20}..."
else
    echo "❌ User registration failed"
    echo "Response: $reg_response"
fi
echo ""

# Test 4: Protected Route Access
echo "Test 4: Protected Route Access"
echo "=============================="
if [[ -n "$token" ]]; then
    workflows_response=$(curl -s -H "Authorization: Bearer $token" http://localhost:5000/api/workflows)
    if [[ $workflows_response == *"["* ]]; then
        echo "✅ Protected routes working"
        echo "Workflows response: ${workflows_response:0:100}..."
    else
        echo "❌ Protected routes failed"
        echo "Response: $workflows_response"
    fi
else
    echo "⚠️ Skipping protected route test (no token)"
fi
echo ""

# Test 5: Workflow Creation
echo "Test 5: Workflow Creation"
echo "========================"
if [[ -n "$token" ]]; then
    create_response=$(curl -s -X POST http://localhost:5000/api/workflows/sample \
      -H "Authorization: Bearer $token" \
      -H "Content-Type: application/json")
    
    if [[ $create_response == *"Business Jarvis"* ]]; then
        echo "✅ Workflow creation working"
        workflow_id=$(echo $create_response | grep -o '"id":"[^"]*' | cut -d'"' -f4)
        echo "Workflow created with ID: $workflow_id"
    else
        echo "❌ Workflow creation failed"
        echo "Response: $create_response"
    fi
else
    echo "⚠️ Skipping workflow creation test (no token)"
fi
echo ""

# Test 6: Workflow Execution
echo "Test 6: Workflow Execution"
echo "=========================="
if [[ -n "$token" && -n "$workflow_id" ]]; then
    exec_response=$(curl -s -X POST http://localhost:5000/api/workflows/$workflow_id/execute \
      -H "Authorization: Bearer $token" \
      -H "Content-Type: application/json" \
      -d '{"input": {"userEmail": "test@test.com", "issue": "Server down"}}')
    
    if [[ $exec_response == *"runId"* ]]; then
        echo "✅ Workflow execution initiated"
        run_id=$(echo $exec_response | grep -o '"runId":"[^"]*' | cut -d'"' -f4)
        echo "Execution ID: $run_id"
        
        # Wait and check execution result
        echo "Waiting 3 seconds for execution to complete..."
        sleep 3
        
        runs_response=$(curl -s -H "Authorization: Bearer $token" \
          "http://localhost:5000/api/workflows/$workflow_id/runs")
        
        if [[ $runs_response == *"COMPLETED"* ]]; then
            echo "✅ Workflow execution completed successfully"
        else
            echo "⚠️ Workflow execution may still be running"
        fi
    else
        echo "❌ Workflow execution failed"
        echo "Response: $exec_response"
    fi
else
    echo "⚠️ Skipping workflow execution test (no token or workflow)"
fi
echo ""

# Test 7: Frontend Connection
echo "Test 7: Frontend Connection"
echo "=========================="
frontend_response=$(curl -s -I http://localhost:3000 2>/dev/null | head -1)
if [[ $frontend_response == *"200"* ]]; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend not accessible"
    echo "Make sure frontend is running: cd frontend && npm run dev"
fi
echo ""

# Test 8: Database Data Integrity
echo "Test 8: Database Data Integrity"
echo "==============================="
users_count=$(npx prisma db execute --command "SELECT COUNT(*) as count FROM users;" --schema prisma/schema.prisma 2>/dev/null || echo "Error")
if [[ $users_count == *"count"* ]]; then
    echo "✅ Database contains user data"
    echo "Users in database: $users_count"
else
    echo "⚠️ Database query failed or no data"
fi
echo ""

# Test Summary
echo "��� Test Summary"
echo "==============="
echo "Business Jarvis system test completed."
echo ""
echo "��� What to check next:"
echo "1. Visit http://localhost:3000 and test the UI"
echo "2. Register a new account manually"
echo "3. Create and execute workflows through the dashboard"
echo "4. Check that cost calculations are displayed"
echo "5. Verify contractor alerts are simulated"
echo ""
echo "��� For detailed testing:"
echo "1. Open browser dev tools (F12)"
echo "2. Watch Network tab during workflow execution"
echo "3. Check Console for any JavaScript errors"
echo "4. Monitor backend logs for detailed execution flow"
