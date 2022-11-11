String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}


$(document).ready(()=>
{

// GAME BOARD
var rows = 2;
var cols = 2;
var curPlayer=0;
var boxColor = ['rgba(0, 0, 255, 0.5)','rgba(255, 0, 0, 0.5)'];
var lineColor = ['rgb(0, 0, 255)','rgb(255, 0, 0)'];
var filled = []
var extra = [0,0];
var filledBoxes=[0,0];
var ai = localStorage.getItem('ai');
var game = $('#game');
for (let i = 0; i <= rows; i++) {

	var grid = '';
	var container = '<div class="d-flex">';
	grid += container;

	var dot = '<div class="dot"></div>';
	var hline = '<div class="h-line" id="h__"></div>';
	var vline = '<div class="v-line" id="v__"></div>';
	var box = '<div class="box" id="b__"></div>';

	for (let j = 0; j <= cols; j++) {
		grid += dot;
		if(j!=cols)
		{
			hline = hline.replaceAt(25,i+''+j);
			grid += hline;
		}
	}
	grid += '</div>';

	if (i != rows) {
		grid += container;
		for (let j = 0; j <= cols; j++) {
			vline = vline.replaceAt(25,i+''+j);
			box = box.replaceAt(22,i+''+j);
			grid += vline;
			if(j!=cols)
				grid+=box;
		}
		grid += '</div>';
	}

	game.append(grid);

}

// WORKING

//1. Check if BOX is formed

function topBox(id)
{
	var r = id.charAt(1);
	var c = id.charAt(2);

	if(r=='0')
		return 0;

	r--;
	var left = !filled['v'+r+c];
	var top =  !filled['h'+r+c];
	c++;
	var right = !filled['v'+r+c];
	
	if(left || right || top)
		return 0;

	return 1;
}

function getTopBoxId(id)
{
	var r = id.charAt(1);
	var tmpid = id.replaceAt(0,'b'+(r-1));
	return tmpid;
}


function bottomBox(id)
{
	var r = id.charAt(1);
	var c = id.charAt(2);

	if((r-'0')==rows)
		return 0;
	
	var left =  !filled['v'+r+c];
	r++;
	var bottom = !filled['h'+r+c];
	c++;
	r--;
	var right = !filled['v'+r+c];
	
	if(left || right || bottom)
		return 0;

	return 1;
}

function getBottomBoxId(id)
{
	var r = id.charAt(1);
	var tmpid = id.replaceAt(0,'b'+r);
	return tmpid;
}


function leftBox(id)
{
	var r = id.charAt(1);
	var c = id.charAt(2);

	if(c=='0')
		return 0;

	c--;
	var top =  !filled['h'+r+c];
	var left =  !filled['v'+r+c];
	r++;
	var bottom =  !filled['h'+r+c];
	
	if(bottom || left || top)
		return 0;

	return 1;
}

function getLeftBoxId(id)
{
	var c = id.charAt(2);
	c--;
	var tmpid = id.replaceAt(0,'b');
	tmpid = tmpid.replaceAt(2,c.toString());
	return tmpid;
			
}

function rightBox(id)
{
	var r = id.charAt(1);
	var c = id.charAt(2);

	if((c-'0')==(cols))
		return 0;

	var top = !filled['h'+r+c];
	r++;			
	var bottom = !filled['h'+r+c];
	c++;
	r--;
	var right = !filled['v'+r+c];

	if(top || right || bottom)
		return 0;

	return 1;
}

function getRightBoxId(id)
{
	var tmpid = id.replaceAt(0,'b');
	return tmpid;	
}

// 2. Draw line ( and Box if needed)
function drawBox(id, player)
{
	$('#'+id).css('background-color',boxColor[player]);
}


// 3. Check Winner
function winnercheck(player)
{
	// var cur=0,other=0;
	var cur = filledBoxes[player], other = filledBoxes[1-player];
	console.log(cur,other);
	if((cur == other) && ((cur+other)==rows*cols) )
	{
		return -1;
	}
	return cur>(rows*cols)/2;

}


function declareWinner(player)
{
	var win = winnercheck(player);
	if(win==-1)
	{
		setTimeout(function () { alert('Its a DRAW'); }, 1);
		document.location.reload();
		return 1;
	}
	else if(win)
	{
		setTimeout(function () { alert('winner is '+player); }, 1);
		document.location.reload();
		return 1;
	}
}


function drawLine(id, player)
{
	$('#'+id).css('background-color',lineColor[player]);
	filled[id]=(player==0?-1:1);
	
	var bonus = 0;
	
	if(id.charAt(0)=='v')
	{
		if(leftBox(id))
		{
			var tmpid = getLeftBoxId(id);
			drawBox(tmpid,player);
			filled[tmpid]=(player==0?-1:1);
			filledBoxes[player]++;
			bonus++;
		}
		
		if(rightBox(id))
		{
			var tmpid = getRightBoxId(id);			
			drawBox(tmpid,player);
			filled[tmpid]=(player==0?-1:1);
			filledBoxes[player]++;
			bonus++;
		}
	}
	else
	{	
		if(topBox(id))
		{
			var tmpid = getTopBoxId(id);
			drawBox(tmpid,player);
			filled[tmpid]=(player==0?-1:1);
			filledBoxes[player]++;
			bonus++;
		}
		if(bottomBox(id))
		{
			var tmpid = getBottomBoxId(id);
			drawBox(tmpid,player);
			filled[tmpid]=(player==0?-1:1);
			filledBoxes[player]++;
			bonus++;
		}
	
	}

	if(declareWinner(player))
		return 0;

	return bonus;
}


var hline = $('.h-line');

hline.hover(function()
{
	$(this).addClass('hover'+curPlayer);
	
},function()
{
	$(this).removeClass('hover'+curPlayer);
});


function findEmpty()
{
	var empty=[];

	for(var i=0;i<=rows;i++)
	{
		for(var j=0;j<cols;j++)
		{
			var id = 'h'+i+j;
			if(!filled[id])
			{
				empty.push(id);
			}
		}		
	}

	for(var i=0;i<rows;i++)
	{
		for(var j=0;j<=cols;j++)
		{
			var id = 'v'+i+j;
			if(!filled[id])
			{
				empty.push(id);
			}
		}		
	}
	return empty;
}

// MiniMax

function miniMax(player,alpha,beta,depth)
{
	var empty=findEmpty();
	if(empty.length==0) // no more moves - leaf (move=[-1,-1])
	{
		var win = winnercheck(player);
		if(win==-1) // draw
		{
			return {'move':'[-1,-1]','score':0};// score=0
		}
		else if(win==1 && player==1) // ai won
		{
			return {'move':'[-1,-1]','score':10};
		}
		else
		{
			return {'move':'[-1,-1]','score':-10};
		}
	}


	var best,res,frst=1 ;
	if(player==1) // ai
	{
		best= {'move':'[-1,-1]','score':-1000};
		res= {'move':'[-1,-1]','score':+10};
	}
	else
	{
		best = {'move':'[-1,-1]','score':+1000};
		res = {'move':'[-1,-1]','score':-10};
	}

	var bonus=0;
	var marked=[];

	try{
	empty.forEach(line => {
		// console.log(filled);
		
		// var excess =0;
		filled[line] = (player==0?-1:1);
		marked.push(line);
		if(line[0]=='h')
		{
			if(topBox(line))
			{
				var tmpid = getTopBoxId(line);
				filled[tmpid]=(player==0?-1:1);
				marked.push(tmpid);
				filledBoxes[player]++;
				bonus++;
			}
			if(bottomBox(line))
			{
				var tmpid = getBottomBoxId(line);
				filled[tmpid]=(player==0?-1:1);
				marked.push(tmpid);
				filledBoxes[player]++;
				bonus++;
			}			
		}
		else if(line[0]=='v')
		{
			if(leftBox(line))
			{
				var tmpid = getLeftBoxId(line);
				filled[tmpid]=(player==0?-1:1);
				marked.push(tmpid);
				filledBoxes[player]++;
				bonus++;
			}
			
			if(rightBox(line))
			{
				var tmpid = getRightBoxId(line);	
				filled[tmpid]=(player==0?-1:1);
				marked.push(tmpid);
				filledBoxes[player]++;
				bonus++;
			}
		}

		if(bonus>0)
		{
			if(frst==1)
			{
				frst=0;
				res['move']=line;
			}
			bonus--;
			depth++;
			return;	// continue	
			
		}

		// console.log(filled);
		var res2 = miniMax(1-player,alpha,beta,1+depth);
		res2['move']=line;

		//Backtrack
		marked.forEach(element => {
			filled[element]=0;
			if(element.charAt(0)=='b')
			{
				filledBoxes[player]--;
			}
			// console.log(element);
		});
		marked=[];
		

		if(player==1)//ai
		{
			res2['score']-=depth;
			if(res2['score']>best['score'])
			{
				best = res2; //maximmizes
			}
			alpha = Math.max(alpha,best['score']);
			if(alpha>=beta)
				throw 'ended';
		}
		else
		{
			res2['score']+=depth;
			if(res2['score']<best['score'])
			{
				best = res2; //minimmizes
			}
			beta = Math.min(beta,best['score']);

			if(alpha>=beta)
				throw 'ended';
		}

	})
	} catch(e)
	{
		console.log(e);
		if(e!='ended')
			throw e;
	}
	
	marked.forEach(element => {
			filled[element]=0;
			if(element.charAt(0)=='b')
			{
				filledBoxes[player]--;
			}
			// console.log(element);
		});
		marked=[];

	if(res['move']!='[-1,-1]')
		return res;

	return best;

}


// 3. playAI

function playAI()
{
	var nextMove = miniMax(1,-1000,+1000,0);
	console.log(nextMove);
	
	if(nextMove['move']=='[-1,-1]')
		return;
	
	if(declareWinner(1))
	{
		return;
	}

	extra[1] += drawLine(nextMove['move'],1);
	
	if(extra[1])
	{
		extra[1]--;
		playAI();
	}	
}



var vline = $('.v-line');
vline.hover(function()
{
	$(this).addClass('hover'+curPlayer);
},function()
{
	$(this).removeClass('hover'+curPlayer);
});

var alllines = [hline,vline];

for (const lines of alllines) {
 for(const line of lines)
{
	line.addEventListener('click', (e) => {
		var id = (e.target.id);	
		if(filled[id])
		{
			return;
		}
		extra[curPlayer] += drawLine(id,curPlayer);
		if(declareWinner(curPlayer))
		{
			return;
		}
		if(extra[curPlayer])
		{
			extra[curPlayer]--;
			return;
		}
		
		if(ai=='true')
		{
			curPlayer=(1-curPlayer);
			$('#current').text(curPlayer);
			playAI();
			if(declareWinner(1))
			{
				return;
			}			
		}
		
		{
			curPlayer=(1-curPlayer);
			$('#current').text(curPlayer);
		}
	});
}
}



// 4. New Game
var newGameTypes = $('.dropdown-menu > li > a');
for(const type of newGameTypes)
{
	type.addEventListener('click',()=>{
		document.location.reload();
		if(type.text=='VS AI')
		{
			localStorage.setItem("ai", 'true');

		}
		else
		{
			localStorage.setItem("ai", 'false');
		}
	});
};
if(ai=='true')
	drawLine('h00',1);

$('#current').text(curPlayer);

});
