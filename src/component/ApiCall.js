const ApiCall = async (text) => {
    try {
      const response = await fetch(
        `https://flask-ai-project.vercel.app/?question=${encodeURIComponent(text)}`
      );
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.result;
    } catch (error) {
      throw new Error(`API Error: ${error.message}`);
    }
  };
  
  export default ApiCall;
  