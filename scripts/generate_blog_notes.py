# -*- coding: utf-8 -*-
"""Generate blog note pages (JA/EN) from migrated LP soliloquy content."""
from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

POSTS = [
    {
        "slug": "third-time",
        "date": "2026-07-29",
        "date_ja": "2026.7.29",
        "date_en": "July 29, 2026",
        "title_ja": "三度目でも、伝わらなかった。",
        "title_en": "Even the Third Time, It Didn't Get Through",
        "body_ja": """断捨離。<br>この三文字に、私は何度も人生を助けられてきた。<br>物も、人間関係も、抱え込みすぎない。余計なものは手放し、身軽に生きる。それが、長年かけてたどり着いた自分なりの流儀である。<br>それでも、ときどき、その網目をすり抜けてくる人がいる。<br>困ったことに、彼はいい人だ。裏表がなく、気遣いもできる。気づけば友達になっていた。まるで冬の雪が、音もなく庭を白く染めていくように。<br>先日、その彼からLINEでお礼のメッセージが届いた。<br>「ありがとうございました。また今度。」<br>丁寧で、穏やかで、非の打ちどころはない。<br>けれど、その一文は、曇りひとつないガラスのようだった。透明なのに、こちらの思いは何ひとつ映してくれない。<br>返信を書こうとして、手が止まる。<br>気づけば、一週間が過ぎていた。<br>実家には、古びた住居なりの、小さな流儀がある。詳しくは書かない。だが、彼はすでに二度、それを経験している。<br>忘れてしまったのか。<br>気づかないだけなのか。<br>気づいていても、深く考えなかったのか。<br>三度目の、あの何気ない振る舞いを思い返すたびに、小さな違和感は、少しずつ心の中で形を変えていく。<br>このまま四度目を迎えるのは、正直、気が進まない。<br>黙っていれば、その場は穏やかに過ぎるだろう。<br>だが、その穏やかさは、本当の意味での優しさなのだろうか。<br>私は、そうは思えない。<br><strong>言わないことは、優しさの仮面をかぶった不誠実だ。</strong><br>もしかすると、彼は本当に知らないだけなのかもしれない。<br>だからこそ、伝えなければならない。<br>責めるためではない。<br>距離を置くためでもない。<br>これからも気持ちよく付き合っていくために。<br>それが相手への礼儀であり、自分自身への誠実さでもあると思うからだ。<br>普段の私は、思ったことを比較的はっきり口にする。<br>それなのに、LINE一通を書くだけで、一週間も立ち止まっている。<br>断捨離を信条にしている人間が、たった数行の言葉を前に足踏みしている。<br>我ながら、おかしな話である。<br>それでも私は、今日も言葉を探している。<br>言葉でしか届かない思いがある。<br>言葉でしか越えられない距離がある。<br>だから、逃げずに書く。<br>ありがたいことに、今はAIという相談相手がいる。<br>人との距離は整理しても、AIとの対話だけは増えていく。<br>少し皮肉で、少し時代らしい。<br>そんな矛盾も含めて、今の私なのだ。""",
        "body_en": """Decluttering.<br>This one word has helped me many times in my life.<br>I try not to hold on to too many things—whether they are possessions or relationships. I let go of what I don't need and try to live lightly. That has become my way of life.<br>Still, every now and then, someone slips through those rules.<br>The trouble is, he is a good person. He is honest, thoughtful, and easy to like. Before I knew it, we had become friends, quietly, like snow covering a garden overnight.<br>A few days ago, he sent me a thank-you message on LINE.<br>“Thank you very much. See you again.”<br>It was polite, warm, and perfectly written.<br>Yet it felt like a piece of clear glass—transparent, but reflecting none of what I had been feeling.<br>I started to write a reply.<br>Then I stopped.<br>A week has already passed.<br>The house I grew up in has its own ways. I won't explain it here, but he has experienced it twice before.<br>Did he forget?<br>Did he simply not notice?<br>Or did he notice but think it wasn't important?<br>Whenever I remember his small action the third time, that tiny feeling of discomfort grows a little stronger.<br>To be honest, I don't want to let the same thing happen a fourth time.<br>If I stay silent, everything will probably seem fine.<br>But is that really kindness?<br>I don't think so.<br><strong>Silence can wear the mask of kindness, while underneath, it is dishonesty.</strong><br>Maybe he truly doesn't know.<br>If that's the case, then I should tell him.<br>Not to blame him.<br>Not to push him away.<br>But because I hope we can continue our friendship with honesty and respect.<br>That is my responsibility to him—and to myself.<br>I am usually a very direct person.<br>Yet here I am, spending an entire week thinking about one short LINE message.<br>For someone who believes in letting go, I am strangely unable to let go of these few words.<br>It makes me smile.<br>Even so, I keep searching for the right words.<br>Some feelings can only be carried by words.<br>Some distances can only be crossed by words.<br>So I keep writing.<br>Thankfully, today I have someone to ask for advice—AI.<br>I may simplify my relationships, but my conversations with AI keep growing.<br>It is a small irony.<br>And somehow, it has become part of who I am today.""",
    },
    {
        "slug": "cursor-pro-return",
        "date": "2026-07-28",
        "date_ja": "2026.7.28",
        "date_en": "July 28, 2026",
        "title_ja": "Cursor Proが戻ってきた。そして、佐藤農園LPも次のステージへ進む。",
        "title_en": "Cursor Pro Is Back—And Sato Farms' Landing Page Has Entered a New Stage",
        "body_ja": """Cursor Proが戻った瞬間、「これでまた思う存分開発できる」と胸が高鳴った。しかし頭に浮かんだのは、新しい機能ではなかった。<strong>「もっと軽く、もっと見やすくしたい。」</strong>その思いこそが、今回のリニューアルの出発点である。<br>気づけば、佐藤農園LPには多くの記事が積み重なっていた。一つひとつは小さくても、集まれば農園の歩みそのものになる大切な財産だ。しかし記事が増えるほど、トップページの表示速度や見やすさに影響が出始めていた。<br>私は農家である。畑も同じだ。作物は育つほど嬉しいが、そのままでは風通しが悪くなる。<strong>育てるだけでなく、整えることも大切な仕事。</strong>その感覚が、今回の構成見直しにつながった。<br>記事はブログページへ移し、トップページには佐藤農園を知っていただくための要点だけを残した。初めて訪れた方にはまず農園の姿を伝え、興味を持ってくださった方にブログへ進んでいただく──そんな自然な流れを整えた。<br>このリニューアルには三つの狙いがある。<br><ul><li><strong>表示速度の向上</strong> — 必要な情報だけを表示することで、トップページは以前より軽くなる。</li><li><strong>見やすさの向上</strong> — 記事がどれだけ増えても、トップページはすっきりとした印象を保てる。</li><li><strong>将来への備え</strong> — 今後何十本と記事を書いても、記事はブログ側で管理されるため、LPはいつまでも軽快なままである。</li></ul><br>農業もホームページも同じだ。育てることと、整えること。その両方を大切にしながら、これからも佐藤農園の歩みを発信していきたい。""",
        "body_en": """Cursor Pro is back. My first thought was, “Now I can start developing again without limits.” But what came to mind wasn’t a new feature. It was something simpler: <strong>“Make it lighter. Make it easier to read.”</strong> That became the starting point of this redesign.<br>Over time, more and more articles found their home on the Sato Farms landing page. Each one may be small, but together they’ve become one of the farm’s greatest assets. As the collection grew, though, the page grew with it—and began loading a little more slowly.<br>As a farmer, this felt familiar. Crops grow thick, and when they do, air can no longer flow through them. Growth is important, but so is pruning and organizing.<br>With that in mind, I rethought the site’s structure. Articles have moved to a dedicated blog, while the landing page now holds only the essentials. New visitors can first learn who we are, then explore further on the blog if they’d like.<br>This redesign has three main benefits:<br><ul><li><strong>Faster loading</strong> — With only the essentials on the front page, the site opens more quickly—a small way of welcoming every visitor.</li><li><strong>A cleaner experience</strong> — No matter how many articles we publish, the landing page stays simple and easy to navigate.</li><li><strong>A future‑proof design</strong> — Even if I write dozens more articles, the landing page will remain fast and light, while the blog continues to grow behind it.</li></ul><br>In that sense, farming and building a website are surprisingly alike—both require not just growth, but thoughtful care and organization.""",
    },
    {
        "slug": "vscode-claude",
        "date": "2026-07-27",
        "date_ja": "2026.7.27",
        "date_en": "July 27, 2026",
        "title_ja": "VSコードとClaude AI、実に優秀だ。",
        "title_en": "VS Code and Claude AI: A Surprisingly Powerful Duo",
        "body_ja": """生成AIのCursor Proが使えなくなったとき、正直かなり困った。佐藤農園LPの制作は、ほとんどCursor頼みだったからだ。<br>天を仰いで嘆いたのも束の間、代打として登場したのがVSコード。これが思いのほか働き者で、派手さはないが実に堅実。助っ人外国人より、生え抜きの中堅選手のほうが頼もしい──そんな存在感を放っている。<br>そして、その代打を陰で支えてくれたのが無料版Claude AIだ。コードの相談、文章の整理、ときには愚痴の聞き役まで。課金もしていないのに、ここまで付き合ってくれるとは、本当に頭が下がる。<br>Web公開の窓口だけは、課金版Netlifyを使い続けている。財布を開いているのはここだけ。あとはドラッグ＆ドロップ一つで世界へ公開できる。つまり、農園のホームページは「ほぼ無料布陣」で元気に稼働しているというわけだ。<br>さて、問題はここからである。<br>もうすぐCursorが復活する。では、どうするか。<br>せっかく築き上げた「ほぼ無料布陣」をベンチへ戻すのは惜しい。しかし、Cursorを遊ばせておくのも本末転倒だ。すでに1年分の利用料は支払っている。道具は使ってこそ価値がある。眠らせてしまえば宝の持ち腐れである。<br>となれば、Cursor Proには新しい持ち場を用意するしかない。封印中のブログ移行か、それとも温めているCloudflare Pagesへの移行か。そうした仕事があれば、Cursorも十分に力を発揮できるだろう。<br>というわけで、今の結論はこうだ。<br>VSコードとClaude AIの「ほぼ無料コンビ」は、このままLP運営の主力とする。Cursorが戻ってきたら、新しい仕事を任せればいい。焦る必要はない。一歩ずつ進めばいい。<br>今回の回り道で、思いがけず「道具を使い分ける力」という副産物まで手に入れた。これもまた、遠回りの効用なのだろう。<br>さて、そろそろ田んぼの様子も見てこなければならない。""",
        "body_en": """When Cursor Pro suddenly became unavailable, I was honestly in trouble. I had built most of the Sato Farms landing page with Cursor doing the heavy lifting.<br>But after only a brief moment of staring helplessly at the sky, VS Code stepped in as the pinch hitter. It turned out to be far more capable than I expected—not flashy, but remarkably dependable. More like a seasoned homegrown player than a high-priced foreign import.<br>Working quietly behind the scenes was the free version of Claude AI. It helped me debug code, organize my writing, and even listened to my occasional complaints. I have to take my hat off to an AI that does all this without charging me a cent.<br>The only service I'm still paying for is Netlify, which handles hosting. That's the only place I'm opening my wallet. Everything else is as simple as dragging and dropping files to publish my website to the world. In other words, my farm's website is running on an almost entirely free lineup.<br>Now comes the interesting part.<br>Cursor Pro will be back soon. So what should I do?<br>It seems a shame to bench the "almost-free team" I've put together. But leaving Cursor idle makes no sense either—I've already paid for a full year's subscription. Tools are meant to be used. Otherwise, they're just gathering dust.<br>So the answer is simple: Cursor Pro needs a new assignment. Perhaps it can finally tackle my long-delayed blog migration, or help move the site to Cloudflare Pages. Either way, it deserves a job worthy of its abilities.<br>So here's my plan.<br>VS Code and Claude AI—the "almost-free duo"—will remain the main force behind the landing page. When Cursor returns, I'll give it a new mission. No rush. One step at a time.<br>Looking back, this detour turned out to be a blessing in disguise. It taught me not only how to use good tools, but also when to use each one. Sometimes, the long way around leads to the best lessons.<br>Now, I'd better go check on the rice fields.""",
    },
    {
        "slug": "cabbage-miracle",
        "date": "2026-07-26",
        "date_ja": "2026.7.26",
        "date_en": "July 26, 2026",
        "title_ja": "完全無消毒キャベツ、たった2ヶ月の奇跡物語",
        "title_en": "The Two-Month Miracle: A Cabbage Story You Won’t Believe",
        "body_ja": """畑には毎年、小さなドラマがある。主人公はキャベツ……ではなく、<strong>青虫くん</strong>だ。<br>彼らは新鮮な葉っぱを見つける天才で、どうやら私の畑を「高級レストラン」だと思いこんでいる。<br>自家用なら、多少の虫食いは「無消毒の勲章」と笑って済ませられる。ところが販売用となると話は別だ。<br>直売所で手にした瞬間、青虫くんが「こんにちは」と顔を出したら、それはもうホラー映画。農家は「新鮮さの証」と「絶対に混入させてはいけない現実」の間で、毎年頭を抱える。<br>私のような小さな農家は、苗の頃から防虫ネットでぐるりと囲み、モンシロチョウの侵入を全力で阻止しようと悪戦苦闘。<br>相手も強者。忍者のようにわずかな隙間から入り込み、卵を産み、青虫となってキャベツをムシャムシャ。気づけば私は、畑でチョウチョを追い払い、青虫を追いかけ回す毎日。農家なのか、昆虫採集少年なのか、自分でも分からなくなる。<br>一方、よその広大なキャベツ畑では、モンシロチョウの姿一匹見当たらない。まるで「虫立入禁止」のテーマパークである。<br>それでも私は、毎年のこと、ほんの2ヶ月だけ、<strong>完全無消毒キャベツ</strong>にこだわっている。１個100円にこだわっている。だから、この期間だけは、自然と青虫くんとの真剣勝負となる。<br>そして2ヶ月が終わると……はい、私は普通に直売所でキャベツを買います。なぜなら、私はキャベツが大好きだから。<br>理想も大事。でも食欲には勝てない。<br>農家だって、結局はそんな普通の人間なのである。""",
        "body_en": """Every morning at sunrise, my small cabbage field wakes up before I do. The dew glistens. The leaves stretch. And somewhere in that quiet glow… the enemy awakens.<br>A tiny green head rises. Two beady eyes scan the horizon. And Mr. Caterpillar whispers to himself: <strong>“Breakfast.”</strong><br>This is where our story begins.<br>For most farmers, cabbage season is routine. But for me, it’s a <strong>two-month war</strong>—a battle fought with nets, patience, and the stubborn belief that cabbage should be grown <strong>pure</strong>, <strong>chemical-free</strong>, and <strong>honest</strong>.<br>I wrap every young plant in insect-proof nets. I patrol the rows like a soldier. I chase butterflies like a kid who forgot he grew up. But the white butterflies—those elegant ninjas—always find a way in. They slip through microscopic gaps, lay their eggs, and soon their children are feasting like tiny kings.<br>Meanwhile, in massive commercial fields, you won’t find a single butterfly. It’s a sterile kingdom. A place where nature is politely asked to leave.<br>But my field? It’s alive. It’s chaotic. It’s real.<br>And for <strong>two months</strong>, I commit to growing cabbages the way nature intended— <strong>100% chemical-free</strong>, <strong>100 yen each</strong>, and bursting with the kind of flavor only a real battle can produce.<br>These cabbages aren’t just vegetables. They’re survivors. They’re the heroes of a story written by sun, soil, and stubbornness.<br>And when the two months end? I do what any cabbage lover would do. I walk to the farm stand and buy cabbages like everyone else. Because ideals matter—but appetite wins.<br>If you want to taste a cabbage with a story… a cabbage grown with laughter, frustration, and a farmer’s pride… this is your moment.<br>The Two-Month Miracle Cabbage. Pure. Seasonal. Limited. And absolutely unforgettable.""",
    },
    {
        "slug": "dotcom-flag",
        "date": "2026-07-25",
        "date_ja": "2026.7.25",
        "date_en": "July 25, 2026",
        "title_ja": "ドットコムは、旗である。---satofarms.com",
        "title_en": "A .com Is My Flag---satofarms.com",
        "body_ja": """「商才ゼロのお前が、ドットコムを取得して何をするんだ。」<br>そんな声が、どこからともなく聞こえてくる。<br><strong>satofarms.com</strong>──。何をするのか。何ができるのか。正直、まだ答えはない。それでも、私は取得した。<br>ホームページを作り、ブログを始めようとしている今、その先にドットコムを持つことは、ごく自然な流れだと思えたからだ。<br>もちろん、不安はある。未経験の世界だし、商売の才能があるとも思っていない。それでも、分からないからこそ、一歩踏み出してみたいと思った。<br>五年後、十年後、日本がどう変わるのかは誰にも分からない。<br>だから私は傍観者ではなく、自分の場所を持ち、自分の言葉で発信しながら、その変化を見つめていたい。<br>中之条の田んぼから見える景色。季節の移ろい。農業の迷いや喜び。そんな日々を、一つひとつ言葉に残していきたい。<br>ドットコムは、ビジネスプランではない。<strong>旗である。</strong><br>「私はここに立っている。」その意思を示す旗だ。<br>商才がなくてもいい。未来が見えていなくてもいい。まず旗を立てる。<br>何が始まるのかは、その先で見えてくる。<br>だから私は、<strong>satofarms.com</strong> を取得した。""",
        "body_en": """<em>"You have no talent for business. So why on earth did you register a .com domain?"</em><br>I can almost hear that question.<br><strong>satofarms.com</strong>. What am I going to do with it? What can I create?<br>Honestly, I don't have the answers yet.<br>Still, I registered it.<br>As I build my website and prepare to launch a blog, owning a .com domain felt like the natural next step.<br>Of course, I'm uncertain. This is completely new territory for me, and I don't consider myself a gifted entrepreneur.<br>But that's exactly why I wanted to take the first step.<br>No one knows what Japan will look like five or ten years from now.<br>Rather than standing on the sidelines, I want to have a place of my own—a place where I can share my thoughts and witness those changes as they unfold.<br>The rice fields of Nakanojo. The changing seasons.<br>The doubts and joys of farming.<br>I want to preserve these moments, one story at a time.<br>A .com is not a business plan. <strong>It is a flag.</strong><br>A flag that says, "I am here."<br>I don't need business talent. I don't need to see the future clearly.<br>First, I plant my flag.<br>What comes next will reveal itself along the way.<br>That is why I registered <strong>satofarms.com</strong>.""",
    },
    {
        "slug": "rice-morning",
        "date": "2026-07-20",
        "date_ja": "2026.7.20",
        "date_en": "July 20, 2026",
        "title_ja": "光・風・水が織りなす稲田の朝",
        "title_en": "Morning in the Rice Fields Woven by Light, Wind, and Water",
        "body_ja": """吾妻の三河川が織りなす、夏の稲田風景、絶品だ！<br>四万川から立ちのぼる冷気が、そっと田んぼを包み込む。名久田川の水面に朝の光がやわらかく揺れ、駅の南に広がる稲田は一斉にきらめき始める。吾妻川から吹き抜ける風が稲をなでるたび、緑の濃淡はゆっくりと揺れ、田んぼ全体が呼吸しているように見える。<br>光と風と水がひとつに溶け合い、田んぼの緑は、ただただ美しい。あぜ道には、トリトマやユリの花が鮮やかな彩りを添え、その共演は夏の輝きをいっそう際立たせる。これぞ、日々、私たちが守り続けたい日本の原風景。未来へ、優しく受け継ぎたい稲田の輝き。""",
        "body_en": """The summer rice fields shaped by the three rivers of Agatsuma are simply breathtaking!<br>The cool air rising from the Shima River gently embraces the rice fields. The morning light shimmers softly upon the surface of the Nakuta River, and the paddies stretching south of the station begin to sparkle all at once. Each time the wind blowing from the Agatsuma River brushes across the rice plants, the shades of green sway slowly, making the entire landscape seem as though it is breathing.<br>Light, wind, and water melt together as one, and the green of the rice fields is simply beautiful. Along the ridges, vibrant red hot pokers and lilies add brilliant colors, their harmony making the radiance of summer shine even more brightly. This is the very Japanese landscape we wish to continue protecting day after day. The quiet strength of these rice fields is something we hope to pass on gently to the future.""",
    },
    {
        "slug": "update-pause",
        "date": "2026-07-15",
        "date_ja": "2026.7.15",
        "date_en": "July 15, 2026",
        "title_ja": "更新作業、いったん休止ーーーーにらめっこ、負けました！",
        "title_en": "Pausing My Update Work — I Lost the Stare‑Down with the Code!",
        "body_ja": """あれから、10日過ぎた。気づけば、次の一手に迷いも生じ始めている。余裕が失せ、何をやりたいのかさえ曖昧だ。<br>Cursorが止まった時、遠回りの景色でも楽しもうかと開き直ってはいた。ところが、これが想像以上の苦戦だった。原稿は書けても、アップロードはすべて手作業。コードを目で追う作業が続き、限界を感じた。このままでは続かない。<br>いずれは音声入力で自動化したいという夢はある。だが、それはまだ遠い先の話。今は、更新作業そのものが重い。来月、Cursorが戻れば、この重さも消え、リズムも戻るだろう。ただ、気づけば、抱える課題はこればかりじゃない。<br>生活のリズムが崩れている。とくにコードとのにらめっこ――これはもう無理だ。続けられない。<br>しばらく、お休みモードに入ることにした。""",
        "body_en": """After about ten days, I find myself hesitating over my next move. The sense of ease is gone, and even what I want to do has become unclear.<br>With Cursor down, I thought I could enjoy taking the long way around. But it turned out to be a tougher battle than expected. I can write the drafts, yes—but every upload has to be done manually. Day after day I stare at lines of code, and my eyes are worn out. I can't keep going like this.<br>I still have a dream of automating everything with voice input someday. But that's a distant future. Right now, the update work itself feels heavy. When Cursor comes back next month, that weight will probably lift and my rhythm will return. Still, I realize there are many other things I want to do.<br>My daily rhythm is off. Especially the endless face‑to‑face with code—this is no longer sustainable. I can't keep it up.<br>So I'm switching myself into rest mode for a while.""",
    },
    {
        "slug": "mid-season-drainage",
        "date": "2026-07-13",
        "date_ja": "2026.7.13",
        "date_en": "July 13, 2026",
        "title_ja": "分げつ遅れの田んぼ、中干しを「しないかも」の選択",
        "title_en": "A Rice Field Behind in Tillering — Choosing Not to Drain the Water",
        "body_ja": """梅雨明けが近づき、里の田んぼは一斉に中干しの季節を迎えた。水を抜き、土を乾かし、根を張らせる。稲作の大原則。長年受け継がれてきた常識だ。<br>「中干しをしない田んぼなど、あるのか」。そんな無言の圧が、あぜ道に漂う。だが我が田の分げつは芳しくない。ここで周囲に倣えば、ようやく勢いづいた稲の成長に、自らブレーキをかけることになる。さて、どうする。<br>専門家の見解は割れ、AIに問うても答えは出ない。ならば、水加減を調整し続けるしかない。リスクは承知している。台風が来れば倒伏の恐れもある。<br>分げつとは、一株が何本にも増える株分かれのこと。理想は一株二十本。穂の数、ひいては収量を決める要だ。通常は過繁茂を抑え、風通しを確保して病気を防ぐ。このため、この時期に中干しを行う。<br>周囲は今、絶賛中干しの真っ最中。だが我が田は、まだ水を湛（たた）えている。<br>稲を信じた選択だと言えば聞こえはよい。<br>吉と出るか凶と出るか。答えは教科書にも、専門家にも、AIにもない。やがて、この田んぼが教えてくれる。すべては自己責任。孤高の選択だ。""",
        "body_en": """The rainy season is ending, and the village paddies are entering the time of nakaboshi—the mid-season drainage. Pull the water. Dry the soil. Strengthen the roots. A principle of rice farming, handed down for generations.<br>“Is there even a rice field that skips nakaboshi?” Such silent pressure drifts along the levee paths.<br>But my field’s tillering is still weak. If I follow the neighbors now, I’ll be putting a brake on growth that has finally begun to surge. So—what should I do?<br>Experts disagree, and even asking AI yields no answer. Then the only choice is to keep the water. I know the risks. A typhoon could flatten everything.<br>Tillering is the branching of a single plant into many stems. The ideal is twenty stems per hill. It determines the number of panicles, and ultimately the yield. Normally, farmers drain the field now to prevent overgrowth and improve airflow.<br>Around me, everyone is deep into nakaboshi. Yet my field still holds water. I could say it’s a choice made in faith—faith in the soil, in the rice—but that may sound too noble.<br>Will it turn out well or badly? No textbook holds the answer. No expert, no AI can tell me. The field itself will reveal it in autumn. A solitary decision. And entirely my responsibility.""",
    },
    {
        "slug": "first-lp",
        "date": "2026-07-11",
        "date_ja": "2026.7.11",
        "date_en": "July 11, 2026",
        "title_ja": "初めてのLP（ランディングページ）",
        "title_en": "My First Landing Page",
        "body_ja_html": """
<p><strong>10年の思いが、ここに結晶した。</strong></p>
<p>きっかけは生成AIの登場だった。「この波には乗り遅れたくない」。その思いだけは誰にも負けなかった。プログラミングで何度も挫折してきた自分だが、YouTubeを見まくるうちに「これなら自分にもできる」と確信した。</p>
<p>7月、Cursor Proを契約。わずか1週間でLPを仕上げ、公開した。細かな修正点は多いが、更新は今も続いている。</p>
<p>トラブルもあった。年間契約で始めたのに、1週間で月間使用量の上限に到達。思えば、要領を得ないお粗末な使い方でAIに八つ当たりしていたのだから、当然の仕打ちかもしれない。それでも試行錯誤を繰り返す中で、少しずつAIとの付き合い方が分かってきた。</p>
<p>公開から今日でちょうど1週間。日曜日、少し一休み中。これからこのLPをどう育て、運用していくのか。この先の可能性が、見えてきた。</p>
""",
        "body_en": """Ten years of hoping came together, right here.<br>It started with the arrival of generative AI. "I don't want to miss this wave" — no one felt that more than I did. I'd failed at programming more times than I can count, but after binge-watching YouTube tutorials, I became convinced: "I can actually do this."<br>In July, I signed up for Cursor Pro. Within a single week, I had finished and published the landing page. There are still plenty of small fixes to make, but updates continue.<br>There was trouble too. Even though I'd signed up for an annual plan, I hit my monthly usage limit in just one week. Looking back, I was using it clumsily and inefficiently, taking my frustration out on the AI — so maybe that was only fair. Still, through all the trial and error, I've slowly started to figure out how to work with it.<br>It's been exactly one week since launch. Sunday today, taking a short breather. Now I'm wondering how to grow and run this page going forward. I can start to see the possibilities ahead.""",
    },
    {
        "slug": "line-friends",
        "date": "2026-07-10",
        "date_ja": "2026.7.10",
        "date_en": "July 10, 2026",
        "title_ja": "HP開設が生んだ、LINE友達の「仕分け祭り」",
        "title_en": "How My Website Launch Sparked a LINE Friend \"Purge\"",
        "body_ja": """「シニアたるもの、人間関係は急ぎ足に整理整頓すべし」 日頃からそう心に決めていたはずなのに、私のLINEには未だに大量の友達やグループが居座っている。しかも今回、自分のホームページを皆に案内してしまった。これからまだ友達を増やしたいのか？ 我ながら矛盾だらけである。<br>しかし、この案内が最高の「リトマス試験紙」となった。反応は見事なまでに二分されたのだ。即座に熱い賛辞を送ってくれる「人を喜ばせる天才」と、完全無視を決め込む「既読スルーの達人」。<br>面白いことに、この差に年齢は関係ない。ただただ、その人の人間性が如実に現れているだけだ。この小さな反応の差が、長い人生の果てに、人徳という名の巨大な格差となって結晶するのだろう。<br>人のふり見て我がふり直せ。私はどっちの人間でありたいか？ 答えは決まっている。さて、まずはスマホを握りしめ、あの「なしのつぶて派」から順に、お掃除（ブロック）を開始するとしよう。""",
        "body_en": """"As a senior, one ought to clear out human relationships at a brisk pace"—or so I had firmly resolved. Yet, my LINE account is still cluttered with a vast crowd of friends and groups. To make matters worse, I've just shared my new homepage with everyone. Do I actually want to keep expanding my circle? I am nothing if not a walking contradiction.<br>Still, this announcement served as the perfect litmus test. The reactions were split cleanly down the middle: the "geniuses of joy" who instantly sent warm praise, and the "masters of ghosting" who met it with absolute silence.<br>Interestingly, age has nothing to do with it. It simply lays bare a person's true character. This tiny difference in response will likely crystallize over a lifetime into a massive divide in what we call personal virtue.<br>Seeing their behavior makes me reflect on my own. Which kind of person do I want to be? The answer is obvious. Now then, clutching my smartphone, I shall begin the cleanup (blocking)—starting with the "radio silence" camp.""",
    },
    {
        "slug": "mobile-maze",
        "date": "2026-07-09",
        "date_ja": "2026.7.9",
        "date_en": "July 9, 2026",
        "title_ja": "スマホ表示の迷宮に迷い込んでいます。",
        "title_en": "Lost in the maze of mobile display.",
        "body_ja": """PC画面では完璧か。なのに、スマホで見ると無情なほどに崩れている。修正しては確認、確認しては修正の無限ループに、「もう無理か」と絶望しています。<br>そんな私の心折れる挑戦を支えてくれるのが、AIツールという相棒です。何十回もの無茶振りに、文句ひとつ言わず付き合ってくれる懐の深さには感謝しかありません。<br>しかし、だからこそ突きつけられる最大の壁。それは「自分の意図を、いかに的確にAIへ伝えるか」という難題です。<br>今日も画面とにらめっこしながら、こちょこちょと修正を試みる四苦八苦の日々。ですが、この悪戦苦闘の先に、一体どんな美しい景色が待っているのか。シニア世代のプライドをかけたパズルの結末を、ぜひ見届けてくださいね。""",
        "body_en": """On PC, it looks perfect. Yet on a smartphone, it falls apart mercilessly. Fix, check, fix, check—caught in an endless loop, I've found myself despairing, wondering if it's hopeless.<br>What keeps me going through this heart-breaking challenge is my partner: AI tools. After dozens of unreasonable requests, they never complain—their patience leaves me nothing but grateful.<br>And yet, that is precisely where the biggest wall stands. How to convey my intentions to AI clearly and accurately—that is the hard part.<br>Today again, I stare at the screen, tinkering here and there through days of struggle. But what beautiful view awaits beyond this uphill battle? Please stay with me to see how this puzzle ends—a senior's pride is on the line.""",
    },
    {
        "slug": "site-ops-note",
        "date": "2026-07-08",
        "date_ja": "2026.7.8",
        "date_en": "July 8, 2026",
        "title_ja": "サイト運営についてのお知らせ",
        "title_en": "A Note on How This Site Is Run",
        "body_ja": """このサイトはこれまで、いわば"無料の畑"を借りて育ててきた。本日、地主さんから「もう無料のままは難しいです」と連絡が入った。サイト初心者の私は少しドキッとした。ただ、いろいろ調べた結果、次のように進めることに決めた。<br>1. まずは1ヶ月だけ小作料を払って継続する。<br>2. その間に、新しい無料の畑を探す。<br>3. ゆくゆくは"自分の土地"（独自ドメイン）を持つ。<br>畑も家も、最初は賃貸から始まり、やがて持ち家になるものだと思っています。当面はこれまで通り継続すると思いますので、引き続きよろしくお付き合いください。今日からNetlifyが課金です。""",
        "body_en": """Until now, this website has been growing on what you might call "borrowed free farmland." Today, the landlord let us know that keeping it free any longer would be difficult. As a complete beginner with websites, I felt a little shaken — but after looking into it, I've decided to proceed as follows.<br>1. First, pay a small rent for one month to keep going.<br>2. During that time, look for new free farmland.<br>3. Eventually, acquire "land of my own" (a custom domain).<br>I think fields and homes alike often start as rentals and gradually become one's own. For now, the site will continue as before — thank you for staying with us. Paid service starts today.""",
    },
    {
        "slug": "lemon-memorial",
        "date": "2026-07-08",
        "date_ja": "2026.7.8",
        "date_en": "July 8, 2026",
        "title_ja": "愛しの兎レモンの命日",
        "title_en": "Beloved rabbit Lemon's memorial day",
        "body_ja": """今日は愛しの兎レモンの命日だ。あの子が旅立ってから、ちょうど五か月になる。<br>九年間、ともに暮らした。妻も、娘も、息子も、そして私も、みんなレモンに夢中だった。あの小さな体が、いつも家族の中心にいた。<br>別れの悲しみは、覚悟していたはずなのに、その想像をはるかに超えていた。正直、つらかった。<br>それでも、時間は静かに流れていく。あれほど胸を締めつけていた悲しみも、少しずつ過去のものへと変わり始めている。それは少し寂しいけれど、それもまた生きていくということなのだろう。<br>けれど、九年という歳月の思い出だけは、色褪せることはない。レモンがくれた笑顔も、ぬくもりも、家族みんなで過ごした時間も、これから先ずっと私たちの心の中で生き続ける。ありがとう、レモン。九年間の夢物語。""",
        "body_en": """Today is the memorial day of our beloved rabbit Lemon. It has been exactly five months since she left us.<br>We lived together for nine years. My wife, my daughter, my son, and I—we were all absolutely devoted to Lemon. That small body was always at the very center of our family.<br>I thought I was prepared for the grief of parting, but it far exceeded anything I had imagined. Honestly, it really took a toll on me.<br>Still, time flows heartlessly on. The sorrow that was once so raw has begun, little by little, to fade into the past. It feels lonely to admit, but I suppose that is just the reality of life.<br>Yet the memories of those nine years do not fade. The smiles Lemon gave us, the warmth, and the time our whole family spent together—they will live on in our hearts forever. Thank you, Lemon. A nine-year dream story.""",
    },
    {
        "slug": "potato-massacre",
        "date": "2026-07-07",
        "date_ja": "2026.7.7",
        "date_en": "July 7, 2026",
        "title_ja": "丸腰の代償——じゃがいも全滅記",
        "title_en": "Unarmed and Defeated: The Potato Massacre",
        "body_ja": """「熊が出てきてないからまだましだ」——近場の長老の言葉だ。応桑の実家を１週間ぶりに訪ねた。裏の畑に植えたじゃがいもと里芋。この春には、ウリ坊を３匹目撃していて、近場も掘られていて、いつやられるかと気をもんでいたのだ。１週間前は無事だったのだが、本日訪ねるとーーーー根こそぎ全滅！芋は皆無で、荒れ放題。<br>一方で、長老さん宅の畑は、トタンで全面を囲い、電熱線を３本敷きつめて、イノシシもハクビシンも撃退中とのこと。無防備な私のじゃがいもがやられたことを伝えると、返答は、同情ではなく叱責に近かった。確かに、丸腰。完全に負け戦。来年に向けてトタンと電熱線を揃えるなら、数万円はいってしまいそう。""",
        "body_en": """“Well, at least no bears showed up, so I guess I should count my blessings” — that's what the old-timer nearby said. I visited my family home in Ōkuwa for the first time in a week. In the back field, I'd planted potatoes and taros. This spring I'd already spotted three wild boar piglets, and the area nearby had already been dug up, so I'd been on edge wondering when my potatoes would get hit. A week ago everything was fine, but when I checked today, it was all wiped out, root and all — not a single potato left, the whole field left in ruins.<br>The old-timer's field is fully enclosed with corrugated tin sheeting and lined with three rows of electric wire, keeping both the wild boars and the raccoon dogs at bay, he told me. When I mentioned that my defenseless potatoes had been wiped out, his reply felt less like sympathy and more like a scolding. Fair enough — completely unguarded. A total defeat. If I'm going to set up tin sheeting and electric wire for next year, it'll probably run me tens of thousands of yen.""",
    },
]

