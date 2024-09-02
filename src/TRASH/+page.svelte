<script lang="ts">
	// import StaticPrompts from '$lib/components/StaticPrompts.svelte'

	import { game, character, selectedItem, misc, coolDowns, bgImage, ui } from '$stores/stores'

	// import frpgPlaces from '$lib/gamedata/places/frpg.json'
	// import frpgStarter from '$lib/gamedata/gamestarters/frpg.json'

	//import type { ChatCompletionRequestMessage } from 'openai'
	import { SSE } from 'sse.js'
	import { fade } from 'svelte/transition'
	import buyWeapons from '$lib/constants/gamedata/weapons.json'
	import buySpells from '$lib/constants/gamedata/spells.json'
	import buyPotions from '$lib/constants/gamedata/potions.json'
	import staticPlaces from '$lib/constants/gamedata/places.json'
	// import medievalStart from '$lib/gamedata/starterprompts/medievalStart.txt'
	import { parse } from 'best-effort-json-parser'
	import medievalMageInventory from '$lib/constants/gamedata/gamestarters/medievalMageInventory.json'
	import medievalMageSpells from '$lib/constants/gamedata/gamestarters/medievalMageSpells.json'
	import medievalWarriorInventory from '$lib/constants/gamedata/gamestarters/medievalWarriorInventory.json'
	import medievalWarriorSpells from '$lib/constants/gamedata/gamestarters/medievalWarriorSpells.json'
	import { TextGenerateEffect } from '$components/UI-Effects/text-generation'
	// import buyArmors from '$lib/gamedata/armors.json'

	let answer: string = ''
	let chatMessages: any = []

	//a variable to carry the enemy into the client-side for app reliability
	let enemyOnFrontend: boolean = false

	let prompt = `Stop being an AI model. Our interaction is imaginary. Don't disclose it, but heighten and uphold the immersion. 
Essential: You will receive data from the user in, and respond to the user in valid UTF8 JSON format with specified keys. You will not add extra characters, symbols or commentary outwith the JSON object.

GAME: Dungeons & Dragons: 5th Edition
BOOKS: Any Random Campaign Book
ROLE: Dungeon Master
THEME: High Fantasy
TONALITY: Whimsical & Heroic
CHARACTER: Sabrina, a human mage with a funny pet.

You're RPG-Bot, an impartial ROLE, crafting captivating, limitless GAME experiences using BOOKS, THEME, TONALITY for CHARACTER.

World Information:
- Place: "Tavern", "Woods", "Town", "Library", "Laboratory", "Hospital", "Sanatorium", "School", "Dungeon", "Cave", "Castle", "Mountain", "Shore", "Cathedral", "Shop", "Home", "Harbor", "Dock", "Ship", "Desert", "Island", "Temple", or "Unknown"
- Enemy: "bandit", "golem", "kobold", "satyr", "skritt", "ghoul", "goblin", "wolf", "ogre", "harpy", "gargoyle", "gnoll", "jinn", "arachne", "demon", "giant", "undead"
- Spells: "light", "fire", "dark", "ice", "lightning", "toxic"
- NPCs: {GoodNPCS: {"David", "Elena", "Gerald", "Hilda", "Ivan", "Jasmine", "Klaus", "Lena", "Morgan"}, BadNPCS: { "Nina", "Oliver", "Pamela", "Quentin", "Rita", "Samuel", "Tina", "Ursula", "Victor", "Wendy", "Xander", "Yvonne", "Zachary"}
- Primary quest: "The Lost Relic of Zanaris - to obtain the lost relic of Zanaris from the depths of the Cathedral."
- Secondary quest: "The Bandit King - to defeat the Bandit King and his minions in the Sanatorium."

**Key Points:**
- Act as both the first-person character and the narrator.
- Tell compelling stories in TONALITY for my CHARACTER.
- Your continuation of the story should be placed in gameData.story.
- Introduce preset GoodNPCs and BadNPCs NPCs as and when appropriate to the story.
- Inject humor, wit, and distinct storytelling.
- Always provide 3 potential actions the CHARACTER can take, fitting the THEME and CHARACTER's abilities per GAME rules. One should randomly be brilliant, ridiculous, or dangerous. Actions might be helpful, harmful, or neutral, reflecting the current situation.
- If the player wants to leave or quit the current conversation, give them choices to go or do something different. If there is a farewell in conversation, let it end.
- Places, enemies, NPCs and spells are predefined above. Do not introduce new ones.
- Manage combat state, NPC interactions, NPC speech to CHARACTER and item looting with strict adherence to the rules.
- Never speak for CHARACTER. Always offer choices and let the player decide.
- No direct ending of the game; always offer options unless stated "game over" by the player.
- Manage game state changes (\`inCombat\`, \`shopMode\`, \`lootMode\`) as detailed in the JSON structure.
- Always include \`gameData\` JSON object in responses, following the JSON structure.

Other Information:
Every spell in the game has manaCost.
There are 2 unique spells: Teleportation and Summon spells.

Example Initiation:
- If no story is present, begin. The game starts in a tavern at night. Use dynamic content for areas and time.

**JSON Response Structure**
gameData: {
    placeAndTime: {
        place: the place where the player is currently located,
        time: in HH:MM, 24hr format
    },
    story: your response to the player's last action,
    currentNPC: the name of the NPC the player is currently interacting with, if none. Set to \`null\`.
    event: { 
        shopMode: 'Weaponsmith', 'Spell Shop', 'Armorsmith', 'Potion Shop', 'Merchant', 'Market' or 'Shop' if there's currently a conversation happening with a seller npc, 
        lootMode: \`true\` if user chooses a choice about exploring a loot from choices, else will stay false. If an NPC gives an item or gold to the player, set to true and add the item-gold into \`gameData.lootBox\`,
        inCombat: \`'false\` when there's no chance for combat, but will be 'true' if there's any combat potential, or nearby enemies.
    },
    choices: [array containing 3 strings of choices and their effect e.g. 'go to bar','punch the bartender', 'leave the tavern'],
    enemy: {enemyName: "name of the enemy", enemyHp: "a number between 30 and 150"},
    lootBox: [array of items that the player can loot from an enemy or a chest in the format of {name: "item name", damage: "damage", price: "price", type: "item type", weaponClass: "weapon class", manaCost: "mana cost", element: "element", cooldown: "cooldown", amount: "amount", healing: "healing", point: "point"}]
}

Ensure you correctly toggle game states (\`inCombat\`, \`shopMode\`, \`lootMode\`), accurately represent items in \`lootBox\`, and use first-person narrative during NPC interactions. Keep information and instructions within story and conversation related to \`gameData.story\`.

Tailor each response to offer a rich, engaging RPG interaction focused on immersion and player choice, all within the gameData structured JSON format specified.
`;
	// Do not give same gameData.choices! Change the gameData.choices in all of your answers, change them according to the current gameData.story!
	// Do not ever give mathematical calculations in gameData.enemy.enemyHp! Don't ever do that, just give the result.
	// You are not creating a game in python, you will just give the JSON object named "gameData", like the example below.

	// Could you please make sure not to introduce line breaks or invalid control characters in the generated content? These characters can sometimes cause issues in data formats like JSON. If you encounter a situation where a line break or control character is necessary, please use appropriate escape sequences. Thank you!
	// Do not seperate story to more than 1 paragraphs! make it only 1 paragraph, so no line breaks. This is so important, JSON.parse getting bugged because of bad characters, if there are line breaks.

	const handleSubmit = async () => {
		if ($misc.query === '') {
			return
		}

		$game.gameData.choices = []

		$misc.loading = true
		chatMessages = [...chatMessages, { role: 'user', content: $misc.query }]

		console.log('myprompt: ', prompt)

		const response = await fetch('/api/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ prompt })
		})

		if (response.ok) {
		const responseData = await response.json() // Extract the JSON response data
		console.log('responseData: ', responseData);
		/*const responseData = {
			candidates: [
				{
					content: {
						parts: [
							{
								text: '{\n\t"gameData": {\n\t\t"placeAndTime": [\n\t\t\t{\n\t\t\t\t"place": "Tavern",\n\t\t\t\t"time": "22:30"\n\t\t\t}\n\t\t],\n\t\t"story": "I\'ll take you to your room now. Follow me.",\n\t\t"event": {\n\t\t\t"inCombat": false,\n\t\t\t"shopMode": "Merchant",\n\t\t\t"lootMode": false\n\t\t},\n\t\t"choices": [],\n\t\t"enemy": {},\n\t\t"lootBox": []\n\t}\n}'
							}
						],
						role: 'model'
					},
					finishReason: 'STOP',
					index: 0,
					safetyRatings: [
						{
							category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
							probability: 'NEGLIGIBLE'
						},
						{
							category: 'HARM_CATEGORY_HATE_SPEECH',
							probability: 'NEGLIGIBLE'
						},
						{
							category: 'HARM_CATEGORY_HARASSMENT',
							probability: 'NEGLIGIBLE'
						},
						{
							category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
							probability: 'NEGLIGIBLE'
						}
					]
				}
			],
			promptFeedback: {
				safetyRatings: [
					{
						category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
						probability: 'NEGLIGIBLE'
					},
					{
						category: 'HARM_CATEGORY_HATE_SPEECH',
						probability: 'NEGLIGIBLE'
					},
					{
						category: 'HARM_CATEGORY_HARASSMENT',
						probability: 'NEGLIGIBLE'
					},
					{
						category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
						probability: 'NEGLIGIBLE'
					}
				]
			}
		}*/
		//try fix shit
		let gameData = responseData?.candidates[0].content.parts[0].text.replace('```','').replace('json','');
		gameData = await parse(gameData);
		console.log(Object.keys(gameData).length);
		if(Object.keys(gameData).length > 0 && !('gameData' in gameData)) gameData = {gameData: {...gameData}}
		console.log('gameData', gameData);
		let hpOfEnemy = 0

		if ($game.gameData?.enemy?.enemyHp) {
			hpOfEnemy = $game.gameData.enemy.enemyHp
		}
		$game = gameData
		if (hpOfEnemy && $game.gameData?.enemy?.enemyHp) {
			$game.gameData.enemy.enemyHp = hpOfEnemy
		}
		console.log('THIS IS $game: ', $game)

		$misc.started = true

		$misc.place = $game.gameData.placeAndTime?.place
		$misc.time = $game.gameData.placeAndTime?.time

		if (!$game.gameData.enemy?.enemyMaxHp) {
			if ($game.gameData.enemy?.enemyHp) {
				$game.gameData.enemy.enemyMaxHp = $game.gameData.enemy.enemyHp
			}
		}
		fetchImg()

		if ($game.gameData.event?.shopMode && $game.gameData.shop?.length != 4) {
			mixBuyables($game.gameData.event.shopMode)
		}

		chatMessages = [...chatMessages, { role: 'assistant', content: $game }]
		$misc.loading = false
		} else {
			console.error('HTTP Error:', response.status, response.statusText)
		}
	}

	let handleErr: boolean = false
	function handleError<T>(err: T) {
		console.error('error from client: ', err)

		handleErr = true

		setTimeout(() => {
			giveYourAnswer(answer)
		}, 1000)
	}

	//logic to shuffle shop items at shop
	function shuffleItems(items: any) {
		// start at the end of the array and work backwards
		for (let i = items?.length - 1; i > 0; i--) {
			// pick a random index between 0 and i (inclusive)
			const j = Math.floor(Math.random() * (i + 1))

			// swap the current element with the randomly selected one
			;[items[i], items[j]] = [items[j], items[i]]
		}

		// return the first six shuffled items
		return items.slice(0, 4)
	}

	function mixBuyables(category: any) {
		let items
		switch (category) {
			case 'Weaponsmith':
			case 'Armorsmith':
			case 'Blacksmith':
				items = buyWeapons
				break
			case 'SpellShop':
			case 'Spell Shop':
			case 'Shop':
			case 'Marketplace':
				items = buySpells
				break
			case 'PotionShop':
			case 'Potion Shop':
			case 'Market':
			case 'Merchant':
				// case 'Bartender':
				// case 'Inn Keeper':
				items = buyPotions
				break
			default:
				items = buyPotions
				$game.gameData.shopMode = null
				break
		}
		$game.gameData.shop = shuffleItems(items)
	}

	//this is the function to canalize player's answer to chatGPT
	function giveYourAnswer(choice: any) {
		if (!choice) return
		$game.gameData.story = ''

		//increase all the $coolDowns by 1 with every choice
		for (const key in $coolDowns) {
			if ($coolDowns.hasOwnProperty(key)) {
				$coolDowns[key] += 1
			}
		}

		$selectedItem.showDescription = 'none'

		$game.gameData.choices = []
		$game.gameData.shop = []

		$misc.query = choice

		try {
			if (chatMessages?.length) {
				prompt = choice
			}
			handleSubmit()
			$misc.query = ''
			answer = ''
		} catch (error) {
			handleError(error)
		}

		if ($misc.started == false) {
			$misc.started = true
		}
	}

	//message loading animation logic
	let dotty: any = '.'
	setInterval(() => {
		if (dotty == '...') {
			dotty = ''
		}
		dotty += '.'
	}, 400)

	//function to handle emittedAnswers
	function handleEmittedAnswer(event: any) {
		giveYourAnswer(event.detail.answer)
	}

	//function to start the game in "medieval starter" conditions
	function startMedievalGame(event: any) {
		chatMessages = []
		$game.gameData.lootBox = []
		$game.gameData.placeAndTime = []

		$game.gameData.shop = []
		$game.gameData.choices = []
		$game.gameData.enemy = []
		$game.gameData.event = []
		$selectedItem = {}
		$character.gold = 30

		if ($game.gameData.heroClass == 'mage') {
			$character.stats = [{ hp: 80, maxHp: 80, mp: 110, maxMp: 110 }]
			$character.spells = [...medievalMageSpells]
			$character.inventory = [...medievalMageInventory]
		} else if ($game.gameData.heroClass == 'warrior') {
			$character.stats = [{ hp: 110, maxHp: 110, mp: 80, maxMp: 80 }]
			$character.spells = [...medievalWarriorSpells]
			$character.inventory = [...medievalWarriorInventory]
		}
		giveYourAnswer(event.detail.answer)
	}

	function getRandomNumber(num: any) {
		return Math.floor(Math.random() * num) + 1
	}

	//extract game hour from chatGPT response
	function extractHours(timeString: any) {
		const hour = parseInt(timeString.split(':')[0], 10)
		return hour
	}

	//fetch img according to player's current place from database
	async function fetchImg() {
		// check if place is the same
		if ($game.gameData.placeAndTime?.place == $misc.currentImg) return

		const places: any = [...staticPlaces]

		// check current place of player
		function checkPlace(str: any) {
			let matchingPlaces: any = places.filter((place: any) => str?.includes(place))

			if (matchingPlaces == 'Town Inn' || matchingPlaces == 'Town Tavern') {
				matchingPlaces = 'Inn'
				return matchingPlaces
			} else if (
				matchingPlaces.includes('Outskirts') ||
				matchingPlaces.includes('outskirts') ||
				matchingPlaces.includes('Road') ||
				matchingPlaces.includes('road')
			) {
				matchingPlaces = 'Forest'
				return matchingPlaces
			} else if (matchingPlaces.includes('Garden') || matchingPlaces.includes('garden')) {
				matchingPlaces = 'Garden'
				return matchingPlaces
			} else if (matchingPlaces.includes('River') || matchingPlaces.includes('river')) {
				matchingPlaces = 'River'
				return matchingPlaces
			} else if (matchingPlaces.includes('Island') || matchingPlaces.includes('island')) {
				matchingPlaces = 'Island'
				return matchingPlaces
			} else if (matchingPlaces.includes('Village') || matchingPlaces.includes('village')) {
				matchingPlaces = 'Village'
				return matchingPlaces
			} else if (matchingPlaces.includes('Mine') || matchingPlaces.includes('mine')) {
				matchingPlaces = 'Cave'
				return matchingPlaces
			}
			return matchingPlaces?.length > 0 ? matchingPlaces[0] : null
		}
		//list images to get the image amount
		/*
		const { data: imgs } = await supabase.storage.from('imgs').list(checkPlace($misc.place), {
			limit: 100,
			offset: 0,
			sortBy: { column: 'name', order: 'asc' }
		})*/

		//fetch images based on time and place
		let finalImg: any
		/*
		if (imgs) {
			if (
				(checkPlace($misc.place) == 'Town' ||
					checkPlace($misc.place) == 'City' ||
					checkPlace($misc.place) == 'Forest' ||
					checkPlace($misc.place) == 'Woods') &&
				(extractHours($misc.time) >= 18 || extractHours($misc.time) <= 6)
			) {
				const { data: img, error } = await supabase.storage
					.from('imgs')
					.download(`${checkPlace($misc.place)}-night/${getRandomNumber(imgs?.length - 1)}.webp`)
				finalImg = img
			} else {
				const { data: img, error } = await supabase.storage
					.from('imgs')
					.download(`${checkPlace($misc.place)}/${getRandomNumber(imgs?.length - 1)}.webp`)
				finalImg = img
			}
		}

		const reader = new FileReader()

		if (finalImg) {
			reader.readAsDataURL(finalImg)
		} else {
			return
		}

		//fade in and out across the fetched images
		reader.onload = () => {
			if (!$bgImage.img1active) {
				$bgImage.fetchedBg1 = reader.result
				$bgImage.img1active = !$bgImage.img1active
				$bgImage.img2active = !$bgImage.img1active
			} else if (!$bgImage.img2active) {
				$bgImage.fetchedBg2 = reader.result
				$bgImage.img2active = !$bgImage.img2active
				$bgImage.img1active = !$bgImage.img2active
			}
		}*/

		$misc.currentImg = $misc.place
	}
