export interface Condition {
    type: string,
        duration: number,
        saveDC: string,
        saveType: string,
        canSave: boolean,
        turnTarget: string
}

export interface Agent {
    id: string,
        hp: number,
        hpMax ? : number,
        npc: boolean,
        name: string,
        initiative: number,
        conditions?: Condition[] | null,
        turnOver: boolean,
        unconscious: boolean,
        initiativeBonus ? : number,
        notes: string,
        removable: boolean,
        awaitingTarget: boolean,
        first: boolean
}

export interface HPData {
    target: string,
            amount: number,
            type: string
}