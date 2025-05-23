<template>
  <div class="page-container">
    <div class="title-container">
      <h1 class="title">一封书信</h1>
    </div>
    <div class="text-container">
      <p class="paragraph">窗外的梧桐叶又轻颤了几分，像极了初次见你时我慌乱的指尖。</p>
        <p class="paragraph">总觉得世间文字太浅，写不透眼底藏着的星芒 </p>
          <p class="paragraph">—— 是你走过街角时，风掀起的衣角；是你低眉读诗时，睫毛投下的阴影；</p>
           <p class="paragraph">是暮色漫过操场时，你转身扬起的发梢，轻轻落在我心尖的一场雪。</p>
            <p class="paragraph">我常想，若把四季折进信里，该用怎样的平仄来丈量喜欢你的距离。</p>
              <p class="paragraph">春日的早樱太热烈，夏日的骤雨太直白，倒是深秋的桂香最合心意</p>
                <p class="paragraph">—— 隔着三两条街的风，也能漫不经心钻进衣领，像我每次与你擦肩时，明明屏住呼吸，却还是被你发间的香氛乱了心跳。</p>
                <p class="paragraph">或许喜欢你本就是一首无题的小诗，字里行间藏着未拆封的温柔。</p>
                  <p class="paragraph">就像此刻，笔尖在纸上游走成蜿蜒的溪，每一笔顿折都在说：“我路过无数个晨昏线，却只想在你的目光里，成为永恒的春分点。”</p>
                    <p class="paragraph">风又起了，把纸页吹得沙沙作响。</p>
                      <p class="paragraph">若你收到这封信，请别笑我笨拙 </p>
                        <p class="paragraph">—— 毕竟有些心事，早该在落雪前，藏进带体温的字里行间。 </p>
      <p class="sentence">{{ displayedText }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// 定义要显示的两句话
const sentences = ["I will always love you until the end of the world"];
const displayedText = ref("");
let currentSentenceIndex = 0;
let currentCharIndex = 0;

const typeNextChar = () => {
  if (currentSentenceIndex < sentences.length) {
    const currentSentence = sentences[currentSentenceIndex];
    if (currentCharIndex < currentSentence.length) {
      displayedText.value += currentSentence[currentCharIndex];
      currentCharIndex++;
      setTimeout(typeNextChar, 100);
    } else {
      setTimeout(() => {
        displayedText.value = "";
        currentSentenceIndex++;
        currentCharIndex = 0;
        typeNextChar();
      }, 1000);
    }
  } else {
    currentSentenceIndex = 0;
    currentCharIndex = 0;
    typeNextChar();
  }
};

onMounted(() => {
  typeNextChar();
});
</script>

<style scoped>
/* 页面背景样式 */
.page-container {

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
}

/* 标题样式 */
.title-container {
  margin-bottom: 20px;
}
.title {
  font-size: 48px;
  font-weight: bold;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

/* 正文样式 */
.text-container {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  max-width: 1000px;
  line-height: 1.8;
}
.paragraph {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
  /* 斜体 */
  font-style: italic;
  /* 加粗 */
  font-weight: bold;
}

/* 动态文字样式 */
.sentence {
  color: #ff6a6a;
  font-size: 24px;
  font-weight: bold;
  font-style: italic;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  animation: fadeIn 1s ease-in-out;
}

/* 动态文字动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>