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
    };
  },
  computed: {
    monsterBarStyles() {
      return {
        // Set the width of the health bar
        width: `${this.monsterHealth}%`,
        // set the color of the health bar bases on health
        backgroundColor: this.monsterHealth < 30 ? '#d40404' : '#2e9d5b',
      };
    },
    playerBarStyles() {
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
  methods: {
    // Player attack monster
    attackMonster() {
      // Increase round count
      this.currentRound++;
      // get the damage value
      const damage = getRandomValue(5, 12);
      // "Hit" monster health by damage value
      this.monsterHealth -= damage;
      // The  monster's turn to attack
      this.attackPlayer();
    },
    // Monster attack player
    attackPlayer() {
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
      }, delay);
    },
    // use special attack
    specialAttackMonster() {
      this.currentRound++;
      const damage = getRandomValue(10, 25);
      this.monsterHealth -= damage;
      this.attackPlayer();
    },

    // heal the player
    healPlayer() {
      this.currentRound++;
      const healValue = getRandomValue(5, 20);

      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.attackPlayer();
    },
  },
});

app.mount('#game');
