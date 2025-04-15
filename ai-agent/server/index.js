const express = require('express');
const app = express();
const PORT = 4000;
const agent = require('./agent');

app.use(express.json());

app.post('/task', async (req, res) => {
    const { task } = req.body;
    const result = await agent.handleTask(task);
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`AI Agent server running on http://localhost:${PORT}`);
});
