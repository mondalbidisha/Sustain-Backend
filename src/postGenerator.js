const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const configuration = new GoogleGenerativeAI(apiKey);
const modelName = "gemini-1.5-flash-latest";
const model = configuration.getGenerativeModel({model : modelName});

const generateBlogPost = async (blogs) => {
  try {
  const requestPayload = {
      contents: [
          {
            role: 'model',
            parts: [
              {
                text: `Perfrom an internet search and retrieve the most pressing climate change issues happening from all around the world. 
                Retrieve climate change specific data from last 1 year only and generate a blog post on one of the most pressing topic or events.
                You are supposed to generate a blog post on a different topic each time. ${JSON.stringify(blogs)} are existing blog post titles. 
                Generate something different from what already exists. There should not be duplicate or similar posts.`
              }
            ]
          },
          {
              role: 'model',
              parts: [
                {
                  text: `Generate a blog post specific to climate change and its impact based on current data. 
                  The post should have 4-5 detailed paragraphs. The post should have an appropriate and interesting title. 
                  Each paragraph should have at least 5-8 sentences each. Only include valid information that can be verified. 
                  Post should have an introductory paragraph, a body with 3 paragraphs and one paragraph for the conclusion.`
                }
              ]
            }
      ],
      systemInstruction: `Language, grammar and tone should be very simple. Your writing style should be interesting and unique. 
      Write a compelling blog post, one that would make people want to read it and take charge. Be bold, interesting and unique.
      Return your response in valid JSON format, with title, introduction, bodyone, bodytwo, bodythree, conclusion, sources keys. 
      bodyone, bodytwo, bodythree should contain the first, second and third paragraphs that make up the body of the blog post, 
      always include sources that were used as references to generate the blog post. Sources should always be present and should be a comma separated list. Do not include anything extra.`,
    };
    const response = await model.generateContent(requestPayload);
    const contentResponse = await response.response;
    const parsedResponse = parseGeminiResponse(contentResponse);
    return parsedResponse;
  } catch (error) {
    console.error('Error generating blog post using Gemini:', error);
    throw error;
  }
};

const parseGeminiResponse = (response) => {
  const content = response.text();
  const jsonString = content.replace('```json\n', '').replace('\n```', '');
  const blogData = JSON.parse(jsonString);
  const sourcesList = blogData.sources.split(', ').map((source) => `<li>${source}</li>`).join('');

  const combinedContent = `
      <p>${blogData.introduction}</p>
      <p><br></p>
      <p>${blogData.bodyone}</p>
      <p><br></p>
      <p>${blogData.bodytwo}</p>
      <p><br></p>
      <p>${blogData.bodythree}</p>
      <p><br></p>
      <p>${blogData.conclusion}</p>
      <p><br></p>
      <p><br></p>
      <p>References - </p>
      <ul>${sourcesList}</ul>
  `.trim();

  return {
    title: blogData.title,
    content: combinedContent
  };
};

module.exports = {
    generateBlogPost
};