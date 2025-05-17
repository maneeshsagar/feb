export default async function UserPage({ params }) {
    // Ensure params is resolved before using it.
    const { username } = await Promise.resolve(params);
  
    // Define a default HTML string
    const defaultHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${username}'s Profile</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 2rem;
              background-color: #f9f9f9;
              margin: 0;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background-color: #fff;
              padding: 2rem;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            h1 {
              color: #333;
              font-size: 2.5rem;
              margin-bottom: 1rem;
            }
            p {
              color: #666;
              font-size: 1.1rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome, ${username}!</h1>
            <p>This is the default profile page. No custom content was returned from the API.</p>
          </div>
        </body>
      </html>
    `;
  
    try {
      // Fetch the HTML content from the API endpoint.
      const res = await fetch(
        `https://910fkqei24.execute-api.ap-south-1.amazonaws.com/api/user?username=${encodeURIComponent(username)}`,
        { cache: "no-store" }
      );
     
      // If the API responds with a non-OK status, throw an error.
      if (!res.ok) {
        throw new Error(`API responded with status ${res.status}`);
      }
  
      // Retrieve the HTML response as text.
      const htmlContent = await res.text();
  
      // If the API returns an empty response, use the default HTML.
      if (!htmlContent.trim()) {
        return <div dangerouslySetInnerHTML={{ __html: defaultHtml }} />;
      }
  
      // Otherwise, render the API response.
      return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // On error, return the default HTML page.
      return <div dangerouslySetInnerHTML={{ __html: defaultHtml }} />;
    }
  }
  