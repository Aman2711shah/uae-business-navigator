// Test script for submit-application function
const testSubmitApplication = async () => {
  try {
    console.log('Testing submit-application function...');
    
    const testData = {
      user_email: "test@example.com",
      user_name: "Test User",
      payload: {
        company_name: "Test Company",
        business_type: "Technology",
        num_visas: 2,
        office_type: "flex",
        duration_years: 1,
        additional_info: "This is a test submission"
      }
    };
    
    console.log('Sending test data:', testData);
    
    const response = await fetch('https://ajxbjxoujummahqcctuo.supabase.co/functions/v1/submit-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.json();
    console.log('Response body:', result);
    
    if (result.ok) {
      console.log('✅ Test successful! Request ID:', result.requestId);
    } else {
      console.log('❌ Test failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

// Run the test
testSubmitApplication();