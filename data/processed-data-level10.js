var characters = 
{
	"pharmacist_1":{
	  "poses":{
		"default": "img/woman1.png"
	  },
	  "name":"Фармацевт"
	},
  
	"noname":{
	  "poses":{
		"default":"img/woman1_hide2.png"
	  },
	  "name":"Посетитель"
	},
  
	"sick1":{
	  "poses":{
		"default":"img/woman1.png",
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
		"body": "<<place farm>>\n{{pharmacist_1}}[[Здравствуйте! Требуется ли вам консультация специалиста?| |<<check_answer 1>> <<turn_on_pc 1>>]]{{pharmacist_1}}\n{{sick1}}[[Здравствуйте! Порекомендуйте, пожалуйста, витаминно-минеральный комплекс| | ]]{{sick1}}\n{{pharmacist_1}}[[Обращались ли Вы к врачу по этому поводу, есть ли у Вас рецепт?|nextScene1|<<check_answer 1>> <<point 2>> <<turn_on_pc 0>>]]{{pharmacist_1}}",
		"position": {
			"x": 563,
			"y": 322
		},
		"colorID": 0
	}
]