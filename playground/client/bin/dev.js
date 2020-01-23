const ngrok = require('ngrok')
const {exec} = require('child_process')

console.log('starting ngrok')
;(async function() {
  const url = await ngrok.connect({
    addr: 3001,
    host_header: 'rewrite',
  })

  console.log(`ngrok url: ${url}`)
  const execCommand = `REACT_APP_SERVER_URL=${url} ./node_modules/.bin/react-scripts start`
  console.log(`Running: '${execCommand}'`)
  exec(execCommand, (error, stdout, stderr) => {
    console.log(`Error: ${error}`)
    console.log(`Stdout: ${stdout}`)
    console.log(`Stderr: ${stderr}`)
  })
})()
