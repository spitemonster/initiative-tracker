<template>
    <div class="grid--12" id="app">
        <section :class="{awaiting: awaiting}" class="initiative-tracker">
            <Character v-for="a in agents" :character="a" :key="a.name"></Character>
        </section>
        <section class="character-add">
            <label>Initiative <input type="text" v-model="newCharacter.initiative" /></label>
            <label>Name <input type="text" v-model="newCharacter.name"></label>
            <div class="add-type">
                <label>Lair<input type="radio" name="addType" v-model="addType" value="lair"><span>✓</span></label>
                <label>Boss<input type="radio" name="addType" v-model="addType" value="boss"><span>✓</span></label>
                <label>Mook<input type="radio" name="addType" v-model="addType" value="mook" checked><span>✓</span></label>
            </div>
            <label>Current HP <input type="text" v-model="newCharacter.hp"></label>
            <label>Max HP <input type="text" v-model="newCharacter.hpMax"></label>
            <button class="btn btn--small" @click="addCharacter">+</button>
            <button class="btn btn--x-small hide" @click="toggleCharacterAdd"><span></span></button>
        </section>
        <div class="button-wrap">
            <label><span>Randomize</span> <input type="checkbox" v-model="randomInitiative"><span>✓</span></label>
            <button @click="endTurn" class="endTurn btn">End &nbsp; <span v-if="!lastRound">Turn</span><span v-else>Round</span></button>
            <button @click="reset" class="btn">Reset</button>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Bus from './index.ts';
import names from './names.json';
import Character from './components/character.vue';
import { Condition, Agent, HPData } from './interfaces.ts';

@Component({
    components: {
        Character
    }
})
export default class App extends Vue {
    tracker: HTMLElement | null;
    characterAdd: HTMLElement | null;
    defaultAgents: Agent[];
    agents: Agent[];
    newCharacter: Agent;
    names!: string[];
    awaiting: boolean;
    conditionHold: Condition | null;
    conditionTarget: string;
    randomInitiative: boolean;
    currentAgent: string;
    lastRound: boolean;
    addType: string;

    constructor() {
        super();

        this.names = names.names;
        this.tracker = document.querySelector('.initiative-tracker');
        this.characterAdd = document.querySelector('.character-add');
        this.awaiting = false;
        this.conditionHold = null;
        this.conditionTarget = '';
        this.randomInitiative = false;
        this.currentAgent = '';
        this.lastRound = false;
        this.addType = 'mook';

        this.newCharacter = {
            id: '',
            name: '',
            initiative: 0,
            npc: true,
            hp: 0,
            conditions: [],
            turnOver: false,
            unconscious: false,
            notes: '',
            removable: true,
            awaitingTarget: false,
            first: false
        }

        this.defaultAgents = [{
                "id": this.randomStr(),
                "hp": 0,
                "npc": false,
                "name": "Arlis",
                "initiative": 0,
                "conditions": [],
                "turnOver": false,
                "unconscious": false,
                "initiativeBonus": 0,
                "notes": '',
                removable: false,
                awaitingTarget: false,
                first: false
            },
            {
                "id": this.randomStr(),
                "hp": 0,
                "npc": false,
                "name": "Bale",
                "initiative": 0,
                "conditions": [],
                "turnOver": false,
                "unconscious": false,
                "initiativeBonus": 0,
                "notes": '',
                removable: false,
                awaitingTarget: false,
                first: false
            },
            {
                "id": this.randomStr(),
                "hp": 0,
                "npc": false,
                "name": "KZ",
                "initiative": 0,
                "conditions": [],
                "turnOver": false,
                "unconscious": false,
                "initiativeBonus": 0,
                "notes": '',
                removable: false,
                awaitingTarget: false,
                first: false
            },
            {
                "id": this.randomStr(),
                "hp": 0,
                "npc": false,
                "name": "Roach",
                "initiative": 0,
                "conditions": [],
                "turnOver": false,
                "unconscious": false,
                "initiativeBonus": 0,
                "notes": '',
                removable: false,
                awaitingTarget: false,
                first: false
            }
        ];

        this.agents = this.defaultAgents;
    }