SHORT_NOTES = {
    "slug": "short-notes",
    "date": "2026-07-06",
    "date_ja": "2026.7.6",
    "date_en": "July 6, 2026",
    "title_ja": "一言メモまとめ",
    "title_en": "Short Notes (collected)",
    "items_ja": [
        ("2026.7.6", "10年できなかったことが、今、できた。この先、Webをどう活かせるかはまだ分からない。悠長にしている余裕はないが、団塊世代として、思うこと、伝えたいことは山ほどある。"),
        ("—", "Webアップに必要なのは、むずかしい知識ではなく、実写・短文・定期更新、そして公開を続ける習慣なのだという。"),
        ("2026.7.5", "このホームページは、プログラミング駆け出しの自分が、Cursor（課金版）を使って1日で作り上げました。<br>早速このままWebに上げてみて、順次、修正、追加して、改訂していきます。"),
    ],
    "items_en": [
        ("July 6, 2026", "For ten years, I couldn't do it. Now, I finally have. Going forward, I still don't know how to make use of the Web. There's no time to take things slowly—but as a member of the baby boomer generation, what I think and want to share is plentiful as mountains."),
        ("—", "For putting a site on the web, what's needed is the habit of real photos, short texts, regular updates, and publishing—rather than advanced programming, or so I'm told."),
        ("July 5, 2026", "I built this website in one day as a programming beginner using Cursor (paid plan), and I'm putting it on the web right away—I will keep adding, revising, and updating it over time."),
    ],
}


