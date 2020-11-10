import {QuickEncounter} from './QuickEncounter.js';

/*
Reused as EncounterCompanionSheet
15-Oct-2020     Re-created
9-Nov-2020      v0.6.1d: Change constructor to take combinedTokenData (will be a template for actor-generated data)
*/


export class EncounterCompanionSheet extends Application {
    constructor(combinedTokenData, options = {}) {
        super(options);
        if (!game.user.isGM) {return;}

        //Get the unique Actors represented
        let tokenActorIDs =new Set();
        for (const token of combinedTokenData) {
            tokenActorIDs.add(token.actorId);
        }

        let combatants = [];
        for (const tokenActorID of tokenActorIDs) {
            const tokens = combinedTokenData.filter(t => t.actorId === tokenActorID);
            //0.4.1: 5e specific: find XP for this number of this actor
            const numTokens = tokens.length;
            const xp = QuickEncounter.getActorXP(tokens[0].actor);
            const xpString = xp ? `(${xp}XP each)`: "";
            combatants.push({
                num : numTokens,
                name : tokens[0].name,
                xp : xpString,
                img: tokens[0].img,
                tokens: tokens,
                actorName: tokens[0].name //tokens[0].actor?.data?.token?.name
            });
        }

        this.combatants = combatants;

        game.users.apps.push(this)
    }


    /** @override  */
    //WARNING: Do not add submitOnClose=true because that will create a submit loop
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id : game.i18n.localize("QE.id"),
            title : game.i18n.localize("QE.Name"),
            template : "modules/quick-encounters/templates/quick-encounters-companion.html",
            closeOnSubmit : false,
            popOut : true,
            width : 510,
            height : "auto"
        });
    }


    /** @override */
    async _render(force, options={}) {
        return super._render(force, options);
    }

    /** @override */
    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();
        let closeButtonIndex = buttons.findIndex(button => {return button.label === "Close";});
        if (closeButtonIndex) {
            buttons[closeButtonIndex].label = "Save & Close";
        }

        return buttons;
    }


    /** @override */
    async getData() {
        return {
           combatants: this.combatants
        };
    }

    /** @override */
    async _updateObject(event, formData) {
        return super._updateObject(event, formData);
    }



}//end class EncounterCompanionSheet