    randomStr(): string {
        // generates a random string to use as character ids for later use
        let str = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        return str;
    }

    rollD(sides: number): number {
        // give it sides and return a roll based on the number of sides
        return Math.ceil(Math.random() * sides);
    }

    resetNewCharacter(): void {
        this.newCharacter = {
            id: '',
            name: '',
            initiative: 0,
            npc: true,
            hp: 0,
            conditions: [],
            turnOver: false,
            unconscious: false,
            notes: '',
            removable: true,
            awaitingTarget: false
        };
    }

    randomName(): string {
        // grab a random name from the name generator
        return this.names[Math.floor(Math.random() * this.names.length)]
    }

    getInitiative(): number {
        // we use this to get the initiative for an individual player
        return this.rollD(20) + this.rollD(4);
    }

    findAgent(target: string): Agent {
        let a = this.agents.find(a => a.id === target);

        if (!a) {
            return this.newCharacter;
        }

        return a;
    }

    addCharacter(): void {
        if (this.newCharacter.initiative == '0') {
            this.newCharacter.initiative = this.getInitiative();
        }

        this.newCharacter.id = this.randomStr()

        if (this.newCharacter.hpMax) {
            this.newCharacter.hp = this.newCharacter.hpMax
        }

        if (this.newCharacter.name) {
            this.newCharacter.npc = false
        } else {
            this.newCharacter.name = this.names[Math.floor(Math.random() * this.names.length)]
            this.newCharacter.hp = 3;
        }

        if (this.addType === 'lair') {
            this.newCharacter.initiative = 99
            this.newCharacter.npc = false
        }

        // instead of rolling initiative or sorting by initiative each time a new character is added, just drop the new character in where they are in the initiative order
        for (let i = 0, l = this.agents.length; i < l; i++) {
            // a is current agent in agents array
            let a = this.agents[i]
            // n is the next agent, or returns false if a is the last agent
            let n = this.agents[i + 1] ? this.agents[i + 1] : false

            if (this.newCharacter.initiative > a.initiative && i == 0) {
                this.agents.unshift(this.newCharacter)
                break;
            } else if (a.initiative >= this.newCharacter.initiative && (!n || n.initiative <= this.newCharacter.initiative)) {
                if (a.turnOver) {
                    this.newCharacter.turnOver = true;
                }

                this.agents.splice(this.agents.indexOf(a) + 1, 0, this.newCharacter)
                break;
            } else if (!n || n.initiative >= this.newCharacter.initiative) {
                this.agents.push(this.newCharacter)
                break;
            }
        }

        this.resetNewCharacter()
    }

    sortByInitiative(): void {
        this.agents.sort((a, b) => (a.initiative > b.initiative) ? -1 : 1);

        this.currentAgent = this.agents[0].id
    }

    rollInitiative(first ? : boolean): void {
        this.lastRound = false;
        this.agents.forEach((a) => {

            if (this.randomInitiative || first) {
                a.initiative = this.getInitiative() + (a.initiativeBonus ? a.initiativeBonus : 0)
            }

            a.turnOver = false;
        })

        this.sortByInitiative()
    }

    endTurn(): void {
        // felt weird about mutating a reference to an object, so instead this.currentAgent is set to the currentAgent's id, and we grab the actual agent object instead
        let currentAgent = this.findAgent(this.currentAgent);
        // at the end of a turn
        // filter through the next agent's conditions

        if (!currentAgent) {
            return
        }

        if (currentAgent && currentAgent.conditions) {
            currentAgent.conditions.forEach((c) => {
                // reduce their duration by one
                c.duration -= 1;

                // if any conditions have a duration less than or equal to 0, remove that conditions
                if (c.duration <= 0 && currentAgent && currentAgent.conditions) {
                    this.removeFrom(currentAgent.conditions, c)
                }
            })
        }

        // then we get the current agent, remove it from the agents array and then push it to the end, after we set "turn over" to true
        let prev = this.removeFrom(this.agents, currentAgent)

        prev.turnOver = true;
        this.agents.push(prev)

        // then we set the current agent to the first agent in the array
        this.currentAgent = this.agents[0].id

        // then we check if this is the last round. if it is, we roll initiative again and start over
        if (this.lastRound) {
            this.rollInitiative()
        } else if (this.agents[1].turnOver) {
            // if it's not, but it's about to be, set last round to true
            this.lastRound = true;
        }
    }

