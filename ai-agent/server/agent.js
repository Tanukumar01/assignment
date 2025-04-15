const fs = require('fs');
const { exec } = require('child_process');
const axios = require('axios');

const OPENAI_API_KEY = "sk-abcdef1234567890abcdef1234567890abcdef12"; // Replace with your actual key or use dotenv

async function callOpenAI(prompt) {
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        },
        {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        }
    );
    return response.data.choices[0].message.content;
}

async function handleTask(userInput) {
    console.log(`🤖 Task received: "${userInput}"`);
    
    const planPrompt = `User asked: "${userInput}". 
Return a step-by-step plan and a simple script (if needed) to perform it.`;
    const plan = await callOpenAI(planPrompt);
    console.log('\n📋 PLAN:\n' + plan);

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        readline.question('\n🟡 Do you approve the plan? (yes/no): ', async (ans) => {
            if (ans.toLowerCase() !== 'yes') {
                readline.close();
                return resolve({ message: 'Plan rejected by user.' });
            }

            const fileMatch = plan.match(/```(.*?)```/s);
            if (fileMatch) {
                const code = fileMatch[1];
                const filename = 'server/tasks/agent-task.py';
                fs.writeFileSync(filename, code);
                console.log(`\n💾 Code written to ${filename}`);

                exec(`python3 ${filename}`, (err, stdout, stderr) => {
                    if (err) {
                        console.log('\n❌ Error during execution:', stderr);
                        readline.question('\n🔁 Should I retry with a fix? (yes/no): ', async (retry) => {
                            if (retry.toLowerCase() === 'yes') {
                                const fixPrompt = `The previous code had this error:\n${stderr}\nFix it.`;
                                const fixed = await callOpenAI(fixPrompt);
                                const fixedCodeMatch = fixed.match(/```(.*?)```/s);
                                if (fixedCodeMatch) {
                                    fs.writeFileSync(filename, fixedCodeMatch[1]);
                                    exec(`python3 ${filename}`, (err2, out2, errOut2) => {
                                        console.log('\n🔁 Retry output:', out2 || errOut2);
                                        readline.close();
                                        resolve({ status: 'retried' });
                                    });
                                } else {
                                    readline.close();
                                    resolve({ status: 'error', message: 'No code in fix.' });
                                }
                            } else {
                                readline.close();
                                resolve({ status: 'error', error: stderr });
                            }
                        });
                    } else {
                        console.log('\n✅ Execution output:\n' + stdout);
                        readline.close();
                        resolve({ status: 'success', output: stdout });
                    }
                });
            } else {
                readline.close();
                resolve({ message: 'No executable code found in plan.' });
            }
        });
    });
}

module.exports = { handleTask };
