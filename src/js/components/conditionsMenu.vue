<template>
    <div class="conditions">
        <button @click="toggle()" class="btn btn--x-small closeButton">X</button>
        <select v-model="newCondition.type">
            <option value="Baned">BANED</option>
            <option value="Blessed">BLESSED</option>
            <option value="Blinded">BLINDED</option>
            <option value="Burning">BURNING</option>
            <option value="Charmed">CHARMED</option>
            <option value="Commanded">COMMANDED</option>
            <option value="Deafened">DEAFENED</option>
            <option value="Frightened">FRIGHTENED</option>
            <option value="Grappled">GRAPPLED</option>
            <option value="Injured">INJURED</option>
            <option value="Ongoing">ONGOING</option>
            <option value="Paralyzed">PARALYZED</option>
            <option value="Poisoned">POISONED</option>
            <option value="Restrained">RESTRAINED</option>
            <option value="Slowed">SLOWED</option>
            <option value="Stunned">STUNNED</option>
        </select>
        <select v-model="newCondition.duration">
            <option value="1">1 ROUND</option>
            <option value="10">1 MINUTE</option>
            <option value="100">10 MINUTE</option>
            <option value="1000">UNTIL SAVE</option>
        </select>
        <label v-show="newCondition.type === 'Ongoing'">ONGOING DAMAGE <input type="text" v-model="newCondition.damage"></label>
        <label v-show="newCondition.type === 'Injured'">INJURY <input type="text" v-model="newCondition.injury" class="injury"></label>
        <label>CAN SAVE? <input type="checkbox" v-model="newCondition.canSave" /><span>✓</span></label>
        <label v-show="newCondition.canSave">DC <input type="text" class="saveDC" v-model="newCondition.saveDC" /></label>
        <label v-show="newCondition.canSave"><select v-model="newCondition.saveType" class="saveType">
                <option value="Str">STRENGTH</option>
                <option value="Dex">DEXTERITY</option>
                <option value="Con">CONSTITUTION</option>
                <option value="Int">INTELLIGENCE</option>
                <option value="Wis">WISDOM</option>
                <option value="Cha">CHARISMA</option>
            </select></label>
        <button @click="addCondition" class="btn btn--small">Add</button>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Bus from '../index.ts';
import { Condition, Agent } from '../interfaces.ts';

@Component
export default class conditionsMenu extends Vue {
    newCondition: Condition;

    constructor() {
        super();

        this.newCondition = {
            type: '',
            duration: 0,
            saveDC: '',
            saveType: '',
            canSave: false,
            turnTarget: ''
        }

        // this.character = null;
    }

    mounted() {
        this.newCondition = {
            type: "Baned",
            duration: 1,
            saveDC: '10',
            saveType: 'Strength',
            canSave: false,
            turnTarget: '',

        }
    }

    @Watch('newCondition', { deep: true })
    onNewConditionChanged() {
        if (this.newCondition.duration == 1000) {
            this.newCondition.canSave = true;
        }
    }

    @Prop() character!: Agent;


    toggle() {
        let saveDC = this.$el.querySelector('.saveDC');
        let saveType = this.$el.querySelector('.saveType');

        if (this.$el.classList.contains('open') && saveDC && saveType) {

            saveDC.classList.remove('error')
            saveType.classList.remove('error')
            return this.$el.classList.remove('open')
        }

        this.$el.classList.add('open');
    }
    addCondition(e: any) {
        let saveDC = this.$el.querySelector('.saveDC');
        let saveType = this.$el.querySelector('.saveType');

        let data = {
            target: this.character,
            condition: this.newCondition
        }

        if ((this.newCondition.canSave && this.newCondition.saveDC !== null || this.newCondition.saveType !== null) || !this.newCondition.canSave) {
            Bus.$emit('addCondition', data)

            this.newCondition = {
                type: "Blinded",
                duration: 1,
                saveDC: '10',
                saveType: 'Strength',
                canSave: false,
                turnTarget: ''
            }

            if (saveDC && saveType) {
                saveDC.classList.remove('error')
                saveType.classList.remove('error')
            }

            this.toggle();
        } else {
            if (this.newCondition.saveDC == null && saveDC) {
                saveDC.classList.add('error')
            }

            if (this.newCondition.saveType == null && saveType) {
                saveType.classList.add('error')
            }
        }

    }

}

</script>
<style lang="css">
</style>
