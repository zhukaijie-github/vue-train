<template>
  <div class="activity activity__wrapper">
    <div class="activity activity__container">
      <div
        :class="[
          'activity activity__item',
          'award' + index,
          awardsIndexIDs[current] === award.id ? 'active' : ''
        ]"
        v-for="(award, index) in awards"
        :key="index"
        @click="start(award)"
      >
        {{ award.name }}{{ index }}
      </div>
    </div>
  </div>
</template>

<script>
let bool = true;
export default {
  data() {
    return {
      current: 0,
      awards: [
        // 奖品数组
      ],
      speed: 200, // 速度
      diff: 15, // 速度增加的值
      award: {}, // 抽中的奖品
      time: 0, // 记录开始抽奖时的时间
      timer: null,
      awardsIndexIDs: [],
      circleIndexs: [0, 1, 2, 5, 8, 7, 6, 3],
      hasResult: false,
      resultId: '',
      isStart: false,
      currentCircleCount: 0,
      defaultCircleCount: 5,
      qindex: 0
    };
  },
  created() {
    this.getData();
  },
  methods: {
    start(item) {
      if (item.id !== 's') return;
      if (this.isStart) return;
      clearTimeout(this.timer);
      setTimeout(() => {
        this.hasResult = true;
        this.resultId = Math.floor(Math.random() * 8) + 1;
      }, 3000);
      this.isStart = true;
      this.hasResult = false;
      this.resultId = '';
      this.speed = 200;
      this.diff = 15;
      this.move();
    },
    move() {
      if (!this.isStart) return;
      this.current++;
      this.qindex++;
      if (this.qindex > 7) {
        this.currentCircleCount++;
        this.qindex = 0;
      }
      if (this.current > 7) {
        this.current = 0;
      }
      if (this.currentCircleCount < this.defaultCircleCount) {
        this.speed -= this.diff;
        this.speed = this.speed < 20 ? 20 : this.speed;
      } else {
        if (this.hasResult) {
          // 有返回结果了,
          // 开始减速
          this.speed += this.diff;
          if (this.currentCircleCount > this.defaultCircleCount) {
            if (this.resultId === this.awardsIndexIDs[this.current]) {
              clearTimeout(this.timer);
              this.isStart = false;
            }
          }
        } else {
          this.currentCircleCount = this.defaultCircleCount - 1;
        }
      }

      this.timer = setTimeout(() => {
        this.move();
      }, this.speed);
    },
    // 请求数据
    getData() {
      setTimeout(() => {
        this.awards = [
          { id: 1, name: '空' },
          { id: 2, name: '眼镜' },
          { id: 3, name: '包' },
          { id: 4, name: '笨驴' },
          { id: 5, name: '书' },
          { id: 6, name: '手链' },
          { id: 7, name: '美女' },
          { id: 8, name: 'iphone' }
        ];
        this.awards.splice(4, 0, { id: 's', name: '开始' });
        this.awardsIndexIDs = this.circleIndexs.map(item => {
          return this.awards[item].id;
        });
      }, 200);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
  border: none;
  box-sizing: border-box;
}
.activity {
  &__container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 360px;
    padding-top: 20px;
  }
  &__item {
    display: flex;
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
    background-color: aqua;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
    &.award4 {
      background-color: red;
    }
    &.active {
      background-color: yellowgreen;
    }
  }
}
</style>
