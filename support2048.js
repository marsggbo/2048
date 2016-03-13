//计算距离顶端的距离
function getposTop(i,j){
	return 20*(i+1)+100*i;
}
//计算距离左端的距离
function getposLeft(i,j){
	return 20*(j+1)+100*j;
}
//number-cell背景色更新
function getNumberBackColor(number){
	switch(number)
	{
        case 2:return "#eee4da";break;
        case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67c5f";break;
        case 64:return "#f65e3b";break;
        case 128:return "#edcf72";break;
        case 256:return "#edcc61";break;
        case 512:return "#9c0";break;
        case 1024:return "#33b5e5";break;
        case 2048:return "#09c";break;
        case 4096:return "#a6c";break;
        case 8192:return "#93c";break;
	}
	return 'black';
}
//number-cell字体颜色更新
function getNumberColor(number){
	if (number <= 4)
	{
		return "#776e65";
	}
	 return "white";
}

//nospace()函数用于判断是否还有空余的格子
function nospace(board) {
	for( var i = 0 ; i < 4 ; i++){
			for( var j = 0 ; j < 4 ; j++)
			{
				if (board[i][j] == 0) {
					return false;
					//有空余的格子
				}
			}
	}
	return true;
}

//canMoveLeft()用于判断是否可以执行左移操作
function canMoveLeft(board){
	//元素是否可以左移需要满足如下情况的一种
	//1.左右元素大小相等
	//2.左边的格子为空，不含元素
	for ( var i = 0 ; i < 4 ; i++ )
		for ( var j = 1 ; j < 4 ; j++)
			if (board[i][j] != 0) 
				if (board[i][j-1] == 0 || board[i][j-1] == board[i][j])
				 	return true;
	return false;
}

function canMoveUp(board){
	for( var j = 0 ; j < 4 ; j++  )
		for ( var i = 1 ; i < 4 ; i++ )
			if ( board[i][j] != 0 )
				if ( board[i-1][j] == 0 || board[i-1][j] == board[i][j] )
					return true;
	return false;
}

function canMoveRight( board ){
	for ( var i = 0 ; i < 4 ; i++ )
		for ( var j = 2 ; j >= 0 ; j-- )
			if ( board[i][j] != 0 )
				if ( board[i][j+1] == 0 || board[i][j+1] == board[i][j] )
					return true;
	return false;
}

function canMoveDown( board ){
	for ( var j = 0 ; j < 4 ; j++ )
		for ( var i = 2 ; i >= 0 ; i-- )
			if ( board[i][j] != 0 )
				if ( board[i+1][j] == 0 || board[i+1][j] == board[i][j] )
					return true;
	return false;
}

//noBlock用于在将某元素左移前判断其移到某位置之间是否有障碍物存在，
//若没有障碍物，才可直接移过去
function noBlockLeft(row,col1,col2,board){
	for( var i = col1 + 1 ; i < col2 ; i++){
		if ( board[row][i] != 0) {
			return false;
		}
	}
	return true;
}

function noBlockUp( col,row1,row2,board ){
	for ( var i = row1 + 1 ; i < row2 ; i++ ){
		if ( board[i][col] != 0 ){
			return false;
		} 
	}
	return true;
}

function noBlockRight( row , col1 ,col2 ,board ){
	for ( var i = col1 - 1 ; i > col2 ; i-- ){
		if ( board[row][i] != 0 ) {
			return false;
		}
	}
	return true;
}

function noBlockDown( col , row1 , row2 ,board ){
	for( var i = row1 - 1 ; i > row2 ; i-- ){
		if ( board[i][col] != 0 ) {
			return false;
		}
	}
	return true;
}

function nomove(board){
	if ( canMoveLeft(board) || canMoveUp(board) || canMoveRight(board) || canMoveDown(board) ){
		return false;//表示还可以进行上下左右操作的某一项操作，游戏没有结束
	}
	return true;
}