def strip_date_span(text: str) -> str:
    return re.sub(r'<span class="soliloquy__date">.*?</span>', "", text, flags=re.S).strip()


def br_to_paragraphs(text: str) -> str:
    text = strip_date_span(text)
    parts = [p.strip() for p in re.split(r"<br\s*/?>", text) if p.strip()]
    return "\n".join(f"<p>{p}</p>" for p in parts)


def page_ja(post: dict, body_html: str) -> str:
    title = post["title_ja"]
    esc = html.escape(title)
    return f"""<!DOCTYPE html>
<html lang="ja" translate="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{esc}｜佐藤農園ブログ">
  <link rel="alternate" hreflang="ja" href="{post['slug']}.html">
  <link rel="alternate" hreflang="en" href="../../blog-en/notes/{post['slug']}.html">
  <meta name="google" content="notranslate">
  <title>{esc}｜佐藤農園ブログ</title>
  <link rel="canonical" href="https://satofarms.com/blog/notes/{post['slug']}.html">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../style.css?v=17">
</head>
<body class="notranslate blog-page">
  <div id="top" class="page-top-anchor" tabindex="-1" aria-hidden="true"></div>
  <header class="header blog-header">
    <div class="header__inner">
      <a href="../../index.html" class="logo">佐藤農園<span>ブログ</span></a>
      <div class="header__tools">
        <div class="header__actions">
          <a href="../../blog-en/notes/{post['slug']}.html" class="header__lang-btn" lang="en">English</a>
          <button class="nav-toggle" type="button" aria-label="メニューを開く" aria-expanded="false"><span></span><span></span><span></span></button>
        </div>
        <nav class="nav" aria-label="メインナビゲーション">
          <a href="../../index.html">トップ</a>
          <a href="../">ブログ</a>
          <a href="../#notes">独り言</a>
          <a href="../../index.html#contact" class="nav__cta">お問い合わせ</a>
        </nav>
      </div>
    </div>
  </header>
  <main>
    <article class="blog-article">
      <div class="container">
        <nav class="blog-breadcrumb" aria-label="パンくずリスト">
          <a href="../../index.html">トップ</a><span aria-hidden="true">/</span>
          <a href="../">ブログ</a><span aria-hidden="true">/</span>
          <span>独り言</span>
        </nav>
        <p class="blog-article__meta">
          <span class="blog-article__category">独り言</span>
          <time datetime="{post['date']}">{post['date_ja']}</time>
        </p>
        <h1 class="blog-article__title">{esc}</h1>
        <div class="blog-article__body">
{body_html}
        </div>
        <nav class="blog-article__nav" aria-label="記事フッターナビ">
          <a href="../">← ブログ一覧へ</a>
          <a href="../../blog-en/notes/{post['slug']}.html" lang="en">English</a>
        </nav>
      </div>
    </article>
  </main>
  <div class="blog-home-bar">
    <div class="container blog-home-bar__inner">
      <a class="blog-home-bar__btn" href="../../index.html">← 佐藤農園トップへ戻る</a>
    </div>
  </div>
  <footer class="footer">
    <div class="container footer__inner">
      <p class="footer__logo">佐藤農園</p>
      <p class="footer__note"><a href="../">ブログ一覧へ</a> · <a href="../../index.html">トップへ</a></p>
      <p class="footer__copy">&copy; 2026 佐藤農園</p>
    </div>
  </footer>
  <script src="../../script.js"></script>
</body>
</html>
"""


