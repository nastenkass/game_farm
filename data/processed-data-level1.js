var characters = 
{
	"pharmacist_1":{
	  "poses":{
		"default": "img/pacient_1.png"
	  },
	  "name":"Фармацевт"
	},
  
	"noname":{
	  "poses":{
		"default":"img/pacient_1_hide.png"
	  },
	  "name":"Посетитель"
	},
  
	"sick1":{
	  "poses":{
		"default":"img/pacient_1.png",
		"angry":"img/VN_chara001_neutral.png",
		"ok": "img/VN_chara001_happy.png"
	  },
	  "name":"Пациент"
	}
  };
 var places = 
{
	"street" : {
		"name":"Аптека",
    	"image":"img/VN_scene001.png"
    },

	"farm" : {
		"name":"Аптека",
    	"image":"img/back1.png"
    }
}; 
 var story = 
[
	{
		"title": "Start",
		"tags": "",
		"body": "<<place farm>>\n{{noname}} ... \n{{pharmacist_1}}[[Здравствуйте, требуется ли вам консультация специалиста?| |<<check_answer 1>> <<point 2>>]]\n[[Здравствуйте| |<<check_answer 2>>]]\n[[...| |<<check_answer 0>>]]{{pharmacist_1}}\n{{sick1}}Здравствуйте. Помогите, пожалуйста, мне нужен лекарственный препарат при спастической боли в желудке.{{sick1}}\n{{pharmacist_1}}[[Обращались ли Вы к врачу по этому поводу, есть ли у Вас рецепт?|nextScene|<<check_answer 1>> <<point 2>>]]\n[[У меня есть универсальное средство от спастической боли в желудке, которое подходит всем без исключения. Вам не потребуется консультация врача или рецепт|nextScene|<<check_answer 0>>]]\n[[Не обязательно обращаться к врачу. Просто выберите самый дешевый препарат без рецепта в аптеке и начните его принимать|nextScene|<<check_answer 0>>]]\n[[Моя бабушка всегда говорила, что для спастической боли в желудке нужно употреблять больше острых перцев. Это самый надежный способ избавиться от боли|nextScene|<<check_answer 0>>]]{{pharmacist_1}}",
		"position": {
			"x": 563,
			"y": 322
		},
		"colorID": 0
	},
	{
		"title": "nextScene",
		"tags": "",
		"body": "{{sick1}}К врачу не обращалась, рецепта нет\n{{pharmacist_1}}[[Рецепт от врача — это всего лишь формальность. Вы можете приобрести любой препарат без рецепта, и он сработает так же хорошо|nextScene1|<<check_answer 0>>]]\n[[В таком случае я не могу вам что-то порекомендовать|nextScene1|<<check_answer 0>>]]\n[[В связи с отсутствием назначения врача, я могу Вам порекомендовать только препараты, отпускаемые без рецепта|nextScene1|<<check_answer 1>> <<point 1>>]]\n[[Не беспокойтесь, мы можем порекомендовать вам любой самый эффективный препарат без рецепта|nextScene1|<<check_answer 0>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
  	{
		"title": "nextScene1",
		"tags": "",
		"body": "{{sick1}}[[*Кивает*|nextScene2]]",
		"position": {
			"x": 456,
			"y": 789
		},
		"colorID": 0
	},
	{
		"title": "nextScene2",
		"tags": "",
		"body": "{{pharmacist_1}}[[Как давно Вас это беспокоит?|choiseAnswer_7|<<check_answer 0>> <<kick_choice 7>>]]\n[[Поясните, пожалуйста, в связи с какими симптомами или заболеваниями планировалось применение данного препарата?|choiseAnswer_1|<<check_answer 1>> <<point 1>>]] \n[[Уточните, пожалуйста, для кого приобретается препарат: взрослый, ребѐнок или для себя?|choiseAnswer_2|<<check_answer 1>> <<point 1>>]]\n[[Есть ли у Вас аллергические реакции на определенные лекарственные препараты?|choiseAnswer_8|<<check_answer 0>>]]\n[[Расскажите есть ли другие заболевания?|choiseAnswer_3|<<check_answer 1>> <<point 22>>]]\n[[Применяете ли на данный момент другие препараты?|choiseAnswer_4|<<check_answer 1>> <<point 22>>]]\n[[Вам предложить лекарство подороже или подешевле?|choiseAnswer_9|<<check_answer 0>>]]\n[[Есть ли особые состояния здоровья: беременность, кормление грудью?|choiseAnswer_5|<<check_answer 1>> <<point 22>>]]\n[[Вы хотите приобрести оригинальные препарат или дженерик?|choiseAnswer_6|<<check_answer 0>>]]\n[[<b>На основе полученной от Вас информации, я могу порекомендовать Вам... (Закончить сбор информации)</b>|nextScene3|<<shelf 1>>]]{{pharmacist_1}}",
		"position": {
			"x": 1254,
			"y": 432
		},
		"colorID": 0
	},
  	{
		"title": "choiseAnswer_1",
		"tags": "",
		"body": "{{sick1}} Меня беспокоит периодическая спастическая боль в желудке \n {{pharmacist_1}}[[<i>Вернуться к списку вопросов</i>|nextScene2]]\n[[<b>На основе полученной от Вас информации, я могу порекомендовать Вам... (Закончить сбор информации)</b>|nextScene3|<<shelf 1>>]]{{pharmacist_1}}",
		"position": {
			"x": 683,
			"y": 186
		},
		"colorID": 0
	},
  	{
    	 "title": "choiseAnswer_2",
		"tags": "",
		"body": "{{sick1}} Препарат необходим мне \n {{pharmacist_1}}[[<i>Вернуться к списку вопросов</i>|nextScene2]]\n[[<b>На основе полученной от Вас информации, я могу порекомендовать Вам... (Закончить сбор информации)</b>|nextScene3|<<shelf 1>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
  	{
        "title": "choiseAnswer_3",
		"tags": "",
		"body": "{{sick1}} В моем анамнезе есть гастрит, но без обострения \n {{pharmacist_1}}[[<i>Вернуться к списку вопросов</i>|nextScene2]]\n[[<b>На основе полученной от Вас информации, я могу порекомендовать Вам... (Закончить сбор информации)</b>|nextScene3|<<shelf 1>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
  	{
        "title": "choiseAnswer_4",
		"tags": "",
		"body": "{{sick1}} Не принимаю \n {{pharmacist_1}}[[<i>Вернуться к списку вопросов</i>|nextScene2]]\n[[<b>На основе полученной от Вас информации, я могу порекомендовать Вам... (Закончить сбор информации)</b>|nextScene3|<<shelf 1>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
  	{
        "title": "choiseAnswer_5",
		"tags": "",
		"body": "{{sick1}} Отсутствуют \n {{pharmacist_1}}[[<i>Вернуться к списку вопросов</i>|nextScene2]]\n[[<b>На основе полученной от Вас информации, я могу порекомендовать Вам... (Закончить сбор информации)</b>|nextScene3|<<shelf 1>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
  	{
        "title": "choiseAnswer_6",
		"tags": "",
		"body": "{{sick1}} Желательно оригинальный препарат, так как он более эффективный \n {{pharmacist_1}}[[<i>Вернуться к списку вопросов</i>|nextScene2]]\n[[<b>На основе полученной от Вас информации, я могу порекомендовать Вам... (Закончить сбор информации)</b>|nextScene3|<<shelf 1>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
  	{
        "title": "choiseAnswer_7",
		"tags": "",
		"body": "{{sick1}} Наверное уже несколько месяцев, а может и больше \n {{pharmacist_1}}[[<i>Вернуться к списку вопросов</i>|nextScene2]]\n[[<b>На основе полученной от Вас информации, я могу порекомендовать Вам... (Закончить сбор информации)</b>|nextScene3|<<shelf 1>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
  	{
        "title": "choiseAnswer_8",
		"tags": "",
		"body": "{{sick1}} Аллергических реакций нет \n {{pharmacist_1}}[[<i>Вернуться к списку вопросов</i>|nextScene2]]\n[[<b>На основе полученной от Вас информации, я могу порекомендовать Вам... (Закончить сбор информации)</b>|nextScene3|<<shelf 1>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
  	{
        "title": "choiseAnswer_9",
		"tags": "",
		"body": "{{sick1}} Не имеет значения, мне главное, чтобы лекарство мне помогло. \n {{pharmacist_1}}[[<i>Вернуться к списку вопросов</i>|nextScene2]]\n[[<b>На основе полученной от Вас информации, я могу порекомендовать Вам... (Закончить сбор информации)</b>|nextScene3|<<shelf 1>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
  	{
        "title": "nextScene3",
		"tags": "",
		"body": "{{sick1}} Спасибо за помощь \n {{sick1}}[[Расскажите, пожалуйста, как действует рекомендованный препарат «Но-шпа» при моих симптомах?|nextScene4]]",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
	{
        "title": "nextScene4",
		"tags": "",
		"body": "{{pharmacist_1}} [[«Но-шпа» проявляет мощное спазмолитическое действие на гладкую мускулатуру за счет ингибирования фермента фосфодиэстеразы 4 типа.|nextScene5|<<check_answer 1>> <<point 1>>]]\n[[«Но-шпа» оказывает протеолитическое, амилолитическое и липолитическое действие.|nextScene5|<<check_answer 0>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
	{
        "title": "nextScene5",
		"tags": "",
		"body": "{{sick1}} Поняла, а как будет действовать «Тримедат» при моих симптомах? \n {{pharmacist_1}}[[«Тримедат» активируется и ингибирует Н+/К+-АТФ-азу протонной помпы. |nextScene6|<<check_answer 0>>]]\n[[«Тримедат» действует на периферические σ-, µ- и κ-опиоидные рецепторы, в т.ч. находящиеся непосредственно на гладкой мускулатуре на всем протяжении ЖКТ, регулирует моторику без влияния на ЦНС.|nextScene6|<<check_answer 1>> <<point 1>>]]\n[[«Тримедат» нейтрализует свободную соляную кислоту в желудке, снижает активность пепсина, что приводит к уменьшению переваривающей активности желудочного сока.|nextScene6|<<check_answer 0>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
	{
        "title": "nextScene6",
		"tags": "",
		"body": "{{sick1}} А «Иберогаст» как будет действовать при моих симптомах? \n {{pharmacist_1}}[[«Иберогаст» является специфическим блокатором дофаминовых (D2) и серотониновых рецепторов|nextScene7|<<check_answer 0>>]]\n[[«Иберогаст» нормализует тонус гладкой мускулатуры ЖКТ: способствует устранению спазма без влияния на нормальную перистальтику|nextScene7|<<check_answer 1>> <<point 1>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
	{
        "title": "nextScene7",
		"tags": "",
		"body": "{{sick1}} Я бы хотела приобрести «Но-шпу» {{sick1}} \n {{sick1}} В каких лекарственных формах данный препарат в наличии в аптеке?\n{{pharmacist_1}}[[Данный препарат в наличии в аптеке в виде капсул|nextScene8|<<check_answer 0>>]]\n[[Данный препарат в наличии в аптеке в виде порошка|nextScene8|<<check_answer 0>>]]\n[[Данный препарат в наличии в аптеке в виде раствора|nextScene8|<<check_answer 0>>]]\n[[Данный препарат в наличии в аптеке в виде таблеток|nextScene8|<<check_answer 1>> <<point 1>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
	{
        "title": "nextScene8",
		"tags": "",
		"body": "{{sick1}} [[Расскажите, пожалуйста, как применяется данный препарат?|nextScene9|<<turn_on_pc 1>>]]",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
	{
        "title": "nextScene9",
		"tags": "",
		"body": "{{pharmacist_1}} [[Препарат принимается по 3 таблетки на один прием 1 раз/сут.|nextScene10|<<check_answer 0>>]]\n[[Препарат принимается По 1-2 таблетки на один прием 2-3 раза/сут.|nextScene10|<<check_answer 1>> <<point>>]]\n[[Препарат принимается по 1 таблетке на один прием 1 раз/сут.|nextScene10|<<check_answer 0>>]]\n[[Препарат принимается по 2-3 таблетки на один прием 2 раза/сут.|nextScene10|<<check_answer 0>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
	{
        "title": "nextScene10",
		"tags": "",
		"body": "{{sick1}} Есть ли особенности применения в зависимости от приѐма пищи? \n {{pharmacist_1}} [[Препарат необходимо принимать после еды|nextScene11|<<check_answer 0>>]] \n [[Препарат необходимо принимать до еды|nextScene11|<<check_answer 0>>]] \n [[Прием препарата не зависит от приема пищи|nextScene11|<<check_answer 1>> <<point 1>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
	{
        "title": "nextScene11",
		"tags": "",
		"body": "{{sick1}} Как долго мне применять данный препарат? \n {{pharmacist_1}} [[При приеме препарата без консультации с врачом рекомендованная продолжительность приема препарата обычно составляет  1-2 дня|nextScene12|<<check_answer 0>>]] \n [[При приеме препарата без консультации с врачом рекомендованная продолжительность приема препарата обычно составляет 1-2 дня. При сохранении симптомов или ухудшении состояния, рекомендую Вам обратиться к врачу|nextScene12|<<check_answer 1>> <<point 1>>]] \n [[При приеме препарата без консультации с врачом рекомендованная продолжительность приема препарата обычно составляет месяц|nextScene12|<<check_answer 0>>]] \n [[При приеме препарата без консультации с врачом рекомендованная продолжительность приема препарата обычно составляет 30 дней|nextScene12|<<check_answer 0>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
	{
        "title": "nextScene12",
		"tags": "",
		"body": "{{sick1}} Какие побочные эффекты могут развиться при применении данного лекарственного препарата? \n {{pharmacist_1}} [[При применении данного препарата могут развиться: головная боль, вертиго, бессонница, тошнота, запор, аллергические реакции|nextScene13|<<check_answer 1>> <<point 1>>]]\n[[При применении данного препарата могут развиться: диарея, тошнота, сонливость, тромбофлебит|nextScene13|<<check_answer 0>>]]\n[[При применении данного препарата могут развиться: головная боль, нарушение слуха, феномен «Рикошета»|nextScene13|<<check_answer 0>>]]\n[[При применении данного препарата могут развиться: блокада нервно-мышечной передачи, потеря зрения, зуд, вздутие живота|nextScene13|<<check_answer 0>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
	{
        "title": "nextScene13",
		"tags": "",
		"body": "{{sick1}} Что делать при возникновении побочных эффектов при применении препарата, которые не описаны в инструкции? \n {{pharmacist_1}} [[В случае развития тяжелых побочных эффектов обратиться к врачу. При возникновении побочных эффектов, которые не описаны в инструкции, необходимо обратиться к врачу/в аптеку/ в Росздравнадзор для их регистрации|nextScene14|<<check_answer 0>>]]\n[[В случае развития тяжелых побочных эффектов прекратить приѐм препаратов. При возникновении побочных эффектов, которые не описаны в инструкции, необходимо написать на электронную почту аптечной сети, в которой приобретался данный препарат|nextScene14|<<check_answer 0>>]]\n[[В случае развития тяжелых побочных эффектов необходимо продолжить прием препаратов еще 2 дня, после чего обратиться к врачу. При возникновении побочных эффектов, которые не описаны в инструкции, необходимо обратиться к врачу/в аптеку/ в Росздравнадзор для их регистрации|nextScene14|<<check_answer 0>>]]\n[[В случае развития тяжелых побочных эффектов прекратить приѐм препаратов и обратиться к врачу. При возникновении побочных эффектов, которые не описаны в инструкции, необходимо обратиться к врачу/в аптеку/ в Росздравнадзор для их регистрации|nextScene14|<<check_answer 1>> <<point 1>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
	{
        "title": "nextScene14",
		"tags": "",
		"body": "{{sick1}} Как хранить данный препарат? \n {{pharmacist_1}} [[Данный препарат следует хранить при температуре не выше 22°C в сухом и недоступном для детей месте|nextScene15|<<check_answer 0>>]]\n[[Данный препарат следует хранить при температуре не выше 25°C в сухом и недоступном для детей месте|nextScene15|<<check_answer 2>> <<point 1>>]]\n[[Данный препарат следует хранить при температуре не выше 25°C в сухом и недоступном для детей месте. Остались ли у Вас еще вопросы?|nextScene15|<<check_answer 1>> <<point 2>>]]\n[[Данный препарат следует хранить при температуре не выше 19°C в сухом и недоступном для детей месте|nextScene15|<<check_answer 0>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
	{
        "title": "nextScene15",
		"tags": "",
		"body": "{{sick1}} Мне все понятно, спасибо \n {{pharmacist_1}} [[В таком случае предлагаю Вам оплатить препарат| |<<point 1>> <<point 0>> <<turn_on_pc 0>>]]{{pharmacist_1}}",
		"position": {
			"x": 824,
			"y": 304
		},
		"colorID": 0
	},
]

