import killPort from 'kill-port'

const port = Number(process.argv[2] || 5173)

killPort(port)
  .then(() => console.log(`Port ${port} freed.`))
  .catch(() => console.log(`Port ${port} was already free.`))
