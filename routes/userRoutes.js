router.options('/register', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'POST')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.sendStatus(200)
}) 