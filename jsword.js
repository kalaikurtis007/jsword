//author kalaiselvan.a
(function ($) {
    $.jsword = function (data, options) {

        var defaultOptions = {
            color: '#948a8a',
            cluesToRight: true,
            clueBox: true,
            validateAnswer: 'none',
            tileSize: 25
        };
        var cursorIndex;
        var clues = [];
        var multiClues = [];
        var impl = {
            init: function (data, options) {
                var dataType = typeof (data);
                if (dataType === 'object') {
                    data = data instanceof $ ? data : $(data);
                } else if (dataType === 'string' || dataType === 'number') {
                    data = $('<div/>').html(data);
                } else {
                    return false;
                }

                data.css('visibility', 'hidden');
                options = $.extend(defaultOptions, options);

                impl.appendGrid(options);
				impl.bindEvents();
                data.hide();
                data.css('visibility', 'visible');
                data.fadeIn('slow');
                return true;
            },
            appendGrid: function (options) {
                 var gridWidth = options.gridMask[0].length;
                var gridHeight = options.gridMask.length;
                var gridSize = { width: gridWidth ? gridWidth : 0, height: gridHeight ? gridHeight : 0 };

                options.acrossClues = options.acrossClues ? options.acrossClues : [];
                options.downClues = options.downClues ? options.downClues : [];
                var borderStyle = impl.stringFormat('solid 1px {0}', options.colour);

                var grid = $('<table id="cwd-grid" cellSpacing="0" rowSpacing="0"></table>');
                var clueNo = 1;

                var newTile = function(row, col) {
                    return $(impl.stringFormat('<td class="cwd-tile" row="{0}" col="{1}" />', row, col))
                                // Must add at least one space to get borders showing in IE7.
                                .append(
                                    $('<div class="cwd-tile-letter" />').text(' ')
                                );
                }

                // Build the bare grid.
                for (i = 0; i < gridSize.height; i++) {
                    var row = $('<tr />').appendTo(grid);

                    for (j = 0; j < gridSize.width; j++) {
                        var tile = newTile(i, j).appendTo(row);
                        if (typeof (options.gridMask[i]) !== 'undefined' && options.gridMask[i].charAt(j) === ' ') {							
                            tile.addClass('cwd-tile-active').css('background-color', 'White');
                        }
                        else {
                            tile.addClass('cwd-tile-inactive').css('background-color', options.color);
                        }
                    }
                }
				var index=0,acrossClueIndex=0, downClueIndex=0;
				grid.find('td.cwd-tile-active').each(function(){
					var i=parseInt($(this).attr('row'));
					var j=parseInt($(this).attr('col'));
					 var acrossNo = (j === 0 || options.gridMask[i].charAt(j - 1) !== ' ') &&
                                (j < gridSize.width - 1 && options.gridMask[i].charAt(j + 1) === ' ')

                    // Inactive tile above (or edge) AND active tile below => start of down clue.
                    var downNo = (i === 0 || options.gridMask[i - 1].charAt(j) !== ' ') &&
                                (i < gridSize.height - 1 && options.gridMask[i + 1].charAt(j) === ' ')
								
					var acrossNo=(j===0 || options.gridMask[i].charAt(j-1)!==' ' && (j<gridSize.width-1 && options.gridMask[i].charAt(j+1)===' '))
					var downNo=(i===0 || options.gridMask[i-1].charAt(j)!==' ') && ( i<gridSize.height-1 && options.gridMask[i+1].charAt(j)===' ')
					var row=i,col=j;
					if(acrossNo){
						while(col<gridSize.width){
							var thisTile=grid.find(impl.stringFormat('td[row={0}][col={0}]',row,col));
							if(thisTile.hasClass('cwd-tile-inactive')){
								break;
							}else{
								thisTile.attr('acrossClueId',index);
							}
							col++;
						}						
					}
					row=i;
					col=j;
					if(downNo){
						while(row < gridSize.height){
							var thisTile=grid.find(impl.stringFormat('td[row={0}][col={1}]',row,col));
							if(thisTile.hasClass('cwd-tile-inactive')){
								break;
							}else{
								thisTile.attr('downClueId',index);
							}
							row++;
						}
					}
					if(acrossNo||downNo){
						$(this).prepend($('<span/>').text(clueNo++).css({'position':'absolute','font-size':options.tileSize/3}));
					}
					
				})
				//console.log(data);
                var container=$('<div/>').attr('id','cwd-container').appendTo(data);				
                $('<div id="cwd-divGrid"/>')
                  .append(grid)
                  .appendTo(container)
                .css({display:"inline-block",width:grid.width()});

            },
			bindEvents:function(){
				var s=this;
				$('#cwd-grid td.cwd-tile-active').click(function(){					
					var preDirection="";
					if($(this).hasClass('cwd-tile-highlight')){						 
						preDirection=$(this).prev('td.cwd-tile-active').hasClass('cwd-tile-highlight')|| $(this).prev('td.cwd-tile-active').hasClass('cwd-tile-highlight')?'a':'d';
					}
				});
				$(document).keydown(function(event){
					var highlightedTiles=$('#cwd-grid td.cwd-tile-highlight');
					if(highlightedTiles.length>0){
						
					}else{
						alert();
					}
				});
			},
            stringFormat: function () {
                var resultString = arguments[0];
                var args = arguments;
                if (typeof (resultString) != 'undefined') {
                    resultString = resultString.replace(/{(\d+)}/g, function (match, number) {
                        var index = parseInt(number) + 1;
                        return typeof (args[index]) != 'undefined' ? args[index] : match;
                    });
                }
                return resultString;
            }
        };

        impl.init(data, options);
    }

    $.fn.jsword = function (options) {
        return $.jsword(this, options);
    }
})(jQuery);