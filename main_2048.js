var board = new Array();
var score = 0;
var hasConflicted = new Array();	//该数组作用是使每个格子每次只能发生一次叠加，且初始值设为false

//触摸的触摸坐标
var startx = 0 ;
var starty = 0 ;
var endx = 0 ;
var endy = 0 ;

$(document).ready(function(){
	prepareForMobile();
	newgame();
});

function prepareForMobile(){
	if( documentWidth > 500 ){
		gradeContainerWidth = 500 ; 
		cellSpace = 20 ; 
		cellSlideLength = 100 ;
	}

	$("#container").css("width" ,gradeContainerWidth - 2 * cellSpace);
	$("#container").css("height",gradeContainerWidth - 2 * cellSpace);
	$("#container").css("border-radius",gradeContainerWidth * 0.02);
	$("#container").css("padding",cellSpace);

	$(".grade-cell").css("width", cellSlideLength);
	$(".grade-cell").css("height",cellSlideLength);
	$(".grade-cell").css("border-radius",0.02 * cellSlideLength);
}

function newgame(){
	//初始化棋盘格
	init();
	//在随机两个格子中生成数字
	getOneNumber(board);
	getOneNumber(board);
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
		hasConflicted[i] = new Array();

		for(var j = 0; j < 4; j++){
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}

	//更新board中的数值大小，并告诉前端显示出来
	updateBoardView();

	//初始化分数
	score = 0;
}

//更新board数据
function updateBoardView() {
	$('.number-cell').remove();
	for(var i = 0; i < 4; i++){
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
				thisNumberCell.css('top',getposTop(i,j) + 0.5*cellSlideLength);
				thisNumberCell.css('left',getposLeft(i,j) + 0.5*cellSlideLength);
			}
			else
			//如果操作对象数值不为0，则将其宽高均设为100px，并更新其位置
			//同时，还需要更新背景色和前端显示的字体颜色
			{
				thisNumberCell.css('width',cellSlideLength);
				thisNumberCell.css('height',cellSlideLength);
				thisNumberCell.css('top',getposTop(i,j));
				thisNumberCell.css('left',getposLeft(i,j));

				//背景色,传入的参数board[i][j]是一个数值
				thisNumberCell.css('background-color',getNumberBackColor(board[i][j]));
				//字体颜色
				thisNumberCell.css('color',getNumberColor(board[i][j]));
				//显示数值大小
				thisNumberCell.text(board[i][j]);
			}

			hasConflicted[i][j] = false;
		}
	}
	$(".number-cell").css("line-height",cellSlideLength + 'px');
	$(".number-cell").css("font-size",0.6 * cellSlideLength + 'px');
}


//在随机两个格子中生成数字
function getOneNumber(board) {
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

		//times是计数器
		var times = 0;
		while(1)
		{
			if ( board[randx][randy] == 0) {break;}
			else{
				randx = parseInt( Math.floor(Math.random() * 4 ) );
				randy = parseInt( Math.floor(Math.random() * 4 ) );
				times++ ;
			}
			if (times == 50) 
			{
				for( var i = 0 ; i < 4 ; i++ )
					for( var  j = 0 ; j < 4 ; j++ )
						if( board[i][j] == 0 )
						{
							randx = i ;
							randy = j ;
							break;
						}
			}

			/*优化随机数生成效果，因为当所剩空格数越少的情况下，计算机正确随机生成随机数的位置几率就越小，这样就会使得游戏运行变慢，
			所以我们可以人工设置一个计数器，当随机生成了50次的时候还没有找对地方，我们就可以人工的设置*/

		}
	//二、在随机位置随机产生一个数字,但又由游戏规则可知要么是2，要么是4
		var randomNumber = Math.random()< 0.5 ? 2 : 4;
	//三、在随机位置处放置随机产生的数字
		board[randx][randy] = randomNumber;
		showNumberWithAnimation(randx,randy,randomNumber);//以动画形式将随机数字显示出来

	return true;
}

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37://left
			if( moveLeft(board) )
			//moveleft函数会先判断是否可以左移，若可以，则返回true，然后执行if条件语句里面的内容，接着将所有元素左移
			{
				setTimeout("getOneNumber(board)",210);		//所有元素左移以后，随机产生一个数字;
				setTimeout("isgameover()",210);		//产生一个数字后，判断游戏是否结束
			}
			break;
		case 38://up
			if( moveUp(board) )
			{
				setTimeout("getOneNumber(board)",210);		
				setTimeout("isgameover()",210);		
			}
			break;
		case 39://right
			if( moveRight(board) )
			{
				setTimeout("getOneNumber(board)",210);		
				setTimeout("isgameover()",210);		
			}
			break;
		case 40://down
			if( moveDown(board) )
			{
				setTimeout("getOneNumber(board)",210);		
				setTimeout("isgameover()",210);		
			}
			break;
		default://default
			break;
	}
});

//触碰监听器
document.addEventListener('touchstart',function( event ){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
})