    // here we overload the removeFrom method.
    // if the arguments given to removeFrom are Agents, return an Agent
    removeFrom(arr: Agent[], target: Agent): Agent;
    // if the arguments given to removeFrom are Conditions, return a Condition
    removeFrom(arr: Condition[], target: Condition): Condition;
    // here is where we actually declare the method. we have to type the arguments and return as any, or the compiler throws a fit, but the function will only accept Agent[]s, Condition[]s, Agents or Conditions as arguments or throw an error later.
    removeFrom(arr: any, target: any): any {
        // i return to splice a lot in this program so i am replacing the half dozen or so places i use it with this utility function
        // given an array and a target, find the index of the target and remove it
        return arr.splice(arr.indexOf(target), 1)[0]
    }

    toggleCharacterAdd(): void {

        if (!this.characterAdd) {
            return;
        }

        if (this.characterAdd.classList.contains('show')) {
            return this.characterAdd.classList.remove('show')
        }

        this.characterAdd.classList.add('show')
    }

    persist(): void {
        localStorage.setItem('agents', JSON.stringify(this.agents));
        localStorage.setItem('awaiting', JSON.stringify(this.awaiting));
        localStorage.setItem('randomInitiative', JSON.stringify(this.randomInitiative));
        localStorage.setItem('lastRound', JSON.stringify(this.lastRound));
        localStorage.setItem('conditionHold', JSON.stringify(this.conditionHold));
        localStorage.setItem('conditionTarget', JSON.stringify(this.conditionTarget));
        localStorage.setItem('currentAgent', JSON.stringify(this.currentAgent));
        localStorage.setItem('randomInitiative', JSON.stringify(this.randomInitiative));
    }

    loadFromStorage(): void {

        // JSON.parse() expects a string, but any of these local storage items could potentially be undefined
        // so we give an OR operator and instead return an empty element of the required type if local storage is empty
        this.agents = JSON.parse(localStorage.getItem('agents') || JSON.stringify(this.defaultAgents));
        this.awaiting = JSON.parse(localStorage.getItem('awaiting') || 'false');
        this.randomInitiative = JSON.parse(localStorage.getItem('randomInitiative') || 'false');
        this.lastRound = JSON.parse(localStorage.getItem('lastRound') || 'false');
        this.conditionHold = JSON.parse(localStorage.getItem('conditionHold') || 'null');
        this.conditionTarget = JSON.parse(localStorage.getItem('conditionTarget') || '');
        this.currentAgent = JSON.parse(localStorage.getItem('currentAgent') || '');
    }

    focus(id: string) {
        let target = document.querySelector(`[data-id="${id}"]`);

        if (target && this.tracker) {
            this.tracker.classList.add('focusing');
            target.classList.add('focused');
        }
    }

    removeFocus(): void {
        let target = document.querySelector(`.focused`);


        if (target && this.tracker) {
            this.tracker.classList.remove('focusing')
            target.classList.remove('focused')
        }
    }

    reset(): void {
        // need a way to remove everyone but the default array
        // spread operator to copy the default array instead of making agents a reference to it
        this.agents = [...this.defaultAgents];

        // clear local storage
        localStorage.clear()

        // set used properties to default values
        this.awaiting = false;
        this.conditionHold = null;
        this.conditionTarget = '';
        this.randomInitiative = false;
        this.lastRound = false;
        this.currentAgent = '';

        // reroll initiative
        this.rollInitiative(true);

        // save everything to local storage again
        this.persist();
    }

