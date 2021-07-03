// Function that calculate damage value
const getRandomValue = (min, max) =>
  Math.floor(Math.random() * (max - min) + min);

const app = Vue.createApp({
  data() {
    return {
      // The health stats at the beginning of the game
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      playerCanAttack: true,
      logMsg: [],
    };
  },
  computed: {
    monsterBarStyles() {
      // if the monsterHealth < 0, set health bar width to 0%
      if (this.monsterHealth < 0) {
        return { width: '0%' };
      }
      return {
        // Set the width of the health bar
        width: `${this.monsterHealth}%`,
        // set the color of the health bar bases on health
        backgroundColor: this.monsterHealth < 30 ? '#d40404' : '#2e9d5b',
      };
    },
    playerBarStyles() {
      // If player health < 0, set health bar width to 0%
      if (this.playerHealth < 0) {
        return { width: '0%' };
      }
      return {
        // Set the width of the health bar
        width: `${this.playerHealth}%`,
        // set the color of the health bar bases on health
        backgroundColor: this.playerHealth < 30 ? '#d40404' : '#2e9d5b',
      };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
  },
  watch: {
    // Keep track of player health and set winner
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        // It is draw
        this.winner = 'draw';
      } else if (value <= 0) {
        // The monster won
        this.winner = 'monster';
      }
    },
    // Keep track of monster health
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        // It is a draw
        this.winner = 'draw';
      } else if (value <= 0) {
        // player won
        this.winner = 'player';
      }
    },
  },
  methods: {
    // Start a new game
    startNewGame() {
      this.currentRound = 0;
      this.monsterHealth = 100;
      this.playerHealth = 100;
      this.playerCanAttack = true;
      this.winner = null;
      this.logMsg = [];
    },
    // Player attack monster
    attackMonster() {
      // Player can't attack before the monster have attacked
      if (this.playerCanAttack) {
        // Increase round count
        this.currentRound++;
        // get the damage value
        const damage = getRandomValue(5, 12);
        // "Hit" monster health by damage value
        this.monsterHealth -= damage;
        // Set the playerCanAttack to false
        this.playerCanAttack = false;

        // The  monster's turn to attack
        this.addLogMessage('player', 'attack', damage);
        this.attackPlayer();
      }
    },
    // Monster attack player
    attackPlayer() {
      // check to see if monster is dead, then end game
      if (monsterHealth <= 0) {
        return;
      }
      // Set the delay value based on health
      let tiredness;
      if (this.monsterHealth > 75) {
        tiredness = 750;
      } else if (this.monsterHealth > 50) {
        tiredness = 1250;
      } else if (this.monsterHealth > 25) {
        tiredness = 2000;
      } else {
        tiredness = 2500;
      }

      // set random delay time up to 2 sec based on tiredness
      const delay = Math.random() * tiredness;
      // set random delay of monster attack
      setTimeout(() => {
        // Get the damage value (the monster hits a bit harder)
        const damage = getRandomValue(8, 15);
        // "Hit" the player by damage value
        this.playerHealth -= damage;
        // Let the player be  able to make his move
        this.addLogMessage('monster', 'attack', damage);

        this.playerCanAttack = true;
      }, delay);
    },
    // use special attack
    specialAttackMonster() {
      if (this.playerCanAttack) {
        this.currentRound++;

        const damage = getRandomValue(10, 25);
        this.monsterHealth -= damage;
        this.playerCanAttack = false;
        this.addLogMessage('player', 'attack', damage);
        this.attackPlayer();
      }
    },

    // heal the player
    healPlayer() {
      if (this.playerCanAttack) {
        this.currentRound++;
        const healValue = getRandomValue(5, 20);

        if (this.playerHealth + healValue > 100) {
          this.playerHealth = 100;
        } else {
          this.playerHealth += healValue;
        }
        this.playerCanAttack = false;
        this.addLogMessage('player', 'heal', healValue);

        this.attackPlayer();
      }
    },
    playerSurrender() {
      this.winner = 'monster';
    },
    // Add message to the battle log
    addLogMessage(actionBy, actionType, actionValue) {
      // Use unshift to place msg to the top of the log
      // It add the msg first in the array, where push adds to the end
      this.logMsg.unshift({
        actionBy,
        actionType,
        actionValue,
      });
      console.log(this.logMsg);
    },
  },
});

app.mount('#game');
