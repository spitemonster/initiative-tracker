<template>
    <div :class="{turnOver: character.turnOver, unconscious: character.unconscious, ignore: character.awaitingTarget}" class="character-card" :data-id="character.id">
        <div class="character-card__open" @click="select" :data-str="character.id"><span></span><span></span></div>
        <div class="character-card__initiative">
            {{ character.initiative }}
        </div>
        <div class="character-card__name">
            <p>{{ character.name }} <span v-if="character.npc">(MOOK)</span></p>
        </div>
        <div class="character-card__hitpoints" v-show="character.npc">
            <button @click="changeHP('hurt')" class="btn btn-hurt"><i class="las la-crutch"></i></button>
            <span v-for="n in character.hp"></span>
            <button @click="changeHP('heal')" class="btn btn-heal"><i class="las la-band-aid"></i></button>
        </div>
        <div class="character-card__hitpoints" v-show="character.hpMax">
            <button @click="toggle('.hurt')" class="btn btn-hurt"><i class="las la-crutch"></i></button>
            <div>{{character.hp}} / {{ character.hpMax }}</div>
            <button @click="toggle('.heal')" class="btn btn-heal"><i class="las la-band-aid"></i></button>
            <div class="hurt">
                <button @click="toggle('.hurt')" class="closeButton">X</button>
                <label>Damage <input type="text" v-model="amount" /></label>
                <button @click="changeHP('hurt')" class="btn btn--x-small">Hurt</button>
            </div>
            <div class="heal">
                <button @click="toggle('.heal')" class="closeButton">X</button>
                <label>Healing <input type="text" v-model="amount" /></label>
                <button @click="changeHP('heal')" class="btn btn--x-small">Heal</button>
            </div>
        </div>
        <div class="character-card__empty" v-if="!character.hpMax && !character.npc" style="--span: 2;">
        </div>
        <div class="character-card__notes">
            <textarea @change="updateNotes" placeholder="Notes on location, descriptive attributes"></textarea>
        </div>
        <div class="character-card__conditions">
            <p :class="c.type.toLowerCase()" class="condition-marker" v-for="c in character.conditions" :data-target="c.turnTarget" v-on="c.turnTarget ? {mouseover: () => focusTarget(c.turnTarget), mouseout: removeFocus} : {}" @click="removeCondition(c, $event)" :data-type="c.type" :data-save="c.canSave ? '(DC ' + c.saveDC + c.saveType + ')': null">
                {{c.type}}
                <span v-if="c.damage">: {{ c.damage }}</span>
                <span v-else-if="c.type === 'Burning'">: 2d4</span>
                <span v-if="c.canSave">(DC{{c.saveDC}} {{c.saveType}})</span>
                <span v-if="c.type === 'Injured'">({{ c.injury }})</span>
            </p>
        </div>
        <div class="character-card__utility">
            <button @click="toggle('.conditions')">+</button>
            <conditionsMenu ref="conditionsMenu" :character="character.id"></conditionsMenu>
        </div>
        <button @click="removeCharacter" v-if="character.removable" class="btn remove-character btn--x-small"><span>X</span></button>
    </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import conditionsMenu from './conditionsMenu.vue';
import Bus from '../index.ts';
import { Condition, Agent } from '../interfaces.ts';

@Component({
    components: {
        conditionsMenu
    }
})
export default class Character extends Vue {
    conditionMenu: HTMLElement | null;
    healing: number;
    damage: number;
    amount: number;

    constructor() {
        super();

        // this.character = null;
        this.conditionMenu = null;
        this.healing = 0;
        this.damage = 0;
        this.amount = 0;
    }

    mounted() {
        this.conditionMenu = this.$el.querySelector('.conditions');
    }

    @Prop() character!: Agent;

    select() {
        if (this.character && !this.character.awaitingTarget) {
            Bus.$emit('selectCharacter', this.character.id)
        }
    }
    openCondition() {
        if (this.conditionMenu) {
            this.conditionMenu.classList.add('open')
        }
    }
    closeCondition() {
        if (this.conditionMenu) {
            this.conditionMenu.classList.remove('open')
        }
    }
    removeCondition(condition: Condition) {
        let data;

        if (this.character && this.character.id) {
            data = {
                target: this.character.id,
                condition: condition
            }
        }


        Bus.$emit('removeCondition', data)
    }
    focusTarget(id: string) {
        if (id) {
            Bus.$emit('focusTarget', id)
        }
    }
    removeFocus() {
        Bus.$emit('removeFocus')
    }
    changeHP(type: string) {
        let data;
        if (this.character && this.character.id) {
            data = {
                target: this.character.id,
                amount: this.amount,
                type: type
            }
        }

        Bus.$emit('changeHP', data)

        if (this.character && !this.character.npc) {
            this.toggle(`.${type}`)
        }

        this.amount = 0
    }
    toggle(targetElement: string) {
        let t = this.$el.querySelector(targetElement)
        if (!t) {
            return
        }

        if (t.classList.contains('open')) {
            return t.classList.remove('open')
        }

        t.classList.add('open')
    }
    updateNotes(e: any) {
        let data;

        if (e && e.target && this.character) {
            data = {
                notes: e.target.value,
                target: this.character.id
            }
        }

        Bus.$emit('updateNotes', data)
    }
    removeCharacter() {
        if (this.character) {
            Bus.$emit('removeCharacter', this.character.id)
        }
    }
}

</script>
<style lang="scss">
</style>
