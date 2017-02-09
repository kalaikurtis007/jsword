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
							console.log("active");
                            tile.addClass('cwd-tile-active').css('background-color', 'White');
                        }
                        else {
                            tile.addClass('cwd-tile-inactive').css('background-color', options.color);
                        }
                    }
                }
				//console.log(data);
                var container=$('<div/>').attr('id','cwd-container').appendTo(data);
				console.log(container);
                $('<div id="cwd-divGrid"/>')
                  .append(grid)
                  .appendTo(container)
                .css({display:"inline-block",width:grid.width()});

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