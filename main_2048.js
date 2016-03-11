var board = new Array();
var score = 0;

$(document).ready(function(){
	newgame();
});

function newgame(){
	//初始化棋盘格
	init();
	//在随机两个格子中生成数字
	getOneNumber();
	getOneNumber();
}

function init(){
	//初始化各个小格子的位置
	for(var i = 0; i < 4; i++)
	{
		for(var j = 0; j < 4; j++){
			var gradecell = $("#grade-cell-"+i+"-"+j);
			gradecell.css('top',getposTop(i,j));//计算距离顶端的距离
			gradecell.css('left',getposLeft(i,j));//计算距离左端的距离
		}
	};

	//初始化board的数值，其实也可以和上面的循环合并，但为了更好理解将其分开
	for(var i = 0; i < 4; i++)
	{
		board[i] = new Array();
		for(var j = 0; j < 4; j++){
			board[i][j] = 0;
		}
	}

	//更新board中的数值大小，并告诉前端显示出来
	updateBoardView();
}

//更新board数据
function updateBoardView() {
	$('.number-cell').remove();
	for(var i = 0; i < 4; i++)
	{
		for(var j = 0; j < 4; j++){
			//增加类为number-cell的div，与原来的grade-cell区分开来,用于更新数据
			//$('#container').append('<div class="number-cell" id="number-cell-"+i+"-"+j+'"></div>");
            $("#container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
			var thisNumberCell = $('#number-cell-'+i+'-'+j);	 //指向当前操作

			//如果操作对象数值为0，则将其宽高均设为0，并更新其位置
			if(board[i][j] == 0)
			{
				thisNumberCell.css('width','0px');
				thisNumberCell.css('height','0px');
				thisNumberCell.css('top',getposTop(i,j)+50);
				thisNumberCell.css('left',getposLeft(i,j)+50);
			}
			else
			//如果操作对象数值不为0，则将其宽高均设为100px，并更新其位置
			//同时，还需要更新背景色和前端显示的字体颜色
			{
				thisNumberCell.css('width','100px');
				thisNumberCell.css('height','100px');
				thisNumberCell.css('top',getposTop(i,j));
				thisNumberCell.css('left',getposLeft(i,j));

				//背景色,传入的参数board[i][j]是一个数值
				thisNumberCell.css('background-color',getNumberBackColor(board[i][j]));
				//字体颜色
				thisNumberCell.css('color',getNumberColor(board[i][j]));
				//显示数值大小
				thisNumberCell.text(board[i][j]);
			}
		}
	}
}


//在随机两个格子中生成数字
function getOneNumber() {
	if ( nospace(board) ) //nospace()函数用于判断是否还有空余的格子
	{
		return false;
	}

//随机产生一个数字有三个步骤，一是选择位置，另一个是产生随机数字，
//第三步则是在随机位置处放置随机产生的数字
	//一、随机选择一个位置
		//Math.random()随机产生0~1之间的随机数，floor()是指向下取整，例如3.3取3.
		//随机生成x，y坐标
		var randx = parseInt(Math.floor(Math.random() * 4 ));
		var randy = parseInt(Math.floor(Math.random() * 4 ));
		//判断生成的坐标是否可以使用，即是否为空
		while(1)
		{
			if ( board[randx][randy] == 0) {break;}
			else{
				randx = parseInt(Math.floor(Math.random() * 4 ));
				randy = parseInt(Math.floor(Math.random() * 4 ));
			}
		}
	//二、在随机位置随机产生一个数字,但又由游戏规则可知要么是2，要么是4
		var randomNumber = Math.random()< 0.5 ? 2 : 4;
	//三、在随机位置处放置随机产生的数字
		board[randx][randy] == randomNumber;
		showNumberWithAnimation(randx,randy,randomNumber);//以动画形式将随机数字显示出来

	return true;
}

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37://left
			if( moveLeft() )
			//moverleft函数会先判断是否可以左移，若可以，则返回true，然后执行if条件语句里面的内容，接着将所有元素左移
			{
				getOneNumber();		//所有元素左移以后，随机产生一个数字;
				isgameover();		//产生一个数字后，判断游戏是否结束
			}
			break;
		case 38://up
			if( moveUp() )
			{
				getOneNumber();		
				isgameover();		
			}
			break;
		case 39://right
			if( moveRight() )
			{
				getOneNumber();		
				isgameover();		
			}
			break;
		case 40://down
			if( moveDown() )
			{
				getOneNumber();		
				isgameover();		
			}
			break;
		default://default
			break;
	}
});

function isgameover(){
	
}

//所有元素左移
function moveLeft(){
	if( canMoveLeft(board) ) //canMoveLeft()用于判断是否可以执行左移操作
	//canMoveLeft()返回true,下面开始执行左移操作
	//虽然已经确定可以移动了，但是我们还需进一步确定该移动到哪个位置
	{
		for( var i = 0 ; i < 4 ; i++)
		{
			for( var j = 1 ; j < 4 ; j++)
			{
				if ( board[i][j] != 0 )
				{
					for( var  k = 0 ; k < j ; k++ )
					{
						if (board[i][k] == 0 && noBlock(i,k,j,board) )//noBlock用于判断是否有障碍物
						{
							//移动
							showMoveAnimation( i , j , i , k);
							board[i][j-1] = board[i][j];
							board[i][j] = 0;
							continue;
						}

						else if (board[i][k] == board[i][j] && noBlock(i,k,j,board) )
						{
							//移动
							showMoveAnimation( i , j , i , k);
							board[i][j-1] = 2 * board[i][j];
							board[i][j] = 0;
							continue;
						}
					}
				}
			}
		}
		return true;
	}
	return false;
}

