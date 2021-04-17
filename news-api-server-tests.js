// * Do not change the boilerplate sections if you don't know what you're doing
// * Make sure that your code does not crash OUTSIDE of try-catch test blocks, otherwise no test will pass.
// * process.env.USER_CODE_DIR is the directory path of user's code. Use it to import/run user specific code (static analysis of user files?)
// * process.env.PUBLIC_PORT is the publicly accessible port on localhost for user's server. Use it to perform HTTP requests to user server
// * process.env.UNIT_TEST_OUTPUT_FILE is the name of the file where results of UNIT tests should be put
// * The results file should have a JSON array with ONLY "true" or "false" values (booleans) as elements having one-to-one correspondance to challenges you design

// !! Boilerplate code starts
const fs = require('fs')
const assert = require('assert')
const path = require('path')
const {spawn,execSync} = require('child_process')
const fetch = require('node-fetch')

// This function helps us wait for user server to spawn for testing
const retry = (fn, ms) =>
	new Promise((resolve) => {
		fn()
			.then(resolve)
			.catch(() => {
				setTimeout(() => {
					retry(fn, ms).then(resolve)
				}, ms)
			})
	})

function waitForPort(port) {
    try {
    	execSync(`lsof -a -i tcp:${port} -c node`)
    	return Promise.resolve(true)
    } catch(error) {
        
    }
	// if execSync doesn't throw, it was successful
	return Promise.reject(false)
}


async function run() {
    // results[] is mapped to results shown to user
	const results = []


	// * EITHER spawn the static server if you want
	// spawns static server:
	const stream = spawn('bash', ['-c', `cd ${process.env.USER_CODE_DIR} && yarn install && yarn start`])
	
	
	stream.stdout.on('data', (data) => {
	    console.log(data.toString('utf8'))
	})
	
	stream.stderr.on('data', (data) => {
	    console.log(data.toString('utf8'))
	})
	
	stream.on('exit', () => {
	    if(results.length === 0) {
	        // tests never ran
	        // close the server
	        console.error('Your server never started/died before tests could run.')
	        fs.writeFileSync(process.env.UNIT_TEST_OUTPUT_FILE, JSON.stringify(results))
	        process.exit(0)
	    } else {
	        console.log('Stream closed')
	        fs.writeFileSync(process.env.UNIT_TEST_OUTPUT_FILE, JSON.stringify(results))
	        process.exit(0)
	    }
	})
	
	// * OR spawn Node.js server: 
	// spawn('bash', ['-c', `cd ${process.env.USER_CODE_DIR} && node index.js`])	


	const URL = 'http://localhost:' + process.env.PUBLIC_PORT
	// * wait for server to come online
	await retry(() => waitForPort(process.env.PUBLIC_PORT), 100)
	
	
    // !! Boilerplate code ends
    
    // Start your tests here in individual try-catch block
    
    const {data} = require(`${process.env.USER_CODE_DIR}/data`)
    
	try {
	    
	    execSync(`cd ${process.env.USER_CODE_DIR} && node createDatabase.js`)
	    console.log('Database seeded')
	} catch(error) {
	    console.log('node createDatabase.js failed', error)
	}
	
    
    try {
		// example: 
		const response = await fetch(`${URL}/newsFeed?limit=100`).then(t => t.json())
		
		for(let i=0;i<data.length;i++) {
		    assert(data[i].title === response[i].title)
		}
		
		// test case passes
		console.log('Test 1 passed') // will appear in execute logs on frontend
		results.push(true)
	} catch (error) {
		console.error('Test 1 failed', error) // will appear in execute logs on frontend
		results.push(false)
	}
	
	try {
		// example: 
		const response = await fetch(`${URL}/newsFeed?limit=1`).then(t => t.json())
		
		assert(response.length === 1)
	    assert(data[0].title === response[0].title)

		
		// test case passes
		console.log('Test 2 passed') // will appear in execute logs on frontend
		results.push(true)
	} catch (error) {
		console.error('Test 2 failed', error) // will appear in execute logs on frontend
		results.push(false)
	}
	
	try {
		// example: 
		const response = await fetch(`${URL}/newsFeed?limit=10`).then(t => t.json())
		
		assert(response.length === 10)
		
	    for(let i=0;i<response.length;i++) {
		    assert(data[i].title === response[i].title)
		}

		// test case passes
		console.log('Test 3 passed') // will appear in execute logs on frontend
		results.push(true)
	} catch (error) {
		console.error('Test 3 failed', error) // will appear in execute logs on frontend
		results.push(false)
	}
	
	try {
		// example: 
		const response = await fetch(`${URL}/newsFeed?limit=10&offset=10`).then(t => t.json())
		
		assert(response.length === 10)
		
	    for(let i=0;i<response.length;i++) {
		    assert(data[i + 10].title === response[i].title)
		}

		// test case passes
		console.log('Test 4 passed') // will appear in execute logs on frontend
		results.push(true)
	} catch (error) {
		console.error('Test 4 failed', error) // will appear in execute logs on frontend
		results.push(false)
	}
	
	
	// End your tests here
	
    // Write the test results to disk
	fs.writeFileSync(process.env.UNIT_TEST_OUTPUT_FILE, JSON.stringify(results))
	// !! Boilerplate code starts
	
	// No time for cleanup, this container will be destroyed in a few milliseconds anyway
	process.exit(0)
}
run()
// !! Boilerplate code ends