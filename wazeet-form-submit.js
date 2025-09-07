// Updated Wazeet form submit handler for Lovable
async function submitWazeetForm(formData) {
  // formData: object containing all fields, e.g.
  // { email, firstname, lastname, phone, service, notes, file_public_url? }

  try {
    const payload = {
      formName: 'Wazeet Service Form',      // change per form if you have multiple forms
      fields: formData,                     // all fields in one object
      // If you uploaded a file to Supabase Storage from the browser, include its public URL:
      file_url: formData.file_public_url || null,
      // OR you can send base64 (not recommended for large files)
      file_base64: formData.file_base64 || null,
      file_name: formData.file_name || null
    };

    // Use the correct Supabase function URL for your project
    const SUPABASE_FUNCTION_URL = 'https://ajxbjxoujummahqcctuo.supabase.co/functions/v1';
    
    const resp = await fetch(`${SUPABASE_FUNCTION_URL}/submit-lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await resp.json();
    if (!resp.ok) {
      console.error('Submit lead failed', json);
      // show error to user or fallback
      return { ok: false, error: json };
    }
    
    // success - you can redirect to thank-you or show a message
    console.log('Lead submitted successfully:', json);
    return { ok: true, result: json };
    
  } catch (err) {
    console.error('Submit error', err);
    return { ok: false, error: err.message };
  }
}

// Example usage:
// const result = await submitWazeetForm({
//   email: 'user@example.com',
//   firstname: 'John',
//   lastname: 'Doe',
//   phone: '+971501234567',
//   service: 'Company Setup',
//   notes: 'Need help with freezone setup',
//   file_base64: 'data:application/pdf;base64,JVBERi0xLjQ...',
//   file_name: 'business_plan.pdf'
// });
//
// if (result.ok) {
//   alert('Form submitted successfully!');
//   // redirect or show success message
// } else {
//   alert('Error: ' + result.error.error);
// }