</script>
<div>
	

	{#if !$misc.started}
		<GameStartWindow on:emittedAnswer={startMedievalGame} />
	{/if}

	<MessageWindows />

	<!-- item description window (out of ui) -->
	<DescriptionWindow />
	<!-- item description window  -->

	<!-- game ui starts here -->
	{#if $misc.started}
		<div class="main-game">
			<!-- chatGPT answer box starts here -->
			<div transition:fade={{ duration: 1000 }} class="game-master">
				{#if $game.gameData.story}
					<p>
						<TextGenerateEffect words={$game.gameData.story} />
					</p>
				{/if}
				{#if !$game.gameData.story}
					<ChatMessage message={dotty} />
				{/if}
			</div>
			<!-- chatGPT answer box ends here -->

			<!-- game controls ui starts here-->
			<div transition:fade={{ duration: 2000 }} class="game-controls">
				<ActionBox
					title={'Inventory'}
					actions={$character.inventory}
					on:emittedAnswer={handleEmittedAnswer}
				/>
				{#if $misc.started}
					<div class="choices">
						<Choices on:emittedAnswer={handleEmittedAnswer} />
					</div>
				{/if}

				<ActionBox
					title={'Spells'}
					actions={$character.spells}
					on:emittedAnswer={handleEmittedAnswer}
				/>
			</div>
			<!-- game controls ui ends here-->
		</div>

		<!-- Static tavern prompts -->
		<!-- {#if (!$misc.loading && $game.gameData.placeAndTime && $game.gameData.placeAndTime.place.includes('Tavern')) || ($game.gameData.placeAndTime && $game.gameData.placeAndTime.place.includes('Inn'))}
			<div transition:fade={{ duration: 3000 }}>
				<StaticPrompts on:emittedAnswer={handleEmittedAnswer} />
			</div>
		{/if} -->
	{/if}
	<!-- game ui ends here -->

	<UiButtons on:emittedAnswer={handleEmittedAnswer} />
</div>