def page_en(post: dict, body_html: str) -> str:
    title = post["title_en"]
    esc = html.escape(title)
    return f"""<!DOCTYPE html>
<html lang="en" translate="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{esc} | Sato Farms Blog">
  <link rel="alternate" hreflang="en" href="{post['slug']}.html">
  <link rel="alternate" hreflang="ja" href="../../blog/notes/{post['slug']}.html">
  <meta name="google" content="notranslate">
  <title>{esc} | Sato Farms Blog</title>
  <link rel="canonical" href="https://satofarms.com/blog-en/notes/{post['slug']}.html">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&family=Noto+Serif:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../style.css?v=17">
</head>
<body class="notranslate blog-page">
  <div id="top" class="page-top-anchor" tabindex="-1" aria-hidden="true"></div>
  <header class="header blog-header">
    <div class="header__inner">
      <a href="../../index-en.html" class="logo">Sato Farms<span>Blog</span></a>
      <div class="header__tools">
        <div class="header__actions">
          <a href="../../blog/notes/{post['slug']}.html" class="header__lang-btn" lang="ja">日本語</a>
          <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
        </div>
        <nav class="nav" aria-label="Main navigation">
          <a href="../../index-en.html">Home</a>
          <a href="../">Blog</a>
          <a href="../#notes">Notes</a>
          <a href="../../index-en.html#contact" class="nav__cta">Contact</a>
        </nav>
      </div>
    </div>
  </header>
  <main>
    <article class="blog-article">
      <div class="container">
        <nav class="blog-breadcrumb" aria-label="Breadcrumb">
          <a href="../../index-en.html">Home</a><span aria-hidden="true">/</span>
          <a href="../">Blog</a><span aria-hidden="true">/</span>
          <span>Notes</span>
        </nav>
        <p class="blog-article__meta">
          <span class="blog-article__category">Random Thoughts</span>
          <time datetime="{post['date']}">{post['date_en']}</time>
        </p>
        <h1 class="blog-article__title">{esc}</h1>
        <div class="blog-article__body">
{body_html}
        </div>
        <nav class="blog-article__nav" aria-label="Article footer">
          <a href="../">← Back to blog</a>
          <a href="../../blog/notes/{post['slug']}.html" lang="ja">日本語</a>
        </nav>
      </div>
    </article>
  </main>
  <div class="blog-home-bar">
    <div class="container blog-home-bar__inner">
      <a class="blog-home-bar__btn" href="../../index-en.html">← Back to Sato Farms Home</a>
    </div>
  </div>
  <footer class="footer">
    <div class="container footer__inner">
      <p class="footer__logo">Sato Farms</p>
      <p class="footer__note"><a href="../">Blog index</a> · <a href="../../index-en.html">Home</a></p>
      <p class="footer__copy">&copy; 2026 Sato Farms</p>
    </div>
  </footer>
  <script src="../../script.js"></script>
</body>
</html>
"""


