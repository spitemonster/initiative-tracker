# Initiative Tracker

A tool I created for managing combat in the TTRPG, based on D&D 5e, that I run for friends. Partially conceived out of boredom, I mostly had a list of unfulfilled desires and requirements that were not met by other initiative tracking methods.

## Features

* Randomize turn order each round. I appreciate the chaos this brings to the table in combat rounds and helps to speed things up because it forces players to pay attention to what is going on. The player character data structure allows for adding an initiative bonus to give players a bit of an edge, if desired.

* Add Mooks, Bosses and Lair Actions on the fly. Mooks are basic enemies, with randomly generated names from `names.json` that exist purely to take a couple hits before going down; they do not recieve full numbered HP and instead get 3 "hits." Bosses are named enemies with full numbered HP. Lair actions are not fully implemented, but when they are, they have no HP and always go first in the turn order.

* Track damage on Mooks and HP on Bosses. Mooks have 3 hit tokens that can be reduced one at a time until 0. Bosses have numbered HP that can be modified at will.

* Add, track and remove status effects from all parties. D&D 5e has a number of statuses that can be applied to creatures, the post-apocalyptic homebrew that I run has these and more. I often found I would forget to make note of these effects when tracking initiative any other way, so this has a built in facility for adding and removing status effects from creatures, some of which even have little animations because I'm fun. Can't you tell how fun I am? Statuses can be set to end after a certain number of rounds, or until save. They can be removed manually at any point and as many can stack as will reasonably fit on the card.

* Uses local storage for keeping data between browser sessions.

## Build and Run

`git clone https://github.com/spitemonster/initiative-tracker.git`

`cd initiative-tracker`

`npm install`

Open the HTML file in your browser, or host it and the `dist` folder on your server of choice. See a live version [here](https://spitemonster.com/initiative).

## Roadmap

As mentioned above, I'd like to add Lair Actions to initiative, and there are some minor bugfixes that need to be implemented. However, given that our game is basically on hold during the pandmic (at time of writing), my interest in working on this project is negligible.