    @Watch('agents', { immediate: false, deep: true })
    onAgentsChanged(val: string, oldVal: string) {
        this.persist();
    }

    mounted() {

        if (localStorage.getItem('agents')) {
            this.loadFromStorage();
        } else {
            // spread operator to copy the default array instead of making agents a reference to it
            // this prevents any changes to agents affecting the default array
            this.agents = [...this.defaultAgents]
            this.rollInitiative(true);
        }

        this.resetNewCharacter();

        this.currentAgent = this.agents[0].id
        this.tracker = this.$el.querySelector('.initiative-tracker');
        this.characterAdd = this.$el.querySelector('.character-add');

        Bus.$on('addCondition', (data: any) => {
            let target;
            let agent = this.findAgent(data.target)

            if (agent && data.condition.type === 'Frightened' || data.condition.type === 'Charmed' || data.condition.type === 'Grappled') {
                this.awaiting = true;
                agent.awaitingTarget = true;
                this.conditionTarget = agent.id;
                this.conditionHold = data.condition;
            } else {

                if (agent && agent.conditions && data.condition) {
                    agent.conditions.push(data.condition)
                }
            }
        })

        Bus.$on('removeCondition', (data: any) => {
            // when clicking on a condition, you manually remove it from the character
            let agent = this.findAgent(data.target)
            let condition = data.condition;

            this.removeFocus()

            if (agent.conditions) {
                this.removeFrom(agent.conditions, condition);
            }

        })

        Bus.$on('selectCharacter', (id: string) => {
            // this fires when clicking on the + icon on the left of a character card.
            // if we're not waiting for character selection, exit
            if (!this.awaiting) {
                return;
            }

            let targetAgent = this.findAgent(this.conditionTarget)
            // otherwise, set the turn target as the passed id
            // add the condition to the condition target then reset the values to their default
            if (this.conditionHold && targetAgent && targetAgent.conditions) {
                this.conditionHold.turnTarget = id;
                targetAgent.conditions.push(this.conditionHold);
            }

            this.conditionHold = null;
            this.conditionTarget = '';
            this.awaiting = false;
        })

        Bus.$on('focusTarget', (id: string) => this.focus(id));

        Bus.$on('removeFocus', this.removeFocus);

        Bus.$on('changeHP', (data: HPData) => {
            // this was initially two functions, one for healing and one for hurting but it wasn't very DRY so with a little additional logic i've reduced it to one function with just a couple more lines
            // if the type of change is 'hurt', set the amount to a negative. otherwise, the amount stays the same
            let amount = data.type === 'hurt' ? data.amount * -1 : data.amount * 1;

            // get the target agent
            let agent = this.findAgent(data.target)

            // if the agent is not an npc (which is to say, a mook), add the amount (positive or negative) to the agent's current HP
            if (!agent.npc && agent.hp) {
                agent.hp = agent.hp * 1 + amount;
            } else if (agent.hp < 3 && data.type === 'heal') {
                // otherwise, as long as the agent's HP is less than 3 and the type is 'heal', increase it by one
                agent.hp++
            } else if (data.type === 'hurt' && agent.hp > 0) {
                // otherwise, if the type is hurt and the agent's HP is greater than 0, reduce hp by 1
                agent.hp--
            }

            // if the agent was healed above 0, it is no longer unconscious.
            if (agent.hp <= 0) {
                agent.hp = 0;
                agent.unconscious = true;
            } else {
                // otherwise it is unconscious
                agent.unconscious = false
            }
        })

        Bus.$on('updateNotes', (data: any) => {
            let agent = this.findAgent(data.target)

            agent.notes = data.notes;
        })

        Bus.$on('removeCharacter', (id: string) => {
            let agent = this.findAgent(id);

            this.removeFrom(this.agents, agent);
        })

        this.persist();

        // add a listener to save data before a refresh, just in case
        window.addEventListener('beforeunload', this.persist)
    }
}

</script>
<style lang="css">
</style>
