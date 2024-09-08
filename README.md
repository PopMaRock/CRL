# CRL - A pile of nothing and pish just now. 
## WIP

### CRL is to be run in a local environment (on a computer).

For local models: LMStudio (With server running)
For remote models: OpenAI (Requires API key to be added to a .env file)

For local image generation: SD Forge (with --api flag in the COMMANDLINE_ARGS)
For remote image generation: Civitai (Requires API key to be added to a .env file)

## Requirements
- Linux or Windows 10+.
- Node 18+
- Up-to-date browser

## Install

Run: git clone 
Open terminal in the install folder and run: 'npm install'
Run: npm run dev
Go to: http://localhost:5173

## To expose server for lan connections
Instead of running 'npm run dev', run 'npm run host'

## Troubleshooting
If you're getting an error. run 'node -v' in a terminal and make sure you're on node 18+
If you are, delete 'node_modules' folder and run 'npm install'

### Builton
SvelteKit, Vite, LangChain to run locally with SDForge (image models) and LMStudio (text models).

### Inspired by great repos such as:
https://github.com/Solemensis/Chad-Rpg
https://github.com/steamship-core/ai-adventure
https://github.com/SillyTavern/SillyTavern
