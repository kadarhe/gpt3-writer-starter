import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
`
Write me a detailed high intensity interval training workout plan with the exercises below.

Title:
`

const generateAction = async (req, res) => {
	//console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

	const baseCompletion = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: `${basePromptPrefix}${req.body.userInput}`,
		temperature: 0.8,
		max_tokens: 250,
	});

	const basePromptOutput = baseCompletion.data.choices.pop();

	//building prompt 2
	const secondPrompt =
	`
	Take the workout plan and title below and generate a blog post written in the style of Dostoevsky. Make it feel like a story. Don't just list the points. Go deep into each one. 

	Title: ${req.body.userInput}

	Table of Contents: ${basePromptOutput.text}

	Blog post:
	`

	const secondPromptCompletion = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: `${secondPrompt}`,
		temperature: 0.85,
		max_tokens: 1250,
	});

	//Get the basePromptOutput
	const secondPromptOutput = secondPromptCompletion.data.choices.pop();

	//send over prompt 2's output to our UI 
	res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;