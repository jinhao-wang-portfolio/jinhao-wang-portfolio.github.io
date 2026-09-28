/* =========================================================
   INSTALLATION: INDUSTRIAL METABOLISM CONVEYOR (V2 修复版)
   - 彻底修复方块重叠：严格的物理排队，间距均匀紧凑 (~14px)
   - 彻底修复下坠方向：在最右侧原位下栽，绝不再瞬移回左边
   - 出字速度加倍：流畅工业流水线
   ========================================================= */

(function () {
    const rawEssays = [
        "创作就是吃什么拉什么的过程，它应该日常化，应该关注我们摄入了什么。",
        "我觉得自己像一条蛆虫，蠕动着，在日趋腐烂的尸体中游荡。",
        "有时候觉得自己是蜱虫，只是以吸食别人的血活着。",
        "有时我则觉得自己像一只狂吠的犬，再叫就要被关起来。",
        "然而首先我是一个野鬼，游荡在雾林里不知归处。",
        "在审查严格的条件下，我们要把握作品的尺度。我们想要说话，我们要发明自己的语言。",
        "在生活进入长时间平淡快乐时，我常害怕一场迅疾的暴雨摧毁一切。",
        "吓了我二十年的老虎，离远后发现它不过是一只无能狂吠的犬。",
        "从前的喝令我竟看出乞求，像垂垂老矣、失去筹码的赌徒，颓然瘫在桌前。",
        "必须想象自己是一个摄像机云台，我试图捕捉羽毛球的轨迹。",
        "手逐渐酸麻，举高俯拍到无法支撑，贴在胸膛上才能勉强把录像录完。",
        "新娘裙摆像妖怪般盘踞在床上，兄弟团撞门与粗鲁捣弄，结婚仪式充满了原始父权文化。",
        "侵入性就是一方在空间上侵入另一方，产生排异，在不断侵入中获得快感。",
        "在我们的社会中，似乎男性生殖器代表着一种超越性，只要挂着一组就总能有底气。",
        "小时候暴雨天，猪肝色雨衣罩住全身，我看着地下如黑履带般的路面推断自己到哪了。",
        "我闭着眼置于一场冒险，感受重心的偏移和每一次转弯的强度，在脑内画一张地图。",
        "感觉非常糟糕，找不到工作，被困在家里任人摆布，长期屈辱，人生一塌糊涂。",
        "感觉浑身没劲，提不起兴趣，对人没有耐心，我很无力，不知道怎么办。",
        "跳楼机坠降的失重，理发害怕被剪刀伤害的恐惧，和想起父母往事的感觉都很像。",
        "很刺激，有点酥麻抽离，挤出最后一点气时，一阵酸胀从胸腔顺着手臂传到掌心。"
    ];

    // 将语料打散成连续字符流
    const fullCharStream = rawEssays.join("   ").split("");

    const runway = document.getElementById("track-runway");
    const conveyor = document.getElementById("conveyor-assembly");

    if (!runway || !conveyor) return;

    let charIndex = 0;
    // 速度加倍：从 1.45 提升至 2.6 像素/帧
    const beltSpeed = 2.6;
    const blockWidth = 56;
    const blockGap = 14; // 字与字之间的紧凑间隔 (14px)
    const activeBlocks = [];

    // 严谨出字机制：当最后一张牌移动了足够距离后才生产下一张，100% 杜绝重叠
    function trySpawnBlock() {
        if (activeBlocks.length > 0) {
            const lastBlock = activeBlocks[activeBlocks.length - 1];
            // 上一个字块还没移开足够空间，不生成，防止任何挤压重叠
            if (lastBlock.posX < blockGap) {
                return;
            }
        }

        const char = fullCharStream[charIndex];
        charIndex = (charIndex + 1) % fullCharStream.length;

        // 遇到空格只拉开距离，不生成实体方块
        if (char === " ") {
            return;
        }

        const block = document.createElement("div");
        block.className = "word-block";
        block.textContent = char;
        runway.appendChild(block);

        activeBlocks.push({
            el: block,
            posX: -blockWidth,
            isFalling: false
        });
    }

    // 核心动画主循环
    function renderFrame() {
        // 自适应获取当前屏幕下履带的最右侧边缘
        const terminalEdge = conveyor.clientWidth - 40;

        // 尝试生成新字块
        trySpawnBlock();

        for (let i = activeBlocks.length - 1; i >= 0; i--) {
            const item = activeBlocks[i];

            if (!item.isFalling) {
                item.posX += beltSpeed;
                item.el.style.transform = `translate3d(${item.posX}px, 0, 0)`;

                // 达到最右侧 [X] 轮边缘，原地顺重力翻转下栽
                if (item.posX >= terminalEdge) {
                    item.isFalling = true;
                    item.el.classList.add("falling");

                    // 关键修复：锁定当前真实 X 坐标，让它在此处垂直下掉，绝不跳回左边！
                    const dropX = item.posX + 18;
                    item.el.style.transform = `translate3d(${dropX}px, 130px, 0) rotate(56deg)`;

                    setTimeout(() => {
                        item.el.remove();
                        const idx = activeBlocks.indexOf(item);
                        if (idx > -1) {
                            activeBlocks.splice(idx, 1);
                        }
                    }, 450);
                }
            }
        }

        requestAnimationFrame(renderFrame);
    }

    requestAnimationFrame(renderFrame);
})();
