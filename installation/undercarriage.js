/* =========================================================
   INSTALLATION: INDUSTRIAL METABOLISM CONVEYOR
   - 完整保留 31 句随笔文本库
   - 匀速从左侧输出口推向 4px 履带
   - 到达最右侧 [X] 轮边缘顺重力翻转倒下并淡出消亡
   ========================================================= */

(function () {
    // 完整保留你真实书写的 31 句随笔
    const rawEssays = [
        "创作就是吃什么拉什么的过程，它应该日常化，应该关注我们摄入了什么。",
        "我觉得自己像一条蛆虫，蠕动着，在日趋腐烂的尸体中游荡。",
        "有时候觉得自己是蜱虫，只是以吸食别人的血活着。",
        "有时我则觉得自己像一只狂吠的犬，再叫就要被关起来。",
        "然而首先我是一个野鬼，游荡在雾林里不知归处。",
        "在生活进入长时间平淡快乐时，我常害怕一场迅疾的暴雨摧毁一切。",
        "像小时候夜晚山边的天忽然亮起，不知是打雷要下雨，还是有人放烟花。",
        "今早做了一个切合现实的梦，回想时发现它确实曾发生过，最后一次发生时我真的走了。",
        "梦里回家，在院子杂物堆捡到一只橘猫，后来发现它的爪子跟婴儿拳头一般大。",
        "带回家两三天它一直不吃也不让摸，很凶，我没衣物保护的地方随时都会被挠。",
        "我单手捧着核桃与腰果仁喂它，吃到最后它舌头上的倒刺剐着我的掌心。",
        "我摩挲着它弓着的身子，它变温顺了，跟我玩了起来，它一定是饿坏了。",
        "它下楼找流浪猫玩被听到，我爸说：这是什么猫？声调低沉有力，像卡夫卡《审判》里的父亲。",
        "即使垂垂老矣将死之时也足以审判儿子。我在楼梯往下喊：不让养我就出去住！",
        "压抑的氛围，空气中悬浮着许多细小的絮，不敢过分呼吸。",
        "在审查严格的条件下，我要把握作品的尺度。我们想要说话，我们要发明自己的语言。",
        "只接受一种道理的人只有一种逻辑，别人的看法都是低等的，存在就是对他的挑战。",
        "吓了我二十年的老虎，离远后发现它不过是一只无能狂吠的犬。",
        "从前的喝令我竟看出乞求，像垂垂老矣、失去筹码的赌徒，颓然瘫在桌前。",
        "必须想象自己是一个摄像机云台，我试图捕捉羽毛球的轨迹。",
        "手逐渐酸麻，举高俯拍到无法支撑，贴在胸膛上才能勉强把录像录完。",
        "新娘裙摆像妖怪般盘踞在床上，兄弟团撞门与粗鲁捣弄，结婚仪式充满了原始父权文化。",
        "侵入性就是一方在空间上侵入另一方，产生排异，在不断侵入中获得快感。",
        "有些我能想得到的、做出来不会让我满意的想法，我不会去做。",
        "在我们的社会中，似乎男性生殖器代表着一种超越性，只要挂着一组就总能有底气。",
        "小时候暴雨天，猪肝色雨衣罩住全身，我看着地下如黑履带般的路面推断自己到哪了。",
        "我闭着眼置于一场冒险，感受重心的偏移和每一次转弯的强度，在脑内画一张地图。",
        "感觉非常糟糕，找不到工作，被困在家里任人摆布，长期屈辱，人生一塌糊涂。",
        "感觉浑身没劲，提不起兴趣，对人没有耐心，我很无力，不知道怎么办。",
        "跳楼机坠降的失重，理发害怕被剪刀伤害的恐惧，和想起父母往事的感觉都很像。",
        "很刺激，有点酥麻抽离，挤出最后一点气时，一阵酸胀从胸腔顺着手臂传到掌心。"
    ];

    const fullCharStream = rawEssays.join("   ").split("");

    const runway = document.getElementById("track-runway");
    const conveyor = document.getElementById("conveyor-assembly");

    if (!runway || !conveyor) return;

    let charIndex = 0;
    // 锁定 1.3x 输送流速 (约 1.45 像素/帧)
    const beltSpeed = 1.45;
    const activeBlocks = [];

    function spawnNextCharBlock() {
        const char = fullCharStream[charIndex];
        charIndex = (charIndex + 1) % fullCharStream.length;

        // 句间留白间隔
        if (char === " ") {
            return;
        }

        const block = document.createElement("div");
        block.className = "word-block";
        block.textContent = char;
        runway.appendChild(block);

        activeBlocks.push({
            el: block,
            posX: -56,
            isFalling: false
        });
    }

    // 匹配 1.3x 流速的出料节奏 (约 1.25 秒生成一个方块字)
    setInterval(spawnNextCharBlock, 1250);
    spawnNextCharBlock();

    // 帧驱动主循环
    function renderFrame() {
        const terminalEdge = conveyor.clientWidth - 46;

        for (let i = activeBlocks.length - 1; i >= 0; i--) {
            const item = activeBlocks[i];

            if (!item.isFalling) {
                item.posX += beltSpeed;
                item.el.style.transform = `translate3d(${item.posX}px, 0, 0)`;

                // 达到最右侧 [X] 轮边缘，重力前倾倒下并坠落淡出
                if (item.posX >= terminalEdge) {
                    item.isFalling = true;
                    item.el.classList.add("falling");

                    setTimeout(() => {
                        item.el.remove();
                        const idx = activeBlocks.indexOf(item);
                        if (idx > -1) {
                            activeBlocks.splice(idx, 1);
                        }
                    }, 420);
                }
            }
        }

        requestAnimationFrame(renderFrame);
    }

    requestAnimationFrame(renderFrame);
})();
