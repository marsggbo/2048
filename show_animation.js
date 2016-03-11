function showNumberWithAnimation(i,j,randomNumber){
	//用变量numbercell来获取生成的id为“number-cell-i-j”的div
	var numbercell = $('#number-cell-'+i+'-'+j);

	//我的版本
	// numbercell.css("background-color",getNumberBackColor(board[i][j]));
	// numbercell.css("color",getNumberColor(board[i][j]));
	// numbercell.txt(randomNumber);

	numbercell.css("background-color",getNumberBackColor(randomNumber));
	numbercell.css("color",getNumberColor(randomNumber));
	numbercell.text(randomNumber);

	numbercell.animate({
		width:"100px",
		height:"100px",
		top:getposTop(i,j),
		left:getposLeft(i,j)
	},50);
	//50ms
}

//移动特效
function showMoveAnimation(fromx , fromy , tox , toy )
{
	var numbercell = $('#number-cell-'+ fromx + '-' + fromy );
	numbercell.animate({
		top:getposTop(tox,toy),
		left:getposLeft(tox,toy)
	},200);
}