document.addEventListener('touchmove',function( event ){
	event.preventDefault();
})
document.addEventListener('touchend',function( event ){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var deltax = endx - startx ;
	var deltay = endy - starty ;

	//判断用户的意图，即只有当用户滑动一定距离才作出响应，否则则认为用户并没有想要移动的意图
	if( Math.abs( deltax ) < 0.3*documentWidth && Math.abs( deltay ) < 0.3*documentWidth){
		return;
	}

	if( Math.abs( deltax ) > Math.abs( deltay ) ) 
		//x轴方向移动，x轴正方向是向右
	{
		if ( deltax > 0 )	//右移
		{
			if( moveRight(board) )
			{
				setTimeout("getOneNumber(board)",210);		
				setTimeout("isgameover()",210);		
			}
		}

		else   //左移
		{
			if( moveLeft(board) )
			{
				setTimeout("getOneNumber(board)",210);	
				setTimeout("isgameover()",210);		
			}
		}
	}

	else
	//y轴方向移动，注意y轴正方向是向下
	{
		if( deltay > 0 ) 	//下移
		{
			if( moveDown(board) )
			{
				setTimeout("getOneNumber(board)",210);		
				setTimeout("isgameover()",210);		
			}
		}

		else 		//上移
		{
			if( moveUp(board) )
			{
				setTimeout("getOneNumber(board)",210);		
				setTimeout("isgameover()",210);		
			}
		}
	}
})


function isgameover(){
	if ( nospace(board) && nomove(board) )
	{
		gameover();
	}
}
function gameover(){
	alert("game is over!");
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
						if (board[i][k] == 0 && noBlockLeft(i,k,j,board) )//noBlock用于判断是否有障碍物
						{
							//移动
							showMoveAnimation( i , j , i , k);
							board[i][k] = board[i][j];
							board[i][j] = 0;
							continue;
						}

						else if (board[i][k] == board[i][j] && noBlockLeft(i,k,j,board) && !hasConflicted[i][j] )
						{
							//移动
							showMoveAnimation( i , j , i , k);
							board[i][k] = 2 * board[i][j];
							board[i][j] = 0;

							hasConflicted[i][j] == true;

							score += board[i][k];
							updateScore( score );

							continue;
						}
					}
				}
			}
		}
	    setTimeout("updateBoardView()",200);
		return true;
	}
	return false;
}


//所有元素上移
function moveUp(){
	if( canMoveUp(board) ) //canMoveLeft()用于判断是否可以执行左移操作
	//canMovUp()返回true,下面开始执行左移操作
	//虽然已经确定可以移动了，但是我们还需进一步确定该移动到哪个位置
	{
		for( var j = 0 ; j < 4 ; j++ )
		{
			for( var i = 1 ; i < 4 ; i++ )
			{
				if ( board[i][j] != 0 )
				{
					for( var  k = 0 ; k < i ; k++ )
					{
						if (board[k][j] == 0 && noBlockUp(j,k,i,board) )//noBlock用于判断是否有障碍物
						{
							//移动
							showMoveAnimation( i , j , k , j);
							board[k][j] = board[i][j];
							board[i][j] = 0;
							continue;
						}

						else if (board[k][j] == board[i][j] && noBlockUp(j,k,i,board) && !hasConflicted[i][j] )
						{
							//移动
							showMoveAnimation( i , j , k , j);
							board[k][j] = 2 * board[i][j];
							board[i][j] = 0;

							hasConflicted[i][j] == true;

							score += board[k][j];
							updateScore( score );
							continue;
						}
					}
				}
			}
		}
    setTimeout("updateBoardView()",200);
		return true;
	}
	return false;
}

//所有元素左移
function moveRight(){
	if( canMoveRight(board) ) //canMoveRight()用于判断是否可以执行左移操作
	//canMoveRight()返回true,下面开始执行右移操作
	//虽然已经确定可以移动了，但是我们还需进一步确定该移动到哪个位置
	{
		for( var i = 0 ; i < 4 ; i++)
		{
			for( var j = 2 ; j >= 0 ; j--)
			{
				if ( board[i][j] != 0 )
				{
					for( var  k = 3 ; k > j ; k-- )
					{
						if (board[i][k] == 0 && noBlockRight(i,k,j,board) )//noBlock用于判断是否有障碍物
						{
							//移动
							showMoveAnimation( i , j , i , k);
							board[i][k] = board[i][j];
							board[i][j] = 0;
							continue;
						}

						else if (board[i][k] == board[i][j] && noBlockRight(i,k,j,board) && !hasConflicted[i][j] )
						{
							//移动
							showMoveAnimation( i , j , i , k);
							board[i][k] = 2 * board[i][j];
							board[i][j] = 0;


							hasConflicted[i][j] == true;

							score += board[i][k];
							updateScore( score );
							continue;
						}
					}
				}
			}
		}
    setTimeout("updateBoardView()",200);
		return true;
	}
	return false;
}

//所有元素下移
function moveDown(){
	if( canMoveDown(board) ) //canMoveDown()用于判断是否可以执行左移操作
	//canMoveDown()返回true,下面开始执行下移操作
	//虽然已经确定可以移动了，但是我们还需进一步确定该移动到哪个位置
	{
		for( var j = 0 ; j < 4 ; j++ )
		{
			for( var i = 2 ; i >= 0 ; i-- )
			{
				if ( board[i][j] != 0 )
				{
					for( var  k = 3 ; k > i ; k-- )
					{
						if (board[k][j] == 0 && noBlockDown(j,k,i,board) )//noBlock用于判断是否有障碍物
						{
							//移动
							showMoveAnimation( i , j , k , j);
							board[k][j] = board[i][j];
							board[i][j] = 0;
							continue;
						}

						else if (board[k][j] == board[i][j] && noBlockDown(j,k,i,board) && !hasConflicted[i][j])
						{
							//移动
							showMoveAnimation( i , j , k , j);
							board[k][j] = 2 * board[i][j];
							board[i][j] = 0;

							hasConflicted[i][j] == true;

							score += board[k][j];
							updateScore( score );
							continue;
						}
					}
				}
			}
		}
    setTimeout("updateBoardView()",200);
		return true;
	}
	return false;
}


