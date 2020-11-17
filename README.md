Commands for running the application in the blacktop directory:

npm run server:
	run just the backend with nodemon, which restarts server every
	time a change is made
	server is on port 5000
	identical to command 'nodemon index.js'
	
npm run client:
	run just the frontend
	client is on port 3000
	identical to command 'cd client && yarn start'
	
npm run dev:
	run the frontend and backend at the same time with the power of magic
	identical to opening two terminals and running npm run server in one
	and npm run client in the other
	
Nick comment:
I changed index.tsx to run game instead of lobby just to test the socket stuff