def short_notes_body(items: list[tuple[str, str]]) -> str:
    blocks = []
    for date_label, text in items:
        paras = br_to_paragraphs(text)
        blocks.append(
            f'<section class="blog-short-note">\n'
            f'  <p class="blog-short-note__date">{html.escape(date_label)}</p>\n'
            f'  {paras}\n'
            f"</section>"
        )
    return "\n".join(blocks)


def list_item_html(post: dict, lang: str) -> str:
    if lang == "ja":
        date_label = post["date_ja"]
        title = post["title_ja"]
        badge = "公開中"
    else:
        date_label = post["date_en"].replace("July ", "Jul ").replace(", 2026", ", 2026")
        # keep full English dates from post
        date_label = post["date_en"]
        title = post["title_en"]
        badge = "Ready"
    return f"""          <li class="blog-list__item">
            <a class="blog-list__row" href="notes/{post['slug']}.html">
              <time class="blog-list__date" datetime="{post['date']}">{date_label}</time>
              <p class="blog-list__title">{html.escape(title)}</p>
              <span class="blog-list__badge blog-list__badge--ready">{badge}</span>
            </a>
          </li>"""


def main() -> None:
    ja_dir = ROOT / "blog" / "notes"
    en_dir = ROOT / "blog-en" / "notes"
    ja_dir.mkdir(parents=True, exist_ok=True)
    en_dir.mkdir(parents=True, exist_ok=True)

    for post in POSTS:
        if "body_ja_html" in post:
            body_ja = post["body_ja_html"].strip()
        else:
            body_ja = br_to_paragraphs(post["body_ja"])
        body_en = br_to_paragraphs(post["body_en"])
        (ja_dir / f"{post['slug']}.html").write_text(page_ja(post, body_ja), encoding="utf-8")
        (en_dir / f"{post['slug']}.html").write_text(page_en(post, body_en), encoding="utf-8")
        print("wrote", post["slug"])

    sn = SHORT_NOTES
    body_ja = (
        "<p>LPの独り言コーナーにあった短いメモを、ここにまとめました。</p>\n"
        + short_notes_body(sn["items_ja"])
    )
    body_en = (
        "<p>Short notes from the landing page Random Thoughts section, collected here.</p>\n"
        + short_notes_body(sn["items_en"])
    )
    (ja_dir / f"{sn['slug']}.html").write_text(page_ja(sn, body_ja), encoding="utf-8")
    (en_dir / f"{sn['slug']}.html").write_text(page_en(sn, body_en), encoding="utf-8")
    print("wrote short-notes")

    # Small CSS for short-note blocks
    css_path = ROOT / "style.css"
    css = css_path.read_text(encoding="utf-8")
    marker = "/* blog-short-note */"
    if marker not in css:
        css_path.write_text(
            css
            + f"""

{marker}
.blog-short-note {{
  margin: 0 0 1.75rem;
  padding: 1rem 0 0;
  border-top: 1px solid rgba(45, 74, 62, 0.14);
}}
.blog-short-note:first-of-type {{
  border-top: 0;
  padding-top: 0;
}}
.blog-short-note__date {{
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}}
""",
            encoding="utf-8",
        )

    print("done")


if __name__ == "__main__":
    main()
