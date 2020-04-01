const app = require('./app');

const PORT = 3333;

app.listen(PORT, () => {
    console.info(`Server listening on port :>> ${PORT}`